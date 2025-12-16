import { InMemoryClientsRepository } from "@/test/repositories/in-memory-clients-repository"
import { GetClientByIdUseCase } from "./get-client-by-id"
import { makeClient } from "@/test/factories/make-client"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: GetClientByIdUseCase // SUT -> System Under Test

describe("Get Client By Id Use Case", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new GetClientByIdUseCase(inMemoryClientsRepository)
  })

  it("should be able to get a client by id", async () => {
    const client = makeClient({}, new UniqueEntityID("client-1"))

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({ id: "client-1" })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      client: expect.objectContaining({
        id: client.id,
      }),
    })
  })
})
