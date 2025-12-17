import { ProductsRepository } from "@/domain/pricing/application/repositories/products.repository"
import { Product } from "@/domain/pricing/enterprise/product.entity"

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
