import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import Wrapper from "@/components/hoc/Wrapper";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { SHIPPING_OPTIONS } from "@/api/mockData";
import { useState } from "react";

export default function CartPage() {
  const { t } = useTranslation("checkout");
  const { items, total, removeFromCart, updateQuantity, clear } = useCart();
  const [shipping, setShipping] = useState("standard");
  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shipping)?.price || 0;
  const tax = Math.round(total * 0.05);

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

        <h1 className="heading-display text-4xl md:text-5xl mt-4 mb-2">
          Your <span className="heading-display-italic text-sand">Cart</span>
        </h1>
        <Separator className="bg-ink mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart items */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 mx-auto text-mist mb-4" />
                <h2 className="heading-display text-2xl mb-2">{t("cartEmpty")}</h2>
                <p className="text-mist mb-6">{t("cartEmptyDesc")}</p>
                <Link to="/shop" className="inline-flex items-center justify-center bg-rust text-white hover:bg-rust/90 label-mono px-8 py-3">
                  {t("startShopping")}
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-6 pb-6 border-b border-stone">
                    <img src={item.image} alt={item.name} className="w-24 h-32 object-cover bg-stone" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-xs text-mist mt-1">{item.color} / {item.size}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.productId, item.color, item.size)} className="text-mist hover:text-ink" aria-label="Remove">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-stone">
                          <button className="p-2 hover:bg-stone" onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)} aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                          <span className="px-4 font-mono text-sm">{item.quantity}</span>
                          <button className="p-2 hover:bg-stone" onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)} aria-label="Increase"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} DZD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-8">
              <Link to="/shop" className="inline-flex items-center justify-center border border-ink label-mono px-4 py-2 hover:bg-stone transition-colors">
                ← {t("continueShopping", { ns: "common" })}
              </Link>
              {items.length > 0 && (
                <button onClick={clear} className="text-sm text-mist underline hover:text-ink">
                  {t("clearCart", { ns: "common" })}
                </button>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-warm p-6 space-y-4 h-fit sticky top-20">
            <h3 className="heading-display text-2xl">{t("orderSummary")}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-semibold"><span>{t("subtotal")}</span><span>{total.toLocaleString()} DZD</span></div>
              <div className="flex justify-between"><span>{t("estimatedTax")}</span><span>{tax.toLocaleString()} DZD</span></div>
            </div>

            <div>
              <p className="label-mono text-mist text-[0.6rem] mb-3">{t("shipping")}</p>
              <RadioGroup value={shipping} onValueChange={setShipping} className="space-y-2">
                {SHIPPING_OPTIONS.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={opt.id} id={opt.id} />
                      <Label htmlFor={opt.id} className="text-sm cursor-pointer">{opt.name} ({opt.description})</Label>
                    </div>
                    <span className="text-sm font-semibold">{opt.price === 0 ? "Free" : `${opt.price.toLocaleString()} DZD`}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Promo */}
            <div className="flex gap-2">
              <Input placeholder={t("promoCode")} className="bg-white border-stone flex-1" />
              <Button className="bg-ink text-chalk label-mono">{t("apply")}</Button>
            </div>

            <Separator className="bg-stone" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{t("total")}</span>
              <span className="heading-display text-2xl">{(total + shippingCost + tax).toLocaleString()} DZD</span>
            </div>

            <Link to="/checkout" className="w-full inline-flex items-center justify-center bg-rust text-white hover:bg-rust/90 label-mono py-3">
              {t("proceedToCheckout")}
            </Link>

            <div className="flex justify-center gap-4 text-xs font-mono text-mist">
              <span>CCP</span><span>BARIDIMOB</span><span>CASH</span>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
