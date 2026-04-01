"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const mockCategories = ['Cement', 'Steel & TMT', 'Bricks & Blocks', 'Sand & Aggregates', 'Paint & Finishes', 'Plumbing', 'Electricals', 'Wood & Plywood'];

export default function SellerProducts() {
    const [products, setProducts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '', brand: '', category: 'Cement', priceCurrent: '',
        priceOld: '', unit: '', tag: '', discount: ''
    });

    // Fetch the seller's active products
    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (data) setProducts(data);
        };
        fetchProducts();
    }, []);

    // Create a new product in the live Supabase Database
    const handleAddProduct = async (e) => {
        e.preventDefault();
        
        // Generate a random ID since our initial schema uses VARCHAR instead of pure UUID for primary keys
        const newId = 'p_vendor_' + Math.random().toString(36).substr(2, 9);
        
        const payload = {
            id: newId,
            title: formData.title,
            brand: formData.brand,
            category: formData.category,
            priceCurrent: parseFloat(formData.priceCurrent),
            priceOld: formData.priceOld ? parseFloat(formData.priceOld) : null,
            unit: formData.unit,
            tag: formData.tag || null,
            discount: formData.discount || null,
            verified: true // Assuming self-uploaded is verified in this prototype
        };

        try {
            const { error } = await supabase.from('products').insert([payload]);
            if (error) {
                alert("Failed to insert into live Database: " + error.message);
                return;
            }
            // Success! Immediately reflect the new item in the frontend table
            setProducts([payload, ...products]);
            setIsAdding(false);
            setFormData({title:'', brand:'', category:'Cement', priceCurrent:'', priceOld:'', unit:'', tag:'', discount:''});
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>My Products</h1>
                    <p style={{ color: 'var(--slate-500)' }}>Manage your inventory and live marketplace pricing.</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsAdding(!isAdding)}>
                    <PlusCircle style={{ width: 18 }} /> {isAdding ? 'Cancel Upload' : 'Add New Product'}
                </button>
            </div>

            {/* Addition Form Modal/Dropdown */}
            {isAdding && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--slate-200)', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Upload New Material</h2>
                    <form onSubmit={handleAddProduct}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label>Material Name</label>
                                <input type="text" className="form-input" required placeholder="e.g. Grade 43 Cement" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label>Manufacturer / Brand</label>
                                <input type="text" className="form-input" required placeholder="e.g. ACC" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label>Category</label>
                                <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    {mockCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label>Selling Price (₹)</label>
                                <input type="number" className="form-input" required placeholder="e.g. 350" value={formData.priceCurrent} onChange={e => setFormData({...formData, priceCurrent: e.target.value})} />
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label>Unit of Measurement</label>
                                <input type="text" className="form-input" required placeholder="e.g. per bag (50kg)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                            </div>
                            <div className="input-group" style={{ marginBottom: 0 }}>
                                <label>Marketing Tag (Optional)</label>
                                <input type="text" className="form-input" placeholder="e.g. Best Seller" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="btn-ghost" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Publish to Marketplace</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Inventory Data Table */}
            <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--slate-200)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                        <tr>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.875rem' }}>Product Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.875rem' }}>Category</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.875rem' }}>Current Price</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.875rem' }}>Unit</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--slate-500)', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 500, color: 'var(--slate-900)' }}>{product.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{product.brand}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', background: 'var(--slate-100)', color: 'var(--slate-700)', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 500 }}>
                                        {product.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>₹{product.priceCurrent.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--slate-500)', fontSize: '0.9rem' }}>{product.unit}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button className="icon-btn" style={{ padding: '0.5rem', marginRight: '0.5rem' }}><Edit style={{width:16, height:16}}/></button>
                                    <button className="icon-btn" style={{ padding: '0.5rem', color: 'var(--red)' }}><Trash2 style={{width:16, height:16}}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>No products in your inventory. Add some!</div>
                )}
            </div>
        </div>
    );
}
