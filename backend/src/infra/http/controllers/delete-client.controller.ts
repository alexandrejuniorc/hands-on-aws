import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { DeleteClientUseCase } from "@/domain/pricing/application/use-cases/delete-client"
import { clientsRepository } from "@/infra/database/dynamo/repositories/dynamo-clients.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const deleteClientParamsSchema = z.object({
  id: z.string().uuid(),
})

export class DeleteClientController {
  constructor(private deleteClientUseCase: DeleteClientUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = deleteClientParamsSchema.parse(request.params)

    const result = await this.deleteClientUseCase.execute({ id })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          return reply.status(404).send({ message: error.message })
        default:
          throw error
      }
    }

    return reply.status(204).send()
  }
}

const deleteClientUseCase = new DeleteClientUseCase(clientsRepository)
export const deleteClientController = new DeleteClientController(deleteClientUseCase)
