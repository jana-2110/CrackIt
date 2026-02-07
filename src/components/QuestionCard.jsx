import React from 'react';

const QuestionCard = ({ question, options, selectedOption, onOptionSelect, isMarked, onToggleReview }) => {
    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row stretch">

                {/* Left Section: Question */}
                <div className="md:w-5/12 lg:w-1/2 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Question
                        </span>

                        <button
                            onClick={onToggleReview}
                            className={`
                                relative group flex-shrink-0 p-2.5 rounded-xl transition-all duration-300 border
                                ${isMarked
                                    ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400'
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 dark:hover:text-slate-300'}
                            `}
                            title={isMarked ? "Unmark for Review" : "Mark for Review"}
                        >
                            <span className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ${isMarked ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-50 dark:bg-slate-700'} -z-10 group-hover:opacity-100`} />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isMarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isMarked ? 0 : 2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8l-6-5-6 5z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 flex items-center">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white leading-relaxed tracking-tight font-display">
                            <span dangerouslySetInnerHTML={{ __html: question }}></span>
                        </h3>
                    </div>
                </div>

                {/* Right Section: Options */}
                <div className="md:w-7/12 lg:w-1/2 p-6 md:p-10 bg-white dark:bg-slate-800 flex flex-col justify-center">
                    <div className="grid grid-cols-1 gap-4">
                        {options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            return (
                                <button
                                    key={index}
                                    onClick={() => onOptionSelect(index)}
                                    className={`
                                        group relative w-full p-4 md:p-5 rounded-2xl flex items-center gap-5 text-left transition-all duration-200 border-2
                                        ${isSelected
                                            ? 'border-brand-primary bg-brand-primary/5 shadow-md z-10'
                                            : 'border-slate-100 dark:border-slate-700 hover:border-brand-primary/30 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                                    `}
                                >
                                    {/* Selection Indicator */}
                                    <div className={`
                                        flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                        ${isSelected
                                            ? 'border-brand-primary bg-brand-primary text-white scale-105 shadow-sm'
                                            : 'border-slate-300 dark:border-slate-600 group-hover:border-brand-primary/50'}
                                    `}>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        )}
                                    </div>

                                    {/* Option Content */}
                                    <span
                                        className={`text-base md:text-lg font-medium transition-colors duration-200 ${isSelected
                                                ? 'text-brand-primary dark:text-brand-primary'
                                                : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: option }}
                                    >
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
