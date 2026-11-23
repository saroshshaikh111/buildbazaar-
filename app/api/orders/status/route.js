// POST /api/orders/status  { orderId, status }
// Header: Authorization: Bearer <session.access_token>
// Admin may set any status. A buyer may mark their own order Delivered or Disputed.
import { NextResponse } from 'next/server';
import { supabaseAdmin, getRequestUser } from '@/lib/supabaseAdmin';
import { loadOrder, canSetStatus, notifyStatusChange } from '@/lib/orderStatus';

export async function POST(request) {
    try {
        const user = await getRequestUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
        }

        const { orderId, status } = await request.json();
        const order = await loadOrder(orderId);
        if (!order) {
            return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
        }
        if (!canSetStatus(user, order, status)) {
            return NextResponse.json({ error: 'You are not allowed to make this change.' }, { status: 403 });
        }
        if (order.status === status) {
            return NextResponse.json({ success: true, status });
        }

        const { data: updated, error } = await supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', order.id)
            .select()
            .single();
        if (error) throw error;

        await notifyStatusChange(updated);
        return NextResponse.json({ success: true, status: updated.status });
    } catch (error) {
        console.error('Order status API error:', error);
        return NextResponse.json({ error: 'Could not update the order.' }, { status: 500 });
    }
}
