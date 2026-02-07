import React, { useState } from 'react';

const ReviewMode = ({ questions, answers, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentQuestion = questions[currentIndex];
    const userAnswerIndex = answers[currentIndex];

    // Safety check
    if (!currentQuestion) return null;

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-brand-dark animate-fade-in">
            {/* Top Navigation Bar */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-4 shadow-sm flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">Review Mode</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Question {currentIndex + 1} of {questions.length}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow overflow-y-auto p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row stretch min-h-[500px]">

                        {/* Left Section: Question */}
                        <div className="md:w-5/12 lg:w-1/2 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col justify-center">
                            <span className="inline-flex self-start px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary uppercase tracking-wider mb-6">
                                Problem Statement
                            </span>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white leading-relaxed tracking-tight font-display">
                                <span dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></span>
                            </h3>

                            {/* Explanation or Search Fallback */}
                            {currentQuestion.explanation ? (
                                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 animate-fade-in">
                                    <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Explanation
                                    </h4>
                                    <p className="text-sm text-blue-600 dark:text-blue-200 mt-2 leading-relaxed">{currentQuestion.explanation}</p>
                                </div>
                            ) : (
                                <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-center animate-fade-in">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No explanation available for this question.</p>
                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(currentQuestion.question + " explanation")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm hover:shadow"
                                    >
                                        <svg className="w-4 h-4 text-brand-primary" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        Find Answer on Google
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Right Section: Options */}
                        <div className="md:w-7/12 lg:w-1/2 p-6 md:p-10 bg-white dark:bg-slate-800 flex flex-col justify-center">
                            <div className="grid grid-cols-1 gap-4">
                                {currentQuestion.options.map((option, idx) => {
                                    const isSelected = userAnswerIndex === idx;
                                    const isCorrect = currentQuestion.correctAnswer === idx;

                                    let containerStyle = "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 opacity-70";
                                    let indicatorStyle = "border-slate-300 dark:border-slate-600";
                                    let textStyle = "text-slate-500 dark:text-slate-400";
                                    let icon = null;

                                    if (isCorrect) {
                                        containerStyle = "border-green-500 bg-green-50 dark:bg-green-900/10 opacity-100 shadow-sm";
                                        indicatorStyle = "border-green-500 bg-green-500 text-white";
                                        textStyle = "text-green-800 dark:text-green-200 font-medium";
                                        icon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>;
                                    } else if (isSelected && !isCorrect) {
                                        containerStyle = "border-red-500 bg-red-50 dark:bg-red-900/10 opacity-100 shadow-sm";
                                        indicatorStyle = "border-red-500 bg-red-500 text-white";
                                        textStyle = "text-red-800 dark:text-red-200 font-medium";
                                        icon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>;
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            className={`
                                                relative w-full p-4 md:p-5 rounded-2xl flex items-center gap-5 text-left border-2 transition-all duration-200 
                                                ${containerStyle}
                                            `}
                                        >
                                            {/* Status Indicator */}
                                            <div className={`
                                                flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                                ${indicatorStyle}
                                            `}>
                                                {icon}
                                            </div>

                                            {/* Option Content */}
                                            <div className="flex-1">
                                                <span
                                                    className={`text-base md:text-lg transition-colors duration-200 ${textStyle}`}
                                                    dangerouslySetInnerHTML={{ __html: option }}
                                                >
                                                </span>
                                                {isCorrect && (
                                                    <span className="block text-xs font-bold text-green-600 dark:text-green-400 mt-1 uppercase tracking-wider">Correct Answer</span>
                                                )}
                                                {isSelected && !isCorrect && (
                                                    <span className="block text-xs font-bold text-red-600 dark:text-red-400 mt-1 uppercase tracking-wider">Your Answer</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 z-10">
                <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        Previous
                    </button>

                    {/* Pagination Dots (Hidden on mobile) */}
                    <div className="hidden md:flex gap-1.5 overflow-x-auto max-w-[50%] p-2 no-scrollbar">
                        {questions.map((_, i) => {
                            const ans = answers[i];
                            const correct = questions[i].correctAnswer;
                            let dotColor = "bg-slate-200 dark:bg-slate-700";

                            if (ans === correct) dotColor = "bg-green-500";
                            else if (ans !== undefined) dotColor = "bg-red-500";

                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${dotColor} ${i === currentIndex ? 'ring-2 ring-brand-primary ring-offset-2 dark:ring-offset-slate-900 scale-125' : 'hover:scale-110'}`}
                                    title={`Question ${i + 1}`}
                                />
                            );
                        })}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentIndex === questions.length - 1}
                        className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed font-bold text-white shadow-lg shadow-brand-primary/25 transition-all flex items-center gap-2"
                    >
                        Next
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewMode;
