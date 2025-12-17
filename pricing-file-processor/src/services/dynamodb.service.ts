import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ProductRecord } from "../validators/product-schema.validator";

export class DynamoDBService {
  private docClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  async batchWrite(tableName: string, items: ProductRecord[]): Promise<void> {
    // DynamoDB BatchWrite limita a 25 itens por request
    const BATCH_SIZE = 25;
    const batches = this.chunkArray(items, BATCH_SIZE);

    console.log(`Writing ${items.length} items in ${batches.length} batches`);

    for (const batch of batches) {
      const putRequests = batch.map((item) => ({
        PutRequest: { Item: item },
      }));

      const command = new BatchWriteCommand({
        RequestItems: {
          [tableName]: putRequests,
        },
      });

      await this.docClient.send(command);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
