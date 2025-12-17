import { Either, right } from "@/core/either"
import { Product } from "../../enterprise/product.entity"
import { ProductsRepository } from "../repositories/products.repository"
import {
  DynamoDBPaginatedResponse,
  DynamoDBPaginationParams,
} from "@/core/repositories/pagination-params"

type FetchProductsUseCaseRequest = DynamoDBPaginationParams
type FetchProductsUseCaseResponse = Either<null, DynamoDBPaginatedResponse<Product>>

export class FetchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute(params: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const { items, count, lastEvaluatedKey } = await this.productsRepository.findAll(params)

    return right({ items, count, lastEvaluatedKey })
  }
}
