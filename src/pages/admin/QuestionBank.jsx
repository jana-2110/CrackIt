import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import QuestionUpload from '../../components/admin/QuestionUpload';
import QuestionForm from '../../components/admin/QuestionForm';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

const QuestionBank = () => {
    const [activeTab, setActiveTab] = useState('list'); // 'list', 'import', 'create'
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    // Fetch questions
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Fetch questions
    const fetchQuestions = async (isNextPage = false) => {
        setLoading(true);
        try {
            let q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(50));

            if (isNextPage && lastDoc) {
                q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(50));
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (snapshot.docs.length < 50) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (snapshot.docs.length > 0) {
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            }

            if (isNextPage) {
                setQuestions(prev => [...prev, ...data]);
            } else {
                setQuestions(data);
                if (snapshot.empty) setHasMore(false);
            }

        } catch (error) {
            console.error("Error fetching questions:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'list') {
            setLastDoc(null);
            setHasMore(true);
            fetchQuestions(false);
        }
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;

        setDeleteLoading(id);
        try {
            await deleteDoc(doc(db, 'questions', id));
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("Failed to delete question.");
        }
        setDeleteLoading(null);
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("CRITICAL WARNING: This will delete ALL questions in the database. This action CANNOT be undone.\n\nAre you sure you want to proceed?")) return;
        if (!window.confirm("Please confirm again: Do you really want to delete ALL questions?")) return;

        setLoading(true);
        try {
            const q = query(collection(db, 'questions'));
            const snapshot = await getDocs(q);

            if (snapshot.size === 0) {
                alert("No questions to delete.");
                setLoading(false);
                return;
            }

            // Firebase batch operations allow max 500 writes
            const batchSize = 500;
            const chunks = [];
            for (let i = 0; i < snapshot.docs.length; i += batchSize) {
                chunks.push(snapshot.docs.slice(i, i + batchSize));
            }

            for (const chunk of chunks) {
                const batch = writeBatch(db);
                chunk.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }

            setQuestions([]);
            setHasMore(false);
            setLastDoc(null);
            alert(`Successfully deleted ${snapshot.size} questions.`);
        } catch (error) {
            console.error("Error deleting all questions:", error);
            alert("Failed to delete questions: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Aptitude Question Bank</h1>
                    <p className="text-gray-400 text-sm">Manage, create, and upload questions for the aptitude tests.</p>
                </div>

                <div className="flex bg-black/50 rounded-xl p-1.5 border border-gray-700 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'list'
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        View Questions
                    </button>
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'import'
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Import / Upload
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 ml-2"
                    >
                        Delete All
                    </button>
                </div>
            </div>

            {activeTab === 'list' && (
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                        <h3 className="font-bold text-gray-300 text-sm uppercase tracking-wider">Recent Questions</h3>
                        <button onClick={() => fetchQuestions(false)} className="text-brand-primary hover:text-brand-secondary text-xs">
                            Refresh List
                        </button>
                    </div>

                    {loading && questions.length === 0 ? (
                        <div className="p-4">
                            <SkeletonLoader type="text" count={5} className="p-4" />
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 mb-4">No questions found in the database.</p>
                            <button onClick={() => setActiveTab('import')} className="text-brand-primary underline hover:text-white">
                                Import some questions now
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800/50">
                            {questions.map((q) => (
                                <div key={q.id} className="p-6 hover:bg-white/5 transition-colors group">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${q.difficulty === 'hard' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                                                    q.difficulty === 'medium' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' :
                                                        'border-green-500/30 text-green-500 bg-green-500/10'
                                                    }`}>
                                                    {(q.difficulty || 'medium').toUpperCase()}
                                                </span>
                                                <span className="text-[10px] px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 bg-blue-500/10">
                                                    {(q.topic || 'General').toUpperCase()}
                                                </span>
                                            </div>
                                            <h4 className="text-white font-medium mb-3">{q.question}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                                                {q.options?.map((opt, idx) => (
                                                    <div key={idx} className={`flex items-center gap-2 ${opt === q.correctAnswer ? 'text-green-400 font-medium' : ''}`}>
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${opt === q.correctAnswer ? 'border-green-500 bg-green-500/20' : 'border-gray-600'
                                                            }`}>
                                                            {String.fromCharCode(65 + idx)}
                                                        </div>
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* <button className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg">
                                                ✏️
                                            </button> */}
                                            <button
                                                onClick={() => handleDelete(q.id)}
                                                disabled={deleteLoading === q.id}
                                                className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                                            >
                                                {deleteLoading === q.id ? '...' : '🗑️'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {hasMore && (
                        <div className="p-4 border-t border-gray-800 flex justify-center bg-gray-900/50">
                            <button
                                onClick={() => fetchQuestions(true)}
                                disabled={loading}
                                className="text-sm text-brand-primary hover:text-white transition-colors font-medium flex items-center gap-2"
                            >
                                {loading ? 'Loading lines...' : 'Load More Questions'}
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'import' && (
                <div className="animate-fade-in">
                    <QuestionUpload />
                </div>
            )}

            {activeTab === 'create' && (
                <div className="animate-fade-in">
                    <QuestionForm />
                </div>
            )}
        </div>
    );
};

export default QuestionBank;
