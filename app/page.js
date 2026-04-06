"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { 
    Building2, Search, ShoppingCart, Menu, Package, Server, 
    LayoutGrid, Mountain, PaintBucket, Droplet, Zap, TreePine, 
    ShieldCheck, Star, Truck, ThumbsUp, CheckCircle, Calculator, 
    X, Trash2 
} from 'lucide-react';

// Mock Data Fallbacks
const mockCategories = [
    { id: 'c1', title: 'Cement', count: '120+ Products', icon: Package },
    { id: 'c2', title: 'Steel & TMT', count: '85+ Products', icon: Server },
    { id: 'c3', title: 'Bricks & Blocks', count: '45+ Products', icon: LayoutGrid },
    { id: 'c4', title: 'Sand & Aggregates', count: '30+ Products', icon: Mountain },
    { id: 'c5', title: 'Paint & Finishes', count: '200+ Products', icon: PaintBucket },
    { id: 'c6', title: 'Plumbing', count: '150+ Products', icon: Droplet },
    { id: 'c7', title: 'Electricals', count: '300+ Products', icon: Zap },
    { id: 'c8', title: 'Wood & Plywood', count: '60+ Products', icon: TreePine }
];

const mockProducts = [
    {
        id: 'p1', title: 'UltraTech Cement OPC 53', brand: 'UltraTech', verified: true,
        tag: 'Best Seller', rating: 4.6, reviews: 2340, priceCurrent: 380, priceOld: 420,
        discount: '10% OFF', unit: 'per bag (50kg)'
    },
    {
        id: 'p2', title: 'Tata Tiscon TMT Bar Fe500D', brand: 'Tata Steel', verified: true,
        tag: 'Top Rated', rating: 4.8, reviews: 1890, priceCurrent: 62500, priceOld: 68000,
        discount: '8% OFF', unit: 'per tonne'
    },
    {
        id: 'p3', title: 'First Class Red Bricks', brand: 'Local Supplier', verified: true,
        tag: 'Bulk Deal', rating: 4.3, reviews: 870, priceCurrent: 8, priceOld: 10,
        discount: '20% OFF', unit: 'per piece'
    },
    {
        id: 'p4', title: 'Finolex CPVC Pipes 1"', brand: 'Finolex', verified: true,
        tag: '', rating: 4.5, reviews: 560, priceCurrent: 245, priceOld: 280,
        discount: '12% OFF', unit: 'per 3m length'
    },
    {
        id: 'p5', title: 'Havells LifeLine Wire 1.5mm', brand: 'Havells', verified: true,
        tag: 'Popular', rating: 4.7, reviews: 1230, priceCurrent: 1450, priceOld: 1650,
        discount: '12% OFF', unit: 'per 90m coil'
    },
    {
        id: 'p6', title: 'Asian Paints Ace Exterior', brand: 'Asian Paints', verified: true,
        tag: '', rating: 4.4, reviews: 980, priceCurrent: 2150, priceOld: 2500,
        discount: '14% OFF', unit: 'per 20 L'
    }
];

