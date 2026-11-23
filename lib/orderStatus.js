// lib/orderStatus.js — SERVER-ONLY order status rules + notification side effects.
import { supabaseAdmin, isAdminEmail } from '@/lib/supabaseAdmin';
import { sendOrderDispatched, sendEscrowReleased } from '@/lib/emailService';

export const ALL_STATUSES = ['Processing', 'Dispatched', 'Delivered', 'Cancelled', 'Disputed'];
// What a buyer may do to their OWN order (mirrors the RLS policy on orders)
export const BUYER_STATUSES = ['Delivered', 'Disputed'];

// Load an order using the server key (bypasses RLS).
export async function loadOrder(orderId) {
    if (!orderId || typeof orderId !== 'string') return null;
    const { data, error } = await supabaseAdmin.from('orders').select('*').eq('id', orderId).single();
    if (error) return null;
    return data;
}

export function canSetStatus(user, order, status) {
    if (!user || !order || !ALL_STATUSES.includes(status)) return false;
    if (isAdminEmail(user.email)) return true;
    // Buyers act only after dispatch: Dispatched -> Delivered / Disputed (same rule as RLS).
    return order.user_id === user.id && order.status === 'Dispatched' && BUYER_STATUSES.includes(status);
}

function toEmailOrder(o) {
    return {
        id: o.id,
        customerName: o.customer_name,
        buyerEmail: o.buyer_email || '',
        projectName: o.project_name,
        deliveryDate: o.delivery_date,
        deliverySlot: o.delivery_slot,
        totalAmount: o.total_amount,
        vendorPayout: o.vendor_payout,
    };
}

// Email side effects for a status change. Data always comes from the DB row.
export async function notifyStatusChange(order) {
    try {
        if (order.status === 'Dispatched') await sendOrderDispatched(toEmailOrder(order));
        if (order.status === 'Delivered') await sendEscrowReleased(toEmailOrder(order));
    } catch (err) {
        console.error('Status notification failed:', err);
    }
}
