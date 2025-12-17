import { InMemoryClientsRepository } from "@/test/repositories/in-memory-clients.repository"
import { makeClient } from "@/test/factories/make-client.factory"
import { FetchClientsUseCase } from "./fetch-clients.use-case"

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: FetchClientsUseCase // SUT -> System Under Test

describe("Fetch Clients Use Case", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new FetchClientsUseCase(inMemoryClientsRepository)
  })

  it("should be able to fetch clients", async () => {
    for (let i = 0; i < 22; i++) {
      inMemoryClientsRepository.create(makeClient())
    }

    const result = await sut.execute({ limit: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.count).toBe(20)
  })
})
