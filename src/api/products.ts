import { api } from "./httpClient";
import { toProduct } from "./transform";
import type { Product } from "@/types/product";
import type { ProductFilters, SortOption } from "@/types/product";

const USE_API = import.meta.env.VITE_USE_API !== "false";

function paramsFromFilters(f?: Partial<ProductFilters>): Record<string, string | string[] | undefined> {
  if (!f) return {};
  const p: Record<string, string | string[] | undefined> = {};
  if (f.category && f.category !== "all") p.category = f.category;
  if (f.sort) p.sort = f.sort as SortOption;
  if (f.priceRange?.[0] != null) p.minPrice = String(f.priceRange[0]);
  if (f.priceRange?.[1] != null) p.maxPrice = String(f.priceRange[1]);
  if (f.sizes?.length) p["sizes[]"] = f.sizes;
  if (f.colors?.length) p["colors[]"] = f.colors;
  return p;
}

export async function fetchProducts(filters?: Partial<ProductFilters>): Promise<Product[]> {
  if (!USE_API) {
    const { mockProducts } = await import("./mockData");
    return Promise.resolve(mockProducts);
  }
  if (filters?.search?.trim()) {
    const { data } = await api.get<unknown[]>(`/api/products/search/`, { params: { q: filters.search.trim() } });
    return (data ?? []).map((p) => toProduct(p as Record<string, unknown>));
  }
  const { data } = await api.get<unknown[]>(`/api/products/`, { params: paramsFromFilters(filters) });
  return (data ?? []).map((p) => toProduct(p as Record<string, unknown>));
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  if (!USE_API) {
    const { mockProducts } = await import("./mockData");
    return Promise.resolve(mockProducts.find((p) => p.id === id));
  }
  try {
    const { data } = await api.get(`/api/products/${id}/`);
    return toProduct(data as Record<string, unknown>);
  } catch {
    return undefined;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (!USE_API) {
    const { mockProducts } = await import("./mockData");
    return Promise.resolve(mockProducts.find((p) => p.slug === slug));
  }
  try {
    const { data } = await api.get(`/api/products/slug/${slug}/`);
    return toProduct(data as Record<string, unknown>);
  } catch {
    return undefined;
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  if (!USE_API) {
    const { mockProducts } = await import("./mockData");
    return Promise.resolve(mockProducts.filter((p) => p.badge === "bestseller" || p.badge === "new"));
  }
  const { data } = await api.get<unknown[]>(`/api/products/featured/`);
  return (data ?? []).map((p) => toProduct(p as Record<string, unknown>));
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!USE_API) {
    const { mockProducts } = await import("./mockData");
    const q = query.toLowerCase();
    return Promise.resolve(
      mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    );
  }
  const { data } = await api.get<unknown[]>(`/api/products/search/`, { params: { q: query } });
  return (data ?? []).map((p) => toProduct(p as Record<string, unknown>));
}
