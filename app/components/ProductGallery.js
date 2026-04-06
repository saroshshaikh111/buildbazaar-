'use client';

import { useState } from 'react';

// Foolproof Fallback SVG for Industrial Pro materials
const IndustrialFallback = ({ text }) => (
    <div style={{
        width: '100%', 
        height: '100%', 
        backgroundColor: '#f1f5f9', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        textAlign: 'center',
        border: '2px dashed #cbd5e1',
        borderRadius: '1rem'
    }}>
        <div style={{width: 48, height: 48, backgroundColor: '#cbd5e1', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8Z"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
        </div>
        <div style={{fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
            {text || 'Industrial Preview (Procurement Staging)'}
        </div>
    </div>
);

export default function ProductGallery({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [error, setError] = useState(false);

    if (!images || images.length === 0) return <IndustrialFallback />;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {/* Main Stage */}
            <div style={{
                position: 'relative', 
                aspectRatio: '1/1', 
                backgroundColor: '#fff', 
                border: '1px solid #f1f5f9', 
                borderRadius: '1.5rem', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                {error ? (
                    <IndustrialFallback />
                ) : (
                    <img 
                        src={images[activeIndex]} 
                        alt="Product view"
                        onError={() => setError(true)}
                        style={{
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain',
                            transition: 'transform 0.5s'
                        }}
                    />
                )}
                
                {images.length > 1 && (
                    <div style={{position: 'absolute', bottom: '1.5rem', display: 'flex', gap: '8px'}}>
                        {images.map((_, i) => (
                            <div key={i} style={{
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                backgroundColor: i === activeIndex ? '#f97316' : '#e2e8f0',
                                transition: '0.3s'
                            }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div style={{display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px'}}>
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => { setActiveIndex(idx); setError(false); }}
                            style={{
                                width: '72px', 
                                height: '72px', 
                                flexShrink: 0,
                                borderRadius: '12px', 
                                border: idx === activeIndex ? '2px solid #f97316' : '2px solid transparent',
                                backgroundColor: '#fff',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <img src={img} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDEwYzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4WiIvPjwvc3ZnPg=='} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
