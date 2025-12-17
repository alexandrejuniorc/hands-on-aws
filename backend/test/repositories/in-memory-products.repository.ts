import { ProductsRepository } from "@/domain/pricing/application/repositories/products.repository"
import { Product } from "@/domain/pricing/enterprise/product.entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import type {
  DynamoDBPaginationParams,
  DynamoDBPaginatedResponse,
} from "@/core/repositories/pagination-params"

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = []

  async create(product: Product): Promise<void> {
    this.items.push(product)
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findByName(name: string): Promise<Product | null> {
    const product = this.items.find((item) => item.name.toLowerCase() === name.toLowerCase())

    if (!product) {
      return null
    }

    return product
  }

  async findAll(params: DynamoDBPaginationParams): Promise<DynamoDBPaginatedResponse<Product>> {
    const products = this.items.slice(0, params.limit ?? this.items.length)

    return {
      items: products,
      count: products.length,
      lastEvaluatedKey:
        products.length < this.items.length
          ? new UniqueEntityID(products[products.length - 1].id.toString())
          : undefined,
    }
  }

  update(product: Product): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    const productIndex = this.items.findIndex((item) => item.id.toString() === id)

    if (productIndex >= 0) {
      this.items.splice(productIndex, 1)
    }
  }
}
