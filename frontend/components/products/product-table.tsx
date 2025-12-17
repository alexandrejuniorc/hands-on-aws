"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ProductRow } from "./product-row";
import { ProductDeleteDialog } from "./product-delete-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductTableProps {
  initialProducts: Product[];
}

export function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setDeleteProduct(null);
  };

  const handleProductCreate = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddingNew(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Total: {products.length} products
          </p>
          {!isAddingNew && (
            <Button
              onClick={() => setIsAddingNew(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-62.5">Name</TableHead>
                <TableHead className="w-96">Description</TableHead>
                <TableHead className="w-37.5">Price</TableHead>
                <TableHead className="w-30">Quantity</TableHead>
                <TableHead className="text-right w-37.5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAddingNew && (
                <ProductRow
                  isNew
                  onCancel={() => setIsAddingNew(false)}
                  onCreate={handleProductCreate}
                />
              )}
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onUpdate={handleProductUpdate}
                  onDelete={() => setDeleteProduct(product)}
                />
              ))}
              {products.length === 0 && !isAddingNew && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No products found. Click "Add Product" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {deleteProduct && (
        <ProductDeleteDialog
          product={deleteProduct}
          open={!!deleteProduct}
          onOpenChange={(open: boolean) => !open && setDeleteProduct(null)}
          onDelete={handleProductDelete}
        />
      )}
    </>
  );
}
