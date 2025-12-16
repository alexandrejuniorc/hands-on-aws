import { faker } from "@faker-js/faker"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Product, ProductProps } from "@/domain/pricing/enterprise/product"

export function makeProduct(override: Partial<ProductProps> = {}, id?: UniqueEntityID): Product {
  const product = Product.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 100 }),
      ...override,
    },
    id,
  )

  return product
}
