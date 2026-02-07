import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import ParticlesBackground from '../components/ParticlesBackground';
import ModernGeometricBackground from '../components/ModernGeometricBackground';

const Login = () => {
    const navigate = useNavigate();
    const { signup, login, currentUser } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                const userCredential = await signup(email, password);
                const user = userCredential.user;
                // Create Firestore User Document
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    role: 'user', // Default role
                    createdAt: serverTimestamp(),
                    displayName: user.email.split('@')[0], // Default display name
                    photoURL: null
                });
            }
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to ' + (isLogin ? 'log in' : 'sign up') + ': ' + err.message);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setError('');
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists, if not create doc
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    role: 'user',
                    createdAt: serverTimestamp(),
                    displayName: user.displayName || user.email.split('@')[0],
                    photoURL: user.photoURL
                });
            }

            navigate('/dashboard');
        } catch (err) {
            setError('Failed to log in with Google: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-dark font-sans selection:bg-brand-primary/30">
            {/* Dynamic Background */}
            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full">
                <ModernGeometricBackground />
            </div>

            <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-4 p-4 items-center">

                {/* Left Side: Welcome visuals (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col justify-center text-white p-8 space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-sm font-medium text-gray-300">Practice Arena Live</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold leading-tight">
                        Master Your <br />
                        <span className="gradient-text">Coding Skills</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                        Join thousands of developers sharpening their algorithms, SQL, and system design skills. Level up your career today.
                    </p>

                    {/* Stats or Trust Indicators could go here */}
                    <div className="flex -space-x-3 pt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-700 flex items-center justify-center text-xs font-bold`}>
                                {i === 4 ? '+' : ''}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Login Card */}
                <div className="animate-slide-up">
                    <div className="p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group bg-brand-primary/10 backdrop-blur-md">
                        {/* Gradient Border Effect */}
                        <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/5 -z-10"></div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-display font-bold text-white mb-2">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-400">
                                {isLogin ? 'Enter your credentials to access your dashboard.' : 'Start your journey with a free account.'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:bg-white/10 focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                                    {isLogin && (
                                        <button type="button" className="text-xs text-brand-primary hover:text-brand-secondary transition-colors">
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-brand-primary focus:bg-white/10 focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-brand-primary/20 transition-all transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    isLogin ? 'Sign In to Dashboard' : 'Create Free Account'
                                )}
                            </button>
                        </form>

                        <div className="my-8 flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            <span className="text-gray-500 text-xs font-medium uppercase tracking-widest">Or continue with</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            {/* Hover effect highlight */}
                            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                            <svg className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="relative z-10">Google</span>
                        </button>

                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-brand-primary hover:text-brand-secondary font-bold transition-colors focus:outline-none ml-1 relative group"
                                >
                                    {isLogin ? 'Sign Up' : 'Log In'}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-secondary transition-all group-hover:w-full"></span>
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
