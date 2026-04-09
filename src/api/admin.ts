import axios, { type AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? (typeof window !== "undefined" ? window.location.origin : "");

function getAdminToken() {
  return localStorage.getItem("adminToken");
}

export const adminApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers["X-Admin-Token"] = token;
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ error?: string }>) => {
    const msg = err.response?.data?.error ?? err.message ?? "Network error";
    if (err.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(new Error(msg));
  }
);

export async function adminLogin(email: string, password: string): Promise<string> {
  const { data } = await adminApi.post<{ token: string }>("/api/admin/login/", { email, password });
  localStorage.setItem("adminToken", data.token);
  return data.token;
}

// ─── Orders ────────────────────────────────────────────────────────────────

export interface OrdersFilterParams {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  wilaya?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedOrders {
  results: Record<string, unknown>[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchAdminOrders(params?: OrdersFilterParams): Promise<PaginatedOrders> {
  const { data } = await adminApi.get<PaginatedOrders>("/api/admin/orders/", { params });
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data } = await adminApi.patch(`/api/admin/orders/${id}/`, { status });
  return data;
}

export async function bulkUpdateOrderStatus(ids: string[], status: string) {
  const { data } = await adminApi.patch("/api/admin/orders/bulk/", { ids, status });
  return data;
}

// ─── Products ──────────────────────────────────────────────────────────────

export interface ProductsFilterParams {
  status?: string;
  category?: string;
  badge?: string;
  search?: string;
  sort?: string;
  tags?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  results: Record<string, any>[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: {
    total: number;
    active: number;
    inactive: number;
    out_of_stock: number;
    low_stock: number;
    scheduled: number;
  };
}

export async function fetchAdminProducts(params?: ProductsFilterParams): Promise<PaginatedProducts> {
  const { data } = await adminApi.get<PaginatedProducts>("/api/admin/products/", { params });
  return data;
}

export type ImageItem = string | File;

export async function createProduct(payload: Record<string, unknown>, images?: ImageItem[]) {
  const hasFiles = images?.some((img) => img instanceof File);
  if (hasFiles && images) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (key === "images") continue;
      if (value === null || value === undefined) continue;
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
    const urlImages: string[] = [];
    for (const img of images) {
      if (img instanceof File) {
        formData.append("images", img);
      } else {
        urlImages.push(img);
      }
    }
    if (urlImages.length > 0) {
      formData.append("images", JSON.stringify(urlImages));
    }
    const { data } = await adminApi.post("/api/admin/products/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } else {
    const body = { ...payload };
    if (images) {
      body.images = images;
    }
    const { data } = await adminApi.post("/api/admin/products/", body);
    return data;
  }
}

export async function updateProduct(id: string, payload: Record<string, unknown>, images?: ImageItem[]) {
  const hasFiles = images?.some((img) => img instanceof File);
  if (hasFiles && images) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      if (key === "images") continue;
      if (value === null || value === undefined) continue;
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
    const urlImages: string[] = [];
    for (const img of images) {
      if (img instanceof File) {
        formData.append("images", img);
      } else {
        urlImages.push(img);
      }
    }
    if (urlImages.length > 0) {
      formData.append("images", JSON.stringify(urlImages));
    }
    const { data } = await adminApi.put(`/api/admin/products/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } else {
    const body = { ...payload };
    if (images) {
      body.images = images;
    }
    const { data } = await adminApi.put(`/api/admin/products/${id}/`, body);
    return data;
  }
}

export async function deleteProduct(id: string) {
  await adminApi.delete(`/api/admin/products/${id}/`);
}

export async function bulkProductsAction(ids: string[], action: string, value?: string) {
  const { data } = await adminApi.post("/api/admin/products/bulk/", { ids, action, value });
  return data;
}

// ─── Product Quick Actions ──────────────────────────────────────────────────

export async function toggleProductActive(id: string) {
  const { data } = await adminApi.patch(`/api/admin/products/${id}/toggle-active/`);
  return data;
}

export async function updateProductStock(id: string, payload: { stock_quantity?: number; variants?: any[]; note?: string }) {
  const { data } = await adminApi.patch(`/api/admin/products/${id}/update-stock/`, payload);
  return data;
}

export async function scheduleProduct(id: string, payload: { publish_at: string | null; unpublish_at: string | null }) {
  const { data } = await adminApi.patch(`/api/admin/products/${id}/schedule/`, payload);
  return data;
}

export async function updateProductPrice(id: string, payload: { price?: number; sale_price?: number | null }) {
  const { data } = await adminApi.patch(`/api/admin/products/${id}/update-price/`, payload);
  return data;
}

export interface ProductHistoryItem {
  id: number;
  action: string;
  old_value: any;
  new_value: any;
  note: string;
  created_at: string;
}

export async function fetchProductHistory(id: string): Promise<ProductHistoryItem[]> {
  const { data } = await adminApi.get<ProductHistoryItem[]>(`/api/admin/products/${id}/history/`);
  return data;
}

export interface ProductAlertsResponse {
  low_stock: any[];
  out_of_stock: any[];
  scheduled_today: any[];
  counts: {
    low_stock: number;
    out_of_stock: number;
    scheduled_today: number;
  };
}

export async function fetchProductAlerts(): Promise<ProductAlertsResponse> {
  const { data } = await adminApi.get<ProductAlertsResponse>("/api/admin/products/alerts/");
  return data;
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface RevenueAnalyticsResponse {
  period: "daily" | "monthly";
  data: RevenueDataPoint[];
  totals: {
    revenue: number;
    orders: number;
    avgOrderValue: number;
  };
}

export interface OrdersSummaryResponse {
  statusBreakdown: Record<string, number>;
  todayOrders: number;
  todayRevenue: number;
  weekOrders: number;
  weekRevenue: number;
}

export async function fetchRevenueAnalytics(period: "daily" | "monthly" = "daily"): Promise<RevenueAnalyticsResponse> {
  const { data } = await adminApi.get<RevenueAnalyticsResponse>("/api/admin/analytics/revenue/", {
    params: { period },
  });
  return data;
}

export async function fetchOrdersSummary(): Promise<OrdersSummaryResponse> {
  const { data } = await adminApi.get<OrdersSummaryResponse>("/api/admin/analytics/orders-summary/");
  return data;
}
