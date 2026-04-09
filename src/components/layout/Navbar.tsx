import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Heart, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toggleCartDrawer, toggleSearchModal, toggleMobileMenu } from "@/redux/reducers/uiSlice";
import type { RootState } from "@/redux/store";

export default function Navbar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartCount = useSelector((s: RootState) => s.cart.count);
  const mobileMenuOpen = useSelector((s: RootState) => s.ui.mobileMenuOpen);

  const navLinks = [
    { to: "/shop", label: t("nav.shop") },
    { to: "/shop?category=men", label: t("nav.men") },
    { to: "/shop?category=women", label: t("nav.women") },
    { to: "/lookbook", label: t("nav.lookbook") },
    { to: "/about", label: t("nav.about") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-chalk/95 backdrop-blur-sm border-b border-stone">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl tracking-[0.3em] font-semibold font-serif text-ink">
            LAZULI
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="label-mono text-ink/80 hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(toggleSearchModal())}
              aria-label={t("search")}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" aria-label={t("wishlist")}>
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              onClick={() => dispatch(toggleCartDrawer())}
              className="bg-rust text-white hover:bg-rust/90 text-xs tracking-widest font-mono uppercase px-4"
            >
              {t("cart")} ({cartCount})
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone bg-chalk">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block label-mono text-ink/80 hover:text-ink py-2"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
