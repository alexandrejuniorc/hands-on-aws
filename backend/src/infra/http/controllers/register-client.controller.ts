import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists.error"
import { RegisterClientUseCase } from "@/domain/pricing/application/use-cases/register-client.use-case"
import { bcryptHasher } from "@/infra/cryptography/bcrypt-hasher"
import { clientsRepository } from "@/infra/database/dynamo/repositories/dynamo-clients.repository"

import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"

const registerClientBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

export class RegisterClientController {
  constructor(private registerClientUseCase: RegisterClientUseCase) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = registerClientBodySchema.parse(request.body)

    const result = await this.registerClientUseCase.execute({
      name,
      email,
      password,
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

const registerClientUseCase = new RegisterClientUseCase(clientsRepository, bcryptHasher)
export const registerClientController = new RegisterClientController(registerClientUseCase)
