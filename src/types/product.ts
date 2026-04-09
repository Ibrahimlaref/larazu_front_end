export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  badge?: "new" | "sale" | "bestseller";
  description: string;
  details: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  ref?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export interface ProductFilters {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sort: SortOption;
  search: string;
}
