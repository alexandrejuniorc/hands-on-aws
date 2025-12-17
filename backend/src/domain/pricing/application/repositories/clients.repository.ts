import {
  DynamoDBPaginationParams,
  DynamoDBPaginatedResponse,
} from "@/core/repositories/pagination-params"
import { Client } from "../../enterprise/client.entity"

export interface ClientsRepository {
  create(client: Client): Promise<void>
  findById(id: string): Promise<Client | null>
  findByEmail(email: string): Promise<Client | null>
  findAll(params: DynamoDBPaginationParams): Promise<DynamoDBPaginatedResponse<Client>>
  update(client: Client): Promise<void>
  delete(id: string): Promise<void>
}
