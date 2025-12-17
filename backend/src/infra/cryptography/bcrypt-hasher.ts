import { HashComparer } from "@/domain/pricing/application/cryptography/hash-comparer"
import { HashGenerator } from "@/domain/pricing/application/cryptography/hash-generator"
import { compare, hash } from "bcryptjs"

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}

export const bcryptHasher = new BcryptHasher()
