// LEGACY endpoint — kept only for mobile 1.0.2, which calls it after the buyer
// taps "Confirm Delivery". New code uses POST /api/orders/status, which sends
// emails itself.
//
// Security: the client's `order` payload is IGNORED except for its id. Emails are
// built from the DB row, and only sent when the DB state matches the event, so
// this can no longer be used to send arbitrary emails from our domain.
import { NextResponse } from 'next/server';
import { getRequestUser, isAdminEmail } from '@/lib/supabaseAdmin';
import { loadOrder, notifyStatusChange } from '@/lib/orderStatus';

export async function POST(request) {
    try {
        const { type, order: clientOrder } = await request.json();
        const order = await loadOrder(clientOrder?.id);
        if (!order) {
            return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
        }

        if (type === 'ESCROW_RELEASED') {
            // Only meaningful if the order really is Delivered in the DB
            if (order.status !== 'Delivered') {
                return NextResponse.json({ error: 'Order is not delivered.' }, { status: 409 });
            }
        } else if (type === 'ORDER_DISPATCHED') {
            const user = await getRequestUser(request);
            if (!user || !isAdminEmail(user.email) || order.status !== 'Dispatched') {
                return NextResponse.json({ error: 'Not allowed.' }, { status: 403 });
            }
        } else {
            return NextResponse.json({ error: 'Unknown notification type.' }, { status: 400 });
        }

        await notifyStatusChange(order);
        return NextResponse.json({ success: true, type });
    } catch (error) {
        console.error('Notify API Error:', error);
        return NextResponse.json({ error: 'Notification failed.' }, { status: 500 });
    }
}
