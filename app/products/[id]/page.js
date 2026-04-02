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
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Breadcrumbs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-sm text-slate-500 font-medium hidden sm:block">
                        BuildBazaar Catalog / {product.category} / {product.brand}
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
                    
                    {/* Left: Media Section (Now Compact) */}
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-white rounded-3xl overflow-hidden border shadow-sm relative group">
                            <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center p-4">
                                {product.images?.[activeImage] ? (
                                    <img 
                                        src={product.images[activeImage]} 
                                        alt={product.title}
                                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                            {product.tag && (
                                <span className="absolute top-6 left-6 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                    {product.tag}
                                </span>
                            )}
                        </div>
                        
                        {/* Thumbnails if multiple images */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 rounded-xl border-2 flex-shrink-0 overflow-hidden bg-white ${activeImage === idx ? 'border-orange-600' : 'border-transparent hover:border-slate-300'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info Section */}
                    <div className="flex flex-col">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-orange-600 font-bold tracking-tight text-sm uppercase">{product.brand}</span>
                            {product.verified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center bg-green-50 px-2 py-1 rounded text-green-700 font-bold text-sm">
                                <Star className="w-4 h-4 fill-green-700 mr-1" />
                                {product.rating}
                            </div>
                            <span className="text-slate-500 text-sm font-medium border-l pl-4">
                                {product.reviews.toLocaleString()} verified reviews
                            </span>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border shadow-sm mb-8">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-black text-slate-900">₹{product.priceCurrent.toLocaleString()}</span>
                                {product.priceOld && (
                                    <span className="text-xl text-slate-400 line-through mb-1">₹{product.priceOld.toLocaleString()}</span>
                                )}
                                {product.discount && (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-1 ml-2">
                                        {product.discount}
                                    </span>
                                )}
                            </div>
                            <div className="text-slate-500 font-medium mb-6 italic">{product.unit}</div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border-2 border-slate-200 rounded-2xl h-14 px-2 bg-slate-50">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-white rounded-xl transition-colors"
                                    >
                                        <Minus className="w-5 h-5 text-slate-600" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg text-slate-800">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 hover:bg-white rounded-xl transition-colors"
                                    >
                                        <Plus className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-200"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                                <Truck className="w-5 h-5 text-slate-600" />
                                <span className="text-xs font-bold text-slate-700">Lightning Express Delivery</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                                <RotateCcw className="w-5 h-5 text-slate-600" />
                                <span className="text-xs font-bold text-slate-700">E-Z 7 Day Returns</span>
                            </div>
                        </div>

                        {/* Calculator Component */}
                        <MaterialCalculator category={product.category} unit={product.unit} />
                    </div>
                </div>

                {/* Bottom Section: Specs & Features */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 border-t pt-16">
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 underline decoration-orange-500 decoration-4 underline-offset-8">
                                Product Intelligence
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                {product.description || "Premium construction quality material sourced directly from verified manufacturers. Designed to meet high-performance standards for modern structural needs."}
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Key Engineering Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.features?.length > 0 ? product.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white border rounded-2xl shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="font-semibold text-slate-700">{feature}</span>
                                    </div>
                                )) : (
                                    <div className="text-slate-400 italic">No features listed</div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="bg-white rounded-3xl border p-8 shadow-sm h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 px-1">Technical Specs</h3>
                        <div className="space-y-4">
                            {Object.entries(product.product_specs || {}).length > 0 ? Object.entries(product.product_specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">{key.replace('_', ' ')}</span>
                                    <span className="text-slate-900 font-bold">{value}</span>
                                </div>
                            )) : (
                                <div className="text-slate-400 italic text-sm">Specs coming soon</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
