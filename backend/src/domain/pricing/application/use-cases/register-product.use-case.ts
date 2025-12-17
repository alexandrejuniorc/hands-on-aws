import { Either, left, right } from "@/core/either"
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists.error"
import { Product } from "../../enterprise/product.entity"
import { ProductsRepository } from "../repositories/products.repository"

interface RegisterProductRequest {
  name: string
  description: string
  price: number
  quantity: number
}

type RegisterProductResponse = Either<ResourceAlreadyExistsError, { product: Product }>

export class RegisterProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    description,
    price,
    quantity,
  }: RegisterProductRequest): Promise<RegisterProductResponse> {
    const productWithSameName = await this.productsRepository.findByName(name)

    if (productWithSameName) {
      return left(new ResourceAlreadyExistsError())
    }

    const product = Product.create({
      name,
      description,
      price,
      quantity,
    })

    await this.productsRepository.create(product)

    return right({ product })
  }
}
