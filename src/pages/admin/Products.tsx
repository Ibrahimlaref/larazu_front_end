import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  fetchAdminProducts, 
  deleteProduct, 
  bulkProductsAction,
  toggleProductActive,
  updateProductStock,
  scheduleProduct,
  updateProductPrice,
  fetchProductHistory,
  type ProductsFilterParams,
  type PaginatedProducts,
  type ProductHistoryItem
} from "@/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Search, Plus, MoreVertical, Edit2, Trash2,
  Clock, DollarSign, Package, Activity, AlertTriangle, Eye, EyeOff
} from "lucide-react";

const CATEGORIES = ["women", "men", "accessories", "shoes", "beauty"];
const STATUS_COLORS: Record<string, string> = {
  in_stock: "bg-emerald-100 text-emerald-800 border-emerald-200",
  low_stock: "bg-amber-100 text-amber-800 border-amber-200",
  out_of_stock: "bg-red-100 text-red-800 border-red-200",
  inactive: "bg-stone-100 text-stone-600 border-stone-200",
};

export default function AdminProducts() {
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductsFilterParams>({
    status: "all",
    category: "all",
    search: "",
    sort: "newest",
    page: 1,
    pageSize: 20
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals state
  const [stockModal, setStockModal] = useState<{ isOpen: boolean; product: any | null }>({ isOpen: false, product: null });
  const [priceModal, setPriceModal] = useState<{ isOpen: boolean; product: any | null }>({ isOpen: false, product: null });
  const [scheduleModal, setScheduleModal] = useState<{ isOpen: boolean; product: any | null }>({ isOpen: false, product: null });
  const [historySheet, setHistorySheet] = useState<{ isOpen: boolean; product: any | null; history: ProductHistoryItem[] }>({ isOpen: false, product: null, history: [] });

  const load = () => {
    setLoading(true);
    const apiFilters = { ...filters };
    if (apiFilters.status === "all") delete apiFilters.status;
    if (apiFilters.category === "all") delete apiFilters.category;
    
    fetchAdminProducts(apiFilters)
      .then(setData)
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delay = setTimeout(() => load(), 300);
    return () => clearTimeout(delay);
  }, [filters]);

  const toggleAll = (checked: boolean) => {
    if (!data) return;
    setSelectedIds(checked ? data.results.map((p) => String(p.id)) : []);
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedIds.length) return;
    if (action === "delete" && !confirm(`Delete ${selectedIds.length} products?`)) return;
    
    try {
      await bulkProductsAction(selectedIds, action);
      toast.success(`Bulk action "${action}" completed`);
      setSelectedIds([]);
      load();
    } catch (err: any) {
      toast.error(err.message || "Bulk action failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    // Optimistic
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        results: prev.results.map(p => p.id === id ? { ...p, is_active: !current } : p)
      };
    });
    try {
      await toggleProductActive(id);
      toast.success(current ? "Product deactivated" : "Product activated");
    } catch (err) {
      toast.error("Status update failed");
      load(); // Revert
    }
  };

  const openHistory = async (product: any) => {
    setHistorySheet({ isOpen: true, product, history: [] });
    try {
      const history = await fetchProductHistory(String(product.id));
      setHistorySheet({ isOpen: true, product, history });
    } catch (err) {
      toast.error("Failed to load history");
    }
  };

  const handleFilterChange = (key: keyof ProductsFilterParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-ink mb-1">Products</h1>
          <p className="text-sm text-mist">Manage your catalog, stock, and pricing.</p>
        </div>
        <Link to="/admin/products/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white border border-stone rounded-lg mb-6 shadow-sm overflow-hidden">
        <div className="border-b border-stone px-4 py-3 bg-stone/20 overflow-x-auto">
          <Tabs 
            value={filters.status || "all"} 
            onValueChange={(v) => handleFilterChange("status", v)}
            className="w-full"
          >
            <TabsList className="bg-transparent h-8 space-x-2 p-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-white rounded-md px-3">
                All Products <span className="ml-2 text-xs text-mist">{data?.summary?.total ?? 0}</span>
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-white rounded-md px-3">
                Active <span className="ml-2 text-xs text-emerald-600">{data?.summary?.active ?? 0}</span>
              </TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-white rounded-md px-3">
                Drafts <span className="ml-2 text-xs text-stone-500">{data?.summary?.inactive ?? 0}</span>
              </TabsTrigger>
              <TabsTrigger value="low_stock" className="data-[state=active]:bg-white rounded-md px-3">
                Low Stock <span className="ml-2 text-xs text-amber-600">{data?.summary?.low_stock ?? 0}</span>
              </TabsTrigger>
              <TabsTrigger value="out_of_stock" className="data-[state=active]:bg-white rounded-md px-3">
                Out of Stock <span className="ml-2 text-xs text-red-600">{data?.summary?.out_of_stock ?? 0}</span>
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="data-[state=active]:bg-white rounded-md px-3">
                Scheduled <span className="ml-2 text-xs text-blue-600">{data?.summary?.scheduled ?? 0}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
            <Input 
              placeholder="Search products by name, SKU, ref..." 
              className="pl-9"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            />
          </div>
          
          <Select value={filters.category} onValueChange={(v) => handleFilterChange("category", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          
          <Select value={filters.sort} onValueChange={(v) => handleFilterChange("sort", v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
            </SelectContent>
          </Select>
          
          {(filters.search || filters.category !== "all" || filters.sort !== "newest") && (
            <Button variant="ghost" className="text-sm text-mist" onClick={() => setFilters({ status: "all", category: "all", search: "", sort: "newest", page: 1, pageSize: 20 })}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-ink text-white rounded-lg p-3 mb-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 shadow-lg sticky top-4 z-40">
          <span className="text-sm font-medium ml-2">{selectedIds.length} products selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction("activate")}>Set Active</Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction("deactivate")}>Set Draft</Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>Delete</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-stone rounded-lg shadow-sm overflow-x-auto relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <p className="animate-pulse font-medium text-ink">Loading...</p>
          </div>
        )}
        <table className="w-full text-sm">
          <thead className="bg-stone/20 text-mist">
            <tr>
              <th className="p-4 text-left font-medium w-12">
                <Checkbox 
                  checked={data?.results?.length ? selectedIds.length === data.results.length : false}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="p-4 text-left font-medium">Product</th>
              <th className="p-4 text-left font-medium">Status / Stock</th>
              <th className="p-4 text-left font-medium">Price</th>
              <th className="p-4 text-left font-medium">Active</th>
              <th className="p-4 text-right font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {!data?.results?.length && !loading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-mist">No products found matching filters.</td>
              </tr>
            )}
            {data?.results?.map((p) => {
              const image = Array.isArray(p.images) && p.images[0] ? String(p.images[0]) : "/placeholder.png";
              const isChecked = selectedIds.includes(String(p.id));
              const stockStatus = String(p.stock_status || "in_stock");
              const isScheduled = !!p.publish_at && new Date(String(p.publish_at)) > new Date();
              
              return (
                <tr key={String(p.id)} className={`hover:bg-stone/5 transition-colors group ${isChecked ? 'bg-sky-50/50' : ''}`}>
                  <td className="p-4">
                    <Checkbox checked={isChecked} onCheckedChange={(c) => toggleRow(String(p.id), !!c)} />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-stone overflow-hidden border border-stone shrink-0">
                        <img src={image} alt={String(p.name)} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/admin/products/edit/${p.id}`} className="font-medium text-ink hover:underline line-clamp-1">
                          {String(p.name)}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-mist">
                          {p.sku && <span>SKU: {String(p.sku)}</span>}
                          {p.category && <span className="bg-stone/30 px-1.5 py-0.5 rounded capitalize">{String(p.category)}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[stockStatus] || STATUS_COLORS.inactive}`}>
                        {stockStatus.replace('_', ' ').toUpperCase()}
                      </span>
                      {p.track_stock && (
                        <span className="text-xs text-mist flex items-center gap-1">
                          <Package className="w-3 h-3"/> {Number(p.stock_quantity ?? 0)} in stock
                        </span>
                      )}
                      {isScheduled && (
                        <span className="text-xs text-blue-600 flex items-center gap-1" title={`Publishes at ${new Date(String(p.publish_at)).toLocaleString()}`}>
                          <Clock className="w-3 h-3"/> Scheduled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-ink">{Number(p.price ?? 0).toLocaleString()} DZD</p>
                    {p.sale_price && (
                      <p className="text-xs text-red-600 line-through">{Number(p.sale_price).toLocaleString()} DZD</p>
                    )}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleActive(String(p.id), !!p.is_active)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${p.is_active ? 'bg-emerald-500' : 'bg-stone-300'}`}
                    >
                      <span className="sr-only">Toggle active</span>
                      <span className={`pointer-events-none absolute left-0.5 inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.is_active ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/products/edit/${p.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-mist hover:text-ink"><Edit2 className="w-4 h-4" /></Button>
                      </Link>
                      
                      <div className="relative group/menu">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-mist"><MoreVertical className="w-4 h-4" /></Button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone rounded-lg shadow-lg z-50 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                          <div className="p-1 flex flex-col">
                            <button onClick={() => setStockModal({ isOpen: true, product: p })} className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-stone/20 rounded-md text-ink">
                              <Package className="w-4 h-4 text-mist" /> Update Stock
                            </button>
                            <button onClick={() => setPriceModal({ isOpen: true, product: p })} className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-stone/20 rounded-md text-ink">
                              <DollarSign className="w-4 h-4 text-mist" /> Update Price
                            </button>
                            <button onClick={() => setScheduleModal({ isOpen: true, product: p })} className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-stone/20 rounded-md text-ink">
                              <Clock className="w-4 h-4 text-mist" /> Schedule
                            </button>
                            <button onClick={() => openHistory(p)} className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-stone/20 rounded-md text-ink">
                              <Activity className="w-4 h-4 text-mist" /> View History
                            </button>
                            <div className="h-px bg-stone my-1" />
                            <button onClick={() => handleToggleActive(String(p.id), !!p.is_active)} className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-stone/20 rounded-md text-ink">
                              {p.is_active ? <EyeOff className="w-4 h-4 text-mist" /> : <Eye className="w-4 h-4 text-mist" />}
                              {p.is_active ? "Set as Draft" : "Set Active"}
                            </button>
                            <button onClick={() => handleDelete(String(p.id), String(p.name))} className="flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-red-50 rounded-md text-red-600">
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Pagination Details */}
        {data && data.totalPages > 1 && (
          <div className="border-t border-stone p-4 flex items-center justify-between text-sm">
            <span className="text-mist">Showing {data.results.length} of {data.count} products</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" size="sm" 
                disabled={filters.page === 1}
                onClick={() => handleFilterChange("page", (filters.page || 1) - 1)}
              >
                Previous
              </Button>
              <span className="font-medium px-2">Page {data.page} of {data.totalPages}</span>
              <Button 
                variant="outline" size="sm" 
                disabled={filters.page === data.totalPages}
                onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* Stock Modal */}
      <Dialog open={stockModal.isOpen} onOpenChange={(v) => setStockModal(prev => ({ ...prev, isOpen: v }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
            <DialogDescription>
              Adjust stock for <strong>{stockModal.product?.name}</strong>. Note that variants track their own stock.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 py-4" onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            try {
              await updateProductStock(String(stockModal.product?.id), {
                stock_quantity: Number(form.get("stock")),
                note: String(form.get("note") || "")
              });
              toast.success("Stock updated");
              setStockModal({ isOpen: false, product: null });
              load();
            } catch (err) {
              toast.error("Failed to update stock");
            }
          }}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Flat Stock Quantity</label>
              <Input autoFocus type="number" name="stock" defaultValue={stockModal.product?.stock_quantity ?? 0} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason / Note <span className="text-mist font-normal">(Optional)</span></label>
              <Input name="note" placeholder="e.g. Manual inventory count" />
            </div>
            {stockModal.product?.variants?.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                This product has variants. Flat stock quantity will be ignored in favor of variant stock. Edit the product to manage variant stock directly.
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStockModal({ isOpen: false, product: null })}>Cancel</Button>
              <Button type="submit">Save Stock</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Price Modal */}
      <Dialog open={priceModal.isOpen} onOpenChange={(v) => setPriceModal(prev => ({ ...prev, isOpen: v }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Pricing</DialogTitle>
            <DialogDescription>
              Adjust pricing for <strong>{priceModal.product?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 py-4" onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const sale = form.get("sale_price");
            try {
              await updateProductPrice(String(priceModal.product?.id), {
                price: Number(form.get("price")),
                sale_price: sale ? Number(sale) : null
              });
              toast.success("Price updated");
              setPriceModal({ isOpen: false, product: null });
              load();
            } catch (err) {
              toast.error("Failed to update price");
            }
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Regular Price (DZD)</label>
                <Input autoFocus type="number" name="price" defaultValue={priceModal.product?.price ?? 0} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sale Price (DZD)</label>
                <Input type="number" name="sale_price" defaultValue={priceModal.product?.sale_price ?? ""} placeholder="Optional" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPriceModal({ isOpen: false, product: null })}>Cancel</Button>
              <Button type="submit">Save Pricing</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={scheduleModal.isOpen} onOpenChange={(v) => setScheduleModal(prev => ({ ...prev, isOpen: v }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publishing Schedule</DialogTitle>
            <DialogDescription>
              Set automated visibility dates for <strong>{scheduleModal.product?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 py-4" onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const pub = form.get("publish_at");
            const unpub = form.get("unpublish_at");
            try {
              await scheduleProduct(String(scheduleModal.product?.id), {
                publish_at: pub ? new Date(String(pub)).toISOString() : null,
                unpublish_at: unpub ? new Date(String(unpub)).toISOString() : null
              });
              toast.success("Schedule updated");
              setScheduleModal({ isOpen: false, product: null });
              load();
            } catch (err) {
              toast.error("Failed to update schedule");
            }
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Publish Date Time</label>
                <Input 
                   type="datetime-local" 
                   name="publish_at" 
                   defaultValue={scheduleModal.product?.publish_at ? new Date(scheduleModal.product.publish_at).toISOString().slice(0, 16) : ""} 
                />
                <p className="text-xs text-mist">When left blank, product behavior depends on Active toggle.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Unpublish Date Time</label>
                <Input 
                   type="datetime-local" 
                   name="unpublish_at" 
                   defaultValue={scheduleModal.product?.unpublish_at ? new Date(scheduleModal.product.unpublish_at).toISOString().slice(0, 16) : ""} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setScheduleModal({ isOpen: false, product: null })}>Cancel</Button>
              <Button type="submit">Save Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Sheet */}
      <Sheet open={historySheet.isOpen} onOpenChange={(v) => setHistorySheet(prev => ({ ...prev, isOpen: v }))}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader className="mb-6">
            <SheetTitle>Product History Trail</SheetTitle>
            <SheetDescription>
              Audit log for <strong>{historySheet.product?.name}</strong>.
            </SheetDescription>
          </SheetHeader>
          <div className="border-l-2 border-stone ml-3 space-y-6">
            {historySheet.history.length === 0 ? (
              <p className="pl-4 text-sm text-mist">No recent history logs found.</p>
            ) : (
              historySheet.history.map((h) => (
                <div key={h.id} className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-white border-2 border-ink rounded-full -left-[7px] top-1" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-ink capitalize">{String(h.action).replace('_', ' ')}</span>
                    <span className="text-xs text-mist">{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                  {h.note && <p className="text-sm text-stone-600 my-1 font-medium">"{h.note}"</p>}
                  
                  {h.action === "price_changed" && (
                    <div className="text-xs space-y-1 bg-stone/20 p-2 rounded mt-2">
                       <p><span className="text-mist">Price:</span> <span className="line-through text-stone-400">{h.old_value?.price || '-'}</span> → <span className="font-medium text-ink">{h.new_value?.price || '-'}</span> DZD</p>
                       <p><span className="text-mist">Sale:</span> <span className="line-through text-stone-400">{h.old_value?.sale_price || '-'}</span> → <span className="font-medium text-ink">{h.new_value?.sale_price || '-'}</span></p>
                    </div>
                  )}

                  {h.action === "stock_updated" && (
                    <div className="text-xs flex gap-3 text-ink bg-amber-50 border border-amber-100 p-2 rounded mt-2">
                       <span>Old stock: <del className="text-mist">{h.old_value?.stock}</del></span>
                       <span className="font-medium text-amber-900 border-l border-amber-200 pl-3">New stock: {h.new_value?.stock}</span>
                    </div>
                  )}

                  {h.action === "status_changed" && (
                     <div className="text-xs mt-1">
                       <span className={`px-2 py-0.5 rounded text-white ${h.new_value?.is_active ? 'bg-emerald-500' : 'bg-stone-500'}`}>
                         {h.new_value?.is_active ? 'Active' : 'Draft'}
                       </span>
                     </div>
                  )}
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

    </div>
  );
}
