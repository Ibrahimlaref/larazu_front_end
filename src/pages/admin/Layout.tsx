import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, Package, ShoppingBag, PlusCircle, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3, exact: false },
  { label: "Orders", path: "/admin/orders", icon: Package, exact: false },
  { label: "Products", path: "/admin/products", icon: ShoppingBag, exact: true },
  { label: "Add Product", path: "/admin/products/add", icon: PlusCircle, exact: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen flex bg-stone/20">
      <aside className="w-56 bg-ink text-chalk flex flex-col">
        <div className="p-4 border-b border-chalk/20">
          <Link to="/admin" className="text-xl font-serif font-semibold">
            LAZULI Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                  active
                    ? "bg-chalk/15 text-chalk font-medium"
                    : "text-chalk/60 hover:bg-chalk/10 hover:text-chalk"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-chalk/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-sand hover:text-chalk transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
