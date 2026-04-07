"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Building2, ArrowLeft, ShoppingCart, Star, ShieldCheck, Filter, Search } from 'lucide-react';

// Fallback Mock Data maintaining the same structure as the homepage
const fallbackProducts = [
    { id: 'p1', title: 'UltraTech Cement OPC 53', brand: 'UltraTech', category: 'Cement', verified: true, tag: 'Best Seller', rating: 4.6, reviews: 2340, priceCurrent: 380, priceOld: 420, discount: '10% OFF', unit: 'per bag (50kg)' },
    { id: 'p2', title: 'Tata Tiscon TMT Bar Fe500D', brand: 'Tata Steel', category: 'Steel & TMT', verified: true, tag: 'Top Rated', rating: 4.8, reviews: 1890, priceCurrent: 62500, priceOld: 68000, discount: '8% OFF', unit: 'per tonne' },
    { id: 'p3', title: 'First Class Red Bricks', brand: 'Local Supplier', category: 'Bricks & Blocks', verified: true, tag: 'Bulk Deal', rating: 4.3, reviews: 870, priceCurrent: 8, priceOld: 10, discount: '20% OFF', unit: 'per piece' },
    { id: 'p4', title: 'Finolex CPVC Pipes 1"', brand: 'Finolex', category: 'Plumbing', verified: true, tag: '', rating: 4.5, reviews: 560, priceCurrent: 245, priceOld: 280, discount: '12% OFF', unit: 'per 3m length' },
    { id: 'p5', title: 'Havells LifeLine Wire 1.5mm', brand: 'Havells', category: 'Electricals', verified: true, tag: 'Popular', rating: 4.7, reviews: 1230, priceCurrent: 1450, priceOld: 1650, discount: '12% OFF', unit: 'per 90m coil' },
    { id: 'p6', title: 'Asian Paints Ace Exterior', brand: 'Asian Paints', category: 'Paint & Finishes', verified: true, tag: '', rating: 4.4, reviews: 980, priceCurrent: 2150, priceOld: 2500, discount: '14% OFF', unit: 'per 20 L' }
];

