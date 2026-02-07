import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);

    const [selectedTestId, setSelectedTestId] = useState(null);
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);
    const navigate = useNavigate();

    const tests = [
        { id: 1, title: 'General Aptitude', description: 'Basic logical reasoning and math skills', time: '30 mins' },
        { id: 2, title: 'Technical Interview (Common)', description: 'Algorithms, Data Structures, and Time Complexity', time: '15 mins' },
        { id: 5, title: 'LeetCode Challenge', description: 'Stack, Sliding Window, Trees, and Interval problems', time: '25 mins' },
        { id: 9, title: 'Data Structures & Algorithms', description: 'Queues, Heaps, Graphs, Sorting, and Complexity', time: '25 mins' },
        { id: 8, title: 'SQL Proficiency', description: 'Joins, Queries, Constraints, and Normalization', time: '20 mins' },
    ];

    const handleStartTest = (testId) => {
        setSelectedTestId(testId);
        setShowDifficultyModal(true);
    };

    const handleDifficultySelect = (level) => {
        setShowDifficultyModal(false);
        navigate(`/test/${selectedTestId}?level=${level}`);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
            case 'Advanced': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const [dynamicTests, setDynamicTests] = useState([]);

    useEffect(() => {
        const fetchDynamicTests = async () => {
            try {
                // Simplified query to avoid index requirement (active == true + orderBy createdAt requires composite index)
                const q = query(collection(db, 'tests'), where('active', '==', true));
                const snapshot = await getDocs(q);
                let loadedTests = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    time: `${doc.data().duration} mins`
                }));

                // Sort client-side instead
                loadedTests.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                    return dateB - dateA;
                });

                setDynamicTests(loadedTests);
            } catch (error) {
                console.error("Error fetching dynamic tests:", error);
            }
        };
        fetchDynamicTests();
    }, []);

    const allTests = [...tests, ...dynamicTests];

    useEffect(() => {
        const fetchResults = async () => {
            if (currentUser) {
                const resultsData = {};
                for (const test of allTests) {
                    try {
                        const docRef = doc(db, "users", currentUser.uid, "testResults", String(test.id));
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            resultsData[test.id] = docSnap.data();
                        }
                    } catch (error) {
                        console.error("Error fetching results:", error);
                    }
                }
                setResults(resultsData);
            }
            setLoading(false);
        };

        if (dynamicTests.length > 0 || !loading) { // Trigger when dynamic tests are loaded or if we just rely on statics
            fetchResults();
        }
    }, [currentUser, dynamicTests]);

    const generalResult = results[1];
    const isGeneralPassed = generalResult && (generalResult.score / generalResult.total) >= 0.7;

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 bg-gray-50 dark:bg-brand-dark container mx-auto transition-colors duration-300">
            <div className="mb-12 animate-fade-in">
                <h1 className="text-4xl font-display font-bold gradient-text mb-2">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage and track your assessment progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {allTests.map((test, index) => {
                    const result = results[test.id];

                    return (
                        <div
                            key={test.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className={`animate-slide-up group relative glass rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-primary/20 hover:border-brand-primary/30`}
                        >
                            <div className="bg-white/50 dark:bg-slate-900/50 rounded-xl p-6 h-full flex flex-col transition-colors duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-xs font-semibold text-gray-500 bg-gray-200/50 dark:bg-black/30 px-3 py-1 rounded-full border border-gray-200 dark:border-white/5">
                                            ⏱ {test.time}
                                        </span>
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold font-display text-gray-800 dark:text-white mb-2">{test.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">{test.description}</p>

                                {result && (
                                    <div className="mb-4 text-sm font-medium flex items-center justify-between bg-green-500/10 p-2 rounded border border-green-500/20 text-green-600 dark:text-green-400">
                                        <span>Last Score</span>
                                        <span>{result.score}/{result.total} ({((result.score / result.total) * 100).toFixed(0)}%)</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleStartTest(test.id)}
                                    className="mt-auto block w-full text-center bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-primary/20 transition-all active:scale-[0.98]"
                                >
                                    {result ? 'Retake Test' : 'Start Test'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Difficulty Modal */}
            {showDifficultyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-up border border-gray-100 dark:border-slate-700">
                        <h2 className="text-2xl font-bold font-display text-center mb-2 text-gray-800 dark:text-white">Select Difficulty</h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Choose a challenge level to begin your test.</p>

                        <div className="space-y-4">
                            <button
                                onClick={() => handleDifficultySelect('Beginner')}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all group dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
                            >
                                <span className="font-bold text-lg">Beginner</span>
                                <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-800 dark:text-green-100">Easy</span>
                            </button>

                            <button
                                onClick={() => handleDifficultySelect('Medium')}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all group dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/30"
                            >
                                <span className="font-bold text-lg">Medium</span>
                                <span className="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded dark:bg-amber-800 dark:text-amber-100">Standard</span>
                            </button>

                            <button
                                onClick={() => handleDifficultySelect('Advanced')}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 transition-all group dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                            >
                                <span className="font-bold text-lg">Advanced</span>
                                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded dark:bg-red-800 dark:text-red-100">Hard</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowDifficultyModal(false)}
                            className="mt-6 w-full text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
