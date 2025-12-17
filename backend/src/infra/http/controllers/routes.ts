import { FastifyTypedInstance } from "@/core/types/fastify-instance"
import { registerClientController } from "./register-client.controller"
import z from "zod"

export async function routes(app: FastifyTypedInstance) {
  /* CLIENTS */
  app.post(
    "/clients",
    {
      schema: {
        tags: ["Clients"],
        summary: "Register a new client",
        description: "Endpoint to register a new client in the system",
        body: z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({}),
          409: z
            .object({
              message: z.string(),
            })
            .describe("Conflict - Resource already exists"),
        },
      },
    },
    registerClientController.handle,
  )

  /* PRODUCTS */
}
