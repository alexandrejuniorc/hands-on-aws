import { ProductsRepository } from "@/domain/pricing/application/repositories/products.repository"
import { Product } from "@/domain/pricing/enterprise/product.entity"
import { dynamoService, DynamoService } from "../dynamo.service"
import { DynamoProductMapper } from "../mappers/dynamo-product.mapper"
import {
  DynamoDBPaginationParams,
  DynamoDBPaginatedResponse,
} from "@/core/repositories/pagination-params"
import { secretsManagerService, SecretsManagerService } from "@/infra/env/secrets-manager.service"

export class DynamoProductsRepository implements ProductsRepository {
  constructor(
    private readonly dynamoService: DynamoService,
    private readonly secretsManagerService: SecretsManagerService,
  ) {}

  private get tableName(): string {
    return this.secretsManagerService.getProperty("PRODUCTS_TABLE")
  }

  async create(product: Product): Promise<void> {
    const newProduct = DynamoProductMapper.toPersistence(product)

    await this.dynamoService.create(this.tableName, newProduct)
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.dynamoService.findById(this.tableName, id)
    if (!result) {
      return null
    }

    return DynamoProductMapper.toDomain(result)
  }

  async findByName(name: string): Promise<Product | null> {
    const results = await this.dynamoService.query(
      this.tableName,
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

  async findAll(params: DynamoDBPaginationParams): Promise<DynamoDBPaginatedResponse<Product>> {
    const result = await this.dynamoService.scan(this.tableName, {
      limit: params.limit,
      lastEvaluatedKey: params.lastEvaluatedKey,
      filters: params.filters,
    })

    const products = result.items.map((item) => DynamoProductMapper.toDomain(item))

    return {
      items: products,
      count: result.count,
      lastEvaluatedKey: result.lastEvaluatedKey,
    }
  }

  update(product: Product): Promise<void> {
    throw new Error("Method not implemented.")
  }

  async delete(id: string): Promise<void> {
    await this.dynamoService.delete(this.tableName, { id })
  }
}

export const productsRepository = new DynamoProductsRepository(dynamoService, secretsManagerService)
