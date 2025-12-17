import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().min(0, "Quantity must be >= 0"),
});

export type ProductInput = z.infer<typeof productSchema>;

export interface ProductRecord extends ProductInput {
  id: string;
  createdAt: string;
  updatedAt: string | null;
}
