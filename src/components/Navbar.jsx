import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            console.error("Failed to log out");
        }
    };

    // Hide Navbar on Test and Admin pages
    if (location.pathname.startsWith('/test') || location.pathname.startsWith('/admin')) {
        return null;
    }

    const isActive = (path) => location.pathname === path;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Close mobile menu when route changes
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300">
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/20 dark:border-white/5 shadow-sm"></div>
            <div className="container mx-auto px-4 md:px-6 py-2.5 flex justify-between items-center relative z-10">
                <Link to="/" className="group flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold shadow-md shadow-brand-primary/25 group-hover:scale-110 transition-transform text-sm">
                        CI
                    </div>
                    <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary dark:from-white dark:to-gray-400 tracking-tight">
                        Crack<span className="text-slate-800 dark:text-white">It</span>
                    </span>
                </Link>

                {/* Mobile Actions */}
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={toggleTheme}
                        className="p-1.5 rounded-lg bg-gray-100/50 dark:bg-white/5 text-gray-600 dark:text-gray-300"
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-1.5 text-gray-600 dark:text-gray-300"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-2 md:space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-100/50 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                    </button>

                    {!currentUser ? (
                        <Link to="/login" className="px-5 py-2 rounded-lg bg-brand-primary hover:bg-brand-secondary text-white text-sm font-semibold shadow-md shadow-brand-primary/25 transition-all hover:-translate-y-0.5">
                            Login
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1 md:gap-3">
                            <div className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-gray-200/50 dark:border-white/5 backdrop-blur-md">
                                {[
                                    { path: '/dashboard', label: 'Dashboard' },
                                    { path: '/leaderboard', label: 'Leaderboard' },
                                    { path: '/practice', label: 'Practice' }
                                ].map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${isActive(link.path)
                                            ? 'bg-white dark:bg-slate-800 text-brand-primary shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <Link
                                to="/profile"
                                className="pl-1.5 pr-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-2 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-[10px] font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-800">
                                    {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
                                </div>
                                <span className="hidden md:block text-xs font-semibold text-gray-700 dark:text-gray-200">
                                    {currentUser?.email?.split('@')[0]}
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-xl animate-fade-in p-2 flex flex-col gap-1">
                    {!currentUser ? (
                        <Link to="/login" className="w-full text-center px-4 py-3 rounded-lg bg-brand-primary text-white font-semibold shadow-sm text-sm">
                            Login
                        </Link>
                    ) : (
                        <>
                            {[
                                { path: '/dashboard', label: 'Dashboard' },
                                { path: '/leaderboard', label: 'Leaderboard' },
                                { path: '/practice', label: 'Practice' },
                                { path: '/profile', label: 'My Profile' }
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                                        ? 'bg-brand-primary/10 text-brand-primary'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
