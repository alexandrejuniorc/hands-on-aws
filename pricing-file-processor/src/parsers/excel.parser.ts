import * as XLSX from "xlsx";
import { ProductInput } from "../validators/product-schema.validator";

export class ExcelParser {
  parse(buffer: Buffer): ProductInput[] {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet);

    return data.map((row) => ({
      name: String(row.name || ""),
      description: String(row.description || ""),
      price: Number(row.price || 0),
      quantity: Number(row.quantity || 0),
    }));
  }
}
