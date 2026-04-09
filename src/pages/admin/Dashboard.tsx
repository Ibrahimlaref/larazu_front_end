import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAdminOrders,
  fetchAdminProducts,
  fetchOrdersSummary,
  fetchProductAlerts,
  type OrdersSummaryResponse,
  type ProductAlertsResponse,
} from "@/api/admin";
import { Package, ShoppingBag, TrendingUp, BarChart3, ArrowRight, AlertTriangle } from "lucide-react";

function formatDZD(amount: number): string {
  return amount.toLocaleString("en-DZ") + " DZD";
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-violet-100 text-violet-800",
  shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [summary, setSummary] = useState<OrdersSummaryResponse | null>(null);
  const [alerts, setAlerts] = useState<ProductAlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAdminOrders({ page: 1, pageSize: 1 }),
      fetchAdminProducts({ page: 1, pageSize: 1 }),
      fetchOrdersSummary(),
      fetchProductAlerts()
    ])
      .then(([orders, products, sum, al]) => {
        setOrdersCount(typeof orders?.count === "number" ? orders.count : Array.isArray(orders) ? orders.length : 0);
        setProductsCount(typeof products?.count === "number" ? products.count : Array.isArray(products) ? products.length : 0);
        setSummary(sum);
        setAlerts(al);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-mist animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-semibold text-ink">Dashboard</h1>
        <Link
          to="/admin/analytics"
          className="flex items-center gap-2 text-sm text-mist hover:text-ink transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          View Analytics
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/admin/orders"
          className="p-5 bg-white border border-stone rounded-lg flex items-center gap-4 hover:border-ink/30 transition-colors"
        >
          <div className="p-2.5 rounded-lg bg-blue-50">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-ink">{ordersCount}</p>
            <p className="text-sm text-mist">Total Orders</p>
          </div>
        </Link>
        <Link
          to="/admin/products"
          className="p-5 bg-white border border-stone rounded-lg flex items-center gap-4 hover:border-ink/30 transition-colors"
        >
          <div className="p-2.5 rounded-lg bg-emerald-50">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-ink">{productsCount}</p>
            <p className="text-sm text-mist">Products</p>
          </div>
        </Link>
        <div className="p-5 bg-white border border-stone rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-amber-50">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-mist uppercase tracking-wider">Today</span>
          </div>
          <p className="text-xl font-semibold text-ink">{summary?.todayOrders ?? 0} orders</p>
          <p className="text-sm text-mist">{formatDZD(summary?.todayRevenue ?? 0)}</p>
        </div>
        <div className="p-5 bg-white border border-stone rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-violet-50">
              <BarChart3 className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-xs text-mist uppercase tracking-wider">This Week</span>
          </div>
          <p className="text-xl font-semibold text-ink">{summary?.weekOrders ?? 0} orders</p>
          <p className="text-sm text-mist">{formatDZD(summary?.weekRevenue ?? 0)}</p>
        </div>
      </div>

      {/* Overview & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Overview */}
        {summary && (
          <div className="bg-white border border-stone rounded-lg p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-ink mb-4">Order Status Overview</h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(summary.statusBreakdown).map(([status, count]) => (
                <div key={status} className="text-center p-4 rounded-lg bg-stone/20">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-2 ${STATUS_COLORS[status] ?? "bg-stone/50 text-ink"}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <p className="text-2xl font-semibold text-ink">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts Widget */}
        {alerts && (
          <div className="bg-white border border-stone rounded-lg p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-ink">Stock & Schedule Alerts</h2>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">
                  🔴 Out of stock ({alerts.counts.out_of_stock})
                </p>
                {alerts.counts.out_of_stock > 0 ? (
                  <p className="text-xs text-mist">
                    {alerts.out_of_stock.slice(0, 3).map((p: any) => p.name).join(", ")}
                    {alerts.counts.out_of_stock > 3 ? ` +${alerts.counts.out_of_stock - 3} more` : ""}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400">All products in stock</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">
                  🟡 Low stock ({alerts.counts.low_stock})
                </p>
                {alerts.counts.low_stock > 0 ? (
                  <p className="text-xs text-mist">
                    {alerts.low_stock.slice(0, 3).map((p: any) => p.name).join(", ")}
                    {alerts.counts.low_stock > 3 ? ` +${alerts.counts.low_stock - 3} more` : ""}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400">No low stock warnings</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  📅 Scheduled today ({alerts.counts.scheduled_today})
                </p>
                {alerts.counts.scheduled_today > 0 ? (
                  <p className="text-xs text-mist">
                    {alerts.scheduled_today.slice(0, 3).map((p: any) => p.name).join(", ")}
                  </p>
                ) : (
                  <p className="text-xs text-stone-400">Nothing scheduled today</p>
                )}
              </div>
            </div>

            <Link
              to="/admin/products?status=low_stock"
              className="mt-6 text-sm text-center font-medium text-ink hover:underline"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
