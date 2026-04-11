import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PLATFORM_EMAIL = 'BuildBazaar Orders <orders@gobuildbazaar.com>';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '';

export async function sendOrderPlaced(order) {
    if (!process.env.RESEND_API_KEY) return;

    const itemsList = order.items.map(i =>
        `<tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:0.75rem;font-weight:600">${i.title}</td>
            <td style="padding:0.75rem;text-align:center">${i.quantity}</td>
            <td style="padding:0.75rem;text-align:right;font-weight:800">₹${Number(i.price * i.quantity).toLocaleString('en-IN')}</td>
        </tr>`
    ).join('');

    const promises = [];

    // Email to BUYER (only if we have their email)
    if (order.buyerEmail) {
        promises.push(resend.emails.send({
            from: PLATFORM_EMAIL,
            to: order.buyerEmail,
            subject: `Order Confirmation - #${order.id.slice(0, 8).toUpperCase()}`,
            html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
                <div style="background:#0f172a;padding:2rem;text-align:center">
                    <h1 style="color:#f97316;margin:0;font-size:1.5rem">BuildBazaar</h1>
                    <p style="color:#94a3b8;margin:0.5rem 0 0;font-size:0.85rem">OFFICIAL INVOICE</p>
                </div>
                <div style="padding:2rem">
                    <h2 style="color:#0f172a">Hi ${order.customerName},</h2>
                    <p style="color:#64748b">Your procurement order has been confirmed. Reference: <strong>#${order.id.slice(0, 8).toUpperCase()}</strong></p>
                    <table style="width:100%;border-collapse:collapse;margin:1.5rem 0;background:#f8fafc;border-radius:12px;overflow:hidden">
                        <thead><tr style="background:#0f172a;color:#fff">
                            <th style="padding:0.75rem;text-align:left;font-size:0.75rem">MATERIAL</th>
                            <th style="padding:0.75rem;text-align:center;font-size:0.75rem">QTY</th>
                            <th style="padding:0.75rem;text-align:right;font-size:0.75rem">AMOUNT</th>
                        </tr></thead>
                        <tbody>${itemsList}</tbody>
                    </table>
                    <div style="background:#f8fafc;border-radius:12px;padding:1.25rem;text-align:right;border:1px solid #e2e8f0">
                        <span style="font-size:0.8rem;color:#64748b;display:block">TOTAL PAYABLE</span>
                        <span style="font-size:2rem;font-weight:900;color:#0f172a">₹${Number(order.totalAmount).toLocaleString('en-IN')}</span>
                    </div>
                    <div style="margin-top:1.5rem;padding:1.25rem;background:#fff7ed;border-radius:12px;border:1px solid #fed7aa">
                        <p style="margin:0;font-size:0.85rem;color:#9a3412"><strong>Payment:</strong> Transfer via NEFT/RTGS to BuildBazaar escrow. Materials dispatched within 48hrs of payment confirmation.</p>
                    </div>
                    <p style="color:#64748b;font-size:0.85rem;margin-top:1.5rem">
                        <strong>Site:</strong> ${order.projectName || 'Standard Site'}<br/>
                        <strong>Delivery By:</strong> ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN') : 'Flexible'}<br/>
                        <strong>Slot:</strong> ${order.deliverySlot}
                    </p>
                </div>
            </div>`
        }));
    }

    // Alert to ADMIN
    if (ADMIN_EMAIL) {
        promises.push(resend.emails.send({
            from: PLATFORM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `New Order Notification - #${order.id.slice(0, 8).toUpperCase()}`,
            html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <div style="background:#0f172a;padding:2rem;border-radius:16px 16px 0 0;text-align:center">
                    <h1 style="color:#f97316;margin:0">New Order Received</h1>
                </div>
                <div style="padding:2rem;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px">
                    <p><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
                    <p><strong>Buyer:</strong> ${order.customerName} (${order.buyerEmail || 'No email provided'})</p>
                    <p><strong>Site:</strong> ${order.projectName || 'Standard Site'}</p>
                    <p><strong>Total Value:</strong> ₹${Number(order.totalAmount).toLocaleString('en-IN')}</p>
                    <p><strong>Your Payout (97%):</strong> ₹${Number(order.vendorPayout).toLocaleString('en-IN')}</p>
                    <p><strong>Delivery By:</strong> ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN') : 'TBD'} — ${order.deliverySlot}</p>
                    <div style="background:#f0fdf4;padding:1rem;border-radius:8px;border-left:4px solid #10b981;margin-top:1rem">
                        <strong>Action:</strong> Log into Vendor Hub → update status to "Dispatched" once materials leave.
                    </div>
                </div>
            </div>`
        }));
    }

    const results = await Promise.allSettled(promises);
    results.forEach((result, idx) => {
        if (result.status === 'rejected') {
            console.error(`Email Error [${idx === 0 ? 'Buyer' : 'Admin'}]:`, result.reason);
        }
    });
}

export async function sendOrderDispatched(order) {
    if (!process.env.RESEND_API_KEY || !order.buyerEmail) return;
    await resend.emails.send({
        from: PLATFORM_EMAIL,
        to: order.buyerEmail,
        subject: `Shipment Update: Your items have been dispatched - #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
            <div style="background:#0f172a;padding:2rem;text-align:center">
                <h1 style="color:#f97316;margin:0">Materials Dispatched</h1>
            </div>
            <div style="padding:2rem">
                <p>Hi ${order.customerName}, your materials are heading to <strong>${order.projectName || 'your project site'}</strong>.</p>
                <div style="background:#ecfdf5;padding:1.25rem;border-radius:12px;border:1px solid #a7f3d0">
                    <strong>On arrival, CONFIRM DELIVERY in your BuildBazaar account to release payment. Funds are safely held in Escrow until you confirm.</strong>
                </div>
            </div>
        </div>`
    });
}

export async function sendEscrowReleased(order) {
    if (!process.env.RESEND_API_KEY || !ADMIN_EMAIL) return;
    await resend.emails.send({
        from: PLATFORM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Escrow Funds Released - #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#065f46;padding:2rem;border-radius:16px 16px 0 0;text-align:center">
                <h1 style="color:#fff;margin:0">Escrow Released</h1>
            </div>
            <div style="padding:2rem;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px">
                <p><strong>Order:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
                <p><strong>Buyer:</strong> ${order.customerName}</p>
                <p style="font-size:1.5rem"><strong>Net Payout: ₹${Number(order.vendorPayout).toLocaleString('en-IN')}</strong></p>
                <p style="color:#64748b;font-size:0.85rem">3% platform commission already deducted.</p>
            </div>
        </div>`
    });
}
