import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Wrapper from "@/components/hoc/Wrapper";
import Ticker from "@/components/layout/Ticker";
import ProductGrid from "@/components/shared/ProductGrid";
import Newsletter from "@/components/shared/Newsletter";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { t } = useTranslation();
  const { products } = useProducts();
  const featured = products.slice(0, 4);

  return (
    <Wrapper>
      {/* Hero */}
      <section className="relative bg-ink text-chalk min-h-[85vh] flex items-end">
        <div className="absolute inset-0">
          <img
            src="/products/Gemini_Generated_Image_3q6hc63q6hc63q6h.png"
            alt="LAZULI Hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
          <p className="label-mono text-sand mb-4">—— {t("newSeason")}</p>
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl leading-none mb-2">
            {t("heroTitle")}
          </h1>
          <h1 className="heading-display-italic text-5xl md:text-7xl lg:text-8xl text-sand leading-none mb-2">
            {t("heroTitleAccent")}
          </h1>
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl leading-none mb-6">
            {t("heroTitleEnd")}
          </h1>
          <p className="text-chalk/70 max-w-md mb-8 text-sm">
            {t("heroSubtitle")}
          </p>
          <div className="flex gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-rust text-white hover:bg-rust/90 label-mono px-8 py-3 transition-colors"
            >
              {t("shopNow")}
            </Link>
            <Link
              to="/lookbook"
              className="inline-flex items-center justify-center border border-chalk text-chalk hover:bg-chalk/10 label-mono px-8 py-3 transition-colors"
            >
              {t("viewLookbook")}
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label-mono text-mist mb-2">NEW ARRIVALS</p>
            <h2 className="heading-display text-4xl md:text-5xl">
              Latest <span className="heading-display-italic">Pieces</span>
            </h2>
          </div>
          <Link to="/shop" className="label-mono text-ink hover:text-rust underline underline-offset-4 transition-colors">
            {t("viewAll")} →
          </Link>
        </div>
        <ProductGrid products={featured} columns={4} />
      </section>

      {/* Categories */}
      <section className="bg-warm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="label-mono text-mist mb-2">EXPLORE</p>
            <h2 className="heading-display text-4xl md:text-5xl">
              Shop by <span className="heading-display-italic">Category</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Women's", slug: "women", img: "/products/Gemini_Generated_Image_9ameg29ameg29ame.png" },
              { name: "Men's", slug: "men", img: "/products/Gemini_Generated_Image_440k5l440k5l440k.png" },
              { name: "Kids", slug: "kids", img: "/products/Gemini_Generated_Image_4xiapv4xiapv4xia.png" },
              { name: "Streetwear", slug: "streetwear", img: "/products/Gemini_Generated_Image_8yapny8yapny8yap.png" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/50 transition-colors" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-chalk heading-display text-2xl">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </Wrapper>
  );
}
