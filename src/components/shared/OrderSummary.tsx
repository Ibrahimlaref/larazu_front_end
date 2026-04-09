import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/useCart";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  shippingCost?: number;
}

export default function OrderSummary({ shippingCost = 0 }: OrderSummaryProps) {
  const { t } = useTranslation("checkout");
  const { total, items } = useCart();
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shippingCost + tax;

  return (
    <div className="bg-warm p-6 space-y-4 sticky top-20">
      <h3 className="label-mono text-sm">{t("orderSummary")}</h3>
      {items.length === 0 ? (
        <p className="text-mist text-sm py-4">Add items to your cart to see them here</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>{(item.price * item.quantity).toLocaleString()} DZD</span>
            </div>
          ))}
          <Separator className="bg-stone" />
        </>
      )}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{t("subtotal")}</span>
          <span>{total.toLocaleString()} DZD</span>
        </div>
        <div className="flex justify-between">
          <span>{t("shipping")}</span>
          <span>{shippingCost === 0 ? t("free") : `${shippingCost.toLocaleString()} DZD`}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (5%)</span>
          <span>{tax.toLocaleString()} DZD</span>
        </div>
      </div>
      <Separator className="bg-stone" />
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">{t("total")}</span>
        <span className="heading-display text-2xl">{grandTotal.toLocaleString()} DZD</span>
      </div>
      {total >= 5000 && (
        <div className="bg-warm border-l-4 border-rust p-3 text-sm">
          <p className="label-mono text-rust text-[0.6rem] mb-1">{t("freeShipping")}</p>
          <p className="text-mist">{t("freeShippingDesc")}</p>
        </div>
      )}
    </div>
  );
}
