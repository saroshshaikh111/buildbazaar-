"use client";

import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
    const { cart, updateQuantity, removeItem, totalPrice, cartDrawerOpen, setCartDrawerOpen } = useCart();

    return (
        <>
            <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] transition-opacity duration-300 ${cartDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setCartDrawerOpen(false)}></div>
            <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[10000] shadow-2xl transition-transform duration-500 ease-out transform ${cartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Procurement Basket</h3>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setCartDrawerOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                    <ShoppingCart className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No materials added yet</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-300 transition-colors group" key={item.id}>
                                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        {item.images && item.images[0] ? (
                                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-slate-200" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-900 line-clamp-1">{item.title}</p>
                                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">₹{item.priceCurrent.toLocaleString()} / {item.unit ? item.unit.split(' ')[1] : 'unit'}</p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center bg-slate-50 rounded-lg p-1">
                                                <button className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-slate-400" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                                <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                <button className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md text-slate-400" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                            </div>
                                            <button className="p-2 text-slate-300 hover:text-red-500 transition-colors" onClick={() => removeItem(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 space-y-4">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Procurement Total</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <Link 
                            href="/checkout" 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-3 transition-all no-underline shadow-xl shadow-slate-900/20 active:scale-[0.98]" 
                            onClick={() => setCartDrawerOpen(false)}
                        >
                            FINALIZE PROCUREMENT
                        </Link>
                        <p className="text-[9px] text-center text-slate-400 uppercase font-bold tracking-widest">Ships to site in 48-72 hours</p>
                    </div>
                </div>
            </div>
        </>
    );
}