export default function BuildBazaar() {
    const router = useRouter();
    const [categories, setCategories] = useState(mockCategories);
    const [products, setProducts] = useState(mockProducts);
    
    // UI State
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [demoModalOpen, setDemoModalOpen] = useState(false);
    const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
    
    // Global Cart State
    const { cart, setCart, addToCart, updateQuantity, removeItem, totalItems, totalPrice, cartDrawerOpen, setCartDrawerOpen } = useCart();
    const { user, logout } = useAuth();
    
    // Calculator State
    const [calcArea, setCalcArea] = useState('');
    const [calcFloors, setCalcFloors] = useState(1);
    const [estimates, setEstimates] = useState(null);

    useEffect(() => {
        // Fetch real data from Supabase if configured (silently falls back if tables don't exist yet)
        async function loadSupabaseData() {
            try {
                const { data: catData } = await supabase.from('categories').select('*');
                if (catData && catData.length > 0) setCategories(catData.map(c => ({...c, icon: Package }))); // Simplification for mapped dynamic icons
                
                const { data: prodData } = await supabase.from('products').select('*');
                if (prodData && prodData.length > 0) setProducts(prodData);
            } catch (err) {
                // Ignore, meaning we fall back to mock data
            }
        }
        loadSupabaseData();
    }, []);

    // Cart mutation hooks are now completely handled centrally via CartContext

    const calculateMaterials = () => {
        const area = parseFloat(calcArea);
        if (!area || area <= 0) {
            alert('Please enter a valid built-up area.');
            return;
        }
        const floors = parseInt(calcFloors) || 1;
        const totalArea = area * floors;
        
        setEstimates({
            cement: Math.ceil(totalArea * 0.4),
            steel: Math.ceil(totalArea * 4),
            sand: Math.ceil(totalArea * 1.8),
            bricks: Math.ceil(totalArea * 8)
        });
    };

    const addAllEstimatesToCart = () => {
        if (!estimates) return;
        
        const estimatedItems = [
            { id: 'est_cement', title: 'UltraTech Cement OPC 53', brand: 'UltraTech', priceCurrent: 380, priceOld: 420, quantity: estimates.cement, unit: 'bags' },
            { id: 'est_steel', title: 'Tata Tiscon TMT Bar Fe500D', brand: 'Tata Steel', priceCurrent: 62, priceOld: 68, quantity: estimates.steel, unit: 'kg' },
            { id: 'est_sand', title: 'Construction Sand', brand: 'Local Supplier', priceCurrent: 45, priceOld: 50, quantity: estimates.sand, unit: 'cft' },
            { id: 'est_bricks', title: 'First Class Red Bricks', brand: 'Local Supplier', priceCurrent: 8, priceOld: 10, quantity: estimates.bricks, unit: 'pcs' }
        ];

        setCart(prev => {
            let newCart = [...prev];
            estimatedItems.forEach(estItem => {
                const existingIndex = newCart.findIndex(item => item.id === estItem.id);
                if (existingIndex >= 0) {
                    newCart[existingIndex].quantity += estItem.quantity;
                } else {
                    newCart.push(estItem);
                }
            });
            return newCart;
        });

        setCartDrawerOpen(true);
    };

    return (
        <>
            <header style={{width: '100%', position: 'sticky', top: 0, zIndex: 100, fontFamily: 'Arial, sans-serif'}}>
                {/* Top Dark Tier */}
                <div style={{backgroundColor: 'var(--slate-900)', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '24px'}}>
                    
                    {/* Logo Box */}
                    <div style={{display: 'flex', alignItems: 'flex-start', cursor: 'pointer', flexShrink: 0}}>
                        <Building2 style={{color: '#f97316', width: 32, height: 32, marginRight: '4px'}} />
                        <span style={{fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px'}}>BuildBazaar</span>
                        <span style={{fontSize: '14px', color: '#ccc', marginLeft: '4px', marginTop: '4px'}}>.in</span>
                    </div>

                    {/* Location Pin */}
                    <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '5px', flexShrink: 0}}>
                        <div style={{marginRight: '2px', marginTop: '8px'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{fontSize: '12px', color: '#ccc', lineHeight: '14px', marginLeft: '2px'}}>Delivering to Delhi 110001</span>
                            <span style={{fontSize: '14px', fontWeight: 700, lineHeight: '15px'}}>Update location</span>
                        </div>
                    </div>

                    {/* Massive Search Bar */}
                    <div style={{flex: 1, display: 'flex', height: '46px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'}}>
                        <select style={{background: 'var(--slate-50)', border: 'none', padding: '0 15px', fontSize: '13px', color: 'var(--slate-800)', borderRight: '1px solid var(--slate-200)', outline: 'none', fontWeight: 600}}>
                            <option>All Categories</option>
                            <option>Cement</option>
                            <option>Steel</option>
                            <option>Paint</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Search materials, brands, suppliers..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`); }}
                            style={{flex: 1, padding: '0 20px', border: 'none', outline: 'none', fontSize: '15px', color: '#111'}}
                        />
                        <button 
                            onClick={() => { if (searchQuery.trim()) router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`); }}
                            style={{background: 'var(--primary-orange)', border: 'none', padding: '0 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'}}
                        >
                            <Search style={{color: 'white', width: 22}} />
                        </button>
                    </div>

                    {/* Accounts Hub */}
                    {user ? (
                        <div style={{display: 'flex', flexDirection: 'column', cursor: 'pointer', color: 'white', flexShrink: 0}} onClick={logout}>
                            <span style={{fontSize: '12px', lineHeight: '14px'}}>Hello, {user.email.split('@')[0]}</span>
                            <span style={{fontSize: '14px', fontWeight: 700, lineHeight: '15px'}}>Sign Out</span>
                        </div>
                    ) : (
                        <Link href="/login" style={{display: 'flex', flexDirection: 'column', cursor: 'pointer', color: 'white', textDecoration: 'none', flexShrink: 0}}>
                            <span style={{fontSize: '12px', lineHeight: '14px'}}>Hello, sign in</span>
                            <span style={{fontSize: '14px', fontWeight: 700, lineHeight: '15px'}}>Account & Lists</span>
                        </Link>
                    )}

                    {/* Orders */}
                    <Link href="/auth" style={{display: 'flex', flexDirection: 'column', cursor: 'pointer', color: 'white', textDecoration: 'none', flexShrink: 0}}>
                        <span style={{fontSize: '12px', lineHeight: '14px'}}>Returns</span>
                        <span style={{fontSize: '14px', fontWeight: 700, lineHeight: '15px'}}>& Orders</span>
                    </Link>

                    {/* Cart Tool */}
                    <div onClick={() => setCartDrawerOpen(true)} style={{display: 'flex', alignItems: 'flex-end', cursor: 'pointer', padding: '5px', flexShrink: 0, position: 'relative'}}>
                        <ShoppingCart style={{width: 36, height: 36, color: 'white'}} />
                        {totalItems > 0 && (
                            <span style={{position: 'absolute', top: '-2px', left: '22px', backgroundColor: '#f97316', color: 'white', fontWeight: 800, fontSize: '11px', minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid var(--slate-900)'}}>{totalItems}</span>
                        )}
                        <span style={{fontSize: '14px', fontWeight: 700, marginLeft: '4px', marginBottom: '4px'}}>Cart</span>
                    </div>
                </div>

                {/* Bottom Sub-Tier Menu */}
                <div style={{backgroundColor: 'var(--slate-800)', color: 'white', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: 600}}>
                    <div onClick={() => setMenuDrawerOpen(true)} style={{display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 700}}>
                        <Menu style={{width: 20, height: 20}} /> All
                    </div>
                    <Link href="/seller" style={{color: '#f97316', textDecoration: 'none'}}>Sell on BuildBazaar</Link>
                    <a href="#categories" style={{color: 'white', textDecoration: 'none'}}>Categories</a>
                    <a href="#products" style={{color: 'white', textDecoration: 'none'}}>Best Sellers</a>
                    <a href="#calculator" style={{color: 'white', textDecoration: 'none'}}>Material Calculator</a>
                    <a href="#" style={{color: 'white', textDecoration: 'none'}}>Today's Deals</a>
                    <a href="#how-it-works" style={{color: 'white', textDecoration: 'none'}}>Customer Service</a>
                </div>
            </header>

            <main>
                <section className="hero dark-section">
                    <div className="container hero-content">
                        <div className="badge-tag">MARKETPLACE</div>
                        <h1>Transparent Prices <br/><span className="text-orange">Zero Hassle.</span></h1>
                        <p>India's trusted digital marketplace for construction materials. Compare prices, order in bulk, get doorstep delivery.</p>
                        <div className="hero-actions">
                            <Link href="/products" className="btn-primary btn-large" style={{textDecoration: 'none', display: 'inline-block'}}>Browse Materials</Link>
                            <button className="btn-ghost btn-large text-white" style={{borderColor: 'rgba(255,255,255,0.2)'}} onClick={() => setDemoModalOpen(true)}>Watch Demo</button>
                        </div>
                    </div>
                </section>

                <section id="categories" className="py-16 bg-slate">
                    <div className="container">
                        <div className="section-header">
                            <h2>Shop by Category</h2>
                            <p>Select material categories for your construction project.</p>
                        </div>
                        <div className="grid categories-grid">
                            {categories.map(cat => {
                                const IconComp = cat.icon;
                                return (
                                <Link href={`/products?category=${encodeURIComponent(cat.title)}`} className="category-card" key={cat.id} style={{textDecoration: 'none', color: 'inherit'}}>
                                    <IconComp className="category-icon" />
                                    <h3 className="category-title">{cat.title}</h3>
                                    <span className="category-count">{cat.count}</span>
                                </Link>
                            )})}
                        </div>
                    </div>
                </section>

                <section id="products" className="py-16">
                    <div className="container">
                        <div className="section-header space-between">
                            <div>
                                <h2>Featured Products</h2>
                                <p>Handpicked materials from verified suppliers at the best prices.</p>
                            </div>
                            <Link href="/products" className="btn-outline" style={{textDecoration: 'none', display: 'inline-block'}}>View All Products</Link>
                        </div>
                        <div className="grid products-grid">
                            {products.map(prod => (
                                <div className="product-card" key={prod.id}>
                                    <div className="card-header">
                                        <span className="tag-verified"><ShieldCheck style={{width: 12, height: 12, marginRight: 4, display: 'inline'}} /> Verified</span>
                                        {prod.tag && (
                                            <span className="tag-status" style={{
                                                backgroundColor: prod.tag === 'Best Seller' ? '#fff7ed' : '#f0fdf4',
                                                color: prod.tag === 'Best Seller' ? '#ea580c' : '#16a34a'
                                            }}>{prod.tag}</span>
                                        )}
                                    </div>
                                    <h3 className="product-title">{prod.title}</h3>
                                    <div className="product-rating">
                                        <Star className="star-icon" />
                                        <span><strong style={{color: 'var(--slate-900)'}}>{prod.rating}</strong> ({prod.reviews} reviews)</span>
                                    </div>
                                    <div className="product-footer">
                                        <div className="price-container">
                                            <div className="price-current">
                                                ₹{prod.priceCurrent.toLocaleString('en-IN')}
                                                {prod.priceOld && <span className="price-old">₹{prod.priceOld.toLocaleString('en-IN')}</span>}
                                                {prod.discount && <span className="price-discount">{prod.discount}</span>}
                                            </div>
                                            <span className="price-unit">{prod.unit}</span>
                                        </div>
                                        <button className="add-btn" onClick={() => addToCart(prod)}>
                                            <ShoppingCart style={{width: 16, height: 16, display: 'inline-block', verticalAlign: 'middle'}} /> Add
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="py-16 dark-section">
                    <div className="container">
                        <div className="badge-tag">SIMPLE PROCESS</div>
                        <div className="section-header text-center w-full">
                            <h2>How It Works</h2>
                            <p>From browsing to building — simplified in four easy steps.</p>
                        </div>
                        <div className="steps-container">
                            <div className="step-connecting-line"></div>
                            {[
                                { num: 1, icon: Search, title: 'Browse & Compare', desc: 'Search materials, compare prices from multiple verified suppliers in your area.' },
                                { num: 2, icon: ShoppingCart, title: 'Place Your Order', desc: 'Add to cart, apply bulk discounts, and checkout with secure digital payments.' },
                                { num: 3, icon: Truck, title: 'Track Delivery', desc: 'Real-time tracking from warehouse to your construction site with estimated ETAs.' },
                                { num: 4, icon: ThumbsUp, title: 'Build with Confidence', desc: 'Quality-checked materials, hassle-free returns, and dedicated support.' }
                            ].map(step => {
                                const StepIcon = step.icon;
                                return (
                                <div className="step-card" key={step.num}>
                                    <div className="step-icon-wrapper">
                                        <StepIcon className="step-icon" />
                                        <span className="step-number">{step.num}</span>
                                    </div>
                                    <h3 style={{color:'white', marginBottom:'0.75rem', fontSize:'1.25rem'}}>{step.title}</h3>
                                    <p style={{color:'var(--slate-300)', fontSize:'0.95rem'}}>{step.desc}</p>
                                </div>
                            )})}
                        </div>
                    </div>
                </section>

                <section id="calculator" className="py-16 bg-white">
                    <div className="container">
                        <div className="flex-between calculator-wrapper">
                            <div className="calculator-content">
                                <div className="badge-tag">FREE TOOL</div>
                                <h2 style={{marginTop: '0.5rem'}}>Material Calculator</h2>
                                <p style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>Estimate materials needed for your projects in seconds. Accurate calculations to avoid wastage and save costs.</p>
                                <ul className="feature-list" style={{marginBottom: '2rem', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                                    <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle style={{color: 'var(--green)'}} /> Brickwork Calculator</li>
                                    <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle style={{color: 'var(--green)'}} /> Concrete Calculator</li>
                                    <li style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle style={{color: 'var(--green)'}} /> Steel Reinforcement</li>
                                </ul>
                            </div>
                            <div className="calculator-image">
                                <div className="calc-mockup" id="calculator-card">
                                    <Calculator className="large-icon text-orange" style={{marginBottom: '1rem', width: 48, height: 48, color: 'var(--primary-orange)'}} />
                                    <h3 style={{marginBottom: '0.25rem'}}>Estimation Calculator</h3>
                                    <p style={{marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-light)'}}>Enter your project details to get instant material estimates.</p>
                                    
                                    <div className="input-group">
                                        <label htmlFor="calc-area">Built-up Area (sq.ft)</label>
                                        <input type="number" id="calc-area" value={calcArea} onChange={(e) => setCalcArea(e.target.value)} placeholder="e.g. 1000" className="form-input" />
                                    </div>
                                    
                                    <div className="input-group">
                                        <label htmlFor="calc-floors">Number of Floors</label>
                                        <input type="number" id="calc-floors" value={calcFloors} onChange={(e) => setCalcFloors(e.target.value)} placeholder="e.g. 1" className="form-input" />
                                    </div>
                                    
                                    <button className="btn-primary w-full" style={{marginTop: '0.5rem'}} onClick={calculateMaterials}>Calculate</button>

                                    {estimates && (
                                        <div id="calc-results" className="calc-results" style={{marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid var(--slate-200)', textAlign:'left'}}>
                                            <h4 style={{marginBottom: '1rem', fontSize: '1.125rem'}}>Estimated Materials</h4>
                                            <div className="result-grid">
                                                <div className="result-item"><span>Cement</span> <strong style={{color:'var(--slate-900)', fontSize:'1.125rem'}}>{estimates.cement.toLocaleString('en-IN')} bags</strong></div>
                                                <div className="result-item"><span>Steel</span> <strong style={{color:'var(--slate-900)', fontSize:'1.125rem'}}>{estimates.steel.toLocaleString('en-IN')} kg</strong></div>
                                                <div className="result-item"><span>Sand</span> <strong style={{color:'var(--slate-900)', fontSize:'1.125rem'}}>{estimates.sand.toLocaleString('en-IN')} cft</strong></div>
                                                <div className="result-item"><span>Bricks</span> <strong style={{color:'var(--slate-900)', fontSize:'1.125rem'}}>{estimates.bricks.toLocaleString('en-IN')} pcs</strong></div>
                                            </div>
                                            <button className="btn-outline w-full" style={{marginTop: '1rem', fontSize: '0.875rem'}} onClick={addAllEstimatesToCart}>
                                                <ShoppingCart style={{width: 14, height: 14, display: 'inline', verticalAlign: 'middle', marginRight: 4}} /> Add Items to Cart
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 dark-section cta-section" style={{backgroundColor: 'var(--slate-900)', padding: '5rem 0', textAlign: 'center'}}>
                    <div className="container">
                        <h2 style={{color: 'white', fontSize: '2.5rem', marginBottom: '1rem'}}>Ready to simplify your sourcing?</h2>
                        <p style={{color: 'var(--slate-300)', fontSize: '1.125rem', maxWidth: 600, margin: '0 auto 2rem auto'}}>Join 10,000+ builders to save up to 25% and get free delivery on your first bulk order.</p>
                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                            <Link href="/auth" className="btn-primary btn-large" style={{textDecoration: 'none'}}>Create Free Account</Link>
                            <Link href="mailto:sales@buildbazaar.com" className="btn-outline btn-large" style={{textDecoration: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.2)'}}>Talk to Sales</Link>
                        </div>
                    </div>
                </section>
            </main>

             <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col-main">
                            <div className="footer-brand">
                                <Building2 style={{marginRight: 8}} /> BuildBazaar
                            </div>
                            <p className="footer-desc">India's most trusted digital marketplace for construction materials. We connect builders with verified suppliers for seamless procurement.</p>
                            <div className="social-links">
                                <a href="#" className="social-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                                <a href="#" className="social-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
                                <a href="#" className="social-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
                                <a href="#" className="social-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                            </div>
                        </div>
                        <div className="footer-col">
                            <h4 className="footer-heading">Products</h4>
                            <div className="footer-links">
                                <a href="#">Cement</a><a href="#">Steel</a><a href="#">Bricks & Blocks</a><a href="#">Sand & Aggregate</a>
                            </div>
                        </div>
                        <div className="footer-col">
                            <h4 className="footer-heading">Company</h4>
                            <div className="footer-links">
                                <Link href="/seller" style={{fontWeight: 600, color: 'var(--primary-orange)'}}>Sell on BuildBazaar</Link>
                                <a href="#">About Us</a>
                                <a href="#">Careers</a>
                                <a href="#">Contact</a>
                            </div>
                        </div>
                        <div className="footer-col">
                            <h4 className="footer-heading">Support</h4>
                            <div className="footer-links">
                                <a href="#">Help Center</a><a href="#">Shipping Policy</a><a href="#">Return Policy</a><a href="#">Track Order</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 BuildBazaar. All rights reserved.</p>
                        <div className="footer-legal">
                            <a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>

            <div className={`cart-overlay ${cartDrawerOpen ? 'active' : ''}`} onClick={() => setCartDrawerOpen(false)}></div>
            <div className={`cart-drawer ${cartDrawerOpen ? 'active' : ''}`}>
                <div className="cart-header">
                    <h3>Your Cart</h3>
                    <button className="icon-btn" onClick={() => setCartDrawerOpen(false)}><X /></button>
                </div>
                <div className="cart-body">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingCart className="empty-icon" />
                            <p>Your cart is empty.</p>
                            <button className="btn-primary" onClick={() => setCartDrawerOpen(false)}>Browse Products</button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-info">
                                    <div className="cart-item-title">{item.title}</div>
                                    <div className="cart-item-price">₹{item.priceCurrent.toLocaleString('en-IN')} x {item.quantity} = ₹{(item.priceCurrent * item.quantity).toLocaleString('en-IN')}</div>
                                    <div className="cart-item-controls">
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        <button className="remove-btn" onClick={() => removeItem(item.id)}>
                                            <Trash2 style={{width:16, height:16}} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="cart-footer">
                    <div className="cart-summary flex-between">
                        <span>Total Amount:</span>
                        <span className="total-price">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <Link href="/checkout" style={{textDecoration: 'none', display: 'block', textAlign: 'center'}} className="btn-primary w-full" onClick={() => setCartDrawerOpen(false)}>Proceed to Checkout</Link>
                </div>
            </div>
            {/* Amazon Style Menu Drawer */}
            <div className={`cart-overlay ${menuDrawerOpen ? 'active' : ''}`} onClick={() => setMenuDrawerOpen(false)} style={{zIndex: 1000}}></div>
            <div style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: '365px', maxWidth: '80%', 
                backgroundColor: 'white', zIndex: 1001, transform: menuDrawerOpen ? 'translateX(0)' : 'translateX(-100%)', 
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column',
                boxShadow: '4px 0 15px rgba(0,0,0,0.2)'
            }}>
                {/* Drawer Header */}
                <div style={{backgroundColor: 'var(--slate-900)', color: 'white', padding: '20px 20px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 800}}>
                    <div style={{width: 32, height: 32, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    {user ? `Hello, ${user.email.split('@')[0]}` : 'Hello, sign in'}
                    <button style={{background: 'none', border: 'none', color: 'white', marginLeft: 'auto', outline: 'none', cursor: 'pointer'}} onClick={() => setMenuDrawerOpen(false)}><X /></button>
                </div>
                
                {/* Drawer Body - Scrollable */}
                <div style={{flex: 1, overflowY: 'auto', paddingBottom: '20px'}}>
                    {/* Section 1 */}
                    <div style={{padding: '15px 0', borderBottom: '1px solid #d5d9d9'}}>
                        <h4 style={{padding: '0 35px 5px 35px', fontSize: '16px', color: '#111', fontWeight: 700, marginBottom: '5px'}}>Trending</h4>
                        <Link href="/products" onClick={() => setMenuDrawerOpen(false)} style={{display: 'block', padding: '13px 35px', color: '#111', textDecoration: 'none', fontSize: '14px'}}>Bestsellers</Link>
                        <Link href="/products" onClick={() => setMenuDrawerOpen(false)} style={{display: 'block', padding: '13px 35px', color: '#111', textDecoration: 'none', fontSize: '14px'}}>New Releases</Link>
                        <Link href="/products" onClick={() => setMenuDrawerOpen(false)} style={{display: 'block', padding: '13px 35px', color: '#111', textDecoration: 'none', fontSize: '14px'}}>Movers and Shakers</Link>
                    </div>

                    {/* Section 2 */}
                    <div style={{padding: '15px 0', borderBottom: '1px solid #d5d9d9'}}>
                        <h4 style={{padding: '0 35px 5px 35px', fontSize: '16px', color: '#111', fontWeight: 700, marginBottom: '5px'}}>Shop by Category</h4>
                        {categories.map(cat => (
                            <Link key={cat.id} href="/products" onClick={() => setMenuDrawerOpen(false)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 35px', color: '#111', textDecoration: 'none', fontSize: '14px'}}>
                                {cat.title}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M9 18l6-6-6-6"></path></svg>
                            </Link>
                        ))}
                    </div>

                    {/* Section 3 */}
                    <div style={{padding: '15px 0'}}>
                        <h4 style={{padding: '0 35px 5px 35px', fontSize: '16px', color: '#111', fontWeight: 700, marginBottom: '5px'}}>Programs & Features</h4>
                        <Link href="/seller" onClick={() => setMenuDrawerOpen(false)} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 35px', color: '#111', textDecoration: 'none', fontSize: '14px'}}>
                            Sell on BuildBazaar
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M9 18l6-6-6-6"></path></svg>
                        </Link>
                        <a href="#calculator" onClick={() => setMenuDrawerOpen(false)} style={{display: 'block', padding: '13px 35px', color: '#111', textDecoration: 'none', fontSize: '14px'}}>
                            Material Calculator
                        </a>
                    </div>
                </div>
            </div>

            {/* Demo Video Modal */}
            {demoModalOpen && (
                <div className="cart-overlay active" style={{zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setDemoModalOpen(false)}>
                    <div className="demo-modal" style={{background: '#fff', padding: '1rem', borderRadius: '1rem', width: '90%', maxWidth: '800px', position: 'relative'}} onClick={(e) => e.stopPropagation()}>
                        <button className="icon-btn" style={{position: 'absolute', top: -40, right: 0, color: 'white'}} onClick={() => setDemoModalOpen(false)}><X /></button>
                        <div style={{position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '0.5rem', overflow: 'hidden'}}>
                            <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}} allow="autoplay; encrypted-media" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
