import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository"
import { DeleteProductUseCase } from "./delete-product"
import { makeProduct } from "@/test/factories/make-product"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: DeleteProductUseCase // SUT -> System Under Test

describe("Delete Product Use Case", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new DeleteProductUseCase(inMemoryProductsRepository)
  })

  it("should be able to delete a product", async () => {
    const product = makeProduct({}, new UniqueEntityID("product-1"))

    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({ id: "product-1" })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a product that does not exist", async () => {
    const result = await sut.execute({ id: "non-existent-id" })

    expect(result.isLeft()).toBe(true)
  })
})
