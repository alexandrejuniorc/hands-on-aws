# Product Management Frontend

Next.js 14 application with AWS integration for product management.

## Features

- ✅ Product CRUD operations with inline editing
- ✅ Quantity management with increment/decrement controls
- ✅ Delete confirmation dialogs
- ✅ Bulk product import via CSV/Excel file upload to S3
- ✅ Server Actions for secure API communication
- ✅ Real-time toast notifications
- ✅ Responsive design with Tailwind CSS
- ✅ shadcn/ui component library

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AWS Services**: S3 (file uploads)
- **State Management**: Server Actions + React Server Components
- **Form Validation**: Zod
- **Notifications**: Sonner (toast)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Update the values:

```env
# Backend API
API_URL=http://localhost:3333

# AWS Credentials (Server-side only)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# S3 Bucket
S3_BUCKET=your-bucket-name
```

⚠️ **Security Note**: These credentials are only used server-side via Next.js Server Actions. They are NEVER exposed to the browser.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Usage

### Managing Products

1. **View Products**: The main page displays all products in a table
2. **Add Product**: Click "Add Product" button, fill in name, price, and quantity
3. **Edit Product**: Click the pencil icon on any row to edit inline
4. **Delete Product**: Click the trash icon to delete (with confirmation)
5. **Adjust Quantity**: Use +/- buttons when editing to change quantity

### Importing Products

1. Click on the "Import Products" card
2. Select a CSV or Excel file (max 10MB)
3. Click "Upload File"
4. The Lambda function will process the file and import products to DynamoDB

**Supported Formats**:
- CSV (.csv)
- Excel (.xlsx, .xls)

**Expected Columns**:
- `name` (string, required)
- `price` (number, required)
- `quantity` (number, required)

## Architecture

### Server Actions Pattern

This app uses Next.js Server Actions for all API communication:

- **Benefits**:
  - API credentials hidden from browser
  - No client-side API calls
  - Automatic cache revalidation
  - Built-in error handling

- **Server Actions** (`app/actions.ts`):
  - `getProducts()` - Fetch all products with pagination
  - `createProduct()` - Create new product
  - `updateProduct()` - Update existing product
  - `deleteProduct()` - Delete product
  - `uploadFileToS3()` - Upload file to S3

### Component Structure

```
app/
  ├── actions.ts          # Server Actions for API calls
  ├── layout.tsx          # Root layout with toast notifications
  └── page.tsx            # Main page entry point

components/
  └── products/
      ├── products-page.tsx        # Container component
      ├── product-table.tsx        # Table with all products
      ├── product-row.tsx          # Editable table row
      ├── product-delete-dialog.tsx # Delete confirmation
      └── file-upload.tsx          # CSV/Excel upload

types/
  └── product.ts          # TypeScript types
```

## API Integration

The frontend communicates with the Fastify backend API:

- `GET /products` - List all products (with pagination)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product (needs to be implemented in backend)
- `DELETE /products/:id` - Delete product

## File Upload Flow

1. User selects CSV/Excel file
2. Frontend validates file (type, size)
3. Server Action uploads to S3
4. S3 triggers Lambda function
5. Lambda parses and validates data
6. Lambda writes products to DynamoDB
7. Products appear in the table

## Development Notes

### Backend Requirements

Make sure the backend API is running on `http://localhost:3333` with the following endpoints:

- `GET /products?limit=50` - Returns paginated products
- `POST /products` - Creates product
- `DELETE /products/:id` - Deletes product

⚠️ **Missing Endpoint**: The backend needs a `PUT /products/:id` endpoint for update functionality.

### Lambda Configuration

The `pricing-file-processor` Lambda must be configured with:
- S3 trigger on the specified bucket
- Secrets Manager access for `PRODUCTS_TABLE_NAME`
- DynamoDB write permissions

## Troubleshooting

### Products not loading

- Verify backend is running on `http://localhost:3333`
- Check `API_URL` in `.env`
- Check browser console for errors

### File upload fails

- Verify AWS credentials in `.env`
- Check S3 bucket name is correct
- Ensure bucket has proper CORS configuration
- Verify Lambda has S3 trigger configured

### Updates not working

- The backend may not have PUT endpoint implemented yet
- Check backend logs for errors
- Verify product ID is valid

## Future Enhancements

- [ ] Implement PUT endpoint in backend for updates
- [ ] Add pagination controls for large datasets
- [ ] Add search/filter functionality
- [ ] Add export to CSV feature
- [ ] Add product images
- [ ] Add batch delete
- [ ] Add product categories

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
