import { auth } from "@/lib/firebase";

/** fetch() that sends the signed-in user's Firebase ID token to staff-only API routes. */
export async function authFetch(input: string, init: RequestInit = {}) {
  const token = await auth.currentUser?.getIdToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers, cache: "no-store" });
}
