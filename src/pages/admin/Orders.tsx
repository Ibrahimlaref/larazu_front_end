import { useEffect, useState, useCallback } from "react";
import {
  fetchAdminOrders,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  type OrdersFilterParams,
  type PaginatedOrders,
} from "@/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Copy, Filter, X } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const PAYMENT_OPTIONS = [
  { value: "ccp", label: "CCP" },
  { value: "baridimob", label: "Baridimob" },
  { value: "cash", label: "Cash" },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "total-asc", label: "Total ↑" },
  { value: "total-desc", label: "Total ↓" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-violet-100 text-violet-800",
  shipped: "bg-cyan-100 text-cyan-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

const PAYMENT_BADGE: Record<string, string> = {
  ccp: "bg-orange-100 text-orange-800",
  baridimob: "bg-blue-100 text-blue-800",
  cash: "bg-stone/50 text-ink",
};

const WILAYAS = [
  "01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi","05 - Batna",
  "06 - Béjaïa","07 - Biskra","08 - Béchar","09 - Blida","10 - Bouira",
  "11 - Tamanrasset","12 - Tébessa","13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou",
  "16 - Alger","17 - Djelfa","18 - Jijel","19 - Sétif","20 - Saïda",
  "21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma","25 - Constantine",
  "26 - Médéa","27 - Mostaganem","28 - M'Sila","29 - Mascara","30 - Ouargla",
  "31 - Oran","32 - El Bayadh","33 - Illizi","34 - Bordj Bou Arréridj","35 - Boumerdès",
  "36 - El Tarf","37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela",
  "41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla","45 - Naâma",
  "46 - Aïn Témouchent","47 - Ghardaïa","48 - Relizane","49 - El M'Ghair","50 - El Meniaa",
  "51 - Ouled Djellal","52 - Bordj Badji Mokhtar","53 - Béni Abbès","54 - Timimoun",
  "55 - Touggourt","56 - Djanet","57 - In Salah","58 - In Guezzam",
];

function formatDZD(amount: number): string {
  return amount.toLocaleString("en-DZ") + " DZD";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type OrderRecord = Record<string, unknown>;

export default function AdminOrders() {
  const [data, setData] = useState<PaginatedOrders>({
    results: [],
    count: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");

  // Filters
  const [filters, setFilters] = useState<OrdersFilterParams>({
    page: 1,
    pageSize: 20,
    sort: "newest",
  });
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: OrdersFilterParams = { ...filters };
      if (searchDebounced) params.search = searchDebounced;
      const result = await fetchAdminOrders(params);
      setData(result);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filters, searchDebounced]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Reset page to 1 when filters change (except page itself)
  const updateFilter = (key: keyof OrdersFilterParams, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      ...(key !== "page" ? { page: 1 } : {}),
    }));
    setSelected(new Set());
  };

  const clearFilters = () => {
    setFilters({ page: 1, pageSize: 20, sort: "newest" });
    setSearch("");
    setSearchDebounced("");
    setSelected(new Set());
  };

  const hasFilters =
    filters.status || filters.dateFrom || filters.dateTo || filters.paymentMethod || filters.wilaya || search;

  // Status change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order updated");
      // Optimistic update
      setData((prev) => ({
        ...prev,
        results: prev.results.map((o) =>
          String(o.id) === orderId ? { ...o, status: newStatus } : o
        ),
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selected.size === data.results.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.results.map((o) => String(o.id))));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selected.size === 0) return;
    try {
      await bulkUpdateOrderStatus(Array.from(selected), bulkStatus);
      toast.success(`${selected.size} orders updated`);
      setSelected(new Set());
      setBulkStatus("");
      loadOrders();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk update failed");
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied");
  };

  const getCustomer = (o: OrderRecord) => {
    const addr = o.address as Record<string, unknown> | undefined;
    if (!addr) return { name: "—", email: "—" };
    const name = [addr.firstName, addr.lastName].filter(Boolean).join(" ") || "—";
    const email = String(addr.email ?? "—");
    return { name, email };
  };

  const getWilaya = (o: OrderRecord) => {
    const addr = o.address as Record<string, unknown> | undefined;
    return String(addr?.wilaya ?? "—");
  };

  const getItemsCount = (o: OrderRecord) => {
    const items = o.items as unknown[];
    return Array.isArray(items) ? items.length : 0;
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-semibold text-ink mb-6">Orders</h1>

      {/* Filter Bar */}
      <div className="bg-white border border-stone rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-mist" />
          <span className="text-sm font-medium text-ink">Filters</span>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto text-xs text-mist hover:text-ink flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Input
            placeholder="Search ID, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
          <select
            value={filters.status ?? ""}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="border border-stone px-3 py-2 text-sm rounded-md"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filters.paymentMethod ?? ""}
            onChange={(e) => updateFilter("paymentMethod", e.target.value)}
            className="border border-stone px-3 py-2 text-sm rounded-md"
          >
            <option value="">All payments</option>
            {PAYMENT_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <select
            value={filters.wilaya ?? ""}
            onChange={(e) => updateFilter("wilaya", e.target.value)}
            className="border border-stone px-3 py-2 text-sm rounded-md"
          >
            <option value="">All wilayas</option>
            {WILAYAS.map((w) => (
              <option key={w} value={w.split(" - ")[1]}>{w}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="border border-stone px-3 py-2 text-sm rounded-md"
            placeholder="From"
          />
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="border border-stone px-3 py-2 text-sm rounded-md"
            placeholder="To"
          />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <select
            value={filters.sort ?? "newest"}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="border border-stone px-3 py-2 text-sm rounded-md"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-ink/5 rounded-lg">
          <span className="text-sm font-medium text-ink">
            {selected.size} order{selected.size !== 1 ? "s" : ""} selected
          </span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="border border-stone px-3 py-1.5 text-sm rounded-md"
          >
            <option value="">Change status to...</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <Button size="sm" onClick={handleBulkUpdate} disabled={!bulkStatus}>
            Apply
          </Button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-mist animate-pulse">Loading orders...</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-stone rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-stone/30">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={selected.size === data.results.length && data.results.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-3">Order ID</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Wilaya</th>
                <th className="text-left p-3">Items</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((o) => {
                const id = String(o.id);
                const customer = getCustomer(o);
                return (
                  <tr key={id} className={`border-t border-stone/50 hover:bg-warm/30 transition-colors ${selected.has(id) ? "bg-warm/40" : ""}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={() => {
                          const next = new Set(selected);
                          if (next.has(id)) next.delete(id);
                          else next.add(id);
                          setSelected(next);
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => copyId(id)}
                        className="font-mono text-xs text-ink hover:text-sand flex items-center gap-1 group"
                        title="Click to copy full ID"
                      >
                        {id.slice(0, 8)}...
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-ink">{customer.name}</p>
                        <p className="text-xs text-mist">{customer.email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-mist">{getWilaya(o)}</td>
                    <td className="p-3 text-center">{getItemsCount(o)}</td>
                    <td className="p-3 font-medium">{formatDZD(Number(o.total ?? 0))}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${PAYMENT_BADGE[String(o.payment_method)] ?? "bg-stone/50 text-ink"}`}>
                        {String(o.payment_method ?? "").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={String(o.status)}
                        onChange={(e) => handleStatusChange(id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${STATUS_COLORS[String(o.status)] ?? "bg-stone/50 text-ink"}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-mist text-xs whitespace-nowrap">
                      {o.created_at ? formatDate(String(o.created_at)) : "—"}
                    </td>
                  </tr>
                );
              })}
              {data.results.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-mist">
                    No orders found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-sm text-mist">
            {data.count} order{data.count !== 1 ? "s" : ""} total • Page {data.page} of {data.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => updateFilter("page", data.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
              let pageNum: number;
              if (data.totalPages <= 5) {
                pageNum = i + 1;
              } else if (data.page <= 3) {
                pageNum = i + 1;
              } else if (data.page >= data.totalPages - 2) {
                pageNum = data.totalPages - 4 + i;
              } else {
                pageNum = data.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => updateFilter("page", pageNum)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    pageNum === data.page
                      ? "bg-ink text-chalk"
                      : "text-mist hover:text-ink hover:bg-stone/30"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages}
              onClick={() => updateFilter("page", data.page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
