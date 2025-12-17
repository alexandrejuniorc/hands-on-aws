import { ClientsRepository } from "@/domain/pricing/application/repositories/clients.repository"
import { Client } from "@/domain/pricing/enterprise/client.entity"
import { dynamoService, DynamoService } from "../dynamo.service"
import { DynamoClientMapper } from "../mappers/dynamo-client.mapper"
import {
  DynamoDBPaginationParams,
  DynamoDBPaginatedResponse,
} from "@/core/repositories/pagination-params"
import { secretsManagerService, SecretsManagerService } from "@/infra/env/secrets-manager.service"

export class DynamoClientsRepository implements ClientsRepository {
  constructor(
    private readonly dynamoService: DynamoService,
    private readonly secretsManagerService: SecretsManagerService,
  ) {}

  private get tableName(): string {
    return this.secretsManagerService.getProperty("CLIENTS_TABLE")
  }

  async create(client: Client): Promise<void> {
    const newClient = DynamoClientMapper.toPersistence(client)

    await this.dynamoService.create(this.tableName, newClient)
  }

  async findById(id: string): Promise<Client | null> {
    const result = await this.dynamoService.findById(this.tableName, id)
    if (!result) {
      return null
    }

    return DynamoClientMapper.toDomain(result)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const result = await this.dynamoService.query(
      this.tableName,
      "email-index",
      "#email = :email",
      { "#email": "email" },
      { ":email": email },
    )

    if (!result) {
      return null
    }

    return DynamoClientMapper.toDomain(result)
  }

  async findAll(params: DynamoDBPaginationParams): Promise<DynamoDBPaginatedResponse<Client>> {
    const result = await this.dynamoService.scan(this.tableName, {
      limit: params.limit,
      lastEvaluatedKey: params.lastEvaluatedKey,
      filters: params.filters,
    })

    const clients = result.items.map((item) => DynamoClientMapper.toDomain(item))

    return {
      items: clients,
      count: result.count,
      lastEvaluatedKey: result.lastEvaluatedKey,
    }
  }

  update(client: Client): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    await this.dynamoService.delete(this.tableName, { id })
  }
}

export const clientsRepository = new DynamoClientsRepository(dynamoService, secretsManagerService)
