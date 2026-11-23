import { NextResponse } from 'next/server';
import { supabaseAdmin, getRequestUser } from '@/lib/supabaseAdmin';
import { sendOrderPlaced } from '@/lib/emailService';

export async function POST(request) {
    try {
        const body = await request.json();
        const { cart, formData = {}, userId: bodyUserId } = body;

        if (!Array.isArray(cart) || cart.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 1. IDENTITY: Trust only a verified Supabase session token.
        //    Web (and mobile >= 1.0.3) send `Authorization: Bearer <access_token>`.
        //    LEGACY: mobile 1.0.2 (live in Play testing) sends no token, only body.userId.
        //    We accept that temporarily so testers' checkout keeps working.
        //    TODO: once 1.0.3+ is the only build in use, return 401 when no token.
        let userId = null;
        const hasAuthHeader = !!request.headers.get('authorization');
        if (hasAuthHeader) {
            const authUser = await getRequestUser(request);
            if (!authUser) {
                return NextResponse.json({ error: 'Your session has expired. Please log in again.' }, { status: 401 });
            }
            userId = authUser.id;
        } else if (bodyUserId) {
            console.warn('Checkout without auth token (legacy mobile client).');
            userId = bodyUserId;
        }

        // 2. SECURE VALIDATION: live prices AND titles come from the DB, never the client.
        const productIds = cart.map(item => item.id);
        const { data: liveProducts, error: prodError } = await supabaseAdmin
            .from('products')
            .select('id, title, "priceCurrent"')
            .in('id', productIds);

        if (prodError || !liveProducts) {
            return NextResponse.json({ error: 'Failed to validate catalog prices.' }, { status: 400 });
        }

        const productMap = {};
        liveProducts.forEach(p => { productMap[p.id] = p; });

        let secureTotal = 0;
        const finalOrderItems = [];

        for (const item of cart) {
            const product = productMap[item.id];
            if (!product) {
                return NextResponse.json({ error: `Product ${item.id} no longer exists.` }, { status: 400 });
            }

            const qty = Number(item.quantity);
            if (!Number.isInteger(qty) || qty <= 0 || qty > 100000) {
                return NextResponse.json({ error: `Invalid quantity for ${product.title}. Must be a positive whole number.` }, { status: 400 });
            }

            secureTotal += Number(product.priceCurrent) * qty;
            finalOrderItems.push({
                product_id: product.id,
                title: product.title,
                quantity: qty,
                price: product.priceCurrent,
            });
        }

        // 3. MONETIZATION ENGINE: The 3% Platform Fee Split
        const platformFee = Math.round(secureTotal * 0.03);
        const vendorPayout = secureTotal - platformFee;

        // 4. Create Order (server key: RLS blocks direct client inserts)
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: userId,
                customer_name: formData.customerName,
                buyer_email: formData.email || '',
                buyer_phone: formData.phone || '',
                shipping_address: formData.shippingAddress,
                pincode: formData.pincode,
                project_name: formData.projectName,
                gstin: formData.gstin,
                total_amount: secureTotal,
                platform_fee: platformFee,
                vendor_payout: vendorPayout,
                delivery_date: formData.deliveryDate || null,
                delivery_slot: formData.deliverySlot,
                payment_method: formData.paymentMethod,
                status: 'Processing',
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 5. Attach Order ID & Insert Items
        finalOrderItems.forEach(item => { item.order_id = order.id; });
        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(finalOrderItems);

        if (itemsError) {
            // Don't leave an order with no items behind
            await supabaseAdmin.from('orders').delete().eq('id', order.id);
            throw itemsError;
        }

        // 6. Fire automated email
        await sendOrderPlaced({
            id: order.id,
            customerName: order.customer_name,
            buyerEmail: order.buyer_email,
            projectName: order.project_name,
            deliveryDate: order.delivery_date,
            deliverySlot: order.delivery_slot,
            totalAmount: secureTotal,
            vendorPayout,
            items: finalOrderItems,
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Checkout Secure API Error:', error);
        return NextResponse.json({ error: 'Could not place the order. Please try again.' }, { status: 500 });
    }
}
