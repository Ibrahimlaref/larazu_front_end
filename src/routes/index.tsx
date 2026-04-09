import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes, AdminLogin, AdminLayout, AdminDashboard, AdminAnalytics, AdminOrders, AdminProducts, AdminAddProduct, AdminEditProduct, ProtectedAdmin } from "./allroutes";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-chalk">
      <div className="text-center">
        <p className="text-2xl tracking-[0.3em] font-serif font-semibold text-ink mb-2">LAZULI</p>
        <p className="text-sm text-mist">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AdminAddProduct />} />
              <Route path="products/edit/:id" element={<AdminEditProduct />} />
            </Route>
          </Route>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
