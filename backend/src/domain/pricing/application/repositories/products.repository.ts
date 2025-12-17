import {
  DynamoDBPaginationParams,
  DynamoDBPaginatedResponse,
} from "@/core/repositories/pagination-params"
import { Product } from "../../enterprise/product.entity"

export interface ProductsRepository {
  create(product: Product): Promise<void>
  findById(id: string): Promise<Product | null>
  findByName(name: string): Promise<Product | null>
  findAll(params: DynamoDBPaginationParams): Promise<DynamoDBPaginatedResponse<Product>>
  update(product: Product): Promise<void>
  delete(id: string): Promise<void>
}
