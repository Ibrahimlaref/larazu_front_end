import { useState } from "react";
import { createOrder } from "@/api/orders";
import { useCart } from "./useCart";
import type { Address, PaymentMethod, ShippingMethod } from "@/types/order";

export function useCheckout() {
  const { items, clear } = useCart();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    wilaya: "",
    city: "",
    postalCode: "",
    address: "",
    notes: "",
  });
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ccp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const order = await createOrder({ items, address, paymentMethod, shippingMethod });
      setOrderId(order.id);
      clear();
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    step, setStep,
    address, setAddress,
    shippingMethod, setShippingMethod,
    paymentMethod, setPaymentMethod,
    loading, error, orderId,
    placeOrder,
  };
}
