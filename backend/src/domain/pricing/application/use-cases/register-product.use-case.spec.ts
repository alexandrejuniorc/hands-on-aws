import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products.repository"
import { RegisterProductUseCase } from "./register-product.use-case"

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: RegisterProductUseCase // SUT -> System Under Test

describe("Register Product Use Case", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new RegisterProductUseCase(inMemoryProductsRepository)
  })

  it("should be able to register a new product", async () => {
    const result = await sut.execute({
      name: "Product Test",
      description: "Product description",
      price: 100,
      quantity: 10,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      product: inMemoryProductsRepository.items[0],
    })
  })

  it("should not be able to register a product with same name", async () => {
    await sut.execute({
      name: "Product Test",
      description: "Product description",
      price: 100,
      quantity: 10,
    })

    const result = await sut.execute({
      name: "Product Test",
      description: "Another description",
      price: 200,
      quantity: 20,
    })

    expect(result.isLeft()).toBe(true)
  })
})
