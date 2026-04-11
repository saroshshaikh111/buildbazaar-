'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
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
    const { user, loading: authLoading } = useAuth();
    
    // Step State: 1 (Site), 2 (Billing), 3 (Logistics)
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        shippingAddress: '',
        pincode: '',
        projectName: '',
        gstin: '',
        businessName: '',
        deliveryDate: '',
        deliverySlot: 'Morning (8AM-12PM)',
        paymentMethod: 'Cash on Delivery'
    });

    // Auth Interceptor
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/checkout');
        }
    }, [user, authLoading, router]);

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
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart: cart,
                    formData: formData,
                    userId: user.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sync with secure payment gateway.');
            }

            // Success!
            setOrderId(data.orderId);
            setOrderSuccess(true);
            clearCart();
            router.push(`/order-success/${data.orderId}`);
        } catch (err) {
            console.error('Order Submission Failed:', err);
            alert(`Failed to place order. Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div style={{width: '40px', height: '40px', border: '4px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (totalItems === 0 && !orderSuccess) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: '"Outfit", sans-serif'}}>
                <div style={{backgroundColor: '#fff', padding: '3rem', borderRadius: '40px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #f1f5f9', maxWidth: '448px', width: '100%'}}>
                    <div style={{width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                        <ShoppingBag style={{width: '40px', height: '40px', color: '#cbd5e1'}} />
                    </div>
                    <h1 style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', color: '#0f172a'}}>Your procurement basket is empty</h1>
                    <p style={{color: '#64748b', marginBottom: '2rem'}}>Add materials to your project sites before checking out.</p>
                    <Link href="/products" style={{backgroundColor: '#f97316', color: '#fff', padding: '1rem', borderRadius: '1rem', display: 'block', textAlign: 'center', fontWeight: 700, textDecoration: 'none'}}>
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
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Link href="/products" style={{display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', color: '#64748b', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', fontWeight: 800, letterSpacing: '0.05em'}}>
                        <ChevronLeft style={{width: 16, height: 16}} /> BACK
                    </Link>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 1, textAlign: 'center'}}>
                        <Building2 style={{width: 20, height: 20, color: '#f97316'}} />
                        <span style={{fontWeight: 900, fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a'}}>BuildBazaar Checkout</span>
                    </div>
                    <div style={{width: '60px'}}></div>
                </div>
            </nav>

            <main style={{maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) 1rem'}}>
                <div style={{display: 'flex', gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                    
                    {/* Left: Procurement Form */}
                    <div style={{flex: '1 1 60%', minWidth: '300px'}}>
                        
                        {/* Step Indicator */}
                        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none'}}>
                            {[
                                { id: 1, label: 'Project Info', icon: Briefcase },
                                { id: 2, label: 'Tax & Billing', icon: CreditCard },
                                { id: 3, label: 'Site Logistics', icon: Truck }
                            ].map((s) => (
                                <div key={s.id} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '1rem', border: '2px solid transparent', backgroundColor: step === s.id ? '#0f172a' : '#fff', borderColor: step === s.id ? '#0f172a' : '#f1f5f9', color: step === s.id ? '#fff' : '#64748b', fontWeight: 900, fontSize: 'clamp(0.65rem, 2.5vw, 0.75rem)', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: '0.2s', flexShrink: 0}} onClick={() => setStep(s.id)}>
                                    <s.icon style={{width: 14, height: 14}} />
                                    <span>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handlePlaceOrder}>
                            
                            {/* STEP 1: SITE INFO */}
                            {step === 1 && (
                                <div style={{animation: 'fade-in 0.3s ease-out'}}>
                                    <h2 style={{fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 900, marginBottom: '2rem', color: '#0f172a', letterSpacing: '-0.02em'}}>Where are we building?</h2>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem'}}>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Project / Site Name</label>
                                            <input required name="projectName" value={formData.projectName} onChange={handleChange} style={{width: '100%', padding: '1rem 1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} placeholder="e.g. Parkview Phase II" />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Site Contact Person</label>
                                            <input required name="customerName" value={formData.customerName} onChange={handleChange} style={{width: '100%', padding: '1rem 1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} placeholder="Full name of manager" />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Email (for order confirmation)</label>
                                            <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{width: '100%', padding: '1rem 1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} placeholder="you@company.com" />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Full Site Address</label>
                                            <textarea required name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} rows={3} style={{width: '100%', padding: '1rem 1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box', resize: 'vertical'}} placeholder="Plot No, Landmark, Sector, etc." />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setStep(2)} style={{width: '100%', padding: '1rem', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s', boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.3)'}}>
                                        SAVE & NEXT <ArrowRight style={{width: 20, height: 20}} />
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: TAX & BILLING */}
                            {step === 2 && (
                                <div style={{animation: 'fade-in 0.3s ease-out'}}>
                                    <h2 style={{fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 900, marginBottom: '2rem', color: '#0f172a', letterSpacing: '-0.02em'}}>Billing Intelligence</h2>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem'}}>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Business / GSTIN (Optional)</label>
                                            <input name="gstin" value={formData.gstin} onChange={handleChange} style={{width: '100%', padding: '1rem 1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box'}} placeholder="22AAAAA0000A1Z5" />
                                        </div>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                            <label style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em'}}>Registered Business Name</label>
                                            <input name="businessName" value={formData.businessName} onChange={handleChange} style={{width: '100%', padding: '1rem 1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700, outline: 'none', boxSizing: 'border-box'}} placeholder="e.g. Skyline Ltd." />
                                        </div>
                                    </div>
                                    <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                                        <button type="button" onClick={() => setStep(1)} style={{flex: '1 1 30%', padding: '1rem', backgroundColor: 'transparent', color: '#94a3b8', border: '2px solid #e2e8f0', borderRadius: '1rem', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s'}}>
                                            BACK
                                        </button>
                                        <button type="button" onClick={() => setStep(3)} style={{flex: '2 1 60%', padding: '1rem', backgroundColor: '#f97316', color: '#fff', border: 'none', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: '0.2s', boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.3)'}}>
                                            NEXT STEP <ArrowRight style={{width: 18, height: 18}} />
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
