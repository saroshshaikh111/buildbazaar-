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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
                <h1 className="text-2xl font-black mb-4">Procurement Confirmed</h1>
                <p className="text-slate-500 mb-8">Your order has been synchronized with our logistics network.</p>
                <Link href="/" className="btn-primary px-8 py-4 rounded-2xl font-bold">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            <nav className="bg-white border-b border-slate-100 h-20 flex items-center mb-8">
                <div className="max-w-4xl mx-auto px-4 w-full flex justify-between items-center">
                    <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest">
                        <ChevronLeft className="w-4 h-4" /> BROWSE MORE
                    </Link>
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-orange-500" />
                        <span className="font-black text-[10px] uppercase tracking-[0.4em]">Order Success</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
                    
                    {/* Header Banner */}
                    <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32"></div>
                        <CheckCircle2 className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                        <h1 className="text-3xl font-black text-white mb-2">Procurement Initiated</h1>
                        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Order Ref: {order.id.slice(0,8).toUpperCase()}</p>
                    </div>

                    <div className="p-12 space-y-12">
                        
                        {/* Logistics Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-100">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Project Site</span>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                                    <p className="text-sm font-bold text-slate-900">{order.project_name || 'Standard Site'}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Scheduled Arrival</span>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'TBD'}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{order.delivery_slot}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">GST Registration</span>
                                <div className="flex items-start gap-3">
                                    <FileText className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                                    <p className="text-sm font-bold text-slate-900 uppercase">{order.gstin || 'B2C Transaction'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Manifest Breakdown</h2>
                            <div className="space-y-4">
                                {order.order_items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-slate-900 border border-slate-200">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{item.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Totals */}
                        <div className="bg-slate-50 rounded-3xl p-8 space-y-4">
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Total Taxable Value</span>
                                <span>₹{(order.total_amount / 1.18).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>GST (CGST + SGST)</span>
                                <span>₹{(order.total_amount - (order.total_amount / 1.18)).toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-sm font-black uppercase tracking-widest">Total Sourcing Cost</span>
                                <span className="text-3xl font-black tracking-tighter">₹{order.total_amount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-12">
                            <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                                <Download className="w-4 h-4" /> DOWNLOAD PROFORMA INVOICE
                            </button>
                            <Link href="/" className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all text-center">
                                SITE DASHBOARD <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
