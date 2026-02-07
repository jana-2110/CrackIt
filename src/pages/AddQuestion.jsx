import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const AddQuestion = () => {
    const [formData, setFormData] = useState({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'optionA',
        category: 'general'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'questions'), {
                question: formData.question,
                options: {
                    a: formData.optionA,
                    b: formData.optionB,
                    c: formData.optionC,
                    d: formData.optionD
                },
                correctAnswer: formData.correctAnswer,
                category: formData.category,
                createdAt: serverTimestamp()
            });
            alert('Question added successfully!');
            setFormData({
                question: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                correctAnswer: 'optionA',
                category: 'general'
            });
        } catch (error) {
            console.error("Error adding question:", error);
            alert('Error adding question');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-8 rounded-xl w-full max-w-lg space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">Add New Question</h2>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Question Text</label>
                    <textarea
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-brand-primary outline-none h-24"
                        placeholder="Enter your question here..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                        <div key={opt} className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Option {opt}</label>
                            <input
                                type="text"
                                name={`option${opt}`}
                                value={formData[`option${opt}`]}
                                onChange={handleChange}
                                required
                                className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:border-brand-primary outline-none"
                            />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Correct Answer</label>
                        <select
                            name="correctAnswer"
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:border-brand-primary outline-none"
                        >
                            <option value="optionA">Option A</option>
                            <option value="optionB">Option B</option>
                            <option value="optionC">Option C</option>
                            <option value="optionD">Option D</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                        >
                            <option value="general">General</option>
                            <option value="math">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="history">History</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 rounded-lg transition-colors"
                >
                    {loading ? 'Adding...' : 'Add Question'}
                </button>
            </form>
        </div>
    );
};

export default AddQuestion;
