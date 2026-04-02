'use client';

import { useState } from 'react';
import { Calculator, Ruler, Hash, Info, RefreshCw } from 'lucide-react';

export default function MaterialCalculator({ category, unit }) {
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [thickness, setThickness] = useState('');
    const [result, setResult] = useState(null);

    const calculate = () => {
        const l = parseFloat(length);
        const w = parseFloat(width);
        const t = parseFloat(thickness) || 0;

        if (!l || !w) return;

        let total = 0;
        let explanation = "";

        if (category === 'Cement') {
            // Approx: Volume in cu.ft * 0.88 bags per cu.ft for 1:2:4 mix
            const volumeCuFt = (l * w * (t / 12));
            total = Math.ceil(volumeCuFt * 0.88);
            explanation = `Based on a standard 1:2:4 concrete mix for a ${t}" thick slab.`;
        } else if (category === 'Bricks & Blocks') {
            // Approx: 50 bricks per 10 sq.ft for 4.5" wall
            const area = l * w;
            const multiplier = t > 5 ? 10 : 5; // 9" wall vs 4.5" wall
            total = Math.ceil(area * multiplier);
            explanation = `Estimated for a ${t > 5 ? '9"' : '4.5"'} brick wall masonry.`;
        } else if (category === 'Paint & Finishes') {
            // Approx: 60 sq.ft per liter (double coat)
            const area = l * w;
            total = Math.ceil(area / 60);
            explanation = "Calculated for a standard double-coat exterior/interior finish.";
        } else {
            // Generic Area Calculation
            total = l * w;
            explanation = "Calculated based on total surface area.";
        }

        setResult({ total, explanation });
    };

    const reset = () => {
        setLength('');
        setWidth('');
        setThickness('');
        setResult(null);
    };

    return (
        <div className="bg-orange-50 rounded-3xl border-2 border-orange-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-600 p-2 rounded-xl text-white">
                    <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 leading-tight">
                    {category} Quantity Estimator
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-orange-700 uppercase tracking-wider ml-1">Length (ft)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border-2 border-orange-200 rounded-2xl h-12 px-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-bold"
                        />
                        <Ruler className="absolute right-4 top-3.5 w-5 h-5 text-orange-200" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-orange-700 uppercase tracking-wider ml-1">Width (ft)</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="0"
                            className="w-full bg-white border-2 border-orange-200 rounded-2xl h-12 px-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-bold"
                        />
                        <Ruler className="absolute right-4 top-3.5 w-5 h-5 text-orange-200" />
                    </div>
                </div>
                {category !== 'Paint & Finishes' && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-orange-700 uppercase tracking-wider ml-1">Thickness (in)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={thickness}
                                onChange={(e) => setThickness(e.target.value)}
                                placeholder="0"
                                className="w-full bg-white border-2 border-orange-200 rounded-2xl h-12 px-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-bold"
                            />
                            <Hash className="absolute right-4 top-3.5 w-5 h-5 text-orange-200" />
                        </div>
                    </div>
                )}
            </div>

            {!result ? (
                <button 
                    onClick={calculate}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 rounded-2xl font-bold transition-all shadow-md shadow-orange-200 active:scale-[0.98]"
                >
                    Calculate Needed Amount
                </button>
            ) : (
                <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-slate-500 text-sm font-bold uppercase mb-1">Recommended Order</p>
                            <div className="text-3xl font-black text-slate-900">
                                {result.total} <span className="text-lg font-bold text-slate-400 font-sans italic">{unit.split(' ')[1] || 'Units'}</span>
                            </div>
                        </div>
                        <button 
                            onClick={reset}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-orange-600 transition-colors"
                            title="Reset Calculator"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <Info className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <p className="text-xs text-slate-600 font-medium">
                            {result.explanation} <br/>
                            <span className="text-slate-400 italic">Values are estimates; consult your contractor for precision.</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
