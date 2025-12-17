import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  async getFileContent(bucket: string, key: string): Promise<Buffer> {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await this.client.send(command);

    if (!response.Body) {
      throw new Error("Empty file content");
    }

    return Buffer.from(await response.Body.transformToByteArray());
  }

  getFileExtension(key: string): string {
    return key.split(".").pop()?.toLowerCase() || "";
  }
}
