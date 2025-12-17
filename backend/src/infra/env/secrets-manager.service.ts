import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager"
import { env } from "./env"

interface SecretsConfig {
  CLIENTS_TABLE: string
  PRODUCTS_TABLE: string
}

export class SecretsManagerService {
  private client: SecretsManagerClient
  private secret: SecretsConfig = {} as SecretsConfig
  private secretName: string

  constructor() {
    const region = env.AWS_REGION_PRICING
    const accessKeyId = env.AWS_ACCESS_KEY_ID
    const secretAccessKey = env.AWS_SECRET_ACCESS_KEY

    this.secretName = env.AWS_SECRETS_MANAGER_SECRET_NAME
    this.client = new SecretsManagerClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  /**
   * Carrega o secret do AWS Secrets Manager
   */
  private async loadSecret() {
    try {
      if (!this.secretName) {
        console.warn("⚠️  AWS_SECRETS_MANAGER_SECRET_NAME not configured, skipping secret loading")
        return
      }

      const command = new GetSecretValueCommand({ SecretId: this.secretName })
      const response = await this.client.send(command)

      if (response.SecretString) {
        this.secret = JSON.parse(response.SecretString)
      } else if (response.SecretBinary) {
        const buff = Buffer.from(response.SecretBinary)
        this.secret = JSON.parse(buff.toString("utf-8"))
      }

      console.log("✅ Secret loaded:", this.secretName)
    } catch (error) {
      console.error("❌ Error loading secret:", error)
      throw error
    }
  }

  /**
   * Retorna o secret completo
   */
  get<T = any>(): SecretsConfig {
    if (Object.keys(this.secret).length === 0) {
      throw new Error("Secret not loaded")
    }
    return this.secret
  }

  /**
   * Retorna uma propriedade específica do secret
   */
  getProperty<K extends keyof SecretsConfig>(property: K): SecretsConfig[K] {
    if (!this.secret[property]) {
      throw new Error(`Property ${property} not found in secret`)
    }
    return this.secret[property]
  }

  /**
   * Força o reload do secret
   */
  async reload(): Promise<void> {
    console.info("🔄 Reloading secret...")
    await this.loadSecret()
  }
}

export const secretsManagerService = new SecretsManagerService()
