"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User, Package } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

export default function MobileNav() {
    const pathname = usePathname();
    const { totalItems, setCartDrawerOpen } = useCart();

    const tabs = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Shop', href: '/products', icon: Package },
        { name: 'Search', href: '/products?search=', icon: Search },
        { name: 'Account', href: '/seller', icon: User },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-around',
            itemsCenter: 'center',
            paddingBottom: 'env(safe-area-inset-bottom)',
            zIndex: 1000,
            boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
        }} className="mobile-only-nav">
            <style>{`
                @media (min-width: 768px) {
                    .mobile-only-nav { display: none !important; }
                }
                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    text-decoration: none;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    transition: all 0.2s;
                    width: 20%;
                    gap: 4px;
                }
                .nav-item.active {
                    color: #f97316;
                }
                .nav-icon {
                    width: 24px;
                    height: 24px;
                }
            `}</style>
            
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;
                return (
                    <Link key={tab.name} href={tab.href} className={`nav-item ${isActive ? 'active' : ''}`}>
                        <Icon className="nav-icon" strokeWidth={isActive ? 3 : 2} />
                        <span>{tab.name}</span>
                    </Link>
                );
            })}

            {/* Cart Trigger */}
            <button 
                onClick={() => setCartDrawerOpen(true)}
                className="nav-item"
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
            >
                <div style={{ position: 'relative' }}>
                    <ShoppingCart className="nav-icon" />
                    {totalItems > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '0.6rem',
                            padding: '2px 5px',
                            borderRadius: '10px',
                            minWidth: '16px',
                            textAlign: 'center',
                            border: '2px solid white'
                        }}>
                            {totalItems}
                        </span>
                    )}
                </div>
                <span>Cart</span>
            </button>
        </nav>
    );
}
