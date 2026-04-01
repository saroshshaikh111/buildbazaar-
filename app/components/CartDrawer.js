"use client";

import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
    const { cart, updateQuantity, removeItem, totalPrice, cartDrawerOpen, setCartDrawerOpen } = useCart();

    return (
        <>
            <div className={`cart-overlay ${cartDrawerOpen ? 'active' : ''}`} onClick={() => setCartDrawerOpen(false)} style={{zIndex: 9999}}></div>
            <div className={`cart-drawer ${cartDrawerOpen ? 'active' : ''}`} style={{zIndex: 10000}}>
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
        </>
    );
}
