import { Encrypter } from "@/domain/pricing/application/cryptography/encrypter"

export class JwtEncrypter implements Encrypter {
  // constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    throw new Error("Method not implemented.")
  }
}

export const jwtEncrypter = new JwtEncrypter()
