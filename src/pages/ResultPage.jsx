import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

import AnalysisCharts from '../components/AnalysisCharts';
import ReviewMode from '../components/ReviewMode';

const ResultPage = () => {
    const location = useLocation();
    const { score, total, testId } = location.state || { score: 0, total: 0, testId: null };
    const percentage = total > 0 ? (score / total) * 100 : 0;
    const { currentUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const hasSaved = useRef(false);
    const [showQuote, setShowQuote] = useState(false);
    const [quote, setQuote] = useState("");

    // New State for Review
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Calculate detailed stats if questions exist
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    if (location.state?.questions) {
        location.state.questions.forEach((q, idx) => {
            const ans = location.state.answers[idx];
            if (ans === undefined) skippedCount++;
            else if (ans === q.correctAnswer) correctCount++;
            else wrongCount++;
        });
    }

    const demotivationalQuotes = [
        "Trying is the first step towards failure. 📉",
        "Not everyone gets to be an astronaut when they grow up. 🚀💥",
        "It could be worse, but it's hard to imagine how. 😬",
        "Maybe you should try a different career path? 🍔",
        "Consistently below average is still consistent. 📉",
        "Giving up is always an option. 🏳️",
        "If at first you don't succeed, stop looking like an idiot. 🙈",
        "Your potential is endless, but your results are... limited. 🛑",
        "Excellence is not a skill. It's an attitude. Which you lack. 💁‍♂️",
        "Dreams are just nightmares with better lighting. 😴"
    ];

    useEffect(() => {
        if (total > 0 && percentage < 50) {
            const randomQuote = demotivationalQuotes[Math.floor(Math.random() * demotivationalQuotes.length)];
            setQuote(randomQuote);
            setTimeout(() => setShowQuote(true), 1500); // Show popup after 1.5s
        }
    }, [percentage, total]);

    useEffect(() => {
        const saveScore = async () => {
            if (!currentUser || !testId || hasSaved.current) {
                console.log("Skipping save: User?", !!currentUser, "TestID?", testId, "Saved?", hasSaved.current);
                return;
            }

            // alert("Starting save for Test ID: " + testId);

            setSaving(true);
            hasSaved.current = true; // Prevent double saves

            try {
                // 1. Save individual test result
                // Use addDoc to create a new document for every attempt (History)
                // Include testId in the data since document ID is now auto-generated
                const resultsRef = collection(db, "users", currentUser.uid, "testResults");
                await addDoc(resultsRef, {
                    testId,
                    score,
                    total,
                    timestamp: new Date()
                });

                // 2. Update Leaderboard
                const leaderboardRef = doc(db, "leaderboard", currentUser.uid);
                const leaderboardSnap = await getDoc(leaderboardRef);

                let currentData = leaderboardSnap.exists() ? leaderboardSnap.data() : { scores: {}, totalScore: 0, email: currentUser.email };

                // Update specific test score if it doesn't exist or is higher
                // Update specific test score if it doesn't exist or is higher
                const previousTestScore = currentData.scores[testId] || 0;

                // ALWAYS update user metadata to ensure fresh profile pics/names
                currentData.email = currentUser.email;
                currentData.displayName = currentUser.displayName || currentUser.email.split('@')[0];
                currentData.photoURL = currentUser.photoURL || null;

                if (score > previousTestScore) {
                    currentData.scores[testId] = score;

                    // Recalculate total score
                    let newTotal = 0;
                    for (const key in currentData.scores) {
                        newTotal += currentData.scores[key];
                    }
                    currentData.totalScore = newTotal;

                    await setDoc(leaderboardRef, currentData);
                } else if (!leaderboardSnap.exists()) {
                    // First time entry for this user
                    currentData.scores[testId] = score;
                    currentData.totalScore = score;
                    await setDoc(leaderboardRef, currentData);
                } else {
                    // Score wasn't higher, but we still want to update metadata (name/photo)
                    // if it changed, without affecting scores.
                    await setDoc(leaderboardRef, currentData, { merge: true });
                }
                console.log("Score saved successfully");
                // alert("Score saved successfully!");
            } catch (error) {
                console.error("Error saving score:", error);
            } finally {
                setSaving(false);
            }
        };

        saveScore();
    }, [currentUser, testId, score, total]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-brand-dark py-8 px-4 md:py-12 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">

                {/* Header Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-purple-500/10 dark:from-brand-primary/5 dark:to-purple-500/5"></div>
                    <div className="p-8 md:p-12 text-center relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2 font-display">
                            Test Completed!
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Here is a breakdown of your performance.
                        </p>

                        <div className="mt-10 mb-8 flex flex-col items-center">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                {/* Simple circular background ring */}
                                <div className="absolute inset-0 rounded-full border-8 border-slate-100 dark:border-slate-700"></div>
                                {/* Score Text */}
                                <div className="text-center z-10">
                                    <span className="block text-6xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-brand-primary to-purple-500 tracking-tighter">
                                        {Math.round(percentage)}%
                                    </span>
                                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest mt-1">Accuracy</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-700 dark:text-gray-200">{score}</span>
                                <span className="text-slate-400">/ {total} Correct</span>
                            </div>

                            {saving && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-brand-primary animate-pulse font-medium">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Saving results...
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/dashboard"
                                className="px-8 py-3 rounded-2xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-600 hover:scale-105 transition-all shadow-sm"
                            >
                                Back to Dashboard
                            </Link>

                            {location.state?.questions && (
                                <button
                                    onClick={() => setIsReviewOpen(true)}
                                    className="px-8 py-3 rounded-2xl bg-brand-primary hover:bg-brand-secondary text-white font-bold shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/40 hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    Review Answers
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {location.state?.questions && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 group hover:translate-y-[-2px] transition-transform">
                            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{correctCount}</span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Correct</span>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 group hover:translate-y-[-2px] transition-transform">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </div>
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{wrongCount}</span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Incorrect</span>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 group hover:translate-y-[-2px] transition-transform">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"></path></svg>
                            </div>
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">{skippedCount}</span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skipped</span>
                        </div>
                    </div>
                )}

                {/* Analysis Charts (Optional - Keeping original chart component) */}
                {location.state?.questions && (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 overflow-hidden">
                        {/* Pass data to chart component, ensuring it fits the aesthetic if possible. 
                             For now, just wrapping it in the card style. */}
                        <AnalysisCharts
                            correct={correctCount}
                            wrong={wrongCount}
                            skipped={skippedCount}
                        />
                    </div>
                )}

                {/* Review Mode Modal */}
                {isReviewOpen && location.state?.questions && (
                    <ReviewMode
                        questions={location.state.questions}
                        answers={location.state.answers}
                        onClose={() => setIsReviewOpen(false)}
                    />
                )}

                {/* Demotivational Popup */}
                {showQuote && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
                        <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border-2 border-brand-primary transform transition-all scale-100 animate-scale-in">
                            <div className="text-5xl mb-6">🤦‍♂️</div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-display">Reality Check</h3>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 italic mb-8 leading-relaxed">"{quote}"</p>
                            <button
                                onClick={() => setShowQuote(false)}
                                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-brand-primary/25"
                            >
                                Whatever, Let's Retry
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultPage;
