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
        <div className="min-h-screen bg-slate-50 pb-24 font-sans animate-pro-load">
            {/* Pro Header / Command Bar */}
            <div className="bg-slate-900 border-b border-white/10 sticky top-0 z-50 text-white">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => router.back()}
                            className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-0.5">Procurement Node</span>
                            <span className="text-sm font-bold text-slate-300">#{params.id.toUpperCase()} // {product.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Hero Section */}
            <div className="pro-grid-bg py-24 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-orange-600/20 text-orange-500 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border border-orange-500/30">
                            {product.brand} Industrial Grade
                        </div>
                        {product.verified && (
                            <div className="flex items-center gap-2 text-blue-400 font-bold text-[11px] uppercase tracking-widest px-4 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                                <ShieldCheck className="w-4 h-4" /> Authenticated Supplier
                            </div>
                        )}
                    </div>
                    
                    <h1 className="text-6xl sm:text-7xl font-black text-white leading-tight mb-8 tracking-tighter drop-shadow-2xl">
                        {product.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-10">
                        <div className="flex items-center">
                            <div className="flex gap-1 mr-4">
                                {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-orange-500 text-orange-500" />)}
                            </div>
                            <span className="text-white font-black text-2xl">{product.rating}</span>
                            <span className="text-slate-500 font-bold ml-3 text-sm tracking-wide uppercase">/ 5.0 Rating</span>
                        </div>
                        <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Market Trust</span>
                            <span className="text-white font-bold tracking-tight">
                                {product.reviews.toLocaleString()} Verified Deployments
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
                    {/* Primary Dashboard Modules */}
                    <div className="space-y-8">
                        {/* Material Intelligence Hub */}
                        <div className="glass-card rounded-[40px] p-12 border-2 border-white">
                            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-4">
                                <div className="w-3 h-12 bg-orange-600 rounded-full" />
                                Material Intelligence
                            </h2>
                            <p className="text-2xl text-slate-500 leading-[1.6] font-medium mb-12">
                                {product.description || "Synthesizing high-performance structural integrity with modern construction requirements."}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {product.features?.map((feature, i) => (
                                    <div key={i} className="flex flex-col gap-4 p-8 bg-slate-50 rounded-[32px] border border-slate-100 pro-border-glow group transition-all hover:bg-white">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <span className="font-black text-slate-900 text-sm uppercase tracking-tight leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Procure Node Details */}
                        <div className="dark-glass-card rounded-[40px] p-12 text-white">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black tracking-tight underline decoration-orange-600 decoration-4 underline-offset-8">Technical Parameters</h3>
                                <Info className="w-6 h-6 text-white/30" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                                {Object.entries(product.product_specs || {}).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-2 pt-6 border-t border-white/5">
                                        <span className="text-white/30 text-[11px] font-black uppercase tracking-[0.15em]">{key.replace('_', ' ')}</span>
                                        <span className="text-white font-bold text-xl tech-monogram">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Transactional Modules */}
                    <div className="space-y-8 h-fit lg:sticky lg:top-24">
                        {/* Procurement Terminal */}
                        <div className="bg-white rounded-[40px] p-12 border-2 border-slate-100 shadow-2xl flex flex-col pro-border-glow">
                            <div className="mb-10">
                                <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4 block">Spot Market Index</span>
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-7xl font-black text-slate-900 tracking-tighter">₹{product.priceCurrent.toLocaleString()}</span>
                                    {product.priceOld && (
                                        <span className="text-3xl text-slate-200 line-through font-bold">₹{product.priceOld.toLocaleString()}</span>
                                    )}
                                </div>
                                <div className="inline-block px-4 py-1.5 bg-orange-600 text-white font-black text-xs rounded-lg uppercase tracking-widest shadow-lg shadow-orange-600/20">
                                    {product.unit}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center bg-slate-50 rounded-3xl p-2 border-2 border-slate-100">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-2xl transition-all shadow-sm hover:text-orange-600"
                                    >
                                        <Minus className="w-6 h-6" />
                                    </button>
                                    <span className="flex-1 text-center font-black text-3xl text-slate-900 tech-monogram">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-16 h-16 flex items-center justify-center hover:bg-white rounded-2xl transition-all shadow-sm hover:text-orange-600"
                                    >
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full bg-slate-900 hover:bg-orange-600 text-white h-20 rounded-[28px] font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl shadow-slate-900/20 group"
                                >
                                    <ShoppingCart className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                    PROCURE NOW
                                </button>
                            </div>
                        </div>

                        {/* Project Estimation Node */}
                        <MaterialCalculator category={product.category} unit={product.unit} />
                    </div>
                </div>
            </main>
        </div>
    );
}
