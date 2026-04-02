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
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Header / Breadcrumbs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-sm text-slate-400 font-bold hidden sm:block uppercase tracking-widest text-center flex-1 pr-10">
                        Catalogue / {product.category} / {product.brand}
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 pt-16">
                {/* Product Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-orange-600 text-white px-3 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter">
                            {product.brand}
                        </span>
                        {product.verified && (
                            <span className="flex items-center gap-1 text-blue-600 font-bold text-[10px] uppercase">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified Supplier
                            </span>
                        )}
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center text-slate-900 font-black text-lg">
                            <Star className="w-5 h-5 fill-orange-500 text-orange-500 mr-2" />
                            {product.rating} <span className="text-slate-400 font-bold ml-2 text-sm">/ 5.0 Rating</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <span className="text-slate-500 text-sm font-bold uppercase tracking-wide">
                            {product.reviews.toLocaleString()} Verified Procurements
                        </span>
                    </div>
                </div>

                {/* Primary Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Pricing Card */}
                    <div className="bg-white p-10 rounded-[32px] border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Current Market Price</p>
                            <div className="flex items-baseline gap-4 mb-1">
                                <span className="text-6xl font-black text-slate-900">₹{product.priceCurrent.toLocaleString()}</span>
                                {product.priceOld && (
                                    <span className="text-2xl text-slate-300 line-through font-bold">₹{product.priceOld.toLocaleString()}</span>
                                )}
                            </div>
                            <div className="text-orange-600 font-black text-sm mb-8 uppercase tracking-tight">{product.unit}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all text-slate-400 hover:text-orange-600"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="flex-1 text-center font-black text-xl text-slate-900">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all text-slate-400 hover:text-orange-600"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-slate-900 hover:bg-orange-600 text-white h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                PROCEED TO PROCURE
                            </button>
                        </div>
                    </div>

                    {/* Calculator Component */}
                    <MaterialCalculator category={product.category} unit={product.unit} />
                </div>

                {/* Technical Ecosystem */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-16">
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Material Intelligence</h2>
                            <p className="text-xl text-slate-500 leading-relaxed font-medium">
                                {product.description || "High-performance construction material engineered for industrial durability and professional grade standards."}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] mb-8">Engineering Characteristics</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.features?.length > 0 ? product.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        <span className="font-bold text-slate-700 text-sm">{feature}</span>
                                    </div>
                                )) : (
                                    <div className="text-slate-300 italic text-sm">Specs Pending Verification</div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl h-fit">
                        <h3 className="text-white font-black text-xl mb-8 border-b border-white/10 pb-4">Technical Specs</h3>
                        <div className="space-y-6">
                            {Object.entries(product.product_specs || {}).length > 0 ? Object.entries(product.product_specs).map(([key, value]) => (
                                <div key={key} className="flex flex-col gap-1">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{key.replace('_', ' ')}</span>
                                    <span className="text-white font-bold text-lg">{value}</span>
                                </div>
                            )) : (
                                <div className="text-white/20 italic text-sm">Loading technical data...</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
