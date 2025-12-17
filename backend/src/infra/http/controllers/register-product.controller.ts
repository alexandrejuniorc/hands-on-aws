import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists.error"
import { RegisterProductUseCase } from "@/domain/pricing/application/use-cases/register-product.use-case"
import { productsRepository } from "@/infra/database/dynamo/repositories/dynamo-products.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const registerProductBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().min(0),
})

export class RegisterProductController {
  constructor(private registerProductUseCase: RegisterProductUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, description, price, quantity } = registerProductBodySchema.parse(request.body)

    const result = await this.registerProductUseCase.execute({
      name,
      description,
      price,
      quantity,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          return reply.status(409).send({ message: error.message })
        default:
          throw error
      }
    }

    return reply.status(201).send()
  }
}

const registerProductUseCase = new RegisterProductUseCase(productsRepository)
export const registerProductController = new RegisterProductController(registerProductUseCase)
