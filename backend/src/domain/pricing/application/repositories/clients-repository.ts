import { Client } from "../../enterprise/client"

export interface ClientsRepository {
  create(client: Client): Promise<void>
  findById(id: string): Promise<Client | null>
  findByEmail(email: string): Promise<Client | null>
  update(client: Client): Promise<void>
  delete(id: string): Promise<void>
}
