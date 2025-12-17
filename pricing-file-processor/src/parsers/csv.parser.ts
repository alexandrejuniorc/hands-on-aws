import Papa from "papaparse";
import { ProductInput } from "../validators/product-schema.validator";

export class CSVParser {
  parse(fileContent: string): ProductInput[] {
    const result = Papa.parse<Record<string, string>>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Converte números automaticamente
    });

    if (result.errors.length > 0) {
      console.warn("CSV parsing warnings:", result.errors);
    }

    return result.data.map((row) => ({
      name: String(row.name || ""),
      description: String(row.description || ""),
      price: Number(row.price || 0),
      quantity: Number(row.quantity || 0),
    }));
  }
}
