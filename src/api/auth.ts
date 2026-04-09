import { api } from "./httpClient";
import type { User, LoginCredentials, RegisterData } from "@/types/user";

export async function loginApi(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  const { data } = await api.post<{
    access: string;
    user?: { id: string; email: string; firstName: string; lastName: string };
  }>("/api/auth/login/", credentials);
  const token = data.access;
  localStorage.setItem("authToken", token);
  const user: User = data.user
    ? { id: data.user.id, firstName: data.user.firstName, lastName: data.user.lastName, email: data.user.email }
    : { id: "", firstName: "", lastName: "", email: credentials.email };
  return { user, token };
}

export async function registerApi(data: RegisterData): Promise<{ user: User; token: string }> {
  const body = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    phone: data.phone,
  };
  const { data: res } = await api.post<{
    user?: { id: string; email: string; firstName: string; lastName: string };
    access?: string;
  }>("/api/auth/register/", body);
  const token = res.access ?? "";
  localStorage.setItem("authToken", token);
  const user: User = {
    id: res.user?.id ?? "",
    firstName: res.user?.firstName ?? data.firstName,
    lastName: res.user?.lastName ?? data.lastName,
    email: res.user?.email ?? data.email,
    phone: data.phone,
  };
  return { user, token };
}

export async function logoutApi(): Promise<void> {
  try {
    await api.post("/api/auth/logout/");
  } finally {
    localStorage.removeItem("authToken");
  }
}

export async function refreshToken(): Promise<string> {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  return token;
}
