import { Either, left, right } from "@/core/either"
import { Client } from "../../enterprise/client"
import { ClientsRepository } from "../repositories/clients-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"

interface GetClientByEmailUseCaseRequest {
  email: string
}

type GetClientByEmailUseCaseResponse = Either<ResourceNotFoundError, { client: Client }>

export class GetClientByEmailUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    email,
  }: GetClientByEmailUseCaseRequest): Promise<GetClientByEmailUseCaseResponse> {
    const clientExistent = await this.clientsRepository.findByEmail(email)

    if (!clientExistent) {
      return left(new ResourceNotFoundError())
    }

    return right({ client: clientExistent })
  }
}
