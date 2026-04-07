"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Package, TrendingUp, DollarSign, Clock, CheckCircle, Truck, PackageOpen, Plus, Image as ImageIcon, X, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [newProduct, setNewProduct] = useState({
        title: '', brand: '', category: 'Cement', priceCurrent: '', priceOld: '', unit: '', file: null
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth');
            return;
        }

        async function fetchData() {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
                    supabase.from('products').select('*').order('created_at', { ascending: false })
                ]);
                
                if (ordersRes.data) setOrders(ordersRes.data);
                if (productsRes.data) setProducts(productsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        
        if (user) fetchData();
    }, [user, authLoading, router]);

    // Derived Metrics
    const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'Processing').length;

    const handleStatusUpdate = async (orderId, newStatus) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (!error) {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } else {
            alert("Error updating status: " + error.message);
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewProduct(prev => ({ ...prev, file: e.target.files[0] }));
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setUploading(true);
        let imageUrl = '';

        try {
            if (newProduct.file) {
                const fileExt = newProduct.file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, newProduct.file);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);
                
                imageUrl = publicUrlData.publicUrl;
            }

            const payload = {
                title: newProduct.title,
                brand: newProduct.brand,
                category: newProduct.category,
                "priceCurrent": Number(newProduct.priceCurrent),
                "priceOld": newProduct.priceOld ? Number(newProduct.priceOld) : null,
                unit: newProduct.unit,
                verified: true
            };
            
            // Only update images array if a newly uploaded image URL was generated
            if (imageUrl) {
                payload.images = [imageUrl];
            } else if (!editingProductId) {
                payload.images = [];
            }

            if (editingProductId) {
                // Update Existing
                const { data: updatedData, error: dbError } = await supabase.from('products').update(payload).eq('id', editingProductId).select();
                if (dbError) throw dbError;
                if (updatedData) {
                    setProducts(products.map(p => p.id === editingProductId ? updatedData[0] : p));
                }
            } else {
                // Insert New
                payload.id = 'v_' + Math.random().toString(36).substring(2, 9);
                const { data: insertedData, error: dbError } = await supabase.from('products').insert([payload]).select();
                if (dbError) throw dbError;
                if (insertedData) {
                    setProducts([insertedData[0], ...products]);
                }
            }
            
            setShowModal(false);
            setEditingProductId(null);
            setNewProduct({ title: '', brand: '', category: 'Cement', priceCurrent: '', priceOld: '', unit: '', file: null });

        } catch (err) {
            alert(err.message || 'Error uploading product.');
        } finally {
            setUploading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '48px', height: '48px', border: '4px solid #0f172a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, trend, colorCode }) => (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', flex: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
                    <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>{value}</div>
                </div>
                <div style={{ padding: '0.75rem', background: `${colorCode}10`, borderRadius: '1rem', color: colorCode }}>
                    <Icon style={{ width: 24, height: 24 }} />
                </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>{trend}</div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '"Outfit", sans-serif', color: '#0f172a' }}>
            {/* Vendor Navbar */}
            <nav style={{ backgroundColor: '#0f172a', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{width: '24px', height: '24px', backgroundColor: '#f97316', borderRadius: '6px'}}></div>
                        BuildBazaar <span style={{ color: '#94a3b8', fontWeight: 500 }}>| Vendor Hub</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href="/" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.1)' }}>View Storefront</Link>
                </div>
            </nav>

            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem' }}>
                {/* Sidebar Navigation */}
                <div style={{ width: '240px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'sticky', top: '100px' }}>
                        <button onClick={() => setActiveTab('overview')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === 'overview' ? '#e2e8f0' : 'transparent', color: activeTab === 'overview' ? '#0f172a' : '#64748b', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: '1rem' }}>
                            <TrendingUp style={{ width: 20, height: 20 }} /> Business Overview
                        </button>
                        <button onClick={() => setActiveTab('orders')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === 'orders' ? '#e2e8f0' : 'transparent', color: activeTab === 'orders' ? '#0f172a' : '#64748b', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: '1rem' }}>
                            <PackageOpen style={{ width: 20, height: 20 }} /> Order Fulfillment {pendingCount > 0 && <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>{pendingCount}</span>}
                        </button>
                        <button onClick={() => setActiveTab('inventory')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '12px', border: 'none', background: activeTab === 'inventory' ? '#e2e8f0' : 'transparent', color: activeTab === 'inventory' ? '#0f172a' : '#64748b', fontWeight: 700, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: '1rem' }}>
                            <Package style={{ width: 20, height: 20 }} /> Manage Inventory
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'overview' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Global Analytics</h1>
                                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Live breakdown of platform metrics and incoming orders.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                                <StatCard title="Total Platform Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} icon={DollarSign} trend="Real-time gross metric" colorCode="#10b981" />
                                <StatCard title="Total Active Products" value={products.length} icon={Package} trend="Live catalog size" colorCode="#3b82f6" />
                                <StatCard title="Pending Fulfillment" value={pendingCount} icon={Clock} trend={pendingCount > 0 ? "Requires attention" : "All orders fulfilled"} colorCode="#f59e0b" />
                            </div>
                            
                            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>Recent Order Activity</h3>
                                {orders.slice(0, 5).map(order => (
                                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div>
                                            <span style={{ fontWeight: 800, color: '#0f172a' }}>{order.customer_name}</span>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>{new Date(order.created_at).toLocaleDateString()} • {order.project_name || 'Standard Site'}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontWeight: 800, color: '#0f172a' }}>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                                            <div style={{ fontSize: '0.85rem', color: order.status === 'Processing' ? '#f59e0b' : '#10b981', fontWeight: 700, marginTop: '0.25rem' }}>{order.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                             <div style={{ marginBottom: '2rem' }}>
                                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Fulfillment Queue</h1>
                                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage and progress live orders across the network.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {orders.map(order => (
                                    <div key={order.id} style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', gap: '2rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Order ID</div>
                                                    <div style={{ fontWeight: 700, fontFamily: 'monospace' }}>{order.id.split('-')[0].toUpperCase()}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Value</div>
                                                    <div style={{ fontWeight: 800 }}>₹{Number(order.total_amount).toLocaleString('en-IN')}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Delivery Site</div>
                                                    <div style={{ fontWeight: 600 }}>{order.project_name || 'Standard Site'}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <select 
                                                    value={order.status || 'Processing'}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontWeight: 700, outline: 'none', cursor: 'pointer', background: 'white' }}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Dispatched">Dispatched</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>Order Items Manifest</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                                {order.order_items?.map(item => (
                                                    <div key={item.id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.title}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Qty: {item.quantity} x ₹{Number(item.price).toLocaleString()}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>Inventory Catalog</h1>
                                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage your storefront products and pricing.</p>
                                </div>
                                <button onClick={() => { setEditingProductId(null); setNewProduct({ title: '', brand: '', category: 'Cement', priceCurrent: '', priceOld: '', unit: '', file: null }); setShowModal(true); }} style={{ background: '#f97316', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }}>
                                    <Plus style={{ width: 20, height: 20 }} /> Add New Product
                                </button>
                            </div>

                            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Product Details</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Current Price</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Unit</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(prod => (
                                            <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {prod.images && prod.images[0] ? (
                                                            <img src={prod.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                                        ) : (
                                                            <ImageIcon style={{ width: 20, height: 20, color: '#94a3b8' }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{prod.title}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{prod.brand}</div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', fontWeight: 600, color: '#64748b' }}>{prod.category}</td>
                                                <td style={{ padding: '1rem', fontWeight: 900, color: '#0f172a' }}>₹{Number(prod.priceCurrent).toLocaleString()}</td>
                                                <td style={{ padding: '1rem', fontWeight: 600, color: '#64748b' }}>{prod.unit}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingProductId(prod.id);
                                                            setNewProduct({
                                                                title: prod.title,
                                                                brand: prod.brand,
                                                                category: prod.category || 'Cement',
                                                                priceCurrent: prod.priceCurrent,
                                                                priceOld: prod.priceOld || '',
                                                                unit: prod.unit,
                                                                file: null
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                        style={{ background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', padding: '0.4rem 1rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Product Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{editingProductId ? 'Edit Material' : 'List New Material'}</h2>
                            <button onClick={() => { setShowModal(false); setEditingProductId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}><X style={{ color: '#64748b' }} /></button>
                        </div>
                        <form onSubmit={handleAddProduct} style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Product Title</label>
                                    <input required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} type="text" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', fontWeight: 600 }} placeholder="e.g. UltraTech Weather Plus Cement" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Brand</label>
                                    <input required value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} type="text" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', fontWeight: 600 }} placeholder="e.g. UltraTech" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Category</label>
                                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', fontWeight: 600, background: 'white' }}>
                                        <option>Cement</option>
                                        <option>Steel & TMT</option>
                                        <option>Bricks & Blocks</option>
                                        <option>Plumbing</option>
                                        <option>Electricals</option>
                                        <option>Paint & Finishes</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Current Price (₹)</label>
                                    <input required value={newProduct.priceCurrent} onChange={e => setNewProduct({...newProduct, priceCurrent: e.target.value})} type="number" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', fontWeight: 600 }} placeholder="450" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Selling Unit</label>
                                    <input required value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} type="text" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', fontWeight: 600 }} placeholder="e.g. per bag (50kg)" />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Product Default Image {editingProductId && <span style={{color: '#94a3b8', fontWeight: 500}}>(Leave empty to keep existing image)</span>}</label>
                                    <input required={!editingProductId} type="file" accept="image/*" onChange={handleFileUpload} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px dashed #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" onClick={() => { setShowModal(false); setEditingProductId(null); }} style={{ flex: 1, padding: '1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={uploading} style={{ flex: 2, padding: '1rem', borderRadius: '0.75rem', border: 'none', background: '#f97316', color: 'white', fontWeight: 800, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
                                    {uploading ? 'Processing...' : (editingProductId ? 'Save Changes' : 'Publish Material')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
