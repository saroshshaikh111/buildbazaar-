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
        <div style={{minHeight: '100vh', backgroundColor: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif'}}>
            {/* Minimal Header */}
            <nav style={{borderBottom: '1px solid #e2e8f0', sticky: 'top', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', zIndex: 100}}>
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <button onClick={() => router.back()} style={{padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                            <ChevronLeft style={{width: '20px', height: '20px'}} />
                        </button>
                        <div style={{fontSize: '0.875rem', fontWeight: 500, color: '#64748b'}}>
                            <Link href="/products" style={{textDecoration: 'none', color: 'inherit'}}>Products</Link> / <span style={{color: '#0f172a', fontWeight: 700}}>{product.category}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main style={{maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3rem'}}>
                    
                    {/* COLUMN 1: MATERIAL GALLERY (SPAN 5) */}
                    <div style={{gridColumn: 'span 5'}}>
                        <div style={{position: 'sticky', top: '100px'}}>
                            <ProductGallery images={product.images} />
                            
                            <div style={{marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9'}}>
                                <h3 style={{fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <FileText style={{width: 14, height: 14}} />
                                    Material intelligence
                                </h3>
                                <p style={{fontSize: '0.875rem', color: '#475569', lineHeight: 1.6}}>
                                    {product.description || "High-performance construction material engineered for industrial-grade durability and structural integrity."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: TECHNICAL SPECIFICATIONS (SPAN 4) */}
                    <div style={{gridColumn: 'span 4'}}>
                        <div style={{marginBottom: '2rem'}}>
                            <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
                                <span style={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px'}}>{product.brand}</span>
                                {product.verified && <span style={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px'}}><ShieldCheck style={{width: 10, height: 10}} /> BIS Verified</span>}
                            </div>
                            <h1 style={{fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginBottom: '0.75rem'}}>{product.title}</h1>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                <div style={{display: 'flex', color: '#fbbf24'}}>
                                    <Star style={{width: 16, height: 16, fill: 'currentColor'}} />
                                    <span style={{marginLeft: '0.25rem', fontWeight: 800, color: '#0f172a'}}>{product.rating}</span>
                                </div>
                                <span style={{color: '#94a3b8'}}>|</span>
                                <span style={{fontSize: '0.875rem', fontWeight: 600, color: '#64748b'}}>{product.reviews.toLocaleString()} Verification Reports</span>
                            </div>
                        </div>

                        <div style={{border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden'}}>
                            <div style={{backgroundColor: '#f8fafc', padding: '1rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: '#64748b'}}>
                                Technical Datasheet
                            </div>
                            {Object.entries(product.product_specs || {}).map(([key, value], idx) => (
                                <div key={key} style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: idx === Object.entries(product.product_specs).length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                                    <span style={{fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8'}}>{key.replace(/_/g, ' ')}</span>
                                    <span style={{fontSize: '0.875rem', fontWeight: 800, color: '#0f172a'}}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Estimator Integration */}
                        <div style={{marginTop: '2rem', padding: '1.5rem', backgroundColor: '#0f172a', borderRadius: '1.5rem', color: '#fff'}}>
                             <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                                <Building2 style={{width: '16px', height: '16px', color: '#f97316'}} />
                                <span style={{fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Consumption Estimator</span>
                             </div>
                             <div style={{transform: 'scale(0.9)', transformOrigin: 'top left'}}>
                                <MaterialCalculator category={product.category} unit={product.unit} />
                             </div>
                        </div>
                    </div>

                    {/* COLUMN 3: PROCUREMENT HUB (SPAN 3) */}
                    <div style={{gridColumn: 'span 3'}}>
                        <div style={{position: 'sticky', top: '100px', backgroundColor: '#fff', border: '2px solid #0f172a', borderRadius: '2rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}>
                            <div style={{marginBottom: '2rem'}}>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem'}}>
                                    <span style={{fontSize: '2.5rem', fontWeight: 900, color: '#0f172a'}}>₹{product.priceCurrent.toLocaleString()}</span>
                                    <span style={{fontSize: '0.75rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase'}}>{product.unit}</span>
                                </div>
                                {product.priceOld && <span style={{fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through'}}>₹{product.priceOld.toLocaleString()}</span>}
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                                <div>
                                    <label style={{fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem', display: 'block'}}>Order Quantity</label>
                                    <div style={{display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '4px'}}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer'}}><Minus style={{width: 14, height: 14}} /></button>
                                        <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} style={{flex: 1, border: 'none', background: 'none', textAlign: 'center', fontWeight: 900, fontSize: '1.125rem'}} />
                                        <button onClick={() => setQuantity(quantity + 1)} style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer'}}><Plus style={{width: 14, height: 14}} /></button>
                                    </div>
                                </div>

                                <button onClick={handleAddToCart} style={{height: '56px', backgroundColor: '#f97316', color: '#fff', borderRadius: '1rem', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)'}}>
                                    <ShoppingCart style={{width: 20, height: 20}} /> ADD TO CART
                                </button>
                                
                                <Link href="/checkout" style={{height: '56px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '1rem', textDecoration: 'none', fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'}}>
                                    PROCURE BULK <ArrowRight style={{width: 16, height: 16}} />
                                </Link>
                            </div>

                            <div style={{marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                                    <Truck style={{width: 18, height: 18, color: '#94a3b8'}} />
                                    <span style={{fontSize: '0.75rem', fontWeight: 700, color: '#64748b'}}>Ships to site in 48-72 hours</span>
                                </div>
                                <div style={{padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '1rem'}}>
                                    <p style={{fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.25rem'}}>Logistics Note</p>
                                    <p style={{fontSize: '0.75rem', lineHeight: 1.4, color: '#64748b'}}>Site access must be heavy-vehicle ready. High unloading volume.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
