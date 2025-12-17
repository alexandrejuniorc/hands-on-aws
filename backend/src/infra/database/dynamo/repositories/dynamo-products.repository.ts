import { ProductsRepository } from "@/domain/pricing/application/repositories/products.repository"
import { Product } from "@/domain/pricing/enterprise/product.entity"
import { dynamoService, DynamoService } from "../dynamo.service"
import { DynamoProductMapper } from "../mappers/dynamo-product.mapper"

export class DynamoProductsRepository implements ProductsRepository {
  constructor(private readonly dynamoService: DynamoService) {}

  async create(product: Product): Promise<void> {
    const newProduct = DynamoProductMapper.toPersistence(product)

    await this.dynamoService.create("ProductsTable", newProduct)
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.dynamoService.findById("ProductsTable", id)

    if (!result) {
      return null
    }

    return DynamoProductMapper.toDomain(result)
  }

  async findByName(name: string): Promise<Product | null> {
    const results = await this.dynamoService.query(
      "ProductsTable",
      "name-index",
      "#name = :name",
      { "#name": "name" },
      { ":name": name },
    )

    if (!results || results.length === 0) {
      return null
    }

    return DynamoProductMapper.toDomain(results[0])
  }

  update(product: Product): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    await this.dynamoService.delete("ProductsTable", { id })
  }
}

export const productsRepository = new DynamoProductsRepository(dynamoService)
