import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request) {
    try {
        const body = await request.json();
        const { cart, formData, userId } = body;

        if (!cart || cart.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 1. SECURE VALIDATION: Fetch live prices from DB to prevent Price Injection
        const productIds = cart.map(item => item.id);
        const { data: liveProducts, error: prodError } = await supabase
            .from('products')
            .select('id, "priceCurrent"')
            .in('id', productIds);

        if (prodError || !liveProducts) {
            return NextResponse.json({ error: 'Failed to validate catalog prices.' }, { status: 400 });
        }

        const priceMap = {};
        liveProducts.forEach(p => { priceMap[p.id] = p.priceCurrent; });

        let secureTotal = 0;
        const finalOrderItems = [];

        for (const item of cart) {
            const livePrice = priceMap[item.id];
            if (livePrice === undefined) {
                 return NextResponse.json({ error: `Product ${item.id} no longer exists.` }, { status: 400 });
            }
            secureTotal += livePrice * item.quantity;
            
            finalOrderItems.push({
                product_id: item.id,
                title: item.title,
                quantity: item.quantity,
                price: livePrice
            });
        }

        // 2. MONETIZATION ENGINE: The 3% Platform Fee Split
        const platformFee = Math.round(secureTotal * 0.03); 
        const vendorPayout = secureTotal - platformFee;

        // 3. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                customer_name: formData.customerName,
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
                status: 'Processing'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 4. Attach Order ID & Insert Items
        finalOrderItems.forEach(item => item.order_id = order.id);
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(finalOrderItems);

        if (itemsError) throw itemsError;

        // 5. Fire automated email notifications (non-blocking)
        fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'ORDER_PLACED',
                order: {
                    id: order.id,
                    customerName: formData.customerName,
                    buyerEmail: formData.email || '',
                    projectName: formData.projectName,
                    deliveryDate: formData.deliveryDate,
                    deliverySlot: formData.deliverySlot,
                    totalAmount: secureTotal,
                    vendorPayout: vendorPayout,
                    items: finalOrderItems
                }
            })
        }).catch(err => console.warn('Notify hook failed (non-critical):', err));

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Checkout Secure API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
