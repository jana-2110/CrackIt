import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        totalTestsTaken: 0,
        avgMarketScore: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            // Check for cached stats to prevent redundant reads on navigation
            const cachedStats = sessionStorage.getItem('adminDashboardStats');
            const cachedTime = sessionStorage.getItem('adminDashboardTime');
            // Cache for 5 minutes
            if (cachedStats && cachedTime && (Date.now() - parseInt(cachedTime) < 5 * 60 * 1000)) {
                setStats(JSON.parse(cachedStats));
                setLoading(false);
                return;
            }

            try {
                // 1. Optimized Counts using getCountFromServer (Cost: 1 read per 1000 docs)
                const usersColl = collection(db, 'users');
                const usersCountSnapshot = await getCountFromServer(usersColl);

                // Note: Compound queries might require an index. 
                // Using client-side filtering on a smaller subset or dedicated metadata doc is better for distinct 'admin' counts if indices are missing.
                // For now, we'll try a direct count query assuming 'role' is indexed or falls back gracefully.
                const adminsQuery = query(usersColl, where('role', '==', 'admin'));
                const adminsCountSnapshot = await getCountFromServer(adminsQuery);

                // 2. Average Score - Still requires reading docs, but we can limit or use a different strategy.
                // For now, fetching leaderboard is necessary for this metric.
                // We'll calculate it but maybe we can offload this to a cloud function later.
                const leaderboardRef = collection(db, 'leaderboard');
                const leaderboardSnap = await getDocs(leaderboardRef);

                let totalScoreSum = 0;
                let userCount = 0;
                leaderboardSnap.docs.forEach(doc => {
                    totalScoreSum += (doc.data().totalScore || 0);
                    userCount++;
                });

                const newStats = {
                    totalUsers: usersCountSnapshot.data().count || 0,
                    totalAdmins: adminsCountSnapshot.data().count || 0,
                    totalTestsTaken: 'N/A',
                    avgMarketScore: userCount > 0 ? Math.round(totalScoreSum / userCount) : 0
                };

                setStats(newStats);
                sessionStorage.setItem('adminDashboardStats', JSON.stringify(newStats));
                sessionStorage.setItem('adminDashboardTime', Date.now().toString());

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-primary uppercase tracking-widest">Command Center</h1>
                    <p className="text-gray-500 text-xs mt-1">SYSTEM ADMINISTRATOR CLEARANCE: LEVEL 5</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-500">SYSTEM ONLINE</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                {[
                    { label: 'Total Users', value: stats.totalUsers, color: 'text-brand-primary', border: 'border-brand-primary/30' },
                    { label: 'Active Admins', value: stats.totalAdmins, color: 'text-brand-secondary', border: 'border-brand-secondary/30' },
                    { label: 'Avg User Score', value: stats.avgMarketScore, color: 'text-brand-accent', border: 'border-brand-accent/30' },
                    { label: 'System Status', value: 'OPTIMAL', color: 'text-green-500', border: 'border-green-500/30' }
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-gray-900/50 border ${stat.border} p-6 rounded-lg backdrop-blur-sm`}>
                        <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-2">{stat.label}</h3>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">System Alerts</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-medium text-red-400">Security Check Required</h4>
                                <p className="text-xs text-gray-500 mt-1">Please review recent admin login attempts from unknown IPs.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h4 className="text-sm font-medium text-blue-400">System Update</h4>
                                <p className="text-xs text-gray-500 mt-1">Admin Dashboard v2.0 deployed successfully.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors group">
                            <span className="text-brand-secondary text-lg mb-2 block group-hover:scale-110 transition-transform">👥</span>
                            <span className="text-sm font-medium text-gray-300">Manage Users</span>
                        </button>
                        <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors group">
                            <span className="text-brand-primary text-lg mb-2 block group-hover:scale-110 transition-transform">📝</span>
                            <span className="text-sm font-medium text-gray-300">Create Test</span>
                        </button>
                        <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors group">
                            <span className="text-blue-400 text-lg mb-2 block group-hover:scale-110 transition-transform">📊</span>
                            <span className="text-sm font-medium text-gray-300">View Reports</span>
                        </button>
                        <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors group">
                            <span className="text-gray-400 text-lg mb-2 block group-hover:scale-110 transition-transform">⚙️</span>
                            <span className="text-sm font-medium text-gray-300">Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
