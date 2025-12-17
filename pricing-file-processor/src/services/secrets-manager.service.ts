import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export class SecretsManagerService {
  private client: SecretsManagerClient;

  constructor() {
    this.client = new SecretsManagerClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  async getSecret(secretName: string): Promise<Record<string, any>> {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await this.client.send(command);

    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} not found`);
    }

    return JSON.parse(response.SecretString);
  }

  async getTableName(): Promise<string> {
    const secretName = process.env.SECRET_NAME || "hands-on-aws/database";
    const secrets = await this.getSecret(secretName);

    if (!secrets.PRODUCTS_TABLE_NAME) {
      throw new Error("PRODUCTS_TABLE_NAME not found in secrets");
    }

    return secrets.PRODUCTS_TABLE_NAME;
  }
}
