"use client";
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SellerAuthLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Not logged in -> Kick out immediately to login screen
                router.replace('/auth');
            } else {
                // Logged in -> Grant access
                setVerified(true);
            }
        }
    }, [user, loading, router]);

    // Show a blank, strict loading state while verifying to prevent UI flashing
    if (loading || !verified) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '48px', height: '48px', border: '4px solid #0f172a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return <>{children}</>;
}
