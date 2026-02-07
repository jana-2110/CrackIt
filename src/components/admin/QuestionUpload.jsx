import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const QuestionUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [previewData, setPreviewData] = useState([]);

    // API State
    const [apiConfig, setApiConfig] = useState({
        amount: 10,
        category: 'custom-tech', // Default to Technical Interview
        difficulty: 'medium'
    });

    // Custom Category Mapping
    const CATEGORY_MAPPING = {
        'General Aptitude': { apiId: '9', label: 'General Aptitude' }, // Map to General Knowledge
        'Technical Interview': { apiId: '18', label: 'Technical Interview (Common)' }, // Map to Computers
        'LeetCode Challenge': { apiId: '18', label: 'LeetCode Challenge' }, // Map to Computers
        'DSA': { apiId: '18', label: 'Data Structures & Algorithms' }, // Map to Computers
        'SQL Proficiency': { apiId: '18', label: 'SQL Proficiency' }, // Map to Computers
        'mixed': { apiId: '', label: 'Mixed Categories' }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setLogs([]);
        setPreviewData([]);

        if (selectedFile) {
            readExcel(selectedFile);
        }
    };

    const readExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            setPreviewData(jsonData);
        };
        reader.readAsBinaryString(file);
    };

    const handleUpload = async () => {
        if (!previewData.length) {
            addLog("No data to upload.", "error");
            return;
        }

        setLoading(true);
        addLog(`Starting upload of ${previewData.length} questions...`, "info");

        let successCount = 0;
        let failCount = 0;

        try {
            // Process in chunks to avoid overwhelming the UI or network
            const chunks = [];
            for (let i = 0; i < previewData.length; i += 50) {
                chunks.push(previewData.slice(i, i + 50));
            }

            for (const chunk of chunks) {
                const promises = chunk.map(async (row, index) => {
                    try {
                        // Normalize Data
                        if (!row.question || !row.correctAnswer) {
                            throw new Error("Missing required fields (question or correctAnswer)");
                        }

                        // Robustly handle options columns
                        const options = [
                            row.option1?.toString(),
                            row.option2?.toString(),
                            row.option3?.toString(),
                            row.option4?.toString()
                        ].filter(o => o !== undefined && o !== null && o !== "").map(String);

                        if (options.length < 2) {
                            // Fallback logic could go here
                        }

                        const questionDoc = {
                            question: row.question,
                            options: options,
                            correctAnswer: row.correctAnswer.toString(),
                            topic: row.topic || "General",
                            difficulty: row.difficulty || "Medium",
                            explanation: row.explanation || "",
                            createdAt: serverTimestamp()
                        };

                        await addDoc(collection(db, "questions"), questionDoc);
                        return true;
                    } catch (err) {
                        console.error("Row error:", err);
                        return false;
                    }
                });

                const results = await Promise.all(promises);
                const chunkSuccess = results.filter(r => r).length;
                successCount += chunkSuccess;
                failCount += (results.length - chunkSuccess);

                await new Promise(r => setTimeout(r, 100));
            }

            addLog(`Upload Complete! Success: ${successCount}, Failed: ${failCount}`, "success");
            if (successCount > 0) {
                alert(`Successfully uploaded ${successCount} questions.`);
                setFile(null);
                setPreviewData([]);
            }

        } catch (error) {
            console.error("Batch Upload Error:", error);
            addLog(`Critical Error: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleApiFetch = async () => {
        setLoading(true);
        addLog(`Fetching ${apiConfig.amount} questions from Open Trivia DB...`, "info");

        try {
            // Determine API Category ID
            let apiCategoryId = '';
            let topicLabel = 'General';

            const selectedCat = Object.entries(CATEGORY_MAPPING).find(([key, val]) => val.label === apiConfig.category);

            if (selectedCat) {
                apiCategoryId = selectedCat[1].apiId;
                topicLabel = selectedCat[1].label;
            } else if (CATEGORY_MAPPING[apiConfig.category]) {
                apiCategoryId = CATEGORY_MAPPING[apiConfig.category].apiId;
                topicLabel = CATEGORY_MAPPING[apiConfig.category].label;
            } else if (apiConfig.category === 'mixed') {
                apiCategoryId = '';
                topicLabel = 'General';
            }

            // Fallback for custom categories values from dropdown
            if (apiConfig.category === 'General Aptitude') { apiCategoryId = '9'; topicLabel = 'General Aptitude'; }
            if (apiConfig.category === 'Technical Interview') { apiCategoryId = '18'; topicLabel = 'Technical Interview (Common)'; }
            if (apiConfig.category === 'LeetCode Challenge') { apiCategoryId = '18'; topicLabel = 'LeetCode Challenge'; }
            if (apiConfig.category === 'DSA') { apiCategoryId = '18'; topicLabel = 'Data Structures & Algorithms'; }
            if (apiConfig.category === 'SQL Proficiency') { apiCategoryId = '18'; topicLabel = 'SQL Proficiency'; }


            const url = `https://opentdb.com/api.php?amount=${apiConfig.amount}&category=${apiCategoryId}&difficulty=${apiConfig.difficulty}&type=multiple`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.response_code !== 0) {
                throw new Error("API returned no results or error code: " + data.response_code);
            }

            addLog(`Fetched ${data.results.length} questions. Saving as '${topicLabel}'...`, "info");

            let successCount = 0;
            const promises = data.results.map(async (item) => {
                try {
                    // Decode HTML entities
                    const decodeHtml = (html) => {
                        const txt = document.createElement("textarea");
                        txt.innerHTML = html;
                        return txt.value;
                    };

                    const questionText = decodeHtml(item.question);
                    const correctAnswer = decodeHtml(item.correct_answer);
                    const incorrectAnswers = item.incorrect_answers.map(decodeHtml);

                    // Shuffle options
                    const options = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

                    const questionDoc = {
                        question: questionText,
                        options: options,
                        correctAnswer: correctAnswer,
                        topic: topicLabel, // Save with the USER'S custom label
                        difficulty: item.difficulty,
                        explanation: `Imported for ${topicLabel}`,
                        createdAt: serverTimestamp()
                    };

                    await addDoc(collection(db, "questions"), questionDoc);
                    successCount++;
                    return true;
                } catch (err) {
                    console.error("API Question Save Error:", err);
                    return false;
                }
            });

            await Promise.all(promises);
            addLog(`API Import Complete! Saved ${successCount} questions.`, "success");
            alert(`Successfully imported ${successCount} questions from API.`);

        } catch (error) {
            console.error("API Fetch Error:", error);
            addLog(`API Error: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const addLog = (message, type) => {
        setLogs(prev => [...prev, { message, type, timestamp: new Date() }]);
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Bulk Question Upload (Excel)</h2>
                {/* ... existing Excel input UI ... */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-brand-primary file:text-white
                                hover:file:bg-brand-primary/80
                            "
                        />
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading || previewData.length === 0}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-colors whitespace-nowrap"
                        >
                            {loading ? "Uploading..." : "Upload Excel"}
                        </button>
                        {previewData.length > 0 && (
                            <span className="text-sm text-gray-400 whitespace-nowrap">
                                {previewData.length} records found
                            </span>
                        )}
                    </div>
                    {/* Instructions */}
                    <div className="text-xs text-gray-500 bg-gray-950 p-4 rounded border border-gray-800 font-mono">
                        <p className="font-bold mb-2 text-brand-secondary">REQUIRED EXCEL COLUMNS:</p>
                        <p className="break-words">question, option1, option2, option3, option4, correctAnswer, topic, difficulty, explanation</p>
                    </div>
                </div>
            </div>

            {/* API Fetch Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Fetch from Open Trivia API</h2>
                    <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-500/20">NEW FEATURE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Category</label>
                        <select
                            value={apiConfig.category}
                            onChange={(e) => setApiConfig({ ...apiConfig, category: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-brand-primary outline-none"
                        >
                            <option value="General Aptitude">General Aptitude</option>
                            <option value="Technical Interview">Technical Interview (Common)</option>
                            <option value="LeetCode Challenge">LeetCode Challenge</option>
                            <option value="DSA">Data Structures & Algorithms</option>
                            <option value="SQL Proficiency">SQL Proficiency</option>
                            <option value="mixed">Mixed (All Categories)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
                        <select
                            value={apiConfig.difficulty}
                            onChange={(e) => setApiConfig({ ...apiConfig, difficulty: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-brand-primary outline-none"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Amount</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={apiConfig.amount}
                            onChange={(e) => setApiConfig({ ...apiConfig, amount: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-brand-primary outline-none"
                        />
                    </div>
                    <div>
                        <button
                            onClick={handleApiFetch}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Fetching...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Fetch & Import
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Logs / Status */}
            {logs.length > 0 && (
                <div className="bg-black/50 p-4 rounded max-h-60 overflow-y-auto font-mono text-xs border border-gray-800 shadow-inner">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-800">
                        <span className="font-bold text-gray-500">SYSTEM LOGS</span>
                        <button onClick={() => setLogs([])} className="text-gray-600 hover:text-white">Clear</button>
                    </div>
                    {logs.map((log, idx) => (
                        <div key={idx} className={`mb-1 ${log.type === 'error' ? 'text-red-400' :
                            log.type === 'success' ? 'text-green-400' : 'text-blue-400'
                            }`}>
                            <span className="opacity-50">[{log.timestamp.toLocaleTimeString()}]</span> {log.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionUpload;
