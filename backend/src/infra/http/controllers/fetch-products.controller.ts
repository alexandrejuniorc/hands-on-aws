import { FetchProductsUseCase } from "@/domain/pricing/application/use-cases/fetch-products.use-case"
import { productsRepository } from "@/infra/database/dynamo/repositories/dynamo-products.repository"
import { HttpProductPresenter } from "../presenters/http-product.presenter"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const fetchProductsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  lastEvaluatedKey: z.string().optional(),
})

export class FetchProductsController {
  constructor(private fetchProductsUseCase: FetchProductsUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { limit, lastEvaluatedKey } = fetchProductsQuerySchema.parse(request.query)

    const result = await this.fetchProductsUseCase.execute({
      limit,
      lastEvaluatedKey: lastEvaluatedKey ? { id: lastEvaluatedKey } : undefined,
    })

    if (result.isLeft()) {
      return reply.status(500).send({ message: "Internal server error" })
    }

    const { items, count, lastEvaluatedKey: nextKey } = result.value

    return reply.status(200).send({
      products: items.map((product) => HttpProductPresenter.toHTTP(product)),
      count,
      lastEvaluatedKey: nextKey,
    })
  }
}

const fetchProductsUseCase = new FetchProductsUseCase(productsRepository)
export const fetchProductsController = new FetchProductsController(fetchProductsUseCase)
