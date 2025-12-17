import { FastifyTypedInstance } from "@/core/types/fastify-instance"
import { registerClientController } from "./register-client.controller"
import { getClientByIdController } from "./get-client-by-id.controller"
import { getClientByEmailController } from "./get-client-by-email.controller"
import { deleteClientController } from "./delete-client.controller"
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
    registerClientController.handle.bind(registerClientController),
  )

  app.get(
    "/clients/:id",
    {
      schema: {
        tags: ["Clients"],
        summary: "Get client by ID",
        description: "Endpoint to get a client by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            client: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              createdAt: z.date(),
              updatedAt: z.date().nullable(),
            }),
          }),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not Found - Client does not exist"),
        },
      },
    },
    getClientByIdController.handle.bind(getClientByIdController),
  )

  app.get(
    "/clients/email",
    {
      schema: {
        tags: ["Clients"],
        summary: "Get client by email",
        description: "Endpoint to search a client by email using query parameter",
        querystring: z.object({
          email: z.string().email(),
        }),
        response: {
          200: z.object({
            client: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              createdAt: z.date(),
              updatedAt: z.date().nullable(),
            }),
          }),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not Found - Client does not exist"),
        },
      },
    },
    getClientByEmailController.handle.bind(getClientByEmailController),
  )

  app.delete(
    "/clients/:id",
    {
      schema: {
        tags: ["Clients"],
        summary: "Delete client",
        description: "Endpoint to delete a client by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null().describe("No Content - Client successfully deleted"),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not Found - Client does not exist"),
        },
      },
    },
    deleteClientController.handle.bind(deleteClientController),
  )

  /* PRODUCTS */
}
