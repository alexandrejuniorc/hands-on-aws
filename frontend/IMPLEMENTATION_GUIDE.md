# Frontend Implementation - Remaining Steps

## ✅ Completed:
- Next.js 14 project setup with TypeScript and Tailwind CSS
- shadcn/ui components installed
- React Query, Axios, Zod, React Hook Form installed
- AWS SDK for S3 installed
- Type definitions (`types/product.ts`)
- API client (`lib/api.ts`)
- S3 upload utility (`lib/s3-upload.ts`)
- React Query hooks (`hooks/use-products.ts`)
- File upload component (`components/products/file-upload.tsx`)

## 📝 TODO - Create these files:

### 1. `app/layout.tsx` - Root layout with React Query Provider
```typescript
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

### 2. `app/page.tsx` - Main products page
```typescript
import { ProductsPage } from "@/components/products/products-page"

export default function Home() {
  return <ProductsPage />
}
```

### 3. `components/products/products-page.tsx` - Main component
- Product table with inline editing
- Quantity selector
- Delete confirmation
- Add new product inline
- File upload section

### 4. `components/products/product-table.tsx` - Table component
- Display all products
- Editable cells for name, description, price, quantity
- Delete button with confirmation dialog
- Add new row button

### 5. `components/products/product-row.tsx` - Individual row
- Editable inputs
- Save/Cancel buttons
- Quantity stepper

### 6. `components/products/product-delete-dialog.tsx` - Delete confirmation
- Confirmation dialog using shadcn Dialog

### 7. Environment variables `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3333
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-secret
NEXT_PUBLIC_S3_BUCKET=your-bucket-name
```

## 🚀 Features to implement in components:

1. **Product Table**:
   - Sortable columns
   - Inline editing (double-click to edit)
   - Quantity selector with +/- buttons
   - Delete with confirmation
   - Loading states
   - Error handling

2. **Add New Product**:
   - Inline form at bottom of table
   - Validation with Zod
   - Auto-clear after save

3. **File Upload**:
   - Drag & drop support (optional)
   - Progress indicator
   - File type validation (CSV, XLSX)
   - Size limit (10MB)

4. **Optimistic Updates**:
   - Use React Query mutations with optimistic updates
   - Show loading states
   - Rollback on error

## 📦 Additional components you might want:
- Pagination controls
- Search/Filter bar
- Export to CSV
- Bulk delete
- Product details modal

Would you like me to create the remaining components?
