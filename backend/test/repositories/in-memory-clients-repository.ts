import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ClientsRepository } from "@/domain/pricing/application/repositories/clients-repository"
import { Client } from "@/domain/pricing/enterprise/client"

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async create(client: Client): Promise<void> {
    this.items.push(client)
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find((item) => item.id.toString() === id)

    if (!client) {
      return null
    }

    return client
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.items.find((item) => item.email === email)

    if (!client) {
      return null
    }

    return client
  }

  async update(client: Client): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    const clientIndex = this.items.findIndex((item) => item.id.toString() === id)

    if (clientIndex >= 0) {
      this.items.splice(clientIndex, 1)
    }
  }
}
