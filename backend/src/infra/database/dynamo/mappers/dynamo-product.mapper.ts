import { Product } from "@/domain/pricing/enterprise/product"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export class DynamoProductMapper {
  static toDomain(raw: any): Product {
    return Product.create(
      {
        name: raw.name,
        description: raw.description,
        price: raw.price,
        quantity: raw.quantity,
        createdAt: new Date(raw.createdAt),
        updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistence(product: Product): any {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    }
  }
}
