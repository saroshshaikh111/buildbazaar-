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
    Briefcase,
    ShoppingBag
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
        <div style={{minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Outfit", sans-serif', color: '#0f172a'}}>
            {/* Minimal Pro Header */}
            <nav style={{borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)', zIndex: 100}}>
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Link href="/products" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#64748b', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em'}}>
                        <ChevronLeft style={{width: 18, height: 18}} /> BACK TO CATALOG
                    </Link>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Building2 style={{width: 24, height: 24, color: '#f97316'}} />
                        <span style={{fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4em', color: '#0f172a'}}>BuildBazaar Checkout</span>
                    </div>
                    <div style={{width: '100px'}}></div>
                </div>
            </nav>

            <main style={{maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem'}}>
                <div style={{display: 'flex', gap: '5rem', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                    
                    {/* Left: Procurement Form */}
                    <div style={{flex: '1 1 60%', minWidth: '350px'}}>
                        
                        {/* Step Indicator */}
                        <div style={{display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem', overflowX: 'auto'}}>
                            {[
                                { id: 1, label: 'Project Info', icon: Briefcase },
                                { id: 2, label: 'Tax & Billing', icon: CreditCard },
                                { id: 3, label: 'Site Logistics', icon: Truck }
                            ].map((s) => (
                                <div key={s.id} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderRadius: '1rem', border: '2px solid transparent', backgroundColor: step === s.id ? '#0f172a' : '#fff', borderColor: step === s.id ? '#0f172a' : '#f1f5f9', color: step === s.id ? '#fff' : '#64748b', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transition: '0.2s', flexShrink: 0}} onClick={() => setStep(s.id)}>
                                    <s.icon style={{width: 16, height: 16}} />
                                    <span>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handlePlaceOrder}>
                            
                            {/* STEP 1: SITE INFO */}
                            {step === 1 && (
                                <div style={{animation: 'fade-in 0.3s ease-out'}}>
                                    <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: '#0f172a', letterSpacing: '-0.02em'}}>Where are we building?</h2>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem'}}>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Project / Site Name</label>
                                            <input required name="projectName" value={formData.projectName} onChange={handleChange} style={{width: '100%', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} placeholder="e.g. Parkview Residency Phase II" />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Site Contact Person</label>
                                            <input required name="customerName" value={formData.customerName} onChange={handleChange} style={{width: '100%', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} placeholder="Full name of site manager" />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Full Site Address</label>
                                            <textarea required name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} rows={4} style={{width: '100%', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box', resize: 'vertical'}} placeholder="Plot No, Landmark, Sector, etc." />
                                        </div>
                                    </div>

                                    <button type="button" onClick={() => setStep(2)} style={{width: '100%', padding: '1.25rem', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s', boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.3)'}}>
                                        SAVE & NEXT <ArrowRight style={{width: 20, height: 20}} />
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: TAX & BILLING */}
                            {step === 2 && (
                                <div style={{animation: 'fade-in 0.3s ease-out'}}>
                                    <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: '#0f172a', letterSpacing: '-0.02em'}}>Billing Intelligence</h2>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem'}}>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Business / GSTIN (Optional)</label>
                                            <input name="gstin" value={formData.gstin} onChange={handleChange} style={{width: '100%', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box'}} placeholder="22AAAAA0000A1Z5" />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Registered Business Name</label>
                                            <input name="businessName" value={formData.businessName} onChange={handleChange} style={{width: '100%', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} placeholder="e.g. Skyline Infrastructure Ltd." />
                                        </div>
                                    </div>

                                    <div style={{display: 'flex', gap: '1rem'}}>
                                        <button type="button" onClick={() => setStep(1)} style={{flex: 1, padding: '1.25rem', backgroundColor: 'transparent', color: '#94a3b8', border: '2px solid #e2e8f0', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', transition: '0.2s'}}>
                                            BACK
                                        </button>
                                        <button type="button" onClick={() => setStep(3)} style={{flex: 2, padding: '1.25rem', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s', boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.3)'}}>
                                            CONTINUE TO LOGISTICS <ArrowRight style={{width: 20, height: 20}} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: LOGISTICS */}
                            {step === 3 && (
                                <div style={{animation: 'fade-in 0.3s ease-out'}}>
                                    <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: '#0f172a', letterSpacing: '-0.02em'}}>Site Logistics</h2>
                                    
                                    <div style={{display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap'}}>
                                        <div style={{flex: '1 1 calc(50% - 0.75rem)', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Preferred Delivery Date</label>
                                            <div style={{position: 'relative'}}>
                                                <Calendar style={{position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#94a3b8'}} />
                                                <input required type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} style={{width: '100%', padding: '1.25rem 1.5rem 1.25rem 3.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} />
                                            </div>
                                        </div>
                                        <div style={{flex: '1 1 calc(50% - 0.75rem)', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Unloading Slot</label>
                                            <select name="deliverySlot" value={formData.deliverySlot} onChange={handleChange} style={{width: '100%', padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', appearance: 'none', boxSizing: 'border-box'}}>
                                                <option>Morning (8AM - 12PM)</option>
                                                <option>Afternoon (12PM - 4PM)</option>
                                                <option>Evening (4PM - 9PM)</option>
                                                <option>Night (10PM - 6AM)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{padding: '2rem', backgroundColor: '#0f172a', borderRadius: '1.5rem', color: '#fff'}}>
                                        <h3 style={{fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f97316'}}>
                                            <CreditCard style={{width: 16, height: 16}} /> Final Step
                                        </h3>
                                        <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6, fontWeight: 500}}>
                                            By placing this order, you authorize the dispatch of materials to the specified project site. You will receive a technical inspection report upon delivery.
                                        </p>

                                        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                                            <button type="button" onClick={() => setStep(2)} style={{flex: '1 1 30%', padding: '1.25rem', backgroundColor: 'transparent', color: '#94a3b8', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', transition: '0.2s'}}>
                                                CHANGE BILLING
                                            </button>
                                            <button 
                                                disabled={loading}
                                                style={{flex: '2 1 60%', padding: '1.25rem', backgroundColor: loading ? '#334155' : '#f97316', color: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s', boxShadow: loading ? 'none' : '0 10px 20px -5px rgba(249, 115, 22, 0.4)'}}
                                            >
                                                {loading ? 'SYNCHRONIZING...' : 'FINALIZE PROCUREMENT'}
                                                {!loading && <ArrowRight style={{width: 20, height: 20}} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div style={{flex: '1 1 35%', minWidth: '350px'}}>
                        <CheckoutSummary />
                    </div>
                </div>
            </main>
        </div>
    );
}
