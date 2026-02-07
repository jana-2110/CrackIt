import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const QuestionForm = () => {
    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: '',
        topic: 'General',
        difficulty: 'medium',
        explanation: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate Options
            const options = [
                formData.option1,
                formData.option2,
                formData.option3,
                formData.option4
            ].filter(o => o.trim() !== '');

            if (options.length < 2) {
                alert("Please provide at least 2 options.");
                setLoading(false);
                return;
            }

            // Validate Correct Answer matches one option
            if (!options.includes(formData.correctAnswer)) {
                alert("The correct answer must match one of the options exactly.");
                setLoading(false);
                return;
            }

            const questionDoc = {
                question: formData.question,
                options: options,
                correctAnswer: formData.correctAnswer,
                topic: formData.topic,
                difficulty: formData.difficulty,
                explanation: formData.explanation,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'questions'), questionDoc);

            alert("Question added successfully!");
            setFormData({
                question: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                correctAnswer: '',
                topic: 'General',
                difficulty: 'medium',
                explanation: ''
            });

        } catch (error) {
            console.error("Error adding question:", error);
            alert("Failed to add question: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">Create New Question</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Question Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Question</label>
                    <textarea
                        name="question"
                        required
                        value={formData.question}
                        onChange={handleChange}
                        rows="3"
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-primary outline-none"
                        placeholder="Enter the question text here..."
                    ></textarea>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num}>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Option {num}</label>
                            <input
                                type="text"
                                name={`option${num}`}
                                required={num <= 2} // First 2 required
                                value={formData[`option${num}`]}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                                placeholder={`Option ${num}`}
                            />
                        </div>
                    ))}
                </div>

                {/* Answer & Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Correct Answer</label>
                        <select
                            name="correctAnswer"
                            required
                            value={formData.correctAnswer}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                        >
                            <option value="">Select Correct Option</option>
                            {[1, 2, 3, 4].filter(n => formData[`option${n}`]).map(n => (
                                <option key={n} value={formData[`option${n}`]}>
                                    {formData[`option${n}`]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Topic</label>
                        <input
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                            placeholder="e.g. Math, Logic"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-primary outline-none"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Explanation */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Explanation (Optional)</label>
                    <textarea
                        name="explanation"
                        value={formData.explanation}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-gray-500 outline-none text-sm"
                        placeholder="Explain why this answer is correct..."
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-8 rounded-lg shadow-lg hover:shadow-brand-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Create Question'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionForm;
