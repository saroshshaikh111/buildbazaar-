"use client";

import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Trash2, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
    const { cart, updateQuantity, removeItem, totalPrice, cartDrawerOpen, setCartDrawerOpen } = useCart();

    return (
        <>
            <div 
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', 
                    zIndex: 9999, transition: 'opacity 0.3s ease',
                    opacity: cartDrawerOpen ? 1 : 0, 
                    pointerEvents: cartDrawerOpen ? 'auto' : 'none'
                }} 
                onClick={() => setCartDrawerOpen(false)}
            ></div>

            <div 
                style={{
                    position: 'fixed', right: 0, top: 0, height: '100%', width: '100%', maxWidth: '450px', 
                    backgroundColor: '#fff', zIndex: 10000, boxShadow: '-25px 0 50px rgba(15, 23, 42, 0.15)', 
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: cartDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
                    display: 'flex', flexDirection: 'column'
                }}
            >
                {/* Header */}
                <div style={{padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1}}>
                        <div style={{width: '2.5rem', height: '2.5rem', backgroundColor: '#0f172a', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <ShoppingCart style={{width: 20, height: 20, color: '#fff'}} />
                        </div>
                        <h3 style={{fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0}}>Procurement Basket</h3>
                    </div>
                    <button onClick={() => setCartDrawerOpen(false)} style={{padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <X style={{width: 24, height: 24, color: '#94a3b8'}} />
                    </button>
                </div>

                {/* Body */}
                <div style={{flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {cart.length === 0 ? (
                        <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 'auto'}}>
                            <div style={{width: '4rem', height: '4rem', backgroundColor: '#f8fafc', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'}}>
                                <ShoppingCart style={{width: 32, height: 32, color: '#e2e8f0'}} />
                            </div>
                            <p style={{color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.75rem', margin: 0}}>No materials added yet</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', borderRadius: '1.25rem', border: '2px solid #f1f5f9'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                                    <div style={{flex: 1, paddingRight: '1rem'}}>
                                        <p style={{fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem 0'}}>{item.title}</p>
                                        <p style={{fontSize: '0.65rem', fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0}}>
                                            ₹{item.priceCurrent.toLocaleString()} / {item.unit ? item.unit.split(' ')[1] : 'unit'}
                                        </p>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} style={{background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem'}}>
                                        <Trash2 style={{width: 18, height: 18}} />
                                    </button>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.25rem', alignSelf: 'flex-start'}}>
                                    <button onClick={() => updateQuantity(item.id, -1)} style={{width: '32px', height: '32px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: 900, cursor: 'pointer'}}>-</button>
                                    <span style={{width: '40px', textAlign: 'center', fontSize: '1rem', fontWeight: 900, color: '#0f172a'}}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} style={{width: '32px', height: '32px', border: 'none', background: 'transparent', color: '#64748b', fontWeight: 900, cursor: 'pointer'}}>+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div style={{padding: '1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem'}}>
                        <span style={{fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em'}}>Procurement Total</span>
                        <span style={{fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em'}}>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    
                    <Link 
                        href="/checkout" 
                        onClick={() => setCartDrawerOpen(false)}
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', height: '4rem', backgroundColor: '#0f172a', color: '#fff', borderRadius: '1rem', fontWeight: 900, letterSpacing: '0.05em', textDecoration: 'none', transition: '0.2s', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.4)'}}
                    >
                        FINALIZE PROCUREMENT
                    </Link>
                    
                    <p style={{fontSize: '0.6rem', textAlign: 'center', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.15em', marginTop: '1rem', marginBottom: 0}}>
                        Ships to site in 48-72 hours
                    </p>
                </div>
            </div>
        </>
    );
}
