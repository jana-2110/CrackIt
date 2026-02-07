import React from 'react';

const QuestionPalette = ({
    totalQuestions,
    currentQuestionIndex,
    onQuestionSelect,
    answers,
    markedForReview,
    visited
}) => {
    return (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-slate-700 pb-2">
                Question Palette
            </h3>

            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {Array.from({ length: totalQuestions }, (_, i) => {
                        const isCurrent = i === currentQuestionIndex;
                        const isAnswered = answers[i] !== undefined;
                        const isMarked = markedForReview[i];
                        const isVisited = visited[i];

                        let bgClass = "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"; // Default/Unvisited
                        let borderClass = "border-transparent";

                        if (isCurrent) {
                            borderClass = "border-brand-primary ring-2 ring-brand-primary/30";
                        }

                        if (isMarked) {
                            bgClass = "bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-400";
                            if (isCurrent) borderClass += " border-yellow-500";
                        } else if (isAnswered) {
                            bgClass = "bg-green-100 text-green-700 border-green-400 dark:bg-green-900/30 dark:text-green-400";
                            if (isCurrent) borderClass += " border-green-500";
                        } else if (isVisited) {
                            bgClass = "bg-gray-200 text-gray-700 dark:bg-slate-600 dark:text-gray-300";
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => onQuestionSelect(i)}
                                className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200
                                    ${bgClass} ${borderClass} border-2 hover:opacity-80 hover:scale-105
                                `}
                            >
                                {i + 1}
                                {isMarked && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-100 border border-green-400 dark:bg-green-900/30"></div>
                    <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-400 dark:bg-yellow-900/30"></div>
                    <span>Review</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-slate-600"></div>
                    <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-100 border dark:bg-slate-700"></div>
                    <span>Not Visited</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionPalette;
