"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        if (!email || !password) {
            setErrorMsg("Please enter both email and password");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                // Login
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password
                });
                if (error) throw error;
                // Redirect on success
                router.push('/');
            } else {
                // Register
                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password
                });
                if (error) throw error;
                
                // Supabase by default configures email confirmations.
                setSuccessMsg("Registration successful! Check your email to verify your account (or skip if email confirmations are disabled in Supabase).");
                if (data?.session) {
                    router.push('/');
                }
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setErrorMsg(error.message || "Failed to authenticate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--slate-50)', padding: '2rem 20px'}}>
            
            <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-orange)', textDecoration: 'none', fontWeight: 800, fontSize: '1.75rem', marginBottom: '2rem'}}>
                <Building2 style={{width: 32, height: 32}}/> BuildBazaar
            </Link>

            <div style={{width: '100%', maxWidth: '350px', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--slate-200)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
                <h1 style={{fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--slate-900)'}}>
                    {isLogin ? 'Sign in' : 'Create account'}
                </h1>

                {errorMsg && (
                    <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.5rem', marginBottom: '1.5rem', color: '#991b1b', fontSize: '0.875rem'}}>
                        <AlertTriangle style={{width: 16, height: 16, flexShrink: 0, marginTop: 2}} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--green-bg)', border: '1px solid #6ee7b7', borderRadius: '0.5rem', marginBottom: '1.5rem', color: 'var(--green)', fontSize: '0.875rem'}}>
                        <CheckCircle style={{width: 16, height: 16, flexShrink: 0, marginTop: 2}} />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem'}}>Email</label>
                        <input 
                            type="email" 
                            required 
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{width: '100%', padding: '0.5rem', border: '1px solid var(--text-light)', borderRadius: '0.25rem', outline: 'none', fontSize: '1rem', backgroundColor: 'white', color: '#111'}} 
                        />
                    </div>
                    
                    <div>
                        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem'}}>Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder={!isLogin ? "At least 6 characters" : ""}
                            defaultValue={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{width: '100%', padding: '0.5rem', border: '1px solid var(--text-light)', borderRadius: '0.25rem', outline: 'none', fontSize: '1rem', backgroundColor: 'white', color: '#111'}} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{width: '100%', padding: '0.75rem', backgroundColor: loading ? 'var(--slate-400)' : 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '1rem', marginTop: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer'}}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
                    </button>
                </form>

                <div style={{marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--slate-600)', lineHeight: '1.4'}}>
                    By continuing, you agree to BuildBazaar's Conditions of Use and Privacy Notice. Secure Supabase Auth verification applies.
                </div>
            </div>

            <div style={{width: '100%', maxWidth: '350px', marginTop: '1.5rem', textAlign: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                    <div style={{flex: 1, height: '1px', backgroundColor: 'var(--slate-200)'}}></div>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>{isLogin ? 'New to BuildBazaar?' : 'Already have an account?'}</span>
                    <div style={{flex: 1, height: '1px', backgroundColor: 'var(--slate-200)'}}></div>
                </div>

                <button 
                    onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); setSuccessMsg(""); }}
                    style={{width: '100%', padding: '0.5rem', backgroundColor: 'var(--slate-50)', color: 'var(--slate-900)', border: '1px solid var(--slate-300)', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}
                >
                    {isLogin ? 'Create your BuildBazaar account' : 'Sign in to existing account'}
                </button>
            </div>
            
            <footer style={{marginTop: '3rem', borderTop: '1px solid var(--slate-200)', paddingTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.75rem', color: 'var(--primary-orange)'}}>
                <span style={{cursor: 'pointer'}}>Conditions of Use</span>
                <span style={{cursor: 'pointer'}}>Privacy Notice</span>
                <span style={{cursor: 'pointer'}}>Help</span>
            </footer>
        </div>
    );
}
