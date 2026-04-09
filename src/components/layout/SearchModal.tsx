import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { setSearchModalOpen } from "@/redux/reducers/uiSlice";
import { useSearch } from "@/hooks/useSearch";
import type { RootState } from "@/redux/store";

export default function SearchModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((s: RootState) => s.ui.searchModalOpen);
  const { query, setQuery, results, loading } = useSearch();

  const close = () => {
    dispatch(setSearchModalOpen(false));
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
      <DialogContent className="sm:max-w-2xl p-0 bg-chalk border-stone gap-0">
        <div className="flex items-center border-b border-stone px-4">
          <Search className="w-5 h-5 text-mist shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="border-0 focus-visible:ring-0 text-lg py-6 bg-transparent"
            autoFocus
          />
        </div>
        {query && (
          <div className="max-h-96 overflow-y-auto p-4">
            {loading ? (
              <p className="text-mist text-center py-8">Searching...</p>
            ) : results.length === 0 ? (
              <p className="text-mist text-center py-8">No products found</p>
            ) : (
              <div className="space-y-3">
                {results.map((p) => (
                  <button
                    key={p.id}
                    className="flex items-center gap-4 w-full text-left hover:bg-warm p-2 rounded-sm transition-colors"
                    onClick={() => { close(); navigate(`/product/${p.id}`); }}
                  >
                    <img src={p.images[0]} alt={p.name} className="w-14 h-16 object-cover bg-stone" />
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-sm text-rust font-semibold">
                        {(p.salePrice ? p.price : p.price).toLocaleString()} DZD
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
