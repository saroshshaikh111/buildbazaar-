"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AuthPage() {
    const [authMode, setAuthMode] = useState('email'); // 'email' or 'phone'
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const router = require('next/navigation').useRouter();

    const handleGoogleAuth = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) alert(error.message);
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: phone.trim(),
                token: verificationCode,
                type: 'sms'
            });
            if (error) throw error;
            router.push('/');
        } catch (err) {
            alert(err.message || "Invalid code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        if (e) e.preventDefault();
        if (!email) {
            alert("Please enter your email address first.");
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            alert("Password reset link sent! Check your inbox.");
        } catch (err) {
            alert(err.message || "Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    const handleCredAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (authMode === 'phone') {
                const { error } = await supabase.auth.signInWithOtp({
                    phone: phone.trim(),
                });
                if (error) throw error;
                setOtpSent(true);
                return;
            }

            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password: password
                });
                if (error) throw error;
                router.push('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password: password
                });
                if (error) throw error;
                alert('Success! Check your email to verify your account.');
                setIsLogin(true);
            }
        } catch (err) {
            alert(err.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--slate-50)'}}>
            
            {/* Minimal Auth Navbar */}
            <nav className="navbar" style={{position: 'absolute', background: 'transparent', border: 'none'}}>
                <div className="nav-container">
                    <div className="nav-brand">
                        <Building2 className="brand-icon" />
                        <span className="brand-text">BuildBazaar</span>
                    </div>
                    <div className="nav-actions">
                        <Link href="/" className="btn-ghost" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none'}}><ArrowLeft style={{width: 16}} /> Back to Home</Link>
                    </div>
                </div>
            </nav>

            {/* Centered Auth Card */}
            <main style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}}>
                <div style={{background: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '480px'}}>
                    
                    <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                        <h1 style={{fontSize: '2rem', color: 'var(--slate-900)', marginBottom: '0.5rem'}}>{isLogin ? 'Welcome back' : 'Create an account'}</h1>
                        <p style={{color: 'var(--slate-500)'}}>{isLogin ? 'Enter your details to access your dashboard.' : 'Join 10,000+ builders streamlining their material sourcing.'}</p>
                    </div>

                    <form onSubmit={handleCredAuth} style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                        
                        {/* Custom Google Button */}
                        <button type="button" onClick={handleGoogleAuth} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem', backgroundColor: 'white', border: '1px solid var(--slate-200)', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                            <img src="https://www.google.com/favicon.ico" width="20" height="20" alt="Google" />
                            Continue with Google
                        </button>

                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0'}}>
                            <div style={{flex: 1, height: '1px', background: 'var(--slate-200)'}}></div>
                            <span style={{color: 'var(--slate-400)', fontSize: '0.875rem'}}>or continue with</span>
                            <div style={{flex: 1, height: '1px', background: 'var(--slate-200)'}}></div>
                        </div>

                        {/* Mode Switcher */}
                        <div style={{display: 'flex', background: 'var(--slate-100)', padding: '0.25rem', borderRadius: '0.5rem', gap: '0.25rem'}}>
                            <button type="button" onClick={() => setAuthMode('email')} style={{flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: 'none', background: authMode === 'email' ? 'white' : 'transparent', boxShadow: authMode === 'email' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', fontWeight: 500, color: authMode === 'email' ? 'var(--slate-900)' : 'var(--slate-500)', cursor: 'pointer', transition: 'all 0.2s'}}>Email</button>
                            <button type="button" onClick={() => setAuthMode('phone')} style={{flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: 'none', background: authMode === 'phone' ? 'white' : 'transparent', boxShadow: authMode === 'phone' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', fontWeight: 500, color: authMode === 'phone' ? 'var(--slate-900)' : 'var(--slate-500)', cursor: 'pointer', transition: 'all 0.2s'}}>Phone Number</button>
                        </div>

                        {/* Email / Password Mode */}
                        {authMode === 'email' && (
                            <>
                                <div className="input-group" style={{marginBottom: 0}}>
                                    <label style={{display: 'none'}}>Email Address</label>
                                    <div style={{position: 'relative'}}>
                                        <Mail style={{position: 'absolute', top: '14px', left: '14px', color: 'var(--slate-400)', width: 20, height: 20}} />
                                        <input type="email" placeholder="name@company.com" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} style={{paddingLeft: '46px'}} />
                                    </div>
                                </div>
                                <div className="input-group" style={{marginBottom: 0}}>
                                    <label style={{display: 'none'}}>Password</label>
                                    <div style={{position: 'relative'}}>
                                        <Lock style={{position: 'absolute', top: '14px', left: '14px', color: 'var(--slate-400)', width: 20, height: 20}} />
                                        <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="form-input" required value={password} onChange={e => setPassword(e.target.value)} style={{paddingLeft: '46px'}} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer'}}>
                                            {showPassword ? <EyeOff style={{width: 20, height: 20}} /> : <Eye style={{width: 20, height: 20}} />}
                                        </button>
                                    </div>
                                </div>
                                {isLogin && <button type="button" onClick={handleForgotPassword} style={{background: 'none', border: 'none', color: 'var(--primary-orange)', fontSize: '0.875rem', textAlign: 'right', fontWeight: 500, cursor: 'pointer'}}>Forgot password?</button>}
                            </>
                        )}

                        {/* Phone Mode */}
                        {authMode === 'phone' && (
                            <div className="input-group" style={{marginBottom: 0}}>
                                <label style={{display: 'none'}}>{otpSent ? 'Verification Code' : 'Phone Number'}</label>
                                <div style={{position: 'relative'}}>
                                    {otpSent ? (
                                        <>
                                            <Lock style={{position: 'absolute', top: '14px', left: '14px', color: 'var(--slate-400)', width: 20, height: 20}} />
                                            <input type="text" placeholder="Enter 6-digit OTP" className="form-input" required value={verificationCode} onChange={e => setVerificationCode(e.target.value)} style={{paddingLeft: '46px', letterSpacing: '4px', textAlign: 'center'}} maxLength={6} />
                                        </>
                                    ) : (
                                        <>
                                            <Phone style={{position: 'absolute', top: '14px', left: '14px', color: 'var(--slate-400)', width: 20, height: 20}} />
                                            <input type="tel" placeholder="+91 98765 43210" className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} style={{paddingLeft: '46px'}} />
                                        </>
                                    )}
                                </div>
                                {!isLogin && !otpSent && <p style={{fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.5rem'}}>We will send a fast 6-digit OTP to verify your number.</p>}
                                {otpSent && <p style={{fontSize: '0.8rem', color: 'var(--primary-orange)', marginTop: '0.5rem', fontWeight: 600, cursor: 'pointer'}} onClick={() => setOtpSent(false)}>Wrong number? Try again.</p>}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn-primary w-full" 
                            disabled={loading}
                            onClick={otpSent ? handleOtpVerify : handleCredAuth}
                            style={{padding: '1rem', fontSize: '1rem', marginTop: '1rem', opacity: loading ? 0.7 : 1}}
                        >
                            {loading ? 'Processing...' : (
                                authMode === 'phone' 
                                    ? (otpSent ? 'Verify & Sign In' : 'Send Verification OTP') 
                                    : (isLogin ? 'Sign In' : 'Create Account')
                            )}
                        </button>
                    </form>

                    <p style={{textAlign: 'center', marginTop: '2rem', color: 'var(--slate-500)'}}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button type="button" onClick={() => setIsLogin(!isLogin)} style={{background: 'none', border: 'none', color: 'var(--primary-orange)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem'}}>{isLogin ? 'Sign up' : 'Log in'}</button>
                    </p>
                </div>
            </main>
        </div>
    );
}
