import { api } from "./httpClient";

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean }> {
  const { data } = await api.post<{ ok: boolean }>("/api/newsletter/subscribe/", { email });
  return data;
}
