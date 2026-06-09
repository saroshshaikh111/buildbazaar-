import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query initial load session state
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user || null);
            } catch (err) {
                console.error("Auth checkSession failed:", err);
            } finally {
                setLoading(false);
            }
        };
        checkSession();

        // Passively listen for all subsequent Auth shifts
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        return {
            user: null,
            loading: false,
            logout: async () => {},
            setUser: () => {}
        };
    }
    return context;
}
