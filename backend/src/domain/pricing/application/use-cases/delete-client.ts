import { Either, left, right } from "@/core/either"
import { ClientsRepository } from "../repositories/clients-repository"
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"

interface DeleteClientRequest {
  id: string
}

type DeleteClientResponse = Either<ResourceNotFoundError, null>

export class DeleteClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({ id }: DeleteClientRequest): Promise<DeleteClientResponse> {
    const clientExistent = await this.clientsRepository.findById(id)

    if (!clientExistent) {
      return left(new ResourceNotFoundError())
    }

    await this.clientsRepository.delete(id)

    return right(null)
  }
}
