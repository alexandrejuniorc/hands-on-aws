import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { GetClientByEmailUseCase } from "@/domain/pricing/application/use-cases/get-client-by-email.use-case"
import { clientsRepository } from "@/infra/database/dynamo/repositories/dynamo-clients.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { HttpClientPresenter } from "../presenters/http-client.presenter"

const getClientByEmailQuerySchema = z.object({
  email: z.string().email(),
})

export class GetClientByEmailController {
  constructor(private getClientByEmailUseCase: GetClientByEmailUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email } = getClientByEmailQuerySchema.parse(request.query)

    const result = await this.getClientByEmailUseCase.execute({ email })

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

const getClientByEmailUseCase = new GetClientByEmailUseCase(clientsRepository)
export const getClientByEmailController = new GetClientByEmailController(getClientByEmailUseCase)
