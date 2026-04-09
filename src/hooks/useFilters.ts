import { useState, useCallback } from "react";
import type { ProductFilters, SortOption } from "@/types/product";

const defaultFilters: ProductFilters = {
  category: "all",
  priceRange: [0, 20000],
  sizes: [],
  colors: [],
  sort: "newest",
  search: "",
};

export function useFilters() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);

  const setCategory = useCallback((c: string) => setFilters((f) => ({ ...f, category: c })), []);
  const setSort = useCallback((s: SortOption) => setFilters((f) => ({ ...f, sort: s })), []);
  const setSearch = useCallback((s: string) => setFilters((f) => ({ ...f, search: s })), []);

  const toggleSize = useCallback(
    (size: string) =>
      setFilters((f) => ({
        ...f,
        sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
      })),
    []
  );

  const toggleColor = useCallback(
    (color: string) =>
      setFilters((f) => ({
        ...f,
        colors: f.colors.includes(color) ? f.colors.filter((c) => c !== color) : [...f.colors, color],
      })),
    []
  );

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  return { filters, setCategory, setSort, setSearch, toggleSize, toggleColor, resetFilters };
}
