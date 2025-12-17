import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { GetProductByIdUseCase } from "@/domain/pricing/application/use-cases/get-product-by-id.use-case"
import { productsRepository } from "@/infra/database/dynamo/repositories/dynamo-products.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { HttpProductPresenter } from "../presenters/http-product.presenter"

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

    return reply.status(200).send({ product: HttpProductPresenter.toHTTP(product) })
  }
}

const getProductByIdUseCase = new GetProductByIdUseCase(productsRepository)
export const getProductByIdController = new GetProductByIdController(getProductByIdUseCase)
