import axios from "axios";
import { Product, ProductInput, ProductsResponse } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const productsApi = {
  // Fetch all products with pagination
  fetchProducts: async (
    limit?: number,
    lastEvaluatedKey?: string
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (lastEvaluatedKey) params.append("lastEvaluatedKey", lastEvaluatedKey);

    const { data } = await api.get<ProductsResponse>(
      `/products?${params.toString()}`
    );
    return data;
  },

  // Get product by ID
  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get<{ product: Product }>(`/products/${id}`);
    return data.product;
  },

  // Get product by name
  getProductByName: async (name: string): Promise<Product> => {
    const { data } = await api.get<{ product: Product }>(
      `/products/name?name=${encodeURIComponent(name)}`
    );
    return data.product;
  },

  // Create new product
  createProduct: async (product: ProductInput): Promise<void> => {
    await api.post("/products", product);
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Update product (you'll need to implement this endpoint in backend)
  updateProduct: async (
    id: string,
    product: Partial<ProductInput>
  ): Promise<void> => {
    await api.put(`/products/${id}`, product);
  },
};
