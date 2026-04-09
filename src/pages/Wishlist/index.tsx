import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Wrapper from "@/components/hoc/Wrapper";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import ProductGrid from "@/components/shared/ProductGrid";

import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />

        <h1 className="heading-display text-4xl md:text-5xl mt-4 mb-10">
          Your <span className="heading-display-italic text-sand">Wishlist</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 mx-auto text-mist mb-4" />
            <h2 className="heading-display text-2xl mb-2">Your wishlist is empty</h2>
            <p className="text-mist mb-6">Save your favorite pieces here</p>
            <Link to="/shop" className="inline-flex items-center justify-center bg-rust text-white hover:bg-rust/90 label-mono px-8 py-3">
              Browse Collection
            </Link>
          </div>
        ) : (
          <>
            <p className="label-mono text-mist mb-8">{items.length} ITEMS</p>
            <ProductGrid products={items} columns={4} />
          </>
        )}
      </div>
    </Wrapper>
  );
}