function ProductCatalog() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { addToCart, cartDrawerOpen, setCartDrawerOpen, totalItems } = useCart();
    
    // Extract query parameters pushed by the Homepage routing
    const categoryQuery = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    
    const [products, setProducts] = useState(fallbackProducts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                let query = supabase.from('products').select('*').order('created_at', { ascending: false });
                
                if (categoryQuery) query = query.ilike('category', `%${categoryQuery}%`);
                if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);
                
                const { data, error } = await query;
                
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    // Client-side filtering of mock data
                    applyLocalFilters();
                }
            } catch (err) {
                // Supabase unavailable — use local mock data with filters
                applyLocalFilters();
            } finally {
                setLoading(false);
            }
        }

        function applyLocalFilters() {
            let filtered = fallbackProducts;
            if (categoryQuery) {
                filtered = filtered.filter(p => p.category.toLowerCase() === categoryQuery.toLowerCase());
            }
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                filtered = filtered.filter(p => 
                    p.title.toLowerCase().includes(q) || 
                    p.brand.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q)
                );
            }
            setProducts(filtered);
        }
        
        fetchProducts();
    }, [categoryQuery, searchQuery]);

    const pageTitle = categoryQuery 
        ? `${categoryQuery} Materials` 
        : searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : "All Products";

    return (
        <div style={{minHeight: '100vh', backgroundColor: 'var(--slate-50)'}}>
            
            {/* Minimal Header */}
            <header style={{backgroundColor: 'var(--slate-900)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                    <Link href="/" style={{display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0, textDecoration: 'none', color: 'white'}}>
                        <Building2 style={{color: '#f97316', width: 28, height: 28, marginRight: '8px'}} />
                        <span style={{fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px'}}>BuildBazaar</span>
                    </Link>
                    <Link href="/" style={{display: 'flex', alignItems: 'center', color: 'var(--slate-300)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600}}>
                        <ArrowLeft style={{width: 16, height: 16, marginRight: 4}} /> Home
                    </Link>
                </div>
                
                <div onClick={() => router.push('/checkout')} style={{display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '5px', backgroundColor: 'var(--primary-orange)', borderRadius: '24px', paddingLeft: '16px', paddingRight: '16px'}}>
                    <ShoppingCart style={{width: 20, height: 20, color: 'white', marginRight: '8px'}} />
                    <span style={{color: 'white', fontWeight: 700, fontSize: '14px'}}>Cart ({totalItems})</span>
                </div>
            </header>

            <main className="container" style={{padding: '3rem 20px'}}>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--slate-200)', paddingBottom: '1rem'}}>
                    <div>
                        <h1 style={{fontSize: '2rem', color: 'var(--slate-900)', marginBottom: '0.5rem'}}>{pageTitle}</h1>
                        <p style={{color: 'var(--slate-500)', fontWeight: 500}}>{products.length} products found matching your criteria</p>
                    </div>
                    {/* Mock Filtering Engine */}
                    <button onClick={() => alert('Advanced filtering options are coming soon in the next update!')} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid var(--slate-300)', borderRadius: '0.5rem', fontWeight: 600, color: 'var(--slate-700)', cursor: 'pointer', flexShrink: 0}}>
                        <Filter style={{width: 16, height: 16}} /> Filter & Sort
                    </button>
                </div>

                {loading ? (
                    <div style={{textAlign: 'center', padding: '4rem', color: 'var(--slate-500)'}}>Loading Catalog...</div>
                ) : products.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '1rem', border: '1px dashed var(--slate-300)'}}>
                        <Search style={{width: 48, height: 48, color: 'var(--slate-300)', margin: '0 auto 1rem auto'}} />
                        <h3 style={{fontSize: '1.5rem', color: 'var(--slate-700)', marginBottom: '0.5rem'}}>No materials found</h3>
                        <p style={{color: 'var(--slate-500)'}}>Try broadening your search term or checking a different category.</p>
                        <Link href="/" style={{display: 'inline-block', marginTop: '1.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--slate-900)', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600}}>Back to Directory</Link>
                    </div>
                ) : (
                    <div className="grid products-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem'}}>
                        {products.map(prod => (
                            <div className="product-card" key={prod.id} style={{backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--slate-200)', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%'}}>
                                
                                <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                                    <span style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)', display: 'flex', alignItems: 'center', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '12px'}}>
                                        <ShieldCheck style={{width: 12, height: 12, marginRight: 4}} /> Verified
                                    </span>
                                    {prod.tag && (
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px',
                                            backgroundColor: prod.tag === 'Best Seller' ? '#fff7ed' : '#f0fdf4',
                                            color: prod.tag === 'Best Seller' ? '#ea580c' : '#16a34a'
                                        }}>{prod.tag}</span>
                                    )}
                                </div>
                                
                                <Link href={`/products/${prod.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                    {/* New Product Image Container */}
                                    <div style={{padding: '1rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px', backgroundColor: '#f9fafb', borderRadius: '0.75rem', marginBottom: '1rem', overflow: 'hidden'}}>
                                        {prod.images && prod.images[0] ? (
                                            <img 
                                                src={prod.images[0]} 
                                                alt={prod.title} 
                                                style={{maxWidth: '100%', maxHeight: '140px', objectFit: 'contain', transition: 'transform 0.3s'}}
                                                className="hover:scale-105"
                                            />
                                        ) : (
                                            <Building2 style={{width: 48, height: 48, color: 'var(--slate-200)'}} />
                                        )}
                                    </div>
                                    
                                    <h3 style={{fontSize: '1.125rem', marginBottom: '0.5rem', lineHeight: '1.4', flex: 1, cursor: 'pointer', fontWeight: 800, height: '2.4em', overflow: 'hidden'}} className="hover:text-orange-600">
                                        {prod.title}
                                    </h3>
                                </Link>
                                
                                <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--slate-500)'}}>
                                    <Star style={{width: 16, height: 16, fill: '#eab308', color: '#eab308'}} />
                                    <span><strong style={{color: 'var(--slate-900)'}}>{prod.rating}</strong> ({prod.reviews} reviews)</span>
                                </div>
                                
                                <div style={{marginTop: 'auto', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                                    <div>
                                        <div style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                            ₹{prod.priceCurrent.toLocaleString('en-IN')}
                                            {prod.priceOld && <span style={{fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-400)', textDecoration: 'line-through'}}>₹{prod.priceOld.toLocaleString('en-IN')}</span>}
                                        </div>
                                        <div style={{fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px'}}>{prod.unit}</div>
                                    </div>
                                    <button 
                                        onClick={() => addToCart(prod)}
                                        style={{backgroundColor: 'var(--slate-100)', color: 'var(--primary-orange)', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                                    >
                                        <ShoppingCart style={{width: 20, height: 20}} />
                                    </button>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// NextJS Requires standard clientside rendering of searchParams to be wrapped in Suspense boundaries
export default function ProductsPage() {
    return (
        <Suspense fallback={<div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Catalog Routing...</div>}>
            <ProductCatalog />
        </Suspense>
    );
}
