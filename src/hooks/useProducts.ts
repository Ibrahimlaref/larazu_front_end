import { useState, useEffect, useMemo } from "react";
import { fetchProducts } from "@/api/products";
import type { Product, ProductFilters } from "@/types/product";

export function useProducts(filters?: Partial<ProductFilters>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts(filters)
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [
    filters?.category,
    filters?.sort,
    filters?.priceRange?.[0],
    filters?.priceRange?.[1],
    filters?.search,
    filters?.sizes?.length,
    filters?.colors?.length,
  ]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (filters?.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (filters?.sizes?.length) {
      result = result.filter((p) => p.sizes.some((s) => filters.sizes!.includes(s)));
    }
    if (filters?.colors?.length) {
      result = result.filter((p) => p.colors.some((c) => filters.colors!.includes(c.name)));
    }
    if (filters?.priceRange) {
      result = result.filter(
        (p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }
    if (filters?.sort) {
      switch (filters.sort) {
        case "price-asc": result.sort((a, b) => a.price - b.price); break;
        case "price-desc": result.sort((a, b) => b.price - a.price); break;
        case "newest": result.sort((a, b) => b.id.localeCompare(a.id)); break;
        case "popular": result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      }
    }
    return result;
  }, [products, filters]);

  return { products: filtered, allProducts: products, loading, error };
}
