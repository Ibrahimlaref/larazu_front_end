import { api } from "./httpClient";
import type { Order, Address, PaymentMethod, ShippingMethod } from "@/types/order";
import type { CartItem } from "@/types/cart";

export async function createOrder(data: {
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
}): Promise<Order> {
  const body = {
    items: data.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      image: i.image,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
    })),
    address: data.address,
    paymentMethod: data.paymentMethod,
    shippingMethod: data.shippingMethod,
  };
  const { data: res } = await api.post<{
    id: string;
    items: unknown[];
    subtotal: string | number;
    shipping: string | number;
    tax: string | number;
    total: string | number;
    status: string;
    address: Address;
    payment_method?: string;
    paymentMethod?: string;
    shipping_method: string;
    shippingMethod?: string;
    created_at?: string;
    createdAt?: string;
    estimated_delivery?: string;
    estimatedDelivery?: string;
  }>("/api/orders/", body);
  return {
    id: String(res.id),
    items: res.items as Order["items"],
    subtotal: Number(res.subtotal),
    shipping: Number(res.shipping),
    tax: Number(res.tax),
    total: Number(res.total),
    status: res.status as Order["status"],
    address: res.address,
    paymentMethod: (res.payment_method ?? res.paymentMethod) as PaymentMethod,
    createdAt: res.created_at ?? res.createdAt ?? new Date().toISOString(),
    estimatedDelivery: res.estimated_delivery ?? res.estimatedDelivery ?? new Date().toISOString(),
  };
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  try {
    const { data } = await api.get<{
      id: string;
      items: unknown[];
      subtotal: string | number;
      shipping: string | number;
      tax: string | number;
      total: string | number;
      status: string;
      address: Address;
      payment_method?: string;
      paymentMethod?: string;
      shipping_method: string;
      shippingMethod?: string;
      created_at?: string;
      createdAt?: string;
      estimated_delivery?: string;
      estimatedDelivery?: string;
    }>(`/api/orders/${id}/`);
    return {
      id: String(data.id),
      items: data.items as Order["items"],
      subtotal: Number(data.subtotal),
      shipping: Number(data.shipping),
      tax: Number(data.tax),
      total: Number(data.total),
      status: data.status as Order["status"],
      address: data.address,
      paymentMethod: (data.payment_method ?? data.paymentMethod) as PaymentMethod,
      createdAt: data.created_at ?? data.createdAt ?? new Date().toISOString(),
      estimatedDelivery: data.estimated_delivery ?? data.estimatedDelivery ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function trackOrder(id: string): Promise<{ status: string }> {
  const order = await fetchOrderById(id);
  return { status: order?.status ?? "unknown" };
}
