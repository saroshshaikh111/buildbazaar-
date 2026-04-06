'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Main High-Res View */}
            <div className="relative aspect-square bg-[#f9f9f9] border border-slate-200 rounded-xl overflow-hidden group">
                <img 
                    src={images[activeIndex]} 
                    alt="Product main view"
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Navigation Arrows (Only if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${idx === activeIndex ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
