import { useTranslation } from "react-i18next";
import Wrapper from "@/components/hoc/Wrapper";
import OrderSummary from "@/components/shared/OrderSummary";
import WilayaSelect from "@/components/shared/WilayaSelect";
import PaymentMethodSelector from "@/components/shared/PaymentMethodSelector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCheckout } from "@/hooks/useCheckout";
import { SHIPPING_OPTIONS } from "@/api/mockData";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { t } = useTranslation("checkout");
  const {
    step,
    address,
    setAddress,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    loading,
    orderId,
    placeOrder,
  } = useCheckout();

  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shippingMethod)?.price || 0;

  const updateAddress = (field: string, value: string) => {
    setAddress({ ...address, [field]: value });
  };

  if (orderId) {
    return (
      <Wrapper>
        <div className="max-w-lg mx-auto text-center py-32 px-4">
          <CheckCircle2 className="w-16 h-16 text-rust mx-auto mb-6" />
          <h1 className="heading-display text-4xl mb-4">Order Placed!</h1>
          <p className="text-mist mb-2">Your order ID: <span className="font-mono font-bold text-ink">{orderId}</span></p>
          <p className="text-mist text-sm">You will receive a confirmation email shortly.</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo */}
        <p className="text-xl tracking-[0.3em] font-semibold font-serif text-ink mb-6">LAZULI</p>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-8 max-w-md">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
                  step >= s ? "bg-ink text-chalk" : "border-2 border-stone text-mist"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? "bg-ink" : "bg-stone"}`} />}
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div className="flex gap-4 mb-10 max-w-md">
          {["cart", "shipping", "payment"].map((label, i) => (
            <button
              key={label}
              className={`label-mono text-xs ${step === i + 1 ? "text-rust" : "text-mist"}`}
            >
              {t(`steps.${label}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="heading-display text-3xl">{t("shippingInfo")}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="label-mono text-[0.6rem] mb-2 block">{t("firstName")}</Label>
                <Input value={address.firstName} onChange={(e) => updateAddress("firstName", e.target.value)} placeholder="Mohammed" className="bg-white border-stone" />
              </div>
              <div>
                <Label className="label-mono text-[0.6rem] mb-2 block">{t("lastName")}</Label>
                <Input value={address.lastName} onChange={(e) => updateAddress("lastName", e.target.value)} placeholder="Amrani" className="bg-white border-stone" />
              </div>
            </div>

            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">{t("email")}</Label>
              <Input value={address.email} onChange={(e) => updateAddress("email", e.target.value)} placeholder="mohammed@email.com" className="bg-white border-stone" />
            </div>

            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">{t("phone")}</Label>
              <Input value={address.phone} onChange={(e) => updateAddress("phone", e.target.value)} placeholder="+213 XXX XXX XXX" className="bg-white border-stone" />
            </div>

            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">{t("wilaya")}</Label>
              <WilayaSelect value={address.wilaya} onChange={(v) => updateAddress("wilaya", v)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="label-mono text-[0.6rem] mb-2 block">{t("city")}</Label>
                <Input value={address.city} onChange={(e) => updateAddress("city", e.target.value)} placeholder="Algiers" className="bg-white border-stone" />
              </div>
              <div>
                <Label className="label-mono text-[0.6rem] mb-2 block">{t("postalCode")}</Label>
                <Input value={address.postalCode} onChange={(e) => updateAddress("postalCode", e.target.value)} placeholder="16000" className="bg-white border-stone" />
              </div>
            </div>

            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">{t("fullAddress")}</Label>
              <Input value={address.address} onChange={(e) => updateAddress("address", e.target.value)} placeholder="Street name, building, apartment" className="bg-white border-stone" />
            </div>

            <div>
              <Label className="label-mono text-[0.6rem] mb-2 block">{t("deliveryNotes")}</Label>
              <Textarea value={address.notes} onChange={(e) => updateAddress("notes", e.target.value)} placeholder={t("deliveryNotesPlaceholder")} className="bg-white border-stone" />
            </div>

            {/* Shipping Method */}
            <div>
              <h3 className="heading-display text-2xl mb-4">{t("shippingMethod")}</h3>
              <RadioGroup value={shippingMethod} onValueChange={(v) => setShippingMethod(v as "standard" | "express" | "sameday")}>
                {SHIPPING_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between p-4 border transition-colors cursor-pointer ${
                      shippingMethod === opt.id ? "border-ink" : "border-stone"
                    }`}
                    onClick={() => setShippingMethod(opt.id)}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={opt.id} id={`ship-${opt.id}`} />
                      <div>
                        <Label htmlFor={`ship-${opt.id}`} className="font-semibold text-sm cursor-pointer">{opt.name}</Label>
                        <p className="text-xs text-mist">{opt.description}</p>
                      </div>
                    </div>
                    <span className="font-semibold">{opt.price === 0 ? t("free") : `${opt.price.toLocaleString()} DZD`}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="heading-display text-2xl mb-4">{t("paymentMethod")}</h3>
              <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
              {paymentMethod === "ccp" && (
                <div className="mt-4 bg-warm p-4 text-sm text-mist">
                  {t("ccpInstructions")}
                </div>
              )}
            </div>

            {/* Place Order */}
            <Button
              onClick={placeOrder}
              disabled={loading}
              className="w-full bg-rust text-white hover:bg-rust/90 label-mono py-6 text-sm"
            >
              {loading ? "Processing..." : `${t("placeOrder")} →`}
            </Button>
          </div>

          {/* Sidebar */}
          <OrderSummary shippingCost={shippingCost} />
        </div>
      </div>
    </Wrapper>
  );
}
