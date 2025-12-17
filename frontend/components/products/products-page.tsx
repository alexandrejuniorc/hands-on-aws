import { getProducts } from "@/app/actions";
import { ProductTable } from "./product-table";
import { FileUpload } from "./file-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function ProductsPage() {
  const response = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Product Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your products with AWS integration
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Products</CardTitle>
              <CardDescription>
                Upload a CSV or Excel file to bulk import products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                View and manage all your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductTable initialProducts={response.products} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
