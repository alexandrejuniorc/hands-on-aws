import { Either, left, right } from "@/core/either"
import { Product } from "../../enterprise/product"
import { ProductsRepository } from "../repositories/products-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"

interface GetProductByIdUseCaseRequest {
  id: string
}

type GetProductByIdUseCaseResponse = Either<ResourceNotFoundError, { product: Product }>

export class GetProductByIdUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ id }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const productExistent = await this.productsRepository.findById(id)

    if (!productExistent) {
      return left(new ResourceNotFoundError())
    }

    return right({ product: productExistent })
  }
}
