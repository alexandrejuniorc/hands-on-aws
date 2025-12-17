// Script to generate Excel file with sample products
// Run: node generate-excel.js

const XLSX = require("xlsx");

const products = [
  {
    name: "Laptop Dell XPS 15",
    description: "High-performance laptop with Intel i7 processor",
    price: 1299.99,
    quantity: 15,
  },
  {
    name: "Mouse Logitech MX Master 3",
    description: "Wireless ergonomic mouse with precision tracking",
    price: 99.99,
    quantity: 50,
  },
  {
    name: "Keyboard Mechanical RGB",
    description: "Gaming keyboard with RGB backlight and blue switches",
    price: 149.99,
    quantity: 30,
  },
  {
    name: "Monitor LG UltraWide 34",
    description: "34-inch curved monitor with 3440x1440 resolution",
    price: 599.99,
    quantity: 8,
  },
  {
    name: "Webcam Logitech C920",
    description: "Full HD 1080p webcam with autofocus",
    price: 79.99,
    quantity: 25,
  },
  {
    name: "Headset HyperX Cloud II",
    description: "Gaming headset with 7.1 surround sound",
    price: 99.99,
    quantity: 40,
  },
  {
    name: "USB-C Hub Anker 7-in-1",
    description: "Multiport adapter with HDMI and card reader",
    price: 49.99,
    quantity: 60,
  },
  {
    name: "SSD Samsung 1TB",
    description: "NVMe M.2 solid state drive with 3500MB/s read speed",
    price: 129.99,
    quantity: 35,
  },
  {
    name: "RAM Corsair 16GB DDR4",
    description: "High-speed memory module 3200MHz",
    price: 89.99,
    quantity: 45,
  },
  {
    name: "Desk Lamp LED",
    description: "Adjustable brightness desk lamp with USB charging port",
    price: 34.99,
    quantity: 100,
  },
];

// Create workbook and worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(products);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, "Products");

// Write file
XLSX.writeFile(wb, "./public/sample-products.xlsx");

console.log("✅ Excel file created: public/sample-products.xlsx");
