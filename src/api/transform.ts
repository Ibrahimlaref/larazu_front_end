/** Map backend snake_case to frontend camelCase */

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function imageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return API_BASE ? `${API_BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}` : path;
}

export function toProduct(p: Record<string, unknown>): {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  badge?: "new" | "sale" | "bestseller";
  description: string;
  details: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  ref?: string;
} {
  return {
    id: String(p.id),
    name: String(p.name),
    slug: String(p.slug),
    category: String(p.category),
    price: Number(p.price),
    salePrice: p.sale_price != null ? Number(p.sale_price) : undefined,
    images: Array.isArray(p.images) ? p.images.map((x) => imageUrl(String(x))) : [],
    colors: Array.isArray(p.colors)
      ? p.colors.map((c: { name?: string; hex?: string }) => ({
          name: String(c?.name ?? ""),
          hex: String(c?.hex ?? "#000"),
        }))
      : [],
    sizes: Array.isArray(p.sizes) ? p.sizes.map(String) : [],
    badge: p.badge ? (p.badge as "new" | "sale" | "bestseller") : undefined,
    description: String(p.description ?? ""),
    details: String(p.details ?? ""),
    inStock: Boolean(p.in_stock ?? true),
    rating: Number(p.rating ?? 0),
    reviewCount: Number(p.review_count ?? 0),
    ref: p.ref ? String(p.ref) : undefined,
  };
}
