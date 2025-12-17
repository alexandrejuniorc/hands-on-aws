import { S3Event } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { S3Service } from "./services/s3.service";
import { DynamoDBService } from "./services/dynamodb.service";
import { SecretsManagerService } from "./services/secrets-manager.service";
import { CSVParser } from "./parsers/csv.parser";
import { ExcelParser } from "./parsers/excel.parser";
import { IdempotencyService } from "./utils/idempotency";
import { Logger } from "./utils/logger";
import {
  productSchema,
  type ProductRecord,
} from "./validators/product-schema.validator";

const s3Service = new S3Service();
const dynamoService = new DynamoDBService();
const secretsService = new SecretsManagerService();
const csvParser = new CSVParser();
const excelParser = new ExcelParser();
const idempotencyService = new IdempotencyService();

export const handler = async (event: S3Event): Promise<void> => {
  Logger.info("S3 Event received", { recordCount: event.Records.length });

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    const processingId = idempotencyService.generateProcessingId(bucket, key);

    try {
      Logger.info("Processing file", { bucket, key, processingId });

      // 1. Ler arquivo do S3
      const fileBuffer = await s3Service.getFileContent(bucket, key);
      const fileExtension = s3Service.getFileExtension(key);
      const fileHash = idempotencyService.generateFileHash(fileBuffer);

      Logger.debug("File downloaded", {
        size: fileBuffer.length,
        extension: fileExtension,
        hash: fileHash,
      });

      // Validar tamanho (10MB max)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (fileBuffer.length > MAX_SIZE) {
        throw new Error(
          `File size ${fileBuffer.length} exceeds maximum ${MAX_SIZE} bytes`
        );
      }

      // 2. Parse baseado na extensão
      let parsedData: any[];

      if (fileExtension === "csv") {
        Logger.info("Parsing CSV file");
        parsedData = csvParser.parse(fileBuffer.toString("utf-8"));
      } else if (["xlsx", "xls"].includes(fileExtension)) {
        Logger.info("Parsing Excel file");
        parsedData = excelParser.parse(fileBuffer);
      } else {
        throw new Error(`Unsupported file format: ${fileExtension}`);
      }

      Logger.info("File parsed", { recordCount: parsedData.length });

      // 3. Validar cada item com Zod e adicionar UUID
      const validatedProducts: ProductRecord[] = [];
      const errors: Array<{ row: number; error: string }> = [];

      for (let i = 0; i < parsedData.length; i++) {
        try {
          const validated = productSchema.parse(parsedData[i]);

          validatedProducts.push({
            id: uuidv4(), // Gera ID único para cada produto
            ...validated,
            createdAt: new Date().toISOString(),
            updatedAt: null,
          });
        } catch (error: any) {
          errors.push({
            row: i + 1,
            error: error.message,
          });
        }
      }

      if (errors.length > 0) {
        Logger.warn("Validation errors found", {
          errorCount: errors.length,
          errors: errors.slice(0, 10), // Log apenas os primeiros 10 erros
        });
      }

      if (validatedProducts.length === 0) {
        throw new Error("No valid products to insert after validation");
      }

      Logger.info("Validation complete", {
        validCount: validatedProducts.length,
        errorCount: errors.length,
      });

      // 4. Buscar nome da tabela do Secrets Manager
      const tableName = await secretsService.getTableName();
      Logger.info("Table name retrieved", { tableName });

      // 5. Inserir no DynamoDB (batch de 25 itens por vez)
      await dynamoService.batchWrite(tableName, validatedProducts);

      Logger.info("Processing complete", {
        bucket,
        key,
        processingId,
        totalRecords: parsedData.length,
        successfulInserts: validatedProducts.length,
        failedValidations: errors.length,
      });
    } catch (error) {
      Logger.error("Error processing file", error as Error, {
        bucket,
        key,
        processingId,
      });
      throw error; // Lambda irá retentar ou enviar para DLQ
    }
  }
};
