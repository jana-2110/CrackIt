import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, setDoc, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';

import ActivityHeatmap from '../components/ActivityHeatmap';


const Profile = () => {
    const { currentUser, logout, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [stats, setStats] = useState({
        testsTaken: 0,
        averageScore: 0,
        totalScore: 0,
        recentResults: [],
        rank: 'N/A',
        displayName: '',
        streak: 0,
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        // ... (rest of useEffect logic remains the same, assuming it's closed properly below)
        const fetchUserStats = async () => {
            if (currentUser) {
                try {
                    // Fetch User Role from Firestore (in addition to Auth Claims)
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    let dbRole = '';
                    if (userDocSnap.exists()) {
                        dbRole = userDocSnap.data().role;
                    }

                    const resultsRef = collection(db, "users", currentUser.uid, "testResults");
                    const snapshot = await getDocs(resultsRef);

                    let totalTests = 0;
                    let totalScore = 0;
                    let totalMaxScore = 0;
                    const recentResults = [];

                    snapshot.forEach(doc => {
                        const data = doc.data();
                        totalTests++;
                        totalScore += data.score;
                        totalMaxScore += data.total;
                        recentResults.push({
                            id: doc.id,
                            ...data,
                            date: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
                        });
                    });

                    // Calculate Streak
                    const uniqueDates = [...new Set(recentResults.map(r => r.date.toDateString()))].sort((a, b) => new Date(b) - new Date(a));
                    let currentStreak = 0;
                    const today = new Date().toDateString();
                    const yesterday = new Date(Date.now() - 86400000).toDateString();

                    if (uniqueDates.length > 0) {
                        if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
                            currentStreak = 1;
                            for (let i = 0; i < uniqueDates.length - 1; i++) {
                                const curr = new Date(uniqueDates[i]);
                                const prev = new Date(uniqueDates[i + 1]);
                                const diffTime = Math.abs(curr - prev);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                if (diffDays === 1) {
                                    currentStreak++;
                                } else {
                                    break;
                                }
                            }
                        }
                    }

                    recentResults.sort((a, b) => b.date - a.date);

                    const leaderboardRef = collection(db, "leaderboard");
                    const q = query(leaderboardRef, orderBy("totalScore", "desc"));
                    const leaderboardSnap = await getDocs(q);

                    let rank = 'N/A';
                    let currentDisplayName = '';

                    leaderboardSnap.docs.forEach((doc, index) => {
                        if (doc.id === currentUser.uid) {
                            rank = index + 1;
                            currentDisplayName = doc.data().displayName || '';
                        }
                    });

                    setStats({
                        testsTaken: totalTests,
                        averageScore: totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
                        totalScore: totalScore,
                        recentResults: recentResults.slice(0, 10),
                        rank: rank,
                        displayName: currentDisplayName,
                        streak: currentStreak,
                        role: dbRole
                    });
                    setNewName(currentDisplayName);

                } catch (error) {
                    console.error("Error fetching user stats:", error);
                }
            }
            setLoading(false);
        };

        fetchUserStats();
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleSaveName = async () => {
        if (!currentUser) return;
        try {
            // 1. Update Leaderboard
            const userLeaderboardRef = doc(db, "leaderboard", currentUser.uid);
            const leaderSnap = await getDoc(userLeaderboardRef);
            let leaderData = leaderSnap.exists() ? leaderSnap.data() : { scores: {}, totalScore: 0, email: currentUser.email };
            leaderData.displayName = newName;
            leaderData.email = currentUser.email;
            await setDoc(userLeaderboardRef, leaderData, { merge: true });

            // 2. Update Users Collection (For Admin Panel)
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(userDocRef, {
                displayName: newName
            }, { merge: true });

            // 3. Update Firebase Auth Profile (Global Source of Truth)
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: newName
                });
                // Force context refresh to reflect change in UI
                await refreshProfile();
            }

            setStats(prev => ({ ...prev, displayName: newName }));
            setIsEditingName(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving name:", error);
            alert("Failed to save name: " + error.message);
        }
    };


    const downloadReport = () => {
        console.log("Starting report download...");
        try {
            const doc = new jsPDF();
            console.log("PDF Document created");

            // Title
            doc.setFontSize(20);
            doc.setTextColor(79, 70, 229); // Indigo color
            doc.text("Aptitude Test Performance Report", 14, 22);

            // ... (rest of logic) ...

            // User Info
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Name: ${stats.displayName || "User"}`, 14, 32);
            doc.text(`Email: ${currentUser?.email || "N/A"}`, 14, 38);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);

            // Summary Stats
            doc.text(`Total Tests Taken: ${stats.testsTaken}`, 14, 54);
            doc.text(`Average Score: ${Math.round(stats.averageScore)}%`, 14, 60);

            // Table
            const tableColumn = ["Date", "Test ID", "Score", "Accuracy", "Status"];
            const tableRows = [];

            if (stats.recentResults.length === 0) {
                console.warn("No results to download");
                alert("No test history available to download.");
                return;
            }

            stats.recentResults.forEach(result => {
                const percentage = result.total > 0 ? (result.score / result.total) * 100 : 0;
                let status = "Review";
                if (percentage >= 80) status = "Excellent";
                else if (percentage >= 50) status = "Pass";

                const rowData = [
                    new Date(result.date).toLocaleDateString(),
                    `T-${(result.testId || result.id).toString().substring(0, 6).toUpperCase()}`,
                    `${result.score} / ${result.total}`,
                    `${Math.round(percentage)}%`,
                    status
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 70,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229] }, // Indigo
            });

            console.log("Saving PDF...");
            doc.save(`Aptitude_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
            console.log("PDF saved");
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Failed to generate report: " + error.message);
        }
    };



    // Render Admin Panel if tab is active
    /*  if (activeTab === 'admin' && currentUser?.role === 'admin') {
         return (
             <div className="min-h-screen bg-slate-50 pt-20">
                 <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                         <div className="flex gap-4">
                             <button onClick={() => setActiveTab('profile')} className="px-3 py-1 text-slate-500 hover:text-slate-900">Profile</button>
                             <button onClick={() => setActiveTab('admin')} className="px-3 py-1 font-bold text-indigo-600 border-b-2 border-indigo-600">Admin Console</button>
                         </div>
                         <button onClick={() => setActiveTab('profile')} className="text-sm text-slate-500">Exit Admin Mode</button>
                     </div>
                 </div>
                 <div className="pb-12">
                     <AdminPanel />
                 </div>
             </div>
         )
     } */

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans text-slate-900 pb-12 pt-20">
            {/* Top Navigation / Breadcrumb Area could go here */}
            <div className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">User Profile</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">



                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Profile Card & Badges */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-100/50 overflow-hidden relative">
                            {/* Decorative Header */}
                            <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                                <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                            </div>

                            <div className="px-6 flex flex-col items-center -mt-12">
                                <div className="relative group mb-4">
                                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 overflow-hidden border-2 border-white">
                                            {currentUser?.photoURL ? (
                                                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center w-full">
                                    {isEditingName ? (
                                        <div className="flex flex-col gap-2 items-center w-full">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={handleSaveName} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Save</button>
                                                <button onClick={() => setIsEditingName(false)} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200">Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-lg font-bold text-slate-900 group cursor-pointer hover:text-indigo-600 flex items-center justify-center gap-2" onClick={() => setIsEditingName(true)}>
                                                {stats.displayName || "User Name"}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </h2>
                                            <p className="text-sm text-slate-500">{currentUser?.email}</p>
                                        </>
                                    )}
                                </div>

                                <div className="px-6 py-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Account Details</h3>
                                    <div className="flex justify-between items-center mb-2 p-2 rounded hover:bg-slate-50 transition-colors">
                                        <span className="text-sm text-slate-600 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            Joined
                                        </span>
                                        <span className="text-sm font-medium text-slate-800">
                                            {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Plan</span>
                                        <span className="text-sm font-medium text-slate-800">Basic User</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>



                        </div>
                    </div>

                    {/* Right Column: Dashboard & Stats */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-6">

                        {/* Activity Heatmap */}
                        <ActivityHeatmap recentResults={stats.recentResults} />

                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Global Rank</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">#{stats.rank}</p>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Day Streak</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{stats.streak || 0} <span className="text-sm font-normal text-slate-400">days</span></p>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Total XP</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalScore.toLocaleString()}</p>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Avg Accuracy</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-slate-900">{stats.averageScore}%</p>
                                    <span className="text-xs text-slate-400 mb-1">per test</span>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Completed</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{stats.testsTaken} <span className="text-sm font-normal text-slate-400">tests</span></p>
                            </div>
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Performance History</h3>
                                <button
                                    onClick={downloadReport}
                                    className="text-xs text-indigo-600 font-medium hover:text-indigo-800 hover:underline flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Report
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Session Date</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Reference ID</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Score</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Efficiency</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">Loading data...</td></tr>
                                        ) : stats.recentResults.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">No test data available.</td></tr>
                                        ) : (
                                            stats.recentResults.map((result, idx) => {
                                                const percentage = result.total > 0 ? (result.score / result.total) * 100 : 0;
                                                let statusBadge = (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                                        Completed
                                                    </span>
                                                );

                                                if (percentage >= 80) {
                                                    statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Excellent</span>;
                                                } else if (percentage >= 50) {
                                                    statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">Pass</span>;
                                                } else {
                                                    statusBadge = <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Review</span>;
                                                }

                                                return (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 text-sm text-slate-700">
                                                            {result.date.toLocaleDateString()}
                                                            <span className="text-slate-400 text-xs ml-2">{result.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono text-center">
                                                            T-{(result.testId || result.id).toString().substring(0, 6).toUpperCase()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-700 font-medium text-center">
                                                            {result.score} / {result.total}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${percentage}%` }}></div>
                                                                </div>
                                                                <span className="text-xs text-slate-500">{Math.round(percentage)}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {statusBadge}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Profile;
