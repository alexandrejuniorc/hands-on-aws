"use server";

import { revalidatePath } from "next/cache";
import { Product, ProductInput, ProductsResponse } from "@/types/product";

const API_BASE_URL = process.env.API_URL || "http://localhost:3333";

// Server-side API calls - credentials are hidden from browser
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const hasBody = options?.body !== undefined;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(hasBody && { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Try to get error message from response body
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    } catch {
      throw new Error(`API Error: ${response.statusText}`);
    }
  }

  // Handle empty responses (201 Created, 204 No Content)
  if (response.status === 201 || response.status === 204) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  return response.json();
}

export async function getProducts(limit?: number, lastEvaluatedKey?: string) {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  if (lastEvaluatedKey) params.append("lastEvaluatedKey", lastEvaluatedKey);

  const queryString = params.toString();
  const data = await fetchAPI(
    `/products${queryString ? `?${queryString}` : ""}`
  );

  return data as ProductsResponse;
}

export async function getProduct(id: string) {
  const data = await fetchAPI(`/products/${id}`);
  return data.product as Product;
}

export async function getProductByName(name: string) {
  const data = await fetchAPI(
    `/products/name?name=${encodeURIComponent(name)}`
  );
  return data.product as Product;
}

export async function createProduct(product: ProductInput) {
  await fetchAPI("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

  // Backend returns 201 with empty body, so fetch the product by name
  const createdProduct = await getProductByName(product.name);

  revalidatePath("/");
  return createdProduct;
}

export async function updateProduct(
  id: string,
  product: Partial<ProductInput>
) {
  const data = await fetchAPI(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

  revalidatePath("/");
  return data.product as Product;
}

export async function deleteProduct(id: string) {
  await fetchAPI(`/products/${id}`, {
    method: "DELETE",
  });

  revalidatePath("/");
}

// S3 Upload Server Action
export async function uploadFileToS3(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  const validTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload CSV or Excel file.");
  }

  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File size must be less than 10MB");
  }

  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  // Use AWS_REGION_PRICING as the bucket is located there
  const s3Client = new S3Client({
    region: process.env.AWS_REGION_PRICING || "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_PRICING!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_PRICING!,
    },
  });

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${Date.now()}-${file.name}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return { success: true, key };
}
