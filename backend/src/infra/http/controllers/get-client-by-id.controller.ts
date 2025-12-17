import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { GetClientByIdUseCase } from "@/domain/pricing/application/use-cases/get-client-by-id.use-case"
import { clientsRepository } from "@/infra/database/dynamo/repositories/dynamo-clients.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { HttpClientPresenter } from "../presenters/http-client.presenter"

const getClientByIdParamsSchema = z.object({
  id: z.string().uuid(),
})

export class GetClientByIdController {
  constructor(private getClientByIdUseCase: GetClientByIdUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = getClientByIdParamsSchema.parse(request.params)

    const result = await this.getClientByIdUseCase.execute({ id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          return reply.status(404).send({ message: error.message })
        default:
          throw error
      }
    }

    const { client } = result.value

    return reply.status(200).send({ client: HttpClientPresenter.toHTTP(client) })
  }
}

const getClientByIdUseCase = new GetClientByIdUseCase(clientsRepository)
export const getClientByIdController = new GetClientByIdController(getClientByIdUseCase)
