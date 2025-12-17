import { Either, left, right } from "@/core/either"
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists.error"
import { Client } from "../../enterprise/client.entity"
import { ClientsRepository } from "../repositories/clients.repository"
import { HashGenerator } from "../cryptography/hash-generator"

interface RegisterClientRequest {
  name: string
  email: string
  password: string
}

type RegisterClientResponse = Either<ResourceAlreadyExistsError, { client: Client }>

export class RegisterClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({ email, name, password }: RegisterClientRequest): Promise<RegisterClientResponse> {
    const clientWithSameEmail = await this.clientsRepository.findByEmail(email)

    if (clientWithSameEmail) {
      return left(new ResourceAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const client = Client.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.clientsRepository.create(client)

    return right({ client })
  }
}
