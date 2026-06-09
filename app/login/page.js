"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, AlertTriangle, CheckCircle, Mail, Smartphone } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            if (loginMethod === "phone") {
                if (!phone) throw new Error("Please enter a valid mobile number with country code (e.g. +91...)");
                
                if (!otpSent) {
                    // Send OTP
                    const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim() });
                    if (error) throw error;
                    setOtpSent(true);
                    setSuccessMsg("OTP sent! Please check your mobile number.");
                } else {
                    if (!otp) throw new Error("Please enter the OTP");
                    // Verify OTP
                    const { error } = await supabase.auth.verifyOtp({ phone: phone.trim(), token: otp.trim(), type: 'sms' });
                    if (error) throw error;
                    router.push('/');
                }
            } else {
                // Email Auth
                if (!email || !password) throw new Error("Please enter both email and password");

                if (isLogin) {
                    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
                    if (error) throw error;
                    router.push('/');
                } else {
                    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
                    if (error) throw error;
                    setSuccessMsg("Registration successful! Check your email to verify your account.");
                    if (data?.session) {
                        router.push('/');
                    }
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

            <div style={{width: '100%', maxWidth: '380px', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', border: '1px solid var(--slate-200)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'}}>
                <h1 style={{fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--slate-900)', textAlign: 'center'}}>
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h1>

                {/* Login Method Tabs */}
                <div style={{display: 'flex', backgroundColor: 'var(--slate-50)', padding: '0.25rem', borderRadius: '0.5rem', marginBottom: '1.5rem'}}>
                    <button 
                        type="button"
                        onClick={() => { setLoginMethod("email"); setErrorMsg(""); setSuccessMsg(""); }}
                        style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: loginMethod === "email" ? 'white' : 'transparent', color: loginMethod === "email" ? 'var(--slate-900)' : 'var(--slate-500)', border: 'none', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: loginMethod === "email" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: '0.2s'}}
                    >
                        <Mail style={{width: 16, height: 16}} /> Email
                    </button>
                    <button 
                        type="button"
                        onClick={() => { setLoginMethod("phone"); setErrorMsg(""); setSuccessMsg(""); setIsLogin(true); /* OTP implies login/signup combined */ }}
                        style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: loginMethod === "phone" ? 'white' : 'transparent', color: loginMethod === "phone" ? 'var(--slate-900)' : 'var(--slate-500)', border: 'none', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', boxShadow: loginMethod === "phone" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: '0.2s'}}
                    >
                        <Smartphone style={{width: 16, height: 16}} /> Mobile No.
                    </button>
                </div>

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
                    
                    {loginMethod === "email" ? (
                        <>
                            <div>
                                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem'}}>Email</label>
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{width: '100%', padding: '0.75rem', border: '1px solid var(--slate-300)', borderRadius: '0.25rem', outline: 'none', fontSize: '1rem'}} />
                            </div>
                            <div>
                                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem'}}>Password</label>
                                <input type="password" required placeholder={!isLogin ? "At least 6 characters" : ""} value={password} onChange={(e) => setPassword(e.target.value)} style={{width: '100%', padding: '0.75rem', border: '1px solid var(--slate-300)', borderRadius: '0.25rem', outline: 'none', fontSize: '1rem'}} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem'}}>Mobile Number</label>
                                <input type="tel" required placeholder="+919876543210" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} style={{width: '100%', padding: '0.75rem', border: '1px solid var(--slate-300)', borderRadius: '0.25rem', outline: 'none', fontSize: '1rem', backgroundColor: otpSent ? 'var(--slate-50)' : 'white', color: otpSent ? 'var(--slate-500)' : '#111'}} />
                                {otpSent && <button type="button" onClick={() => {setOtpSent(false); setOtp(""); setSuccessMsg("");}} style={{marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--primary-orange)', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>Change Number</button>}
                            </div>
                            {otpSent && (
                                <div style={{animation: 'fade-in 0.3s ease-out'}}>
                                    <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.25rem'}}>One-Time Password (OTP)</label>
                                    <input type="text" required placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={{width: '100%', padding: '0.75rem', border: '1px solid var(--primary-orange)', borderRadius: '0.25rem', outline: 'none', fontSize: '1rem', letterSpacing: '0.2em', textAlign: 'center', fontWeight: 700}} />
                                </div>
                            )}
                        </>
                    )}

                    <button type="submit" disabled={loading} style={{width: '100%', padding: '0.75rem', backgroundColor: loading ? 'var(--slate-400)' : 'var(--primary-orange)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '1rem', marginTop: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer'}}>
                        {loading ? 'Processing...' : (
                            loginMethod === "phone" 
                                ? (otpSent ? 'Verify OTP & Login' : 'Send OTP') 
                                : (isLogin ? 'Sign in' : 'Create account')
                        )}
                    </button>
                </form>
            </div>

            {loginMethod === "email" && (
                <div style={{width: '100%', maxWidth: '380px', marginTop: '1.5rem', textAlign: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                        <div style={{flex: 1, height: '1px', backgroundColor: 'var(--slate-200)'}}></div>
                        <span style={{fontSize: '0.75rem', color: 'var(--slate-500)'}}>{isLogin ? 'New to BuildBazaar?' : 'Already have an account?'}</span>
                        <div style={{flex: 1, height: '1px', backgroundColor: 'var(--slate-200)'}}></div>
                    </div>

                    <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); setSuccessMsg(""); }} style={{width: '100%', padding: '0.5rem', backgroundColor: 'var(--slate-50)', color: 'var(--slate-900)', border: '1px solid var(--slate-300)', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'}}>
                        {isLogin ? 'Create your BuildBazaar account' : 'Sign in to existing account'}
                    </button>
                </div>
            )}
        </div>
    );
}

