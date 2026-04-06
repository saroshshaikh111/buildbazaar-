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
    Plus, 
    Minus, 
    ShoppingCart,
    Building2,
    Clock,
    FileText,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import ProductGallery from '@/app/components/ProductGallery';
import MaterialCalculator from '@/app/components/MaterialCalculator';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

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
            addToCart({
                ...product,
                priceCurrent: product.priceCurrent
            }, quantity);
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
                <h1 className="text-2xl font-bold mb-4 text-slate-900">Product Not Found</h1>
                <Link href="/products" className="text-orange-600 hover:text-orange-700 font-bold flex items-center group">
                    <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    Back to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Simple Utility Navigation */}
            <nav className="border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.back()}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            aria-label="Go back"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="text-sm font-medium breadcrumbs text-slate-500">
                            <Link href="/" className="hover:text-slate-900">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/products" className="hover:text-slate-900">Products</Link>
                            <span className="mx-2">/</span>
                            <span className="text-slate-900 font-semibold">{product.category}</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        SKU: {product.id.toUpperCase()}-BB
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Left Column: Media Gallery (Col 4) */}
                    <div className="lg:col-span-5">
                        <ProductGallery images={product.images} />
                        
                        <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-orange-500" />
                                Material intelligence
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {product.description || "Synthesizing high-performance structural integrity with modern construction requirements."}
                            </p>
                        </div>
                    </div>

                    {/* Middle Column: Technical Specifications (Col 4) */}
                    <div className="lg:col-span-4">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                    {product.brand}
                                </span>
                                {product.verified && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                        <ShieldCheck className="w-3 h-3" /> BIS Verified
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                                    <span className="ml-1 font-bold text-slate-900">{product.rating}</span>
                                </div>
                                <span className="text-slate-400 text-sm">|</span>
                                <span className="text-slate-500 text-sm">{product.reviews.toLocaleString()} Reviews</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <h2 className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                                    Technical Specifications
                                </h2>
                                <div className="divide-y divide-slate-100">
                                    {Object.entries(product.product_specs || {}).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-2 px-4 py-3 hover:bg-slate-50 transition-colors">
                                            <span className="text-xs text-slate-500 uppercase font-medium">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-sm font-bold text-slate-900 text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-900">Key Features</h3>
                                <ul className="grid grid-cols-1 gap-2">
                                    {product.features?.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Buy Box (Col 3) */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            <div className="p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-xl">
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-slate-900">₹{product.priceCurrent.toLocaleString()}</span>
                                        {product.priceOld && (
                                            <span className="text-lg text-slate-300 line-through">₹{product.priceOld.toLocaleString()}</span>
                                        )}
                                    </div>
                                    <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">{product.unit}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                                        <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                                            <button 
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
                                            <button 
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                                onClick={() => setQuantity(quantity + 1)}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleAddToCart}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        ADD TO CART
                                    </button>

                                    <Link 
                                        href="/checkout"
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all no-underline"
                                    >
                                        PROCURE BULK QUOTE
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                                    <div className="flex gap-3">
                                        <Truck className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Standard Delivery</p>
                                            <p className="text-[10px] text-slate-500">Delivered in 2-4 working days</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Clock className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">Secure Procurement</p>
                                            <p className="text-[10px] text-slate-500">100% Quality Inspected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Calculator Sidebar */}
                            <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl">
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-orange-400" />
                                    Estimate Consumption
                                </h3>
                                <div className="transform scale-90 -origin-top-left -mr-4">
                                    <MaterialCalculator category={product.category} unit={product.unit} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

