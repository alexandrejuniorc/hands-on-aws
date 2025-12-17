import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { DeleteProductUseCase } from "@/domain/pricing/application/use-cases/delete-product.use-case"
import { productsRepository } from "@/infra/database/dynamo/repositories/dynamo-products.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const deleteProductParamsSchema = z.object({
  id: z.string().uuid(),
})

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = deleteProductParamsSchema.parse(request.params)

    const result = await this.deleteProductUseCase.execute({
      productId: id,
    })

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

const deleteProductUseCase = new DeleteProductUseCase(productsRepository)
export const deleteProductController = new DeleteProductController(deleteProductUseCase)
