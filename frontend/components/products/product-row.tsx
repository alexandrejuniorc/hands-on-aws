"use client";

import { useState } from "react";
import { Product, ProductInput } from "@/types/product";
import { createProduct, updateProduct } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Check, X, Pencil, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductRowProps {
  product?: Product;
  isNew?: boolean;
  onUpdate?: (product: Product) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onCreate?: (product: Product) => void;
}

export function ProductRow({
  product,
  isNew = false,
  onUpdate,
  onDelete,
  onCancel,
  onCreate,
}: ProductRowProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    quantity: product?.quantity || 0,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!formData.name.trim()) {
        toast.error("Product name is required");
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Product description is required");
        return;
      }

      if (formData.price <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }

      if (formData.quantity < 0) {
        toast.error("Quantity cannot be negative");
        return;
      }

      if (isNew) {
        const newProduct = await createProduct(formData);
        onCreate?.(newProduct);
        toast.success("Product created successfully");
      } else if (product) {
        const updated = await updateProduct(product.id, formData);
        onUpdate?.(updated);
        setIsEditing(false);
        toast.success("Product updated successfully");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save product"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isNew) {
      onCancel?.();
    } else {
      setIsEditing(false);
      setFormData({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        quantity: product?.quantity || 0,
      });
    }
  };

  const handleQuantityChange = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(0, prev.quantity + delta),
    }));
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product name"
            disabled={isSaving}
          />
        </TableCell>
        <TableCell>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Product description"
            disabled={isSaving}
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
            disabled={isSaving}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(-1)}
              disabled={isSaving || formData.quantity <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              className="w-20 text-center"
              disabled={isSaving}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(1)}
              disabled={isSaving}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{product?.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {product?.description}
      </TableCell>
      <TableCell>${product?.price.toFixed(2)}</TableCell>
      <TableCell>{product?.quantity}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
