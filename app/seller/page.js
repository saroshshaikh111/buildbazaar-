"use client";
import { Package, TrendingUp, DollarSign, Clock } from 'lucide-react';

export default function SellerDashboard() {
    
    // Quick stat generator
    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--slate-200)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: 500 }}>{title}</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.5rem' }}>{value}</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--slate-50)', borderRadius: '0.5rem', color: 'var(--primary-orange)' }}>
                    <Icon style={{ width: 24, height: 24 }} />
                </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--emerald-600)', fontWeight: 500 }}>{trend}</div>
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>Business Overview</h1>
                <p style={{ color: 'var(--slate-500)' }}>Here's what's happening in your hardware store today.</p>
            </div>

            {/* Quick Analytics */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Total Revenue" value="₹2,45,000" icon={DollarSign} trend="+12% from last month" />
                <StatCard title="Active Materials" value="34" icon={Package} trend="+2 new products" />
                <StatCard title="Total Orders" value="128" icon={TrendingUp} trend="+5% from last month" />
                <StatCard title="Pending Fulfillment" value="6" icon={Clock} trend="Requires your attention" />
            </div>

            {/* Pending actions placeholder */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--slate-200)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
                <div style={{ color: 'var(--slate-500)', textAlign: 'center', padding: '3rem 0' }}>
                    <TrendingUp style={{ width: 48, height: 48, color: 'var(--slate-200)', margin: '0 auto 1rem auto' }} />
                    <p>Connect your first inventory items in the "My Products" tab to start accepting live orders!</p>
                </div>
            </div>
        </div>
    );
}
