export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  createdAt: string;
  estimatedDelivery: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wilaya: string;
  city: string;
  postalCode: string;
  address: string;
  notes?: string;
}

export type PaymentMethod = "ccp" | "baridimob" | "cash";

export type ShippingMethod = "standard" | "express" | "sameday";

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}
