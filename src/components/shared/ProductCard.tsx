import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggle } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.salePrice! - product.price) / product.salePrice!) * 100)
    : 0;

  const imageSrc = (() => {
    const raw = product.images?.[0] ?? "";
    if (!raw) return "/products/Gemini_Generated_Image_3q6hc63q6hc63q6h.png";
    if (raw.startsWith("http") || raw.startsWith("data:")) return raw;
    return `${import.meta.env.BASE_URL}${raw.replace(/^\//, "")}`;
  })();

  return (
    <div className="group relative">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-stone aspect-[3/4]">
        <img
          src={imageSrc}
          alt={`${product.name} photo`}
          loading="lazy"
          onError={(event) => {
            const img = event.currentTarget as HTMLImageElement;
            if (!img.src.includes("Gemini_Generated_Image_3q6hc63q6hc63q6h.png")) {
              img.src = "/products/Gemini_Generated_Image_3q6hc63q6hc63q6h.png";
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge */}
        {product.badge && (
          <Badge
            className={`absolute top-3 left-3 rounded-none text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 ${
              product.badge === "sale"
                ? "bg-rust text-white"
                : product.badge === "new"
                ? "bg-ink text-chalk"
                : "bg-sand text-ink"
            }`}
          >
            {product.badge === "sale" ? `Sale` : product.badge === "new" ? "New" : "Best Seller"}
          </Badge>
        )}
        {/* Hover Actions */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); toggle(product); }}
            className={`w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-colors ${
              inWishlist ? "text-rust" : "text-ink"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className="w-3.5 h-3.5" fill={inWishlist ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); window.location.href = `/product/${product.id}`; }}
            className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white text-ink transition-colors"
            aria-label="Quick view"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-2">
        <p className="label-mono text-mist text-[0.55rem] mb-1">
          {product.category === "women" ? "WOMEN'S" : product.category === "men" ? "MEN'S" : product.category.toUpperCase()}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-base text-ink hover:text-rust transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="font-semibold text-rust">{product.price.toLocaleString()} DZD</span>
              <span className="text-sm text-mist line-through">{product.salePrice!.toLocaleString()} DZD</span>
            </>
          ) : (
            <span className="font-semibold">{product.price.toLocaleString()} DZD</span>
          )}
          {discount > 0 && (
            <span className="text-xs text-rust font-mono">-{discount}%</span>
          )}
        </div>
        {/* Color dots */}
        <div className="flex gap-1 mt-2">
          {product.colors.map((c) => (
            // eslint-disable-next-line
            <span
              key={c.name}
              className="w-3 h-3 rounded-full border border-stone"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
