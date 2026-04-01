"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Truck, Settings, LogOut, Building2 } from 'lucide-react';

export default function SellerLayout({ children }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
        { name: 'My Products', path: '/seller/products', icon: Package },
        { name: 'Orders', path: '/seller/orders', icon: Truck },
        { name: 'Settings', path: '/seller/settings', icon: Settings },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--slate-50)' }}>
            
            {/* Admin Sidebar */}
            <aside style={{ width: '260px', backgroundColor: 'white', borderRight: '1px solid var(--slate-200)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--slate-200)' }}>
                    <Link href="/" style={{ color: 'var(--slate-900)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
                        <Building2 className="brand-icon" style={{width: 24, height: 24}} /> BuildBazaar
                    </Link>
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'var(--emerald-50)', color: 'var(--emerald-600)', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textAlign: 'center' }}>
                        Seller Portal
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', textDecoration: 'none',
                                backgroundColor: isActive ? 'var(--orange-50)' : 'transparent',
                                color: isActive ? 'var(--primary-orange)' : 'var(--slate-600)',
                                fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.2s'
                            }}>
                                <Icon style={{ width: 20, height: 20 }} /> {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--slate-200)' }}>
                    <Link href="/auth" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--slate-500)', textDecoration: 'none', fontWeight: 500 }}>
                        <LogOut style={{ width: 20, height: 20 }} /> Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main style={{ flex: 1 }}>
                {/* Top Header */}
                <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--slate-200)', padding: '1rem 2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-900)' }}>Ramesh Traders</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Verified Supplier</div>
                        </div>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--orange-100)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            RT
                        </div>
                    </div>
                </header>
                
                {/* Page Content injected here */}
                <div style={{ padding: '2rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
