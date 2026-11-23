// Calls the BuildBazaar web API with the logged-in user's Supabase token,
// so the server can verify who is making the request.
import { supabase } from './supabase';

export const API_BASE = 'https://www.gobuildbazaar.com';

export async function authedPost(path: string, body: unknown) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  let data: any = {};
  try { data = await res.json(); } catch { /* non-JSON response */ }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export function updateOrderStatus(orderId: string, status: string) {
  return authedPost('/api/orders/status', { orderId, status });
}
