import { Either, right } from "@/core/either"
import { Client } from "../../enterprise/client.entity"
import { ClientsRepository } from "../repositories/clients.repository"
import {
  DynamoDBPaginatedResponse,
  DynamoDBPaginationParams,
} from "@/core/repositories/pagination-params"

type FetchClientsUseCaseRequest = DynamoDBPaginationParams
type FetchClientsUseCaseResponse = Either<null, DynamoDBPaginatedResponse<Client>>

export class FetchClientsUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute(params: FetchClientsUseCaseRequest): Promise<FetchClientsUseCaseResponse> {
    const { items, count, lastEvaluatedKey } = await this.clientsRepository.findAll(params)

    return right({ items, count, lastEvaluatedKey })
  }
}
