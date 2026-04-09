import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Minus, Plus, Package, RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";
import Wrapper from "@/components/hoc/Wrapper";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import SizeGuide from "@/components/shared/SizeGuide";
import ProductGrid from "@/components/shared/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("products");
  const { product, loading } = useProductDetail(id || "");
  const { addToCart } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { products } = useProducts();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    if (!product) return;
    setMainImage(0);
    setSelectedColor(product.colors?.length ? 0 : -1);
    setSelectedSize(product.sizes?.length ? product.sizes[0] : "");
  }, [product]);

  if (loading) {
    return (
      <Wrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (!product) {
    return (
      <Wrapper>
        <div className="text-center py-40">
          <h1 className="heading-display text-3xl text-mist">Product not found</h1>
        </div>
      </Wrapper>
    );
  }

  const hasDiscount = product.salePrice && product.salePrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.salePrice! - product.price) / product.salePrice!) * 100)
    : 0;
  const inWishlist = isInWishlist(product.id);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const productImage = product.images?.[mainImage] || "/products/Gemini_Generated_Image_3q6hc63q6hc63q6h.png";
  const hasColors = product.colors?.length > 0;
  const hasSizes = product.sizes?.length > 0;
  const selectedColorLabel = hasColors ? product.colors[selectedColor]?.name ?? "Default" : "Default";
  const selectedSizeLabel = hasSizes ? selectedSize : "One size";

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: productImage,
      color: selectedColorLabel,
      size: selectedSizeLabel,
      quantity,
    });
  };

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Images Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/5] max-h-[700px] bg-stone overflow-hidden mb-4">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(event) => {
                  const img = event.currentTarget as HTMLImageElement;
                  img.src = "/products/Gemini_Generated_Image_3q6hc63q6hc63q6h.png";
                }}
              />
            </div>
            {product.images?.length ? (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${
                      mainImage === i ? "border-ink" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Details */}
          <div>
            <BreadcrumbNav
              items={[
                { label: "Home", href: "/" },
                { label: product.category === "women" ? "Women's" : product.category === "men" ? "Men's" : product.category, href: `/shop?category=${product.category}` },
                { label: product.name },
              ]}
            />

            {/* Badge bar */}
            {(product.badge || hasDiscount) && (
              <div className="mt-4">
                <Badge className="bg-rust text-white rounded-none label-mono text-[0.6rem] px-3 py-1.5 w-full justify-center">
                  {product.badge === "bestseller" && "BEST SELLER"}
                  {product.badge === "sale" && `SALE · -${discount}% OFF`}
                  {product.badge === "new" && "NEW ARRIVAL"}
                  {!product.badge && hasDiscount && `-${discount}% OFF`}
                </Badge>
              </div>
            )}

            <h1 className="heading-display text-3xl md:text-4xl mt-4">{product.name}</h1>
            <p className="label-mono text-mist text-xs mt-1">
              {product.category.toUpperCase()} COLLECTION · REF. {product.ref}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="heading-display text-3xl text-ink">
                {product.price.toLocaleString()} DZD
              </span>
              {hasDiscount && (
                <>
                  <span className="text-mist line-through">{product.salePrice!.toLocaleString()} DZD</span>
                  <span className="label-mono text-rust text-xs">
                    SAVE {(product.salePrice! - product.price).toLocaleString()} DZD
                  </span>
                </>
              )}
            </div>

            <Separator className="my-5 bg-stone" />

            <p className="text-mist text-sm leading-relaxed">{product.description}</p>

            {/* Color */}
            <div className="mt-6">
              <p className="label-mono text-xs mb-3">
                {t("color")} — {selectedColorLabel}
              </p>
              <div className="flex gap-2">
                {hasColors ? (
                  product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        selectedColor === i ? "border-ink" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                    />
                  ))
                ) : (
                  <div className="w-8 h-8 rounded-full border border-stone bg-stone" />
                )}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <p className="label-mono text-xs">{t("size")} — {t("select")}</p>
                <span className="text-mist">·</span>
                <SizeGuide />
              </div>
              <div className="flex gap-2 flex-wrap">
                {hasSizes ? (
                  product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[48px] h-12 px-3 border font-mono text-sm transition-colors ${
                        selectedSize === s
                          ? "bg-ink text-chalk border-ink"
                          : "border-stone hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))
                ) : (
                  <span className="min-w-[48px] h-12 inline-flex items-center justify-center border border-stone text-sm text-mist">
                    One size
                  </span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="label-mono text-xs mb-3">{t("quantity")}</p>
              <div className="flex items-center border border-stone w-fit">
                <button
                  className="p-3 hover:bg-stone transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-mono">{quantity}</span>
                <button
                  className="p-3 hover:bg-stone transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mt-8">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-ink text-chalk hover:bg-ink/90 label-mono py-6 text-sm"
              >
                {t("addToCart", { ns: "common" })} — {(product.price * quantity).toLocaleString()} DZD
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`w-14 h-14 border-stone ${inWishlist ? "text-rust" : ""}`}
                onClick={() => toggle(product)}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
              </Button>
            </div>

            {/* Info strips */}
            <div className="mt-6 bg-warm p-5 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-mist">
                <Package className="w-4 h-4 text-rust shrink-0" />
                {t("freeShippingNote")}
              </div>
              <div className="flex items-center gap-3 text-mist">
                <RotateCcw className="w-4 h-4 text-rust shrink-0" />
                {t("freeReturns")}
              </div>
              <div className="flex items-center gap-3 text-mist">
                <ShieldCheck className="w-4 h-4 text-rust shrink-0" />
                {t("securePayment")}
              </div>
              <div className="flex items-center gap-3 text-mist">
                <CheckCircle2 className="w-4 h-4 text-rust shrink-0" />
                {t("authenticQuality")}
              </div>
            </div>

            {/* Accordions */}
            <Accordion className="mt-6">
              <AccordionItem value="details">
                <AccordionTrigger className="font-semibold text-sm">
                  {t("productDetails")}
                </AccordionTrigger>
                <AccordionContent className="text-mist text-sm">
                  {product.details}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="size-guide">
                <AccordionTrigger className="font-semibold text-sm">
                  {t("sizeGuide")}
                </AccordionTrigger>
                <AccordionContent className="text-mist text-sm">
                  Please refer to our size guide for accurate measurements. We recommend measuring yourself and comparing to the chart.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="font-semibold text-sm">
                  {t("shippingReturns")}
                </AccordionTrigger>
                <AccordionContent className="text-mist text-sm">
                  Free standard shipping on orders over 5,000 DZD. Express delivery available. Free returns within 14 days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20 bg-warm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label-mono text-mist mb-2">{t("youMayAlsoLike")}</p>
                <h2 className="heading-display text-3xl md:text-4xl">
                  Related <span className="heading-display-italic">Pieces</span>
                </h2>
              </div>
            </div>
            <ProductGrid products={related} columns={4} />
          </section>
        )}
      </div>
    </Wrapper>
  );
}
