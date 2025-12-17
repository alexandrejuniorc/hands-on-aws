import { Either, left, right } from "@/core/either"
import { ProductsRepository } from "../repositories/products.repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"

interface DeleteProductRequest {
  id: string
}

type DeleteProductResponse = Either<ResourceNotFoundError, null>

export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ id }: DeleteProductRequest): Promise<DeleteProductResponse> {
    const productExistent = await this.productsRepository.findById(id)

    if (!productExistent) {
      return left(new ResourceNotFoundError())
    }

    await this.productsRepository.delete(id)

    return right(null)
  }
}
