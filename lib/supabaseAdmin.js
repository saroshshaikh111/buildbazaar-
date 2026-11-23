// lib/supabaseAdmin.js
// SERVER-ONLY Supabase client. Uses the secret key, which bypasses Row Level
// Security. Import this ONLY from app/api/** route handlers — never from a
// 'use client' file, or the key would be shipped to browsers.
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!secretKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set — server DB writes will fail.');
}

export const supabaseAdmin = createClient(url, secretKey || 'missing', {
    auth: { persistSession: false, autoRefreshToken: false },
});

export function isAdminEmail(email) {
    const admin = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase();
    return !!admin && (email || '').toLowerCase() === admin;
}

// Returns the logged-in Supabase user for this request, or null.
// Clients send: Authorization: Bearer <session.access_token>
export async function getRequestUser(request) {
    const header = request.headers.get('authorization') || '';
    if (!header.toLowerCase().startsWith('bearer ')) return null;
    const token = header.slice(7).trim();
    if (!token) return null;
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
}
