"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    
    // Load exactly once on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('buildbazaar_cart');
        if (savedCart) {
            try { setCart(JSON.parse(savedCart)); } catch (e) {}
        }
    }, []);

    // Save on every change
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('buildbazaar_cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prev, { ...product, quantity }];
        });
        setCartDrawerOpen(true);
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => {
            const newCart = prev.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: Math.max(0, item.quantity + delta) };
                }
                return item;
            }).filter(item => item.quantity > 0);
            
            // Clear local storage if empty
            if (newCart.length === 0) {
                localStorage.removeItem('buildbazaar_cart');
            }
            return newCart;
        });
    };

    const removeItem = (id) => {
         setCart(prev => {
             const newCart = prev.filter(item => item.id !== id);
             if (newCart.length === 0) localStorage.removeItem('buildbazaar_cart');
             return newCart;
         });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('buildbazaar_cart');
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.priceCurrent * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart, setCart, addToCart, updateQuantity, removeItem, clearCart,
            totalItems, totalPrice,
            cartDrawerOpen, setCartDrawerOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
