import { FastifyTypedInstance } from "@/core/types/fastify-instance"
import { registerClientController } from "./register-client.controller"
import { getClientByIdController } from "./get-client-by-id.controller"
import { getClientByEmailController } from "./get-client-by-email.controller"
import { deleteClientController } from "./delete-client.controller"
import { registerProductController } from "./register-product.controller"
import { getProductByIdController } from "./get-product-by-id.controller"
import { getProductByNameController } from "./get-product-by-name.controller"
import { deleteProductController } from "./delete-product.controller"
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
  app.post(
    "/products",
    {
      schema: {
        tags: ["Products"],
        summary: "Register a new product",
        description: "Endpoint to register a new product in the system",
        body: z.object({
          name: z.string().min(1),
          description: z.string().min(1),
          price: z.number().positive(),
          quantity: z.number().int().min(0),
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
    registerProductController.handle.bind(registerProductController),
  )

  app.get(
    "/products/:id",
    {
      schema: {
        tags: ["Products"],
        summary: "Get product by ID",
        description: "Endpoint to get a product by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          200: z.object({
            product: z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              price: z.number(),
              quantity: z.number(),
              createdAt: z.date(),
              updatedAt: z.date().nullable(),
            }),
          }),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not Found - Product does not exist"),
        },
      },
    },
    getProductByIdController.handle.bind(getProductByIdController),
  )

  app.get(
    "/products/name",
    {
      schema: {
        tags: ["Products"],
        summary: "Get product by name",
        description: "Endpoint to search a product by name using query parameter",
        querystring: z.object({
          name: z.string().min(1),
        }),
        response: {
          200: z.object({
            product: z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              price: z.number(),
              quantity: z.number(),
              createdAt: z.date(),
              updatedAt: z.date().nullable(),
            }),
          }),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not Found - Product does not exist"),
        },
      },
    },
    getProductByNameController.handle.bind(getProductByNameController),
  )

  app.delete(
    "/products/:id",
    {
      schema: {
        tags: ["Products"],
        summary: "Delete product",
        description: "Endpoint to delete a product by ID",
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null().describe("No Content - Product successfully deleted"),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Not Found - Product does not exist"),
        },
      },
    },
    deleteProductController.handle.bind(deleteProductController),
  )
}
