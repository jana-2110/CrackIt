import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Fetch top 10 scores sorted by totalScore descending
                const q = query(collection(db, "leaderboard"), orderBy("totalScore", "desc"), limit(10));
                const querySnapshot = await getDocs(q);

                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setLeaderboardData(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // Helper to mask email
    const maskEmail = (email) => {
        if (!email) return "Anonymous";
        const [name, domain] = email.split('@');
        return `${name.substring(0, 3)}***@${domain}`;
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 bg-gray-50 dark:bg-brand-dark container mx-auto transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl font-display font-bold gradient-text mb-2">Global Leaderboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Top performers across all assessments</p>
                </div>

                <div className="glass rounded-2xl overflow-hidden animate-slide-up bg-white/60 dark:bg-white/5">
                    <div className="bg-white/50 dark:bg-slate-900/50 p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-white/10 text-left">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-gray-500 dark:text-gray-400">Loading rankings...</td>
                                        </tr>
                                    ) : leaderboardData.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-gray-500 dark:text-gray-400">No data available yet. Be the first!</td>
                                        </tr>
                                    ) : (
                                        leaderboardData.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/50' :
                                                        index === 1 ? 'bg-gray-200 text-gray-600 dark:bg-gray-400/20 dark:text-gray-300 border border-gray-300 dark:border-gray-400/50' :
                                                            index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-amber-700/20 dark:text-amber-600 border border-orange-200 dark:border-amber-700/50' :
                                                                'text-gray-500 bg-gray-100 dark:bg-white/5'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-white/20 shadow-sm">
                                                            {user.photoURL ? (
                                                                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-800 dark:text-white">{user.displayName || "Anonymous"}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{maskEmail(user.email)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right font-mono text-lg font-bold text-brand-secondary">
                                                    {user.totalScore}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
