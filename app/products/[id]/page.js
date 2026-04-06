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
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;

                // DEMO FIX: Hardcode the correct high-fidelity images if DB is stale
                let updatedProduct = data;
                if (data.id === 'p1') {
                    // Hardcoded High-Fidelity Material Image (Staging Override)
                    updatedProduct.images = ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Blue_and_gray_cement_bags.jpg/640px-Blue_and_gray_cement_bags.jpg'];
                    updatedProduct.priceCurrent = data.priceCurrent === 99 ? 450 : data.priceCurrent;
                } else if (data.id === 'p2') {
                    updatedProduct.images = ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800'];
                }

                setProduct(updatedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
        }
    };

    if (loading) {
        return (
            <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc'}}>
                <div style={{width: '40px', height: '40px', border: '4px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
                <h1 style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem'}}>Product Not Configured</h1>
                <Link href="/products" style={{color: '#f97316', fontWeight: 700, textDecoration: 'none'}}>← Back to Materials Catalog</Link>
            </div>
        );
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif'}}>
            {/* Minimal Pro Header */}
            <nav style={{borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', zIndex: 100}}>
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <button onClick={() => router.back()} style={{padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b'}}><ChevronLeft style={{width: 20, height: 20}} /></button>
                        <div style={{fontSize: '0.875rem', fontWeight: 600, color: '#64748b'}}>
                            <Link href="/products" style={{textDecoration: 'none', color: 'inherit'}}>Products</Link> / <span style={{color: '#0f172a', fontWeight: 800}}>{product.category}</span>
                        </div>
                    </div>
                    <div style={{fontSize: '10px', fontWeight: 900, color: '#cbd5e1', letterSpacing: '0.2em'}}>PRO-SKU: {product.id.toUpperCase()}</div>
                </div>
            </nav>

            <main style={{maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3.5rem', alignItems: 'start'}}>
                    
                    {/* COLUMN 1: VISUAL ASSETS (SPAN 5) */}
                    <div style={{gridColumn: 'span 5'}}>
                        <div style={{position: 'sticky', top: '100px'}}>
                            <ProductGallery images={product.images} />
                            
                            <div style={{marginTop: '2.5rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9'}}>
                                <h3 style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <FileText style={{width: 14, height: 14, color: '#f97316'}} />
                                    Material Intelligence
                                </h3>
                                <p style={{fontSize: '0.925rem', color: '#475569', lineHeight: 1.65, fontWeight: 500}}>
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: TECH SPEC DATA (SPAN 4) */}
                    <div style={{gridColumn: 'span 4'}}>
                        <div style={{marginBottom: '2.5rem'}}>
                            <div style={{display: 'flex', gap: '8px', marginBottom: '1.25rem'}}>
                                <span style={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px'}}>{product.brand}</span>
                                {product.verified && <span style={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '4px 10px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px'}}><ShieldCheck style={{width: 10, height: 10}} /> BIS CERTIFIED</span>}
                            </div>
                            <h1 style={{fontSize: '2.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.05, marginBottom: '1rem', letterSpacing: '-0.03em'}}>{product.title}</h1>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    <Star style={{width: 16, height: 16, color: '#fbbf24', fill: '#fbbf24'}} />
                                    <span style={{fontWeight: 900, color: '#0f172a'}}>{product.rating}</span>
                                </div>
                                <span style={{color: '#e2e8f0'}}>|</span>
                                <span style={{fontSize: '0.825rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{product.reviews.toLocaleString()} Verification Reports</span>
                            </div>
                        </div>

                        {/* Datasheet Grid */}
                        <div style={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}}>
                            <div style={{backgroundColor: '#f8fafc', padding: '1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b'}}>
                                Technical Compliance Datasheet
                            </div>
                            {Object.entries(product.product_specs || {}).map(([key, value], idx) => (
                                <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '1.25rem', borderBottom: idx === Object.entries(product.product_specs).length - 1 ? 'none' : '1px solid #f1f5f9', transition: 'background 0.2s'}} className="spec-row">
                                    <span style={{fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em'}}>{key.replace(/_/g, ' ')}</span>
                                    <span style={{fontSize: '0.9rem', fontWeight: 800, color: '#0f172a'}}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Scale Inhibitor: Estimator */}
                        <div style={{marginTop: '2.5rem', padding: '2rem', backgroundColor: '#0f172a', borderRadius: '2rem', color: '#fff', position: 'relative', overflow: 'hidden'}}>
                             <div style={{position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)'}}></div>
                             <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem'}}>
                                <Building2 style={{width: 18, height: 18, color: '#f97316'}} />
                                <span style={{fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em'}}>Project Consumption Estimator</span>
                             </div>
                             <div style={{transform: 'scale(0.95)', transformOrigin: 'top left'}}>
                                <MaterialCalculator category={product.category} unit={product.unit} />
                             </div>
                        </div>
                    </div>

                    {/* COLUMN 3: TRANSACTIONAL BUY-BOX (SPAN 3) */}
                    <div style={{gridColumn: 'span 3'}}>
                        <div style={{position: 'sticky', top: '100px', backgroundColor: '#fff', border: '2px solid #0f172a', borderRadius: '2.5rem', padding: '2.5rem', boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.12)'}}>
                            <div style={{marginBottom: '2.5rem'}}>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px'}}>
                                    <span style={{fontSize: '3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em'}}>₹{product.priceCurrent.toLocaleString()}</span>
                                    <span style={{fontSize: '0.75rem', fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{product.unit}</span>
                                </div>
                                {product.priceOld && <span style={{fontSize: '1.125rem', color: '#cbd5e1', textDecoration: 'line-through', fontWeight: 700}}>₹{product.priceOld.toLocaleString()}</span>}
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                                <div>
                                    <label style={{fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', display: 'block', letterSpacing: '0.1em'}}>Order Quantity</label>
                                    <div style={{display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #e2e8f0', padding: '6px'}}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b'}}><Minus style={{width: 16, height: 16}} /></button>
                                        <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} style={{flex: 1, border: 'none', background: 'none', textAlign: 'center', fontWeight: 900, fontSize: '1.25rem', color: '#0f172a', outline: 'none'}} />
                                        <button onClick={() => setQuantity(quantity + 1)} style={{width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b'}}><Plus style={{width: 16, height: 16}} /></button>
                                    </div>
                                </div>

                                <button onClick={handleAddToCart} style={{height: '64px', backgroundColor: '#f97316', color: '#fff', borderRadius: '1.25rem', border: 'none', fontWeight: 900, fontSize: '1.125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 12px 24px -6px rgba(249, 115, 22, 0.35)'}}>
                                    <ShoppingCart style={{width: 22, height: 22}} /> ADD TO CART
                                </button>
                                
                                <Link href="/checkout" style={{height: '64px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '1.25rem', textDecoration: 'none', fontWeight: 900, fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s'}}>
                                    PROCURE BULK <ArrowRight style={{width: 20, height: 20}} />
                                </Link>
                            </div>

                            <div style={{marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                    <div style={{width: '36px', height: '36px', backgroundColor: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <Truck style={{width: 18, height: 18, color: '#94a3b8'}} />
                                    </div>
                                    <span style={{fontSize: '0.8rem', fontWeight: 800, color: '#64748b'}}>DELIVERY TO SITE: 48-72 HRS</span>
                                </div>
                                <div style={{padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9'}}>
                                    <p style={{fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.1em'}}>Compliance Note</p>
                                    <p style={{fontSize: '0.75rem', lineHeight: 1.5, color: '#475569', fontWeight: 600}}>Material batches are strictly IS-certified. Batch reports shared on dispatch.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
