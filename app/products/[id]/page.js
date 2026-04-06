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

                // STAGING OVERRIDE: Ensuring the demo data is always high-fidelity
                let updatedProduct = data;
                if (data.id === 'p1') {
                    // Using a stable, high-fidelity cement stack image
                    updatedProduct.images = [
                        'https://images.unsplash.com/photo-1544161513-0179fe746fd5?q=80&w=1200&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1589934301540-3b0277bd2228?q=80&w=1200&auto=format&fit=crop'
                    ];
                    updatedProduct.priceCurrent = 450;
                } else if (data.id === 'p2') {
                    updatedProduct.images = ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop'];
                    updatedProduct.priceCurrent = 65500;
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
                <h1 style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem'}}>Product Metadata Mismatch</h1>
                <Link href="/products" style={{color: '#f97316', fontWeight: 700, textDecoration: 'none'}}>← Back to Materials Hub</Link>
            </div>
        );
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif'}}>
            {/* Minimal Pro Header */}
            <nav style={{borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)', zIndex: 100}}>
                <div style={{maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <button onClick={() => router.back()} style={{padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center'}}><ChevronLeft style={{width: 18, height: 18}} /></button>
                        <div style={{fontSize: '0.85rem', fontWeight: 600, color: '#64748b'}}>
                            <Link href="/products" style={{textDecoration: 'none', color: 'inherit'}}>Products</Link> / <span style={{color: '#0f172a', fontWeight: 800}}>{product.category}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main style={{maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4rem', alignItems: 'start'}}>
                    
                    {/* Visual Asset Stage (Span 5) */}
                    <div style={{gridColumn: 'span 5'}}>
                        <div style={{position: 'sticky', top: '100px'}}>
                            <ProductGallery images={product.images} />
                            
                            <div style={{marginTop: '2.5rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9'}}>
                                <h3 style={{fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <FileText style={{width: 14, height: 14, color: '#f97316'}} />
                                    Material intelligence
                                </h3>
                                <p style={{fontSize: '0.925rem', color: '#475569', lineHeight: 1.7, fontWeight: 500}}>
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Datasheet Core (Span 4) */}
                    <div style={{gridColumn: 'span 4'}}>
                        <div style={{marginBottom: '2.5rem'}}>
                            <div style={{display: 'flex', gap: '8px', marginBottom: '1.25rem'}}>
                                <span style={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px'}}>{product.brand}</span>
                                {product.verified && <span style={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '4px 10px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px'}}><ShieldCheck style={{width: 10, height: 10}} /> BIS CERTIFIED</span>}
                            </div>
                            <h1 style={{fontSize: '2.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.04em'}}>{product.title}</h1>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                    <Star style={{width: 16, height: 16, color: '#fbbf24', fill: '#fbbf24'}} />
                                    <span style={{fontWeight: 900, color: '#0f172a'}}>{product.rating}</span>
                                </div>
                                <span style={{color: '#e2e8f0'}}>|</span>
                                <span style={{fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase'}}>{product.reviews?.toLocaleString()} Verification Reports</span>
                            </div>
                        </div>

                        <div style={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}}>
                            <div style={{backgroundColor: '#f8fafc', padding: '1.25rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.125em', color: '#64748b'}}>
                                Technical Datasheet
                            </div>
                            {Object.entries(product.product_specs || {}).map(([key, value], idx) => (
                                <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '1.25rem', borderBottom: idx === Object.entries(product.product_specs).length - 1 ? 'none' : '1px solid #f1f5f9'}}>
                                    <span style={{fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8'}}>{key.replace(/_/g, ' ')}</span>
                                    <span style={{fontSize: '0.9rem', fontWeight: 800, color: '#0f172a'}}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{marginTop: '2rem', padding: '2rem', backgroundColor: '#0f172a', borderRadius: '1.75rem', color: '#fff'}}>
                             <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem'}}>
                                <Building2 style={{width: 18, height: 18, color: '#f97316'}} />
                                <span style={{fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em'}}>Project Estimator</span>
                             </div>
                             <div style={{transform: 'scale(0.95)', transformOrigin: 'top left'}}>
                                <MaterialCalculator category={product.category} unit={product.unit} />
                             </div>
                        </div>
                    </div>

                    {/* Transactional Hub (Span 3) */}
                    <div style={{gridColumn: 'span 3'}}>
                        <div style={{position: 'sticky', top: '100px', backgroundColor: '#fff', border: '2px solid #0f172a', borderRadius: '2.5rem', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)'}}>
                            <div style={{marginBottom: '2.5rem'}}>
                                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
                                    <span style={{fontSize: '2.75rem', fontWeight: 900, color: '#0f172a'}}>₹{product.priceCurrent.toLocaleString()}</span>
                                    <span style={{fontSize: '0.75rem', fontWeight: 900, color: '#f97316', textTransform: 'uppercase'}}>{product.unit}</span>
                                </div>
                                {product.priceOld && <span style={{fontSize: '1.125rem', color: '#cbd5e1', textDecoration: 'line-through', fontWeight: 700}}>₹{product.priceOld.toLocaleString()}</span>}
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                                <div>
                                    <label style={{fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', display: 'block'}}>Order Quantity</label>
                                    <div style={{display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '6px'}}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer'}}><Minus style={{width: 14, height: 14}} /></button>
                                        <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} style={{flex: 1, border: 'none', background: 'none', textAlign: 'center', fontWeight: 900, fontSize: '1.125rem'}} />
                                        <button onClick={() => setQuantity(quantity + 1)} style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer'}}><Plus style={{width: 14, height: 14}} /></button>
                                    </div>
                                </div>

                                <button onClick={handleAddToCart} style={{height: '60px', backgroundColor: '#f97316', color: '#fff', borderRadius: '1.25rem', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.4)'}}>
                                    <ShoppingCart style={{width: 20, height: 20}} /> ADD TO CART
                                </button>
                                
                                <Link href="/checkout" style={{height: '60px', backgroundColor: '#0f172a', color: '#fff', borderRadius: '1.25rem', textDecoration: 'none', fontWeight: 900, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
                                    PROCURE BULK <ArrowRight style={{width: 18, height: 18}} />
                                </Link>
                            </div>

                            <div style={{marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <Truck style={{width: 18, height: 18, color: '#94a3b8'}} />
                                    <span style={{fontSize: '0.75rem', fontWeight: 800, color: '#64748b'}}>Ships to site: 48-72 hours</span>
                                </div>
                                <div style={{padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #f1f5f9'}}>
                                    <p style={{fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px'}}>Technical Note</p>
                                    <p style={{fontSize: '0.75rem', lineHeight: 1.5, color: '#475569', fontWeight: 600}}>IS-certified batch reports shared upon dispatch completion.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
