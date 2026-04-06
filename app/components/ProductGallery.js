'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) return (
        <div style={{aspectRatio: '1/1', backgroundColor: '#f8fafc', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontWeight: 900}}>
            NO MEDIA
        </div>
    );

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
                <img 
                    src={images[activeIndex]} 
                    alt="Product view"
                    style={{
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
                
                {/* Navigation Pips (Overlay) */}
                {images.length > 1 && (
                    <div style={{position: 'absolute', bottom: '1.5rem', display: 'flex', gap: '8px'}}>
                        {images.map((_, i) => (
                            <div key={i} style={{
                                width: '6px', 
                                height: '6px', 
                                borderRadius: 'full', 
                                backgroundColor: i === activeIndex ? '#f97316' : '#e2e8f0',
                                transition: 'all 0.3s'
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
                            onClick={() => setActiveIndex(idx)}
                            style={{
                                width: '72px', 
                                height: '72px', 
                                flexShrink: 0,
                                borderRadius: '12px', 
                                border: idx === activeIndex ? '2px solid #f97316' : '2px solid transparent',
                                backgroundColor: '#fff',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                padding: '4px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <img src={img} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
