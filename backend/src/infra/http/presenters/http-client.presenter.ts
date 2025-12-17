import { Client } from "@/domain/pricing/enterprise/client.entity"

export class HttpClientPresenter {
  static toHTTP(client: Client) {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
