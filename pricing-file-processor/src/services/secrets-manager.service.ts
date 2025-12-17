import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { env } from "../config/env";
import { Logger } from "../utils/logger";

export class SecretsManagerService {
  private client: SecretsManagerClient;

  constructor() {
    this.client = new SecretsManagerClient({
      region: env.AWS_DEFAULT_REGION,
    });

    Logger.info("SecretsManager initialized", {
      region: env.AWS_DEFAULT_REGION,
      secretName: env.SECRET_NAME,
    });
  }

  async getSecret(secretName: string): Promise<Record<string, any>> {
    Logger.info("Fetching secret", { secretName });

    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await this.client.send(command);

    if (!response.SecretString) {
      Logger.error(`Secret not found or empty`, undefined, { secretName });
      throw new Error(`Secret ${secretName} not found`);
    }

    const secrets = JSON.parse(response.SecretString);
    const keys = Object.keys(secrets);

    Logger.info("Secret fetched successfully", {
      secretName,
      keys: keys.join(", "),
      keysCount: keys.length,
    });

    return secrets;
  }

  async getTableName(): Promise<string> {
    Logger.debug("Getting PRODUCTS_TABLE_NAME from secret", {
      secretName: env.SECRET_NAME,
    });

    const secrets = await this.getSecret(env.SECRET_NAME);

    if (!secrets.PRODUCTS_TABLE) {
      const availableKeys = Object.keys(secrets).join(", ");
      Logger.error("PRODUCTS_TABLE_NAME not found in secret", undefined, {
        availableKeys,
      });
      throw new Error(
        `PRODUCTS_TABLE_NAME not found in secrets. Available keys: ${availableKeys}`
      );
    }

    const tableName = secrets.PRODUCTS_TABLE;
    Logger.info("Using DynamoDB table", { tableName });

    return tableName;
  }
}
