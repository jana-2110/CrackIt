import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticlesBackground from '../components/ParticlesBackground';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { refreshProfile } = useAuth();
    // Pre-fill dummy credentials for user convenience
    const [email, setEmail] = useState('admin@aptitude.com');
    const [password, setPassword] = useState('admin123'); // Default dummy password
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // 1. Domain Restriction (Frontend Check)
        if (!email.endsWith('@aptitude.com')) {
            setError('Access Denied: Restricted Domain. Only @aptitude.com accounts are allowed.');
            setLoading(false);
            return;
        }

        try {
            // 2. Authenticate with Firebase
            let user;
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
            } catch (signInError) {
                // Feature: Auto-create the bootstrap admin if they don't exist yet
                if (email === 'admin@aptitude.com' && signInError.code === 'auth/user-not-found') {
                    try {
                        console.log("Attempting to auto-create bootstrap admin...");
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                        user = userCredential.user;
                    } catch (createError) {
                        throw signInError;
                    }
                } else if (signInError.code === 'auth/multi-factor-auth-required') {
                    // Feature: Handle MFA
                    // In a real app, you would prompt for the second factor here using signInWithPhoneNumber or similar
                    // resolver = getMultiFactorResolver(auth, signInError);
                    setError('Multi-Factor Authentication required. Please use the main portal to verify MFA first.');
                    setLoading(false);
                    return;
                } else {
                    throw signInError;
                }
            }

            // 3. Strict Admin Verification
            // Force refresh token to ensure up-to-date access rights
            const tokenResult = await user.getIdTokenResult(true);

            if (tokenResult.claims.admin) {
                navigate('/admin');
            } else {
                // Critical: Sign out immediately if not admin
                await auth.signOut();
                setError('Access Denied: You do not have administrator privileges.');
            }

        } catch (err) {
            console.error("Admin Login Error:", err);
            setError('Authentication Failed: ' + (err.message || 'Unknown error'));
            if (auth.currentUser) await auth.signOut();
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans selection:bg-brand-primary/30 relative overflow-hidden">
            <ParticlesBackground color="#4f46e5" count={50} />
            <div className="w-full max-w-md p-8 animate-fade-in relative z-10">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8 relativ overflow-hidden">
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary"></div>

                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4 ring-1 ring-brand-primary/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Admin Portal</h2>
                        <p className="text-slate-400 text-sm">Restricted Access Authorization</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAdminLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Admin Identity</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-600 focus:border-brand-primary focus:bg-slate-900 focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                                placeholder="admin@system.internal"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Secure Key</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-600 focus:border-brand-primary focus:bg-slate-900 focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                                placeholder="••••••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary hover:to-brand-primary text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-brand-primary/20 transition-all transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Verifying Credentials...' : 'Access Control Panel'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <a href="/" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Return to Public Site</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
