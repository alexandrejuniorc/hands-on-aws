PK     ! Sample products data for testing

This folder contains sample files for testing the product import feature.

## Files

### sample-products.csv
CSV file with 10 sample products. You can use this to test CSV import.

### How to create sample-products.xlsx manually:

Since we can't generate Excel files directly, you have two options:

**Option 1: Use the CSV and convert**
1. Open `sample-products.csv` in Excel or Google Sheets
2. Save as `sample-products.xlsx`

**Option 2: Create manually in Excel**
1. Create a new Excel file
2. Add these columns: name, description, price, quantity
3. Add sample data like:

| name | description | price | quantity |
|------|-------------|-------|----------|
| Laptop Dell XPS 15 | High-performance laptop with Intel i7 processor | 1299.99 | 15 |
| Mouse Logitech MX Master 3 | Wireless ergonomic mouse with precision tracking | 99.99 | 50 |
| Keyboard Mechanical RGB | Gaming keyboard with RGB backlight and blue switches | 149.99 | 30 |

4. Save as `sample-products.xlsx`

## Testing

1. Go to your frontend at `http://localhost:3000`
2. In the "Import Products" card, click "Choose File"
3. Select either `sample-products.csv` or `sample-products.xlsx`
4. Click "Upload File"
5. Wait for the Lambda to process the file
6. Refresh the page to see the new products
