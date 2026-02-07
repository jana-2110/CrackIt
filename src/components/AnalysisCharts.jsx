import React from 'react';

const AnalysisCharts = ({ correct, wrong, skipped }) => {
    const total = correct + wrong + skipped;

    // Calculate percentages for the pie chart
    // We'll use a simple CSS conic-gradient approach for a lightweight pie chart
    // correct (green), wrong (red), skipped (gray/yellow)

    const correctDeg = (correct / total) * 360;
    const wrongDeg = (wrong / total) * 360;
    const skippedDeg = (skipped / total) * 360;

    // Cumulative degrees for gradient stops
    const stop1 = correctDeg;
    const stop2 = correctDeg + wrongDeg;

    const chartStyle = {
        background: `conic-gradient(
            #22c55e 0deg ${stop1}deg, 
            #ef4444 ${stop1}deg ${stop2}deg, 
            #fbbf24 ${stop2}deg 360deg
        )`
    };

    return (
        <div className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-slate-700 mb-8 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Performance Breakdown</h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                {/* Visual Chart */}
                <div className="relative w-48 h-48 rounded-full shadow-xl" style={chartStyle}>
                    {/* Inner circle for donut effect */}
                    <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold dark:text-white">{Math.round((correct / total) * 100)}%</span>
                        <span className="text-xs text-gray-500 uppercase font-bold">Accuracy</span>
                    </div>
                </div>

                {/* Legend / Stats */}
                <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span>
                            <span className="font-medium text-green-900 dark:text-green-300">Correct</span>
                        </div>
                        <span className="font-bold text-green-700 dark:text-green-400">{correct}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
                            <span className="font-medium text-red-900 dark:text-red-300">Wrong</span>
                        </div>
                        <span className="font-bold text-red-700 dark:text-red-400">{wrong}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
                            <span className="font-medium text-amber-900 dark:text-amber-300">Skipped</span>
                        </div>
                        <span className="font-bold text-amber-700 dark:text-amber-400">{skipped}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisCharts;
