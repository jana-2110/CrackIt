import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, setDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, startAfter, collectionGroup, where, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import SkeletonLoader from '../../components/admin/SkeletonLoader';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TestManager = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');

    // Creation State
    const [formData, setFormData] = useState({
        title: '',
        duration: 30, // minutes
        description: '',
        type: 'aptitude' // 'aptitude', 'coding', 'mixed'
    });
    const [creating, setCreating] = useState(false);

    // Edit Mode State
    const [editingTest, setEditingTest] = useState(null);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
    const [qLoading, setQLoading] = useState(false);

    // List State
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchTests = async (isNextPage = false) => {
        setLoading(true);
        try {
            // Simplified query to ensure no index errors
            let q = query(collection(db, 'tests'), limit(20));

            if (isNextPage && lastDoc) {
                q = query(collection(db, 'tests'), startAfter(lastDoc), limit(20));
            }

            const snapshot = await getDocs(q);
            let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Client-side sort
            data.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });

            if (snapshot.docs.length < 20) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (snapshot.docs.length > 0) {
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            }

            if (isNextPage) {
                setTests(prev => [...prev, ...data]);
            } else {
                setTests(data);
                if (snapshot.empty) setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'list') {
            setLastDoc(null);
            setHasMore(true);
            fetchTests(false);
        }
    }, [activeTab]);

    // Fetch available questions for selection
    const fetchAllQuestions = async () => {
        setQLoading(true);
        try {
            const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(100)); // Limit 100 for now
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAvailableQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
        setQLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await addDoc(collection(db, 'tests'), {
                ...formData,
                createdAt: serverTimestamp(),
                active: true,
                questionCount: 0
            });
            alert("Test created successfully!");
            setActiveTab('list');
            setFormData({ title: '', duration: 30, description: '', type: 'aptitude' });
        } catch (error) {
            console.error("Error creating test:", error);
            alert("Failed to create test.");
        }
        setCreating(false);
    };

    const handleEditClick = (test) => {
        setEditingTest(test);
        setFormData({
            title: test.title,
            duration: test.duration,
            description: test.description,
            type: test.type
        });
        setSelectedQuestionIds(test.questions || []);
        setActiveTab('edit'); // Switch to edit view
        fetchAllQuestions();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingTest) return;
        setCreating(true);

        try {
            const testRef = doc(db, 'tests', editingTest.id);
            await setDoc(testRef, {
                ...formData,
                questions: selectedQuestionIds,
                questionCount: selectedQuestionIds.length,
                updatedAt: serverTimestamp()
            }, { merge: true });

            alert("Test updated successfully!");
            setActiveTab('list');
            setEditingTest(null);
            setFormData({ title: '', duration: 30, description: '', type: 'aptitude' });
            setSelectedQuestionIds([]);
        } catch (error) {
            console.error("Error updating test:", error);
            alert("Failed to update test.");
        }
        setCreating(false);
    };

    const handleDelete = async (testId) => {
        if (!window.confirm("Are you sure you want to delete this test? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, 'tests', testId));
            setTests(prev => prev.filter(t => t.id !== testId));
            alert("Test deleted successfully.");
        } catch (error) {
            console.error("Error deleting test:", error);
            alert("Failed to delete test.");
        }
    };

    const handleDownloadResults = async (test) => {
        const testId = test.id;
        const testTitle = test.title;
        alert(`Generating report for ${testTitle}... This might take a moment as we check all users.`);

        try {
            const reportData = [];

            // 1. Get all users
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);

            if (usersSnapshot.empty) {
                alert("No users found in the system (other than potentially you).");
                return;
            }

            console.log(`Found ${usersSnapshot.size} total users. Scanning for results...`);

            // 2. For each user, check their testResults
            const promises = usersSnapshot.docs.map(async (userDoc) => {
                const userData = userDoc.data();
                const userName = userData.displayName || 'User';
                const userEmail = userData.email || 'No Email';

                try {
                    // Query specific user's results
                    const resultsRef = collection(db, 'users', userDoc.id, 'testResults');
                    // Query for this specific test
                    const q = query(resultsRef, where('testId', '==', String(testId)));
                    const resultSnap = await getDocs(q);

                    if (!resultSnap.empty) {
                        resultSnap.forEach(doc => {
                            const data = doc.data();
                            reportData.push({
                                name: userName,
                                email: userEmail,
                                score: data.score,
                                total: data.total,
                                percentage: data.total > 0 ? ((data.score / data.total) * 100).toFixed(1) + '%' : '0%',
                                date: data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'
                            });
                        });
                    }
                } catch (err) {
                    // Ignore permission errors for other users if strict rules apply
                    console.warn(`Skipping user ${userDoc.id}:`, err);
                }
            });

            await Promise.all(promises);

            if (reportData.length === 0) {
                alert("No results found for this test yet. (Checked " + usersSnapshot.size + " users)");
                return;
            }

            // Generate PDF
            const pdfDoc = new jsPDF();
            pdfDoc.text(`${testTitle} - Results Report`, 14, 15);
            pdfDoc.setFontSize(10);
            pdfDoc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
            pdfDoc.text(`Total Records: ${reportData.length}`, 14, 28);

            // Use independent function call instead of prototype
            autoTable(pdfDoc, {
                startY: 35,
                head: [['Name', 'Email', 'Score', 'Total', '%', 'Date']],
                body: reportData.map(r => [r.name, r.email, r.score, r.total, r.percentage, r.date]),
            });

            pdfDoc.save(`${testTitle}_Results.pdf`);
            console.log("Report generated successfully!");

        } catch (error) {
            console.error("Error downloading results:", error);
            alert("Failed to download results. Error: " + error.message);
        }
    };

    const toggleQuestionSelection = (qId) => {
        setSelectedQuestionIds(prev => {
            if (prev.includes(qId)) {
                return prev.filter(id => id !== qId);
            } else {
                return [...prev, qId];
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header ... */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Test Management</h1>
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Active Tests
                    </button>
                    <button
                        onClick={() => { setActiveTab('create'); setEditingTest(null); setFormData({ title: '', duration: 30, description: '', type: 'aptitude' }); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'create' ? 'bg-brand-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Create New Exam
                    </button>
                </div>
            </div>

            {/* LIST TAB */}
            {activeTab === 'list' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* ... mapping tests ... */}
                        {loading ? (
                            <div className="col-span-full"><SkeletonLoader type="card" count={3} /></div>
                        ) : tests.length === 0 ? (
                            <div className="col-span-full text-center py-12"><p className="text-gray-500">No exams configured.</p></div>
                        ) : (
                            tests.map(test => (
                                <div key={test.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 hover:border-brand-primary/50 transition-colors">
                                    <h3 className="text-lg font-bold text-white">{test.title}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{test.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-mono">
                                        <span>🕒 {test.duration} mins</span>
                                        <span>📝 {test.questionCount || (test.questions ? test.questions.length : 0)} Qs</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(test)}
                                            className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-2 rounded-lg text-xs font-bold transition-colors">
                                            Edit & Select Questions
                                        </button>
                                        <button
                                            onClick={() => handleDownloadResults(test)}
                                            className="px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 py-2 rounded-lg text-xs font-bold transition-colors"
                                            title="Download Results Report">
                                            📥
                                        </button>
                                        <button
                                            onClick={() => handleDelete(test.id)}
                                            className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 rounded-lg text-xs font-bold transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* CREATE & EDIT FORMS */}
            {(activeTab === 'create' || activeTab === 'edit') && (
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-6">
                        {activeTab === 'edit' ? `Edit Test: ${editingTest?.title}` : 'Create New Exam'}
                    </h2>

                    <form onSubmit={activeTab === 'edit' ? handleUpdate : handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Exam Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Duration (mins)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                                rows={2}
                            />
                        </div>

                        {/* Question Selection (Only in Edit Mode for efficiency) */}
                        {activeTab === 'edit' && (
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-white">Select Questions ({selectedQuestionIds.length})</h3>
                                    <button type="button" onClick={fetchAllQuestions} className="text-xs text-brand-primary">Refresh Questions</button>
                                </div>

                                {qLoading ? <SkeletonLoader type="text" count={3} /> : (
                                    <div className="h-64 overflow-y-auto bg-black/50 border border-gray-800 rounded-lg p-2 space-y-2">
                                        {availableQuestions.map(q => (
                                            <div
                                                key={q.id}
                                                onClick={() => toggleQuestionSelection(q.id)}
                                                className={`p-3 rounded cursor-pointer border transition-all flex justify-between items-start gap-4 ${selectedQuestionIds.includes(q.id)
                                                    ? 'bg-brand-primary/20 border-brand-primary'
                                                    : 'bg-gray-900 border-transparent hover:bg-gray-800'
                                                    }`}
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-200">{q.question}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1 rounded">{q.difficulty}</span>
                                                        <span className="text-[10px] bg-gray-800 text-gray-400 px-1 rounded">{q.topic}</span>
                                                    </div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedQuestionIds.includes(q.id) ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-600'
                                                    }`}>
                                                    {selectedQuestionIds.includes(q.id) && '✓'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setActiveTab('list')}
                                className="px-6 py-2 text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating}
                                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-8 rounded-lg"
                            >
                                {creating ? 'Saving...' : (activeTab === 'edit' ? 'Update Test' : 'Create Test')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TestManager;
