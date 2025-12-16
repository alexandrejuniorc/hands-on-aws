import { FakeHasher } from "@/test/cryptography/fake-hasher"
import { RegisterClientUseCase } from "./register-client"
import { InMemoryClientsRepository } from "@/test/repositories/in-memory-clients-repository"

let inMemoryStudentsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let sut: RegisterClientUseCase // SUT -> System Under Test

describe("Register Client Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryClientsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterClientUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it("should be able to register a new client", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      client: inMemoryStudentsRepository.items[0],
    })
  })

  it("should hash client password upon registration", async () => {
    const result = await sut.execute({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    })

    const hashedPassword = await fakeHasher.hash("123456")

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
