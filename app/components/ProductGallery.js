'use client';

import { useState } from 'react';

// Foolproof Dynamic Fallback for Industrial Pro materials
const IndustrialFallback = ({ brand, text }) => (
    <div style={{
        width: '100%', 
        height: '100%', 
        backgroundColor: '#f8fafc', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2.5rem',
        textAlign: 'center',
        border: '2px dashed #e2e8f0',
        borderRadius: '2rem'
    }}>
        <div style={{width: 56, height: 56, backgroundColor: '#f1f5f9', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8Z"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
        </div>
        <div style={{fontSize: '0.65rem', fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px'}}>
            {brand || 'Industrial Pro'}
        </div>
        <div style={{fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
            {text || 'Material Identity Preview'}
        </div>
    </div>
);

export default function ProductGallery({ images, brand, productTitle }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [error, setError] = useState(false);

    if (!images || images.length === 0) return <IndustrialFallback brand={brand} text={productTitle} />;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {/* Main Stage */}
            <div style={{
                position: 'relative', 
                aspectRatio: '1/1', 
                backgroundColor: '#fff', 
                border: '1px solid #f1f5f9', 
                borderRadius: '2rem', 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2.5rem',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
                {error ? (
                    <IndustrialFallback brand={brand} text={productTitle} />
                ) : (
                    <img 
                        src={images[activeIndex]} 
                        alt="Product view"
                        onError={() => setError(true)}
                        style={{
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain',
                            transition: 'transform 0.5s Ease'
                        }}
                    />
                )}
                
                {images.length > 1 && (
                    <div style={{position: 'absolute', bottom: '2rem', display: 'flex', gap: '10px'}}>
                        {images.map((_, i) => (
                            <div key={i} style={{
                                width: '8px', 
                                height: '8px', 
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
                <div style={{display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none'}}>
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => { setActiveIndex(idx); setError(false); }}
                            style={{
                                width: '84px', 
                                height: '84px', 
                                flexShrink: 0,
                                borderRadius: '1rem', 
                                border: idx === activeIndex ? '2.5px solid #f97316' : '2.5px solid transparent',
                                backgroundColor: '#f8fafc',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                padding: '6px',
                                transition: '0.2s transform'
                            }}
                        >
                            <img src={img} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem'}} onError={(e) => e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDEwYzAgNC40MTgtMy41ODIgOC04IDhzLTgtMy41ODItOC04IDMuNTgyLTggOC04IDggMy41ODIgOCA4WiIvPjwvc3ZnPg=='} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
