import { Client } from "@/domain/pricing/enterprise/client.entity"

export class DynamoClientMapper {
  static toDomain(raw: any): Client {
    return Client.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: new Date(raw.createdAt),
        updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
      },
      raw.id,
    )
  }

  static toPersistence(client: Client): any {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      password: client.password,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt ? client.updatedAt.toISOString() : null,
    }
  }
}
