import { useEffect, useState, useCallback } from "react";
import {
  fetchRevenueAnalytics,
  fetchOrdersSummary,
  type RevenueAnalyticsResponse,
  type OrdersSummaryResponse,
} from "@/api/admin";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, ShoppingBag, DollarSign, Calendar } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  processing: "#8B5CF6",
  shipped: "#06B6D4",
  delivered: "#10B981",
  cancelled: "#EF4444",
};

function formatDZD(amount: number): string {
  return amount.toLocaleString("en-DZ") + " DZD";
}

export default function Analytics() {
  const [period, setPeriod] = useState<"daily" | "monthly">("daily");
  const [revenue, setRevenue] = useState<RevenueAnalyticsResponse | null>(null);
  const [summary, setSummary] = useState<OrdersSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rev, summ] = await Promise.all([
        fetchRevenueAnalytics(period),
        fetchOrdersSummary(),
      ]);
      setRevenue(rev);
      setSummary(summ);
    } catch {
      // Silently fail — toasts handled in API layer
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pieData = summary
    ? Object.entries(summary.statusBreakdown)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          color: STATUS_COLORS[status] || "#8c8680",
        }))
    : [];

  if (loading && !revenue) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-mist animate-pulse">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-semibold text-ink mb-8">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          label="Revenue (period)"
          value={formatDZD(revenue?.totals.revenue ?? 0)}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <KPICard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Orders (period)"
          value={String(revenue?.totals.orders ?? 0)}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KPICard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Order Value"
          value={formatDZD(revenue?.totals.avgOrderValue ?? 0)}
          color="text-violet-600"
          bgColor="bg-violet-50"
        />
        <KPICard
          icon={<Calendar className="w-5 h-5" />}
          label="Orders Today"
          value={String(summary?.todayOrders ?? 0)}
          sub={formatDZD(summary?.todayRevenue ?? 0)}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-stone rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">Revenue Overview</h2>
          <div className="flex gap-1 bg-stone/40 p-1 rounded-lg">
            <button
              onClick={() => setPeriod("daily")}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                period === "daily"
                  ? "bg-ink text-chalk shadow-sm"
                  : "text-mist hover:text-ink"
              }`}
            >
              Daily (30d)
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                period === "monthly"
                  ? "bg-ink text-chalk shadow-sm"
                  : "text-mist hover:text-ink"
              }`}
            >
              Monthly (12m)
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenue?.data ?? []}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f0e0d" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f0e0d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede8e2" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#8c8680" }}
                tickFormatter={(val: string) => {
                  if (period === "daily") {
                    const d = new Date(val);
                    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                  }
                  const d = new Date(val + "-01");
                  return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#8c8680" }}
                tickFormatter={(val: number) =>
                  val >= 1000 ? `${(val / 1000).toFixed(0)}K` : String(val)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f0e0d",
                  border: "none",
                  borderRadius: "8px",
                  color: "#f8f5f1",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "#c8b89a", fontWeight: 600 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: any, name: any) => {
                  const v = Number(value ?? 0);
                  if (name === "revenue") return [formatDZD(v), "Revenue"];
                  return [v, String(name ?? "")];
                }) as never}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0f0e0d"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Donut + Week Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie Chart */}
        <div className="bg-white border border-stone rounded-lg p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Order Status Breakdown</h2>
          {pieData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-sm text-ink">{value}</span>
                    )}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f0e0d",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f8f5f1",
                      fontSize: "13px",
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: any, name: any) => [`${Number(value ?? 0)} orders`, String(name ?? "")]) as never}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-mist text-sm mt-8 text-center">No order data available</p>
          )}
        </div>

        {/* Weekly Summary */}
        <div className="bg-white border border-stone rounded-lg p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">This Week</h2>
          <div className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-mist text-sm">Orders</span>
              <span className="text-2xl font-semibold text-ink">{summary?.weekOrders ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mist text-sm">Revenue</span>
              <span className="text-2xl font-semibold text-ink">
                {formatDZD(summary?.weekRevenue ?? 0)}
              </span>
            </div>
            <hr className="border-stone" />
            <div className="flex items-center justify-between">
              <span className="text-mist text-sm">Today's Orders</span>
              <span className="text-lg font-medium text-ink">{summary?.todayOrders ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mist text-sm">Today's Revenue</span>
              <span className="text-lg font-medium text-ink">
                {formatDZD(summary?.todayRevenue ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  sub,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white border border-stone rounded-lg p-5 hover:border-ink/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${bgColor} ${color}`}>{icon}</div>
        <span className="text-xs text-mist uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-ink">{value}</p>
      {sub && <p className="text-sm text-mist mt-1">{sub}</p>}
    </div>
  );
}
