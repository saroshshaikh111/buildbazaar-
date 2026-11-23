// lib/apiClient.js — browser-side helper: call our API routes with the
// logged-in user's Supabase access token so the server can verify identity.
import { supabase } from '@/lib/supabaseClient';

export async function authedPost(path, body) {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = { 'Content-Type': 'application/json' };
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
    const res = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body) });
    let data = {};
    try { data = await res.json(); } catch { /* non-JSON response */ }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
}

export function updateOrderStatus(orderId, status) {
    return authedPost('/api/orders/status', { orderId, status });
}
