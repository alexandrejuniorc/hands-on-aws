import { InMemoryClientsRepository } from "@/test/repositories/in-memory-clients.repository"
import { DeleteClientUseCase } from "./delete-client.use-case"
import { makeClient } from "@/test/factories/make-client.factory"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

let inMemoryStudentsRepository: InMemoryClientsRepository
let sut: DeleteClientUseCase // SUT -> System Under Test

describe("Delete Client Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryClientsRepository()
    sut = new DeleteClientUseCase(inMemoryStudentsRepository)
  })

  it("should be able to delete a client", async () => {
    makeClient({}, new UniqueEntityID("client-1"))

    await sut.execute({ id: "client-1" })

    expect(inMemoryStudentsRepository.items).toHaveLength(0)
  })
})
