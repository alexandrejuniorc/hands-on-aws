import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { GetProductByIdUseCase } from "@/domain/pricing/application/use-cases/get-product-by-id"
import { productsRepository } from "@/infra/database/dynamo/repositories/dynamo-products.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const getProductByIdParamsSchema = z.object({
  id: z.string().uuid(),
})

export class GetProductByIdController {
  constructor(private getProductByIdUseCase: GetProductByIdUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = getProductByIdParamsSchema.parse(request.params)

    const result = await this.getProductByIdUseCase.execute({
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

    const { product } = result.value

    return reply.status(200).send({
      product: {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    })
  }
}

const getProductByIdUseCase = new GetProductByIdUseCase(productsRepository)
export const getProductByIdController = new GetProductByIdController(getProductByIdUseCase)
