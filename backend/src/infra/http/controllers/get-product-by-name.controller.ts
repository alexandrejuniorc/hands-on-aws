import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { GetProductByNameUseCase } from "@/domain/pricing/application/use-cases/get-product-by-name"
import { productsRepository } from "@/infra/database/dynamo/repositories/dynamo-products.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const getProductByNameQuerySchema = z.object({
  name: z.string().min(1),
})

export class GetProductByNameController {
  constructor(private getProductByNameUseCase: GetProductByNameUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name } = getProductByNameQuerySchema.parse(request.query)

    const result = await this.getProductByNameUseCase.execute({
      name,
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

const getProductByNameUseCase = new GetProductByNameUseCase(productsRepository)
export const getProductByNameController = new GetProductByNameController(getProductByNameUseCase)
