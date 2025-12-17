import { faker } from "@faker-js/faker"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ClientProps, Client } from "@/domain/pricing/enterprise/client.entity"

export function makeClient(override: Partial<ClientProps> = {}, id?: UniqueEntityID): Client {
  const client = Client.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return client
}
