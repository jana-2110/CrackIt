import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase/config';
import SkeletonLoader from '../../components/admin/SkeletonLoader';

const CodingChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list'); // 'list', 'create'

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'medium',
        points: 10,
        timeLimit: 1000, // ms
        memoryLimit: 128, // MB
        template: '// Write your code here\n',
        testCases: [{ input: '', output: '', isHidden: false }]
    });

    const [creating, setCreating] = useState(false);

    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchChallenges = async (isNextPage = false) => {
        setLoading(true);
        try {
            let q = query(collection(db, 'codingChallenges'), orderBy('createdAt', 'desc'), limit(20));

            if (isNextPage && lastDoc) {
                q = query(collection(db, 'codingChallenges'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(20));
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (snapshot.docs.length < 20) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (snapshot.docs.length > 0) {
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            }

            if (isNextPage) {
                setChallenges(prev => [...prev, ...data]);
            } else {
                setChallenges(data);
                if (snapshot.empty) setHasMore(false);
            }

        } catch (error) {
            console.error("Error fetching challenges:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'list') {
            setLastDoc(null);
            setHasMore(true);
            fetchChallenges(false);
        }
    }, [activeTab]);

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...formData.testCases];
        newTestCases[index][field] = value;
        setFormData({ ...formData, testCases: newTestCases });
    };

    const addTestCase = () => {
        setFormData({
            ...formData,
            testCases: [...formData.testCases, { input: '', output: '', isHidden: false }]
        });
    };

    const removeTestCase = (index) => {
        if (formData.testCases.length === 1) return;
        const newTestCases = formData.testCases.filter((_, i) => i !== index);
        setFormData({ ...formData, testCases: newTestCases });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            await addDoc(collection(db, 'codingChallenges'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            alert("Challenge created successfully!");
            setActiveTab('list');
            setFormData({
                title: '',
                description: '',
                difficulty: 'medium',
                points: 10,
                timeLimit: 1000,
                memoryLimit: 128,
                template: '// Write your code here\n',
                testCases: [{ input: '', output: '', isHidden: false }]
            });
        } catch (error) {
            console.error("Error creating challenge:", error);
            alert("Failed to create challenge.");
        }
        setCreating(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this challenge?")) return;
        try {
            await deleteDoc(doc(db, 'codingChallenges', id));
            setChallenges(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting challenge:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Coding Challenges</h1>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Review Challenges
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'create' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Create New
                    </button>
                </div>
            </div>

            {activeTab === 'list' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading && challenges.length === 0 ? (
                            <div className="col-span-full">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <SkeletonLoader type="card" count={3} />
                                </div>
                            </div>
                        ) : challenges.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 mb-4">No coding challenges found.</p>
                                <button onClick={() => setActiveTab('create')} className="text-brand-primary underline">
                                    Create your first challenge
                                </button>
                            </div>
                        ) : (
                            challenges.map(challenge => (
                                <div key={challenge.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 hover:border-brand-primary/50 transition-colors group relative">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDelete(challenge.id)} className="text-red-500 hover:text-red-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${challenge.difficulty === 'hard' ? 'bg-red-500/10 text-red-500' :
                                            challenge.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-green-500/10 text-green-500'
                                            }`}>
                                            {challenge.difficulty}
                                        </span>
                                        <span className="text-xs text-gray-500 font-mono">{challenge.points} XP</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{challenge.title}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{challenge.description}</p>
                                    <div className="flex items-center text-xs text-gray-500 gap-4 mb-4">
                                        <span>⏱️ {challenge.timeLimit}ms</span>
                                        <span>💾 {challenge.memoryLimit}MB</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-1/3"></div>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-1 text-right">32 attempts</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Load More */}
                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => fetchChallenges(true)}
                                disabled={loading}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {loading && challenges.length > 0 ? 'Loading...' : 'Load More Challenges'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'create' && (
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Challenge Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                                    placeholder="e.g. Reverse a Linked List"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Difficulty</label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Points (XP)</label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Problem Description (Markdown)</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none font-sans text-sm"
                                placeholder="Describe the problem, input format, and constraints..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Starter Template Code</label>
                            <textarea
                                value={formData.template}
                                onChange={e => setFormData({ ...formData, template: e.target.value })}
                                rows={4}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:border-brand-primary outline-none font-mono text-sm"
                            />
                        </div>

                        <div className="border-t border-gray-800 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">Test Cases</h3>
                                <button type="button" onClick={addTestCase} className="text-brand-primary hover:text-brand-secondary text-sm font-bold">
                                    + Add Case
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.testCases.map((tc, index) => (
                                    <div key={index} className="flex gap-4 items-start bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Input (e.g. 5, [1,2,3])"
                                                value={tc.input}
                                                onChange={e => handleTestCaseChange(index, 'input', e.target.value)}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-sm text-white font-mono"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Expected Output"
                                                value={tc.output}
                                                onChange={e => handleTestCaseChange(index, 'output', e.target.value)}
                                                className="w-full bg-black border border-gray-700 rounded px-3 py-1.5 text-sm text-white font-mono"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={tc.isHidden}
                                                    onChange={e => handleTestCaseChange(index, 'isHidden', e.target.checked)}
                                                    className="rounded bg-gray-700 border-gray-600 text-brand-primary focus:ring-0"
                                                />
                                                <span className="text-xs text-gray-400">Hidden?</span>
                                            </label>
                                            {index > 0 && (
                                                <button type="button" onClick={() => removeTestCase(index)} className="text-red-500 hover:text-red-400 text-xs text-left">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={creating}
                                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
                            >
                                {creating ? 'Creating...' : 'Publish Challenge'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CodingChallenges;
