'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
    CheckCircle2, 
    FileText, 
    Download, 
    Truck, 
    Building2, 
    ChevronLeft,
    Clock,
    MapPin,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrder() {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .eq('id', params.id)
                .single();

            if (error) {
                console.error('Error fetching order:', error);
            } else {
                setOrder(data);
            }
            setLoading(false);
        }

        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '48px', height: '48px', border: '4px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>
                <CheckCircle2 style={{width: '80px', height: '80px', color: '#10b981', marginBottom: '1.5rem'}} />
                <h1 style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a'}}>Procurement Confirmed</h1>
                <p style={{color: '#64748b', marginBottom: '2rem'}}>Your order has been synchronized with our logistics network.</p>
                <Link href="/" style={{backgroundColor: '#f97316', color: '#fff', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 700, textDecoration: 'none'}}>Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '6rem', fontFamily: '"Outfit", sans-serif', color: '#0f172a'}}>
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: #fff; }
                }
            `}</style>
            <nav className="no-print" style={{backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', height: '80px', display: 'flex', alignItems: 'center', marginBottom: '2rem'}}>
                <div style={{maxWidth: '896px', margin: '0 auto', padding: '0 1rem', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Link href="/products" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none'}}>
                        <ChevronLeft style={{width: '16px', height: '16px'}} /> BROWSE MORE
                    </Link>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Building2 style={{width: '20px', height: '20px', color: '#f97316'}} />
                        <span style={{fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.4em'}}>Order Success</span>
                    </div>
                </div>
            </nav>

            <main style={{maxWidth: '896px', margin: '0 auto', padding: '0 1rem'}}>
                <div style={{backgroundColor: '#fff', borderRadius: '40px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #f1f5f9', overflow: 'hidden'}}>
                    
                    {/* Header Banner */}
                    <div style={{backgroundColor: '#0f172a', padding: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
                        <div style={{position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', backgroundColor: 'rgba(249, 115, 22, 0.1)', filter: 'blur(100px)', marginRight: '-128px', marginTop: '-128px'}}></div>
                        <CheckCircle2 style={{width: '64px', height: '64px', color: '#f97316', margin: '0 auto 1.5rem'}} />
                        <h1 style={{fontSize: '1.875rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem 0'}}>Procurement Initiated</h1>
                        <p style={{color: '#94a3b8', fontWeight: 900, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0}}>Order Ref: {order.id.slice(0,8).toUpperCase()}</p>
                    </div>

                    <div style={{padding: '3rem'}}>
                        
                        {/* Logistics Summary */}
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '2rem', paddingBottom: '3rem', borderBottom: '1px solid #f1f5f9', marginBottom: '3rem'}}>
                            <div style={{flex: 1, minWidth: '200px'}}>
                                <span style={{fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem'}}>Project Site</span>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                                    <MapPin style={{width: '16px', height: '16px', color: '#f97316', marginTop: '4px', flexShrink: 0}} />
                                    <p style={{fontSize: '0.875rem', fontWeight: 900, color: '#0f172a', margin: 0}}>{order.project_name || 'Standard Site'}</p>
                                </div>
                            </div>
                            <div style={{flex: 1, minWidth: '200px'}}>
                                <span style={{fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem'}}>Scheduled Arrival</span>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                                    <Clock style={{width: '16px', height: '16px', color: '#f97316', marginTop: '4px', flexShrink: 0}} />
                                    <div>
                                        <p style={{fontSize: '0.875rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem 0'}}>{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'TBD'}</p>
                                        <p style={{fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', margin: 0}}>{order.delivery_slot}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{flex: 1, minWidth: '200px'}}>
                                <span style={{fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem'}}>GST Registration</span>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                                    <FileText style={{width: '16px', height: '16px', color: '#f97316', marginTop: '4px', flexShrink: 0}} />
                                    <p style={{fontSize: '0.875rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', margin: 0}}>{order.gstin || 'B2C Transaction'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div style={{marginBottom: '3rem'}}>
                            <h2 style={{fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#94a3b8', margin: '0 0 1.5rem 0'}}>Manifest Breakdown</h2>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                {order.order_items?.map((item, idx) => (
                                    <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                            <div style={{width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', color: '#0f172a', border: '1px solid #e2e8f0'}}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p style={{fontSize: '0.875rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem 0'}}>{item.title}</p>
                                                <p style={{fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', margin: 0}}>Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p style={{fontWeight: 900, color: '#0f172a', margin: 0}}>₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Totals */}
                        <div style={{backgroundColor: '#f8fafc', borderRadius: '1.5rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                                <span>Total Taxable Value</span>
                                <span>₹{(order.total_amount / 1.18).toLocaleString()}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                                <span>GST (CGST + SGST)</span>
                                <span>₹{(order.total_amount - (order.total_amount / 1.18)).toLocaleString()}</span>
                            </div>
                            <div style={{paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem'}}>
                                <span style={{fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a'}}>Total Sourcing Cost</span>
                                <span style={{fontSize: '1.875rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#0f172a'}}>₹{order.total_amount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="no-print" style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', paddingTop: '3rem'}}>
                            <button onClick={() => window.print()} style={{flex: 1, minWidth: '250px', backgroundColor: '#0f172a', color: '#fff', padding: '1.25rem', borderRadius: '1rem', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', border: 'none', cursor: 'pointer'}}>
                                <Download style={{width: '16px', height: '16px'}} /> DOWNLOAD PROFORMA INVOICE
                            </button>
                            <Link href="/" style={{flex: 1, minWidth: '250px', backgroundColor: '#fff', color: '#0f172a', border: '2px solid #e2e8f0', padding: '1.25rem', outline: 'none', textDecoration: 'none', borderRadius: '1rem', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', boxSizing: 'border-box'}}>
                                SITE DASHBOARD <ArrowRight style={{width: '16px', height: '16px'}} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
