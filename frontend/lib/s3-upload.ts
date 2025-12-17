import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(
  file: File,
  bucket: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: file.type,
  });

  try {
    // Get presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // Upload file using presigned URL
    await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return key;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file to S3");
  }
}

// Alternative: Direct upload (requires CORS configuration on S3)
export async function directUploadToS3(
  file: File,
  bucket: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);
    return key;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file to S3");
  }
}
