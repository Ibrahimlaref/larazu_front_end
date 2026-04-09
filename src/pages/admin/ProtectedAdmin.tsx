import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdmin() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
