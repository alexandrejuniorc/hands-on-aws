import crypto from "crypto";

export class IdempotencyService {
  /**
   * Gera hash único baseado no conteúdo do arquivo
   * Útil para identificar se o mesmo arquivo foi processado antes
   */
  generateFileHash(content: Buffer | string): string {
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  /**
   * Gera identificador único para o processamento
   * Combina bucket, key e timestamp
   */
  generateProcessingId(bucket: string, key: string): string {
    const timestamp = new Date().toISOString();
    const data = `${bucket}:${key}:${timestamp}`;
    return crypto.createHash("md5").update(data).digest("hex");
  }
}
