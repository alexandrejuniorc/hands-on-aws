import { Either, left, right } from "@/core/either"
import { Client } from "../../enterprise/client"
import { ClientsRepository } from "../repositories/clients-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"

interface GetClientByIdUseCaseRequest {
  id: string
}

type GetClientByIdUseCaseResponse = Either<ResourceNotFoundError, { client: Client }>

export class GetClientByIdUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({ id }: GetClientByIdUseCaseRequest): Promise<GetClientByIdUseCaseResponse> {
    const clientExistent = await this.clientsRepository.findById(id)

    if (!clientExistent) {
      return left(new ResourceNotFoundError())
    }

    return right({ client: clientExistent })
  }
}
