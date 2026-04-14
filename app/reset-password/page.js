"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Building2, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            if (error) throw error;
            alert("Password updated successfully! Redirecting to login...");
            router.push('/auth');
        } catch (err) {
            alert(err.message || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc'}}>
            <main style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
                <div style={{background: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px'}}>
                    <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                        <Building2 style={{color: '#f97316', width: 48, height: 48, margin: '0 auto 1rem'}} />
                        <h1 style={{fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem'}}>Set New Password</h1>
                        <p style={{color: '#64748b'}}>Choose a secure password for your BuildBazaar account.</p>
                    </div>

                    <form onSubmit={handleReset} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                        <div style={{position: 'relative'}}>
                            <Lock style={{position: 'absolute', top: '14px', left: '14px', color: '#94a3b8', width: 20, height: 20}} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="New Password" 
                                required 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                style={{width: '100%', padding: '0.875rem 1rem 0.875rem 46px', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none'}} 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'}}>
                                {showPassword ? <EyeOff style={{width: 20, height: 20}} /> : <Eye style={{width: 20, height: 20}} />}
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{background: '#f97316', color: 'white', padding: '1rem', borderRadius: '0.75rem', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '1rem', opacity: loading ? 0.7 : 1}}
                        >
                            {loading ? 'Updating...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
