import type { User } from "@/types/user";

export async function fetchProfile(): Promise<User> {
  return Promise.resolve({
    id: "1",
    firstName: "Mohammed",
    lastName: "Amrani",
    email: "mohammed@email.com",
    phone: "+213 555 123 456",
  });
}

export async function updateProfile(_data: Partial<User>): Promise<User> {
  return Promise.resolve({
    id: "1",
    firstName: "Mohammed",
    lastName: "Amrani",
    email: "mohammed@email.com",
    phone: "+213 555 123 456",
  });
}
