import { Either, left, right } from "@/core/either"
import { Product } from "../../enterprise/product.entity"
import { ProductsRepository } from "../repositories/products.repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"

interface GetProductByNameUseCaseRequest {
  name: string
}

type GetProductByNameUseCaseResponse = Either<ResourceNotFoundError, { product: Product }>

export class GetProductByNameUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
  }: GetProductByNameUseCaseRequest): Promise<GetProductByNameUseCaseResponse> {
    const productExistent = await this.productsRepository.findByName(name)

    if (!productExistent) {
      return left(new ResourceNotFoundError())
    }

    return right({ product: productExistent })
  }
}
