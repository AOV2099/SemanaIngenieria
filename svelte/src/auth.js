// auth.ts/js
import { adminToken } from "./store";
import { get } from "svelte/store";

export async function requireAdminOrRedirect(API_URL, navigate, toast) {
  const token = get(adminToken) || (document.cookie.match(/adminToken=([^;]+)/)?.[1] || "");
  if (token) adminToken.set(token);
  const res = await fetch(`${API_URL}/api/admin/ping`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    adminToken.set("");
    toast.error("Necesitas iniciar sesión de administrador");
    navigate("/login");
    return null;
  }
  return token;
}
