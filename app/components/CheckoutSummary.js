'use client';

import { useCart } from '@/app/context/CartContext';
import { ShoppingBag, Calculator, ShieldCheck } from 'lucide-react';

export default function CheckoutSummary() {
    const { cart, totalPrice } = useCart();
    
    // Industrial Tax Breakdown (18% GST)
    const basePrice = totalPrice / 1.18;
    const totalGst = totalPrice - basePrice;
    const cgst = totalGst / 2;
    const sgst = totalGst / 2;

    return (
        <div style={{ backgroundColor: 'white', border: '2px solid #0f172a', borderRadius: '1.5rem', padding: '2rem', position: 'sticky', top: '6rem', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#0f172a' }}>
                <Calculator style={{ width: 24, height: 24, color: '#f97316' }} />
                Procurement Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {cart.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                            <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                                QTY: {item.quantity} {item.unit.split(' ')[0]}
                            </p>
                        </div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                            ₹{(item.priceCurrent * item.quantity).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem 0', borderTop: '1px dashed #e2e8f0', borderBottom: '1px dashed #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span>Taxable Value</span>
                    <span>₹{basePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span>CGST (9%)</span>
                    <span>₹{cgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span>SGST (9%)</span>
                    <span>₹{sgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div style={{ paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.02em' }}>Grand Total</span>
                    <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        ₹{totalPrice.toLocaleString()}
                    </span>
                </div>

                <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '0.75rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck style={{ width: 20, height: 20, color: '#059669', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.65rem', lineHeight: 1.2, color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                        Price includes building cess and site logistics overhead.
                    </p>
                </div>
            </div>
        </div>
    );
}
