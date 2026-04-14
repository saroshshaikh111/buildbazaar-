import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PLATFORM_EMAIL = process.env.PLATFORM_EMAIL || 'noreply@gobuildbazaar.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gobuildbazaar.com';

// ============================================================
// HOOK 1: ORDER PLACED → Buyer gets invoice, Vendor gets alert
// ============================================================
async function sendOrderPlaced(order) {
    const itemsList = order.items.map(i =>
        `<tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:0.75rem;font-weight:600">${i.title}</td>
            <td style="padding:0.75rem;text-align:center">${i.quantity}</td>
            <td style="padding:0.75rem;text-align:right;font-weight:800">₹${Number(i.price * i.quantity).toLocaleString('en-IN')}</td>
        </tr>`
    ).join('');

    // Email to BUYER
    await resend.emails.send({
        from: PLATFORM_EMAIL,
        to: order.buyerEmail,
        subject: `Order Confirmed: #${order.id.slice(0, 8).toUpperCase()} — BuildBazaar`,
        html: `
        <div style="font-family:'Outfit',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
            <div style="background:#0f172a;padding:2rem;text-align:center">
                <h1 style="color:#f97316;margin:0;font-size:1.5rem">⚡ BuildBazaar</h1>
                <p style="color:#94a3b8;margin:0.5rem 0 0;font-size:0.85rem">ORDER CONFIRMED</p>
            </div>
            <div style="padding:2rem">
                <h2 style="color:#0f172a;font-size:1.25rem">Hi ${order.customerName},</h2>
                <p style="color:#64748b">Your procurement order has been confirmed. Reference: <strong>#${order.id.slice(0, 8).toUpperCase()}</strong></p>
                
                <table style="width:100%;border-collapse:collapse;margin:1.5rem 0;background:#f8fafc;border-radius:12px;overflow:hidden">
                    <thead>
                        <tr style="background:#0f172a;color:#fff">
                            <th style="padding:0.75rem;text-align:left;font-size:0.75rem">MATERIAL</th>
                            <th style="padding:0.75rem;text-align:center;font-size:0.75rem">QTY</th>
                            <th style="padding:0.75rem;text-align:right;font-size:0.75rem">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>${itemsList}</tbody>
                </table>
                
                <div style="background:#f8fafc;border-radius:12px;padding:1.25rem;text-align:right;border:1px solid #e2e8f0">
                    <span style="font-size:0.8rem;color:#64748b;display:block">TOTAL PAYABLE</span>
                    <span style="font-size:2rem;font-weight:900;color:#0f172a">₹${Number(order.totalAmount).toLocaleString('en-IN')}</span>
                </div>
                
                <div style="margin-top:1.5rem;padding:1.25rem;background:#fff7ed;border-radius:12px;border:1px solid #fed7aa">
                    <p style="margin:0;font-size:0.85rem;color:#9a3412"><strong>📋 Payment Instructions:</strong> Please transfer the total amount via NEFT/RTGS to BuildBazaar's escrow account. Materials will be dispatched within 48 hours of payment confirmation.</p>
                </div>
                
                <p style="color:#64748b;font-size:0.85rem;margin-top:1.5rem">
                    <strong>📍 Delivery Site:</strong> ${order.projectName || 'Standard Site'}<br/>
                    <strong>📅 Requested By:</strong> ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN') : 'Flexible'}<br/>
                    <strong>⏰ Slot:</strong> ${order.deliverySlot}
                </p>
            </div>
            <div style="background:#f8fafc;padding:1rem;text-align:center;border-top:1px solid #e2e8f0">
                <p style="margin:0;font-size:0.75rem;color:#94a3b8">BuildBazaar Industrial Marketplace • Questions? Reply to this email.</p>
            </div>
        </div>`
    });

    // Alert to VENDOR/ADMIN to dispatch
    await resend.emails.send({
        from: PLATFORM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🚨 NEW ORDER: #${order.id.slice(0, 8).toUpperCase()} — Action Required`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#0f172a;padding:2rem;border-radius:16px 16px 0 0;text-align:center">
                <h1 style="color:#f97316;margin:0">🚨 New Order Received</h1>
            </div>
            <div style="padding:2rem;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px">
                <p><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
                <p><strong>Buyer:</strong> ${order.customerName}</p>
                <p><strong>Site:</strong> ${order.projectName || 'Standard Site'}</p>
                <p><strong>Total Value:</strong> ₹${Number(order.totalAmount).toLocaleString('en-IN')}</p>
                <p><strong>Your Payout (97%):</strong> ₹${Number(order.vendorPayout || order.totalAmount * 0.97).toLocaleString('en-IN')}</p>
                <p><strong>Delivery By:</strong> ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN') : 'TBD'} — ${order.deliverySlot}</p>
                <div style="background:#f0fdf4;padding:1rem;border-radius:8px;border-left:4px solid #10b981;margin-top:1rem">
                    <strong>Action Required:</strong> Log in to your Vendor Hub and update the order status to "Dispatched" once materials leave your facility.
                </div>
            </div>
        </div>`
    });
}

// ============================================================
// HOOK 2: DISPATCHED → Buyer gets tracking notification
// ============================================================
async function sendOrderDispatched(order) {
    await resend.emails.send({
        from: PLATFORM_EMAIL,
        to: order.buyerEmail,
        subject: `Your Materials Are On The Way! 🚛 — #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
        <div style="font-family:'Outfit',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
            <div style="background:#0f172a;padding:2rem;text-align:center">
                <h1 style="color:#f97316;margin:0;font-size:1.5rem">🚛 Materials Dispatched</h1>
                <p style="color:#94a3b8;margin:0.5rem 0 0">Order #${order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div style="padding:2rem">
                <h2 style="color:#0f172a">Hi ${order.customerName},</h2>
                <p style="color:#64748b">Great news! Your materials are on the way to <strong>${order.projectName || 'your project site'}</strong>.</p>
                <div style="background:#ecfdf5;border-radius:12px;padding:1.25rem;border:1px solid #a7f3d0;margin:1.5rem 0">
                    <p style="margin:0;font-weight:700;color:#065f46">📍 On arrival, please CONFIRM DELIVERY in your BuildBazaar account to release payment to the supplier. This protects both parties.</p>
                </div>
                <p style="color:#64748b;font-size:0.85rem">If you face any issues with the delivery (short quantity, damaged goods), click "Report Issue" within 48 hours of arrival. Funds are held safely in Escrow until you confirm.</p>
            </div>
            <div style="background:#f8fafc;padding:1rem;text-align:center;border-top:1px solid #e2e8f0">
                <p style="margin:0;font-size:0.75rem;color:#94a3b8">BuildBazaar — Your Escrow protects every rupee.</p>
            </div>
        </div>`
    });
}

// ============================================================
// HOOK 3: DELIVERED → Vendor gets Escrow Release confirmation
// ============================================================
async function sendEscrowReleased(order) {
    await resend.emails.send({
        from: PLATFORM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `✅ ESCROW RELEASED: ₹${Number(order.vendorPayout || order.totalAmount * 0.97).toLocaleString('en-IN')} — Order #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#065f46;padding:2rem;border-radius:16px 16px 0 0;text-align:center">
                <h1 style="color:#fff;margin:0">✅ Escrow Released</h1>
                <p style="color:#a7f3d0;margin:0.5rem 0 0">Buyer has confirmed delivery</p>
            </div>
            <div style="padding:2rem;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px">
                <p><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
                <p><strong>Buyer:</strong> ${order.customerName}</p>
                <p style="font-size:1.5rem"><strong>💰 Your Net Payout: ₹${Number(order.vendorPayout || order.totalAmount * 0.97).toLocaleString('en-IN')}</strong></p>
                <p style="color:#64748b;font-size:0.85rem">Platform Commission (3%) already deducted. Please initiate transfer within 2 business days.</p>
                <div style="background:#f0fdf4;padding:1rem;border-radius:8px;border-left:4px solid #10b981;margin-top:1rem">
                    Congratulations on completing this order!
                </div>
            </div>
        </div>`
    });
}

// ============================================================
// MAIN HANDLER
// ============================================================
export async function POST(request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ warning: 'Email service not configured. Set RESEND_API_KEY in env.' }, { status: 200 });
        }

        const body = await request.json();
        const { type, order } = body;

        if (!type || !order) {
            return NextResponse.json({ error: 'Missing type or order data.' }, { status: 400 });
        }

        switch (type) {
            case 'ORDER_PLACED':
                await sendOrderPlaced(order);
                break;
            case 'ORDER_DISPATCHED':
                await sendOrderDispatched(order);
                break;
            case 'ESCROW_RELEASED':
                await sendEscrowReleased(order);
                break;
            default:
                return NextResponse.json({ error: 'Unknown notification type.' }, { status: 400 });
        }

        return NextResponse.json({ success: true, type });
    } catch (error) {
        console.error('Notify API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
