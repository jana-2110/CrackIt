import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, startAfter, orderBy, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase/config';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');

    // Constants
    const USERS_PER_PAGE = 20;

    const fetchUsers = async (isNextPage = false) => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users'); // Or 'leaderboard' if users collection is not fully synced

            // Build Query
            let q = query(usersRef, limit(USERS_PER_PAGE));

            // Note: Complex queries (like valid orderBy + where + startAfter) require Firestore indices.
            // For simplicity in this optimization pass, we will order by Document ID or a basic field.
            // If you need strict ordering by name, ensure indices exist.

            // Filtering by role
            if (roleFilter !== 'all') {
                q = query(q, where('role', '==', roleFilter));
            }

            // Pagination
            if (isNextPage && lastDoc) {
                q = query(q, startAfter(lastDoc));
            }

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setHasMore(false);
                if (!isNextPage) setUsers([]);
            } else {
                const userList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Fallbacks for missing data
                    email: doc.data().email || 'No Email',
                    displayName: doc.data().displayName || 'Anonymous',
                    role: doc.data().role || 'User',
                    totalScore: doc.data().totalScore || 0
                }));

                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

                if (isNextPage) {
                    setUsers(prev => [...prev, ...userList]);
                } else {
                    setUsers(userList);
                }

                // If we got fewer than requested, that's the end
                if (snapshot.docs.length < USERS_PER_PAGE) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    // Initial Load & Filter Change
    useEffect(() => {
        setHasMore(true);
        setLastDoc(null);
        fetchUsers(false);
    }, [roleFilter]);

    // Handle Search (Client-side filtering for simplicity if dataset < 1000, 
    // OR Backend search if dedicated search service like Algolia is used. 
    // Here we'll show a hybrid approach: Alerting that search is limited to loaded items/by ID)
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRoleUpdate = (userId, newRole) => {
        alert(`Role Management:
        
To change a user's role to '${newRole}', please use the secure admin script in your terminal:
        
node scripts/setAdmin.js ${userId}
        
Client-side role promotion is restricted for security.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <div className="text-xs text-gray-500">
                    Showing {filteredUsers.length} loaded users
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-900/30 border border-gray-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                <div className="relative w-full md:w-96">
                    <svg className="absolute left-3 top-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Filter loaded users..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full bg-black border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:border-brand-primary outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-black border border-gray-700 text-white rounded-lg px-4 py-2 focus:border-brand-primary outline-none cursor-pointer"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="user">Users</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">User Identity</th>
                                <th className="px-6 py-4">Total XP</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4">
                                        <SkeletonLoader type="table-row" count={5} />
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                                                    {(user.displayName || 'U')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.displayName}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-brand-primary font-mono">
                                            {(user.totalScore || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleRoleUpdate(user.id, user.role === 'admin' ? 'Success' : 'admin')}
                                                    className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1 rounded transition-colors"
                                                >
                                                    {user.role === 'admin' ? 'Demote' : 'Promote'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {hasMore && !searchTerm && (
                    <div className="p-4 border-t border-gray-800 flex justify-center">
                        <button
                            onClick={() => fetchUsers(true)}
                            disabled={loading}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Load More Users'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
