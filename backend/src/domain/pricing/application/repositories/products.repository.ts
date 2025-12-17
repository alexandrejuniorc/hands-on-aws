import { Product } from "../../enterprise/product.entity"

export interface ProductsRepository {
  create(product: Product): Promise<void>
  findById(id: string): Promise<Product | null>
  findByName(name: string): Promise<Product | null>
  update(product: Product): Promise<void>
  delete(id: string): Promise<void>
}
