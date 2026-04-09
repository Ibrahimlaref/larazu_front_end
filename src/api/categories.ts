import { mockCategories } from "./mockData";
import type { Category } from "@/types/product";

export async function fetchCategories(): Promise<Category[]> {
  return Promise.resolve(mockCategories);
}
