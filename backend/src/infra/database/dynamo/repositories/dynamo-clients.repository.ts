import { ClientsRepository } from "@/domain/pricing/application/repositories/clients-repository"
import { Client } from "@/domain/pricing/enterprise/client"
import { dynamoService, DynamoService } from "../dynamo.service"
import { DynamoClientMapper } from "../mappers/dynamo-client.mapper"

export class DynamoClientsRepository implements ClientsRepository {
  constructor(
    private readonly dynamoService: DynamoService,
    // private readonly secretsManagerService: SecretsManagerService,
  ) {}

  async create(client: Client): Promise<void> {
    const newClient = DynamoClientMapper.toPersistence(client)

    await this.dynamoService.create("ClientsTable", newClient)
  }

  async findById(id: string): Promise<Client | null> {
    const result = await this.dynamoService.findById("ClientsTable", id)

    if (!result) {
      return null
    }

    return DynamoClientMapper.toDomain(result)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const result = await this.dynamoService.query(
      "clients-table",
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

  update(client: Client): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    await this.dynamoService.delete("ClientsTable", { id })
  }
}

export const clientsRepository = new DynamoClientsRepository(dynamoService)
