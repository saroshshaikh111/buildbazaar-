'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/context/AuthContext';
import { 
    Package, 
    ChevronLeft, 
    MapPin, 
    Clock, 
    Building2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth');
            return;
        }

        async function fetchOrders() {
            if (!user?.id) return;
            
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, order_items(*)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                } else {
                    setOrders(data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '48px', height: '48px', border: '4px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Outfit", sans-serif', color: '#0f172a', paddingBottom: '4rem'}}>
            <nav style={{backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', height: '80px', display: 'flex', alignItems: 'center', marginBottom: '2rem'}}>
                <div style={{maxWidth: '1024px', margin: '0 auto', padding: '0 1rem', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none'}}>
                        <ChevronLeft style={{width: '16px', height: '16px'}} /> BACK TO DASHBOARD
                    </Link>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Package style={{width: '20px', height: '20px', color: '#f97316'}} />
                        <span style={{fontWeight: 900, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3em'}}>My Procurement</span>
                    </div>
                </div>
            </nav>

            <main style={{maxWidth: '1024px', margin: '0 auto', padding: '0 1rem'}}>
                <div style={{marginBottom: '2rem'}}>
                    <h1 style={{fontSize: '2rem', fontWeight: 900, color: '#0f172a'}}>Returns & Orders</h1>
                    <p style={{color: '#64748b', fontSize: '1rem', marginTop: '0.5rem'}}>Track, return, or buy materials again for your project sites.</p>
                </div>

                {orders.length === 0 ? (
                    <div style={{backgroundColor: '#fff', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'}}>
                        <div style={{width: '64px', height: '64px', backgroundColor: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                            <Package style={{width: '32px', height: '32px', color: '#94a3b8'}} />
                        </div>
                        <h2 style={{fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem'}}>No typical orders yet</h2>
                        <p style={{color: '#64748b', marginBottom: '2rem'}}>Looks like you haven't placed any raw material orders.</p>
                        <Link href="/products" style={{backgroundColor: '#f97316', color: '#fff', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 800, textDecoration: 'none', display: 'inline-block'}}>
                            Start Sourcing
                        </Link>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {orders.map((order) => (
                            <div key={order.id} style={{backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'}}>
                                {/* Order Header */}
                                <div style={{backgroundColor: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between'}}>
                                    <div style={{display: 'flex', gap: '3rem'}}>
                                        <div>
                                            <span style={{display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem'}}>Order Placed</span>
                                            <span style={{fontSize: '0.875rem', fontWeight: 700, color: '#0f172a'}}>
                                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div>
                                            <span style={{display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem'}}>Total</span>
                                            <span style={{fontSize: '0.875rem', fontWeight: 900, color: '#0f172a'}}>₹{order.total_amount?.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div>
                                            <span style={{display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem'}}>Ship To</span>
                                            <span style={{fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Building2 style={{width:14, height:14, color:'#f97316'}}/> {order.project_name || 'Standard Site'}</span>
                                        </div>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <span style={{display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem'}}>Order ID</span>
                                        <span style={{fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace'}}>{order.id.split('-')[0].toUpperCase()}</span>
                                    </div>
                                </div>
                                
                                {/* Order Status & Items */}
                                <div style={{padding: '1.5rem'}}>
                                    <h3 style={{fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        <span style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: order.status === 'Processing' ? '#f59e0b' : '#10b981'}}></span>
                                        {order.status === 'Processing' ? 'Preparing for Dispatch' : order.status || 'Processing'}
                                    </h3>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                        {order.order_items?.map((item) => (
                                            <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', lastChild: {borderBottom: 'none'}}}>
                                                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                                    <div style={{width: '56px', height: '56px', backgroundColor: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                        <Package style={{width: '24px', height: '24px', color: '#94a3b8'}} />
                                                    </div>
                                                    <div>
                                                        <Link href={`/products/${item.product_id}`} style={{fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textDecoration: 'none', display: 'block'}}>{item.title}</Link>
                                                        <span style={{fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginTop: '0.25rem'}}>Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                                    <button style={{padding: '0.6rem 1rem', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', cursor: 'pointer'}}>Return Items</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div style={{backgroundColor: '#f8fafc', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end'}}>
                                    <Link href={`/order-success/${order.id}`} style={{color: '#f97316', fontSize: '0.85rem', fontWeight: 900, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                        View Full Proforma <ArrowRight style={{width: 16, height: 16}} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
