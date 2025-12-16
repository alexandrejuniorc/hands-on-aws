import { InMemoryProductsRepository } from "@/test/repositories/in-memory-products-repository"
import { GetProductByIdUseCase } from "./get-product-by-id"
import { makeProduct } from "@/test/factories/make-product"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: GetProductByIdUseCase // SUT -> System Under Test

describe("Get Product By Id Use Case", () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new GetProductByIdUseCase(inMemoryProductsRepository)
  })

  it("should be able to get a product by id", async () => {
    const product = makeProduct({}, new UniqueEntityID("product-1"))

    inMemoryProductsRepository.items.push(product)

    const result = await sut.execute({ id: "product-1" })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      product: expect.objectContaining({
        id: product.id,
      }),
    })
  })

  it("should not be able to get a product that does not exist", async () => {
    const result = await sut.execute({ id: "non-existent-id" })

    expect(result.isLeft()).toBe(true)
  })
})
