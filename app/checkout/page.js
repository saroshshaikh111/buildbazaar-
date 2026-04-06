'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useCart } from '@/app/context/CartContext';
import { 
    ChevronLeft, 
    Building2, 
    Truck, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    AlertCircle,
    ArrowRight,
    Calendar,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';
import CheckoutSummary from '@/app/components/CheckoutSummary';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, totalPrice, clearCart, totalItems } = useCart();
    
    // Step State: 1 (Site), 2 (Billing), 3 (Logistics)
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        customerName: '',
        shippingAddress: '',
        pincode: '',
        projectName: '',
        gstin: '',
        businessName: '',
        deliveryDate: '',
        deliverySlot: 'Morning (8AM-12PM)',
        paymentMethod: 'Cash on Delivery'
    });

    // Auto-fill from localStorage (pincode/city)
    useEffect(() => {
        const savedPincode = localStorage.getItem('buildbazaar_pincode');
        if (savedPincode) setFormData(prev => ({ ...prev, pincode: savedPincode }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: formData.customerName,
                    shipping_address: formData.shippingAddress,
                    pincode: formData.pincode,
                    project_name: formData.projectName,
                    gstin: formData.gstin,
                    total_amount: totalPrice,
                    delivery_date: formData.deliveryDate || null,
                    delivery_slot: formData.deliverySlot,
                    payment_method: formData.paymentMethod,
                    status: 'Processing'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.priceCurrent
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Success!
            setOrderId(order.id);
            setOrderSuccess(true);
            clearCart();
            router.push(`/order-success/${order.id}`);
        } catch (err) {
            console.error('Order Submission Failed:', err);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (totalItems === 0 && !orderSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-12 rounded-[40px] text-center shadow-xl border border-slate-100 max-w-md">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-black mb-4">Your procurement basket is empty</h1>
                    <p className="text-slate-500 mb-8">Add materials to your project sites before checking out.</p>
                    <Link href="/products" className="btn-primary w-full py-4 rounded-2xl block text-center font-bold">
                        Browse Materials
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
            {/* Minimal Pro Header */}
            <nav className="border-b border-slate-100 sticky top-0 z-50 bg-white/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm tracking-widest group">
                        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        BACK TO CATALOG
                    </Link>
                    <div className="flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-orange-500" />
                        <span className="font-black text-xs uppercase tracking-[0.4em]">BuildBazaar Checkout</span>
                    </div>
                    <div className="w-24"></div> {/* Balance spacer */}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Left: Procurement Form */}
                    <div className="lg:col-span-7">
                        
                        {/* Step Indicator */}
                        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4">
                            {[
                                { id: 1, label: 'Project Info', icon: Briefcase },
                                { id: 2, label: 'Tax & Billing', icon: CreditCard },
                                { id: 3, label: 'Site Logistics', icon: Truck }
                            ].map((s) => (
                                <div key={s.id} className="flex items-center gap-4 flex-shrink-0">
                                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all ${step === s.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-400 bg-white'}`}>
                                        <s.icon className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">{s.label}</span>
                                    </div>
                                    {s.id < 3 && <div className="w-4 h-px bg-slate-100"></div>}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-12">
                            
                            {/* STEP 1: SITE INFO */}
                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <h2 className="text-4xl font-black tracking-tight mb-8">Where are we building?</h2>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Project / Site Name</label>
                                            <input required name="projectName" value={formData.projectName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold" placeholder="e.g. Parkview Residency Phase II" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Site Contact Person</label>
                                            <input required name="customerName" value={formData.customerName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold" placeholder="Full name of site manager" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Full Site Address</label>
                                            <textarea required name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold" placeholder="Plot No, Landmark, Sector, etc." />
                                        </div>
                                    </div>

                                    <button type="button" onClick={() => setStep(2)} className="btn-primary w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
                                        SAVE & NEXT
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: TAX & BILLING */}
                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <h2 className="text-4xl font-black tracking-tight mb-8">Billing Intelligence</h2>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Business / GSTIN (Optional)</label>
                                            <input name="gstin" value={formData.gstin} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-black tech-monogram uppercase" placeholder="22AAAAA0000A1Z5" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Registered Business Name</label>
                                            <input name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold" placeholder="e.g. Skyline Infrastructure Ltd." />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-slate-100 rounded-2xl font-black text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
                                            BACK
                                        </button>
                                        <button type="button" onClick={() => setStep(3)} className="flex-[2] btn-primary py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
                                            CONTINUE TO LOGISTICS
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: LOGISTICS */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                    <h2 className="text-4xl font-black tracking-tight mb-8">Site Logistics</h2>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Preferred Delivery Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input required type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Unloading Slot</label>
                                            <select name="deliverySlot" value={formData.deliverySlot} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold appearance-none">
                                                <option>Morning (8AM - 12PM)</option>
                                                <option>Afternoon (12PM - 4PM)</option>
                                                <option>Evening (4PM - 9PM)</option>
                                                <option>Night (10PM - 6AM)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-900 rounded-3xl text-white">
                                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-orange-500">
                                            <CreditCard className="w-4 h-4" /> Final Step
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                            By placing this order, you authorize the dispatch of materials to the specified project site. You will receive a technical inspection report upon delivery.
                                        </p>

                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 border-2 border-white/10 rounded-2xl font-black text-white/40 hover:border-white transition-all">
                                                CHANGE BILLING
                                            </button>
                                            <button 
                                                disabled={loading}
                                                className="flex-[2] bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98]"
                                            >
                                                {loading ? 'SYNCHRONIZING...' : 'FINALIZE PROCUREMENT'}
                                                {!loading && <ArrowRight className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-5">
                        <CheckoutSummary />
                    </div>
                </div>
            </main>
        </div>
    );
}
