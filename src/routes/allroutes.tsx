import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home"));
const Shop = lazy(() => import("@/pages/Shop"));
const ProductPage = lazy(() => import("@/pages/Product"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Lookbook = lazy(() => import("@/pages/Lookbook"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const AdminLogin = lazy(() => import("@/pages/admin/Login"));
export const AdminLayout = lazy(() => import("@/pages/admin/Layout"));
export const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
export const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));
export const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
export const AdminProducts = lazy(() => import("@/pages/admin/Products"));
export const AdminAddProduct = lazy(() => import("@/pages/admin/AddProduct"));
export const AdminEditProduct = lazy(() => import("@/pages/admin/EditProduct"));
export const ProtectedAdmin = lazy(() => import("@/pages/admin/ProtectedAdmin"));

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  protected?: boolean;
}

export const routes: RouteConfig[] = [
  { path: "/", component: Home },
  { path: "/shop", component: Shop },
  { path: "/product/:id", component: ProductPage },
  { path: "/cart", component: Cart },
  { path: "/checkout", component: Checkout },
  { path: "/lookbook", component: Lookbook },
  { path: "/about", component: About },
  { path: "/contact", component: Contact },
  { path: "/wishlist", component: Wishlist },
  { path: "*", component: NotFound },
];
