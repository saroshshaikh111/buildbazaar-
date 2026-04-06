'use client';

import { useCart } from '@/app/context/CartContext';
import { ShoppingBag, Calculator, ShieldCheck } from 'lucide-react';

export default function CheckoutSummary() {
    const { cart, totalPrice } = useCart();
    
    // Industrial Tax Breakdown (18% GST)
    const basePrice = totalPrice / 1.18;
    const totalGst = totalPrice - basePrice;
    const cgst = totalGst / 2;
    const sgst = totalGst / 2;

    return (
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <Calculator className="w-6 h-6 text-orange-500" />
                Procurement Summary
            </h2>

            <div className="space-y-4 mb-8">
                {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                QTY: {item.quantity} {item.unit.split(' ')[0]}
                            </p>
                        </div>
                        <p className="text-sm font-black text-slate-900">
                            ₹{(item.priceCurrent * item.quantity).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            <div className="space-y-3 py-6 border-y border-dashed border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Taxable Value</span>
                    <span>₹{basePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>CGST (9%)</span>
                    <span>₹{cgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>SGST (9%)</span>
                    <span>₹{sgst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="pt-6">
                <div className="flex justify-between items-baseline mb-8">
                    <span className="text-sm font-black uppercase text-slate-900 tracking-tighter">Grand Total</span>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">
                        ₹{totalPrice.toLocaleString()}
                    </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <p className="text-[10px] leading-tight text-emerald-700 font-bold uppercase tracking-wider">
                        Price includes building cess and site logistics overhead.
                    </p>
                </div>
            </div>
        </div>
    );
}
