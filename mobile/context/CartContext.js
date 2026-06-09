import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    
    // Load exactly once on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = await AsyncStorage.getItem('buildbazaar_cart');
                if (savedCart) {
                    setCart(JSON.parse(savedCart));
                }
            } catch (e) {
                console.error("Failed to load cart from AsyncStorage:", e);
            }
        };
        loadCart();
    }, []);

    // Helper to sync state to storage
    const saveCart = async (newCart) => {
        try {
            if (newCart.length > 0) {
                await AsyncStorage.setItem('buildbazaar_cart', JSON.stringify(newCart));
            } else {
                await AsyncStorage.removeItem('buildbazaar_cart');
            }
        } catch (e) {
            console.error("Failed to save cart to AsyncStorage:", e);
        }
    };

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            let updated;
            if (existingItem) {
                updated = prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            } else {
                updated = [...prev, { ...product, quantity }];
            }
            saveCart(updated);
            return updated;
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => {
            const updated = prev.map(item => {
                if (item.id === id) {
                    return { ...item, quantity: Math.max(0, item.quantity + delta) };
                }
                return item;
            }).filter(item => item.quantity > 0);
            saveCart(updated);
            return updated;
        });
    };

    const removeItem = (id) => {
         setCart(prev => {
             const updated = prev.filter(item => item.id !== id);
             saveCart(updated);
             return updated;
         });
    };

    const clearCart = () => {
        setCart([]);
        AsyncStorage.removeItem('buildbazaar_cart');
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.priceCurrent * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart, setCart, addToCart, updateQuantity, removeItem, clearCart,
            totalItems, totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        return {
            cart: [],
            setCart: () => {},
            addToCart: () => {},
            updateQuantity: () => {},
            removeItem: () => {},
            clearCart: () => {},
            totalItems: 0,
            totalPrice: 0
        };
    }
    return context;
}
