import { InMemoryClientsRepository } from "@/test/repositories/in-memory-clients-repository"
import { makeClient } from "@/test/factories/make-client"
import { GetClientByEmailUseCase } from "./get-client-by-email"

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: GetClientByEmailUseCase // SUT -> System Under Test

describe("Get Client By EmailUse Case", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new GetClientByEmailUseCase(inMemoryClientsRepository)
  })

  it("should be able to get a client by email", async () => {
    const client = makeClient({ email: "client@example.com" })

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({ email: "client@example.com" })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      client: expect.objectContaining({
        email: client.email,
      }),
    })
  })
})
