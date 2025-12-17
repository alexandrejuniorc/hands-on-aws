import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products.repository"
import { makeProduct } from "@/test/factories/make-product.factory"
import { FetchProductsUseCase } from "./fetch-products.use-case"

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: FetchProductsUseCase // SUT -> System Under Test

describe("Fetch Products Use Case", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new FetchProductsUseCase(inMemoryProductsRepository)
  })

  it("should be able to fetch products", async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryProductsRepository.create(makeProduct())
    }

    const result = await sut.execute({ limit: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.count).toBe(20)
  })
})
