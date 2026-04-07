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
        <div style={{ backgroundColor: '#fff7ed', borderRadius: '1.5rem', border: '2px solid #ffedd5', padding: '1.5rem 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#ea580c', padding: '0.5rem', borderRadius: '0.75rem', color: 'white', display: 'flex' }}>
                    <Calculator style={{ width: 20, height: 20 }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7c2d12', margin: 0, lineHeight: 1.2 }}>
                    {category} Quantity Estimator
                </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: category !== 'Paint & Finishes' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Length (ft)</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="number" 
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            placeholder="0"
                            style={{ width: '100%', backgroundColor: 'white', border: '2px solid #fed7aa', borderRadius: '1rem', height: '3rem', padding: '0 1rem', outline: 'none', fontWeight: 800, fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Width (ft)</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="number" 
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="0"
                            style={{ width: '100%', backgroundColor: 'white', border: '2px solid #fed7aa', borderRadius: '1rem', height: '3rem', padding: '0 1rem', outline: 'none', fontWeight: 800, fontSize: '1rem', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
                {category !== 'Paint & Finishes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thickness (in)</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="number" 
                                value={thickness}
                                onChange={(e) => setThickness(e.target.value)}
                                placeholder="0"
                                style={{ width: '100%', backgroundColor: 'white', border: '2px solid #fed7aa', borderRadius: '1rem', height: '3rem', padding: '0 1rem', outline: 'none', fontWeight: 800, fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {!result ? (
                <button 
                    onClick={calculate}
                    style={{ width: '100%', backgroundColor: '#ea580c', color: 'white', height: '3.5rem', borderRadius: '1rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', border: 'none', transition: '0.2s', boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.2)' }}
                >
                    Calculate Needed Amount
                </button>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '2px solid #fed7aa', animation: 'fade-in 0.3s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem', margin: 0 }}>Recommended Order</p>
                            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>
                                {result.total} <span style={{ fontSize: '1.125rem', color: '#94a3b8', fontStyle: 'italic' }}>{unit.split(' ')[1] || 'Units'}</span>
                            </div>
                        </div>
                        <button 
                            onClick={reset}
                            style={{ padding: '0.5rem', backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            title="Reset Calculator"
                        >
                            <RefreshCw style={{ width: 20, height: 20 }} />
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                        <Info style={{ width: 20, height: 20, color: '#fb923c', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                            {result.explanation} <br/>
                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Values are estimates; consult your contractor for precision.</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
