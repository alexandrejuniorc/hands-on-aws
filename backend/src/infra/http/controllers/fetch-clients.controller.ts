import { FetchClientsUseCase } from "@/domain/pricing/application/use-cases/fetch-clients.use-case"
import { clientsRepository } from "@/infra/database/dynamo/repositories/dynamo-clients.repository"
import { HttpClientPresenter } from "../presenters/http-client.presenter"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const fetchClientsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  lastEvaluatedKey: z.string().optional(),
})

export class FetchClientsController {
  constructor(private fetchClientsUseCase: FetchClientsUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { limit, lastEvaluatedKey } = fetchClientsQuerySchema.parse(request.query)

    const result = await this.fetchClientsUseCase.execute({
      limit,
      lastEvaluatedKey: lastEvaluatedKey ? { id: lastEvaluatedKey } : undefined,
    })

    if (result.isLeft()) {
      return reply.status(500).send({ message: "Internal server error" })
    }

    const { items, count, lastEvaluatedKey: nextKey } = result.value

    return reply.status(200).send({
      clients: items.map((client) => HttpClientPresenter.toHTTP(client)),
      count,
      lastEvaluatedKey: nextKey,
    })
  }
}

const fetchClientsUseCase = new FetchClientsUseCase(clientsRepository)
export const fetchClientsController = new FetchClientsController(fetchClientsUseCase)
