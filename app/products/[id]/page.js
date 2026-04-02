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
    CheckCircle2,
    Building2
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
        <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
            {/* Elite Node Header */}
            <nav className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-[100] h-20 flex items-center">
                <div className="max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-sm"
                        >
                            <div className="p-2 border border-slate-200 group-hover:border-slate-900 rounded-xl transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </div>
                            BACK
                        </button>
                        <div className="h-6 w-px bg-slate-200/60"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Node Cluster</span>
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{product.category}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20">
                            BuildBazaar Premium
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-24 items-start">
                    
                    {/* Primary Intelligence Core (Left) */}
                    <div className="space-y-24">
                        {/* Title & Identity Module */}
                        <div className="animate-pro-load">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="px-4 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-amber-500/20">
                                    {product.brand} Industrial
                                </div>
                                {product.verified && (
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                                        <ShieldCheck className="w-4 h-4" /> Authenticated
                                    </div>
                                )}
                            </div>
                            
                            <h1 className="text-7xl sm:text-8xl font-black text-slate-950 leading-[0.95] mb-10 tracking-[-0.04em]">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-12">
                                <div className="flex items-center bg-white p-3 pr-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex gap-0.5 mr-4 p-1">
                                        {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-amber-500 text-amber-500" />)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-slate-900 leading-none">{product.rating}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Quality Index</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black text-slate-950 tracking-tighter">
                                        {product.reviews.toLocaleString()}+
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Verified Procurements</span>
                                </div>
                            </div>
                        </div>

                        {/* Material Intelligence Module */}
                        <section className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-slate-200 flex-1"></div>
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">Material Intelligence</h2>
                                <div className="h-px bg-slate-200 flex-1"></div>
                            </div>

                            <p className="text-3xl text-slate-500 leading-tight font-medium max-w-3xl tracking-tight">
                                {product.description || "Synthesizing high-performance structural integrity with modern construction requirements."}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {product.features?.map((feature, i) => (
                                    <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[32px] hover:border-slate-900 transition-all duration-300">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <p className="font-extrabold text-slate-900 leading-snug">{feature}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Technical Parameter Grid */}
                        <section className="bg-slate-950 rounded-[48px] p-16 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] -mr-48 -mt-48 transition-opacity group-hover:opacity-100 opacity-50"></div>
                            <h3 className="text-2xl font-black mb-16 underline decoration-amber-500/50 decoration-4 underline-offset-[12px] tracking-tight">Technical Specification Control</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                                {Object.entries(product.product_specs || {}).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-3 group/item">
                                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] group-hover/item:text-amber-500 transition-colors">{key.replace('_', ' ')}</span>
                                        <span className="text-white font-black text-2xl tracking-tighter tech-monogram">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Transactional Node (Right Sidebar) */}
                    <div className="lg:sticky lg:top-32 space-y-8 pb-10">
                        {/* Elite Visual Board */}
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 flex items-center justify-center aspect-square relative shadow-elite group transition-transform duration-500 hover:scale-[1.02]">
                            {product.images && product.images[0] ? (
                                <img 
                                    src={product.images[0]} 
                                    alt={product.title}
                                    className="max-w-[85%] max-h-[85%] object-contain drop-shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            ) : (
                                <Building2 className="w-24 h-24 text-slate-100" />
                            )}
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Visual Reference #492</span>
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Pricing Hub */}
                        <div className="bg-slate-950 rounded-[48px] p-12 text-white shadow-2xl shadow-slate-900/40 border border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
                            <div className="mb-12 relative z-10">
                                <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Market Valuation Node</span>
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-7xl font-black tracking-tighter text-white">₹{product.priceCurrent.toLocaleString()}</span>
                                    {product.priceOld && (
                                        <span className="text-2xl text-white/20 line-through font-bold">₹{product.priceOld.toLocaleString()}</span>
                                    )}
                                </div>
                                <span className="text-amber-500 font-black text-sm uppercase tracking-widest">{product.unit}</span>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center bg-white/5 rounded-[24px] p-2 border border-white/10">
                                    <button className="w-16 h-16 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-6 h-6 text-white/40" /></button>
                                    <span className="flex-1 text-center font-black text-3xl text-white tech-monogram">{quantity}</span>
                                    <button className="w-16 h-16 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all" onClick={() => setQuantity(quantity + 1)}><Plus className="w-6 h-6 text-white/40" /></button>
                                </div>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 h-24 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl shadow-amber-500/20 group"
                                >
                                    <ShoppingCart className="w-7 h-7" />
                                    START PROCUREMENT
                                </button>
                            </div>
                        </div>

                        {/* Digital Field Calculator */}
                        <MaterialCalculator category={product.category} unit={product.unit} />
                    </div>
                </div>
            </main>

            <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-slate-100 mt-40">
                <div className="flex justify-between items-center opacity-30 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                    <span>BuildBazaar Industrial Ecosystem</span>
                    <span>System v.4.0.2 // Elite Node</span>
                </div>
            </footer>
        </div>
    );

}
