import React from 'react';

const TestStartScreen = ({ onStart, title, rules }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-gray-200 dark:border-slate-700 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-purple-600"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl"></div>

                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 relative z-10">
                    Ready to Start?
                </h2>
                <p className="text-brand-primary font-medium text-lg mb-8 relative z-10">{title}</p>

                <div className="text-left bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 mb-8 border border-gray-100 dark:border-slate-700/50 relative z-10">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4">Instructions</h4>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                        {rules.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold mt-0.5">
                                    {idx + 1}
                                </span>
                                <span>{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={onStart}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-purple-600 text-white font-bold text-lg shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative z-10"
                >
                    Start Test Now
                </button>
            </div>
        </div>
    );
};

export default TestStartScreen;
