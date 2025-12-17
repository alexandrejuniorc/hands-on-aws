import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error"
import { GetProductByNameUseCase } from "@/domain/pricing/application/use-cases/get-product-by-name.use-case"
import { productsRepository } from "@/infra/database/dynamo/repositories/dynamo-products.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { HttpProductPresenter } from "../presenters/http-product.presenter"

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

    return reply.status(200).send({ product: HttpProductPresenter.toHTTP(product) })
  }
}

const getProductByNameUseCase = new GetProductByNameUseCase(productsRepository)
export const getProductByNameController = new GetProductByNameController(getProductByNameUseCase)
