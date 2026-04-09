import axios, { type AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? (typeof window !== "undefined" ? window.location.origin : "");

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ error?: string }>) => {
    const msg =
      err.response?.data?.error ??
      err.message ??
      "Network error";
    return Promise.reject(new Error(msg));
  }
);
