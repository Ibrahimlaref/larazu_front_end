import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Wrapper from "@/components/hoc/Wrapper";
import Ticker from "@/components/layout/Ticker";
import ProductGrid from "@/components/shared/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useFilters } from "@/hooks/useFilters";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 6;

const categories = [
  { value: "all", label: "All" },
  { value: "women", label: "Women's" },
  { value: "men", label: "Men's" },
  { value: "kids", label: "Kids" },
  { value: "streetwear", label: "Streetwear" },
];

export default function Shop() {
  const { t } = useTranslation("products");
  const [searchParams] = useSearchParams();
  const { filters, setCategory } = useFilters();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams, setCategory]);

  const { products, loading } = useProducts(filters);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Wrapper>
      {/* Hero */}
      <section className="relative bg-ink text-chalk py-20">
        <div className="absolute inset-0">
          <img
            src="/products/Gemini_Generated_Image_omcyhvomcyhvomcy.png"
            alt="Collections"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-ink/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="label-mono text-sand mb-2">{t("shopAll")}</p>
          <h1 className="heading-display text-4xl md:text-6xl">
            Our <span className="heading-display-italic text-sand">{t("ourCollections").split(" ").pop()}</span>
          </h1>
          <p className="text-chalk/60 mt-3 text-sm max-w-md">
            {t("collectionsSubtitle")}
          </p>
        </div>
      </section>

      <Ticker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`px-5 py-2 border text-sm font-mono tracking-wide transition-colors ${
                filters.category === cat.value
                  ? "bg-ink text-chalk border-ink"
                  : "border-stone text-ink hover:border-ink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products count */}
        <p className="label-mono text-mist mb-8">{products.length} {t("products")}</p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="heading-display text-2xl text-mist">{t("noProducts")}</p>
          </div>
        ) : (
          <ProductGrid products={paginated} columns={5} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                      className={
                        page === i + 1
                          ? "bg-ink text-chalk border-ink"
                          : "border-stone hover:border-ink"
                      }
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
