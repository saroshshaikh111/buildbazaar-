'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useCart } from '@/app/context/CartContext';
import { 
    ChevronLeft, 
    Star, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    Plus, 
    Minus, 
    ShoppingCart,
    Info,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import MaterialCalculator from '@/app/components/MaterialCalculator';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
                // Handle 404 or redirect
            } else {
                setProduct(data);
            }
            setLoading(false);
        }

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
            // Optional: Show toast or open drawer
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Link href="/products" className="text-orange-600 hover:underline flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24 font-sans animate-pro-load overflow-x-hidden">
            {/* Minimal Pro Header */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-all border border-slate-200"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">
                            Catalogue / <span className="text-slate-900">{product.category}</span> / {product.brand}
                        </div>
                    </div>
                    <div className="text-[10px] font-black uppercase text-orange-500 tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                        Node ID: #{params.id.toUpperCase()}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 items-start">
                    
                    {/* Left Column: Extensive Data & Intelligence */}
                    <div className="space-y-16">
                        {/* Title & Brand Identity */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-slate-900 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                                    {product.brand}
                                </span>
                                {product.verified && (
                                    <span className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Supplier
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-8">
                                <div className="flex items-center">
                                    <div className="flex gap-0.5 mr-3">
                                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.floor(product.rating) ? 'fill-orange-500 text-orange-500' : 'text-slate-200'}`} />)}
                                    </div>
                                    <span className="text-slate-900 font-extrabold text-2xl">{product.rating}</span>
                                </div>
                                <div className="h-6 w-px bg-slate-200"></div>
                                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                    {product.reviews.toLocaleString()} Verified Procurements
                                </span>
                            </div>
                        </div>

                        {/* Material Intelligence (Behance Style) */}
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                                <Info className="w-6 h-6 text-orange-500" />
                                Material Intelligence
                            </h2>
                            <p className="text-xl text-slate-500 leading-relaxed font-semibold max-w-3xl mb-12">
                                {product.description || "Synthesizing high-performance structural integrity with modern construction requirements."}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.features?.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-orange-500/20 hover:bg-white transition-all group">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500 mt-1" />
                                        <span className="font-bold text-slate-700 text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Technical Parameters Module */}
                        <section className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] -mr-32 -mt-32"></div>
                            <h3 className="text-xl font-black mb-10 uppercase tracking-widest flex items-center justify-between">
                                Technical Parameters
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 relative z-10">
                                {Object.entries(product.product_specs || {}).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-1.5 p-4 rounded-xl hover:bg-white/5 transition-colors">
                                        <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">{key.replace('_', ' ')}</span>
                                        <span className="text-white font-bold text-lg tech-monogram">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Media & Actions */}
                    <div className="lg:sticky lg:top-28 space-y-8">
                        {/* Compact Media Module */}
                        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 flex items-center justify-center min-h-[320px] relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/20 to-transparent"></div>
                            {product.images && product.images[0] ? (
                                <img 
                                    src={product.images[0]} 
                                    alt={product.title}
                                    className="max-w-[280px] max-h-[280px] object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 relative z-10"
                                />
                            ) : (
                                <div className="text-slate-300 font-black text-xs uppercase tracking-widest text-center">
                                    Node Visual Reference Pending
                                </div>
                            )}
                        </div>

                        {/* Procurement Module */}
                        <div className="bg-white rounded-[32px] p-10 border-2 border-slate-100 shadow-2xl shadow-slate-200/50">
                            <div className="mb-10">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 block">Market Sourcing Value</span>
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{product.priceCurrent.toLocaleString()}</span>
                                    {product.priceOld && (
                                        <span className="text-xl text-slate-200 line-through font-bold">₹{product.priceOld.toLocaleString()}</span>
                                    )}
                                </div>
                                <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">{product.unit}</span>
                            </div>

                            <div className="flex items-center bg-slate-50 rounded-2xl p-1 mb-6 border border-slate-100">
                                <button className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-5 h-5 text-slate-400" /></button>
                                <span className="flex-1 text-center font-black text-xl text-slate-900 tech-monogram">{quantity}</span>
                                <button className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all" onClick={() => setQuantity(quantity + 1)}><Plus className="w-5 h-5 text-slate-400" /></button>
                            </div>
                            
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-slate-900 hover:bg-orange-600 text-white h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-lg shadow-slate-900/10"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                PROCURE UNIT
                            </button>
                        </div>

                        {/* Project Estimation Hub */}
                        <MaterialCalculator category={product.category} unit={product.unit} />
                    </div>
                </div>
            </main>
        </div>
    );
}
