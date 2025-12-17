export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface ProductsResponse {
  products: Product[];
  count: number;
  lastEvaluatedKey?: any;
}
