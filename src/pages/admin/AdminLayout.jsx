import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { label: 'User Management', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { label: 'Aptitude Questions', path: '/admin/questions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { label: 'Coding Challenges', path: '/admin/coding', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
        { label: 'Test Management', path: '/admin/tests', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { label: 'System Settings', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex relative overflow-x-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/80 z-20 md:hidden animate-fade-in"
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                w-60 bg-slate-900 border-r border-white/5 flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between gap-3 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
                            CI
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-wide">Crack It</h1>
                            <p className="text-[10px] text-brand-primary font-semibold uppercase tracking-wider">Admin Console</p>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${isActive
                                    ? 'text-white bg-brand-primary/10 border border-brand-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute inset-y-0 left-0 w-1 bg-brand-primary rounded-r-full shadow-[0_0_10px_#3b82f6]"></div>
                                    )}
                                    <svg className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-brand-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    <span className="relative z-10">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors mb-3">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white shadow-inner ring-1 ring-white/10">
                                {currentUser?.email?.[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate">{currentUser?.email?.split('@')[0]}</p>
                                <p className="text-[10px] text-green-400 flex items-center gap-1.5 font-medium mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                                    System Online
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all group"
                    >
                        <svg className="w-4 h-4 mr-2 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-60 min-h-screen bg-black flex flex-col w-full transition-all duration-300">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-400 hover:text-white p-1 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-bold text-white tracking-wide">
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
                    </span>
                    <div className="w-6"></div> {/* Spacer for balance */}
                </header>

                <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
