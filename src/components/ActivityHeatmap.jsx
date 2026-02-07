import React from 'react';

const ActivityHeatmap = ({ recentResults = [] }) => {
    // 1. Generate last 60 days
    const days = [];
    const today = new Date();
    for (let i = 59; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d);
    }

    // 2. Map activity
    const activityMap = {};
    recentResults.forEach(r => {
        const dateStr = r.date.toDateString();
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
    });

    // 3. Helper for color intensity
    const getColor = (count) => {
        if (!count) return 'bg-slate-100 dark:bg-slate-800'; // Empty
        if (count === 1) return 'bg-indigo-200 dark:bg-indigo-900/40';
        if (count <= 3) return 'bg-indigo-400 dark:bg-indigo-700';
        return 'bg-indigo-600 dark:bg-indigo-500'; // High activity
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Study Consistency</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-indigo-200 dark:bg-indigo-900/40"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-indigo-400 dark:bg-indigo-700"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-indigo-600 dark:bg-indigo-500"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[700px]"> {/* Ensure min width for grid */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1 w-fit mx-auto sm:mx-0">
                        {days.map((date, idx) => {
                            const dateStr = date.toDateString();
                            const count = activityMap[dateStr] || 0;
                            return (
                                <div
                                    key={idx}
                                    className={`w-3 h-3 rounded-sm ${getColor(count)} transition-colors hover:ring-2 ring-indigo-300 dark:ring-indigo-600 relative group cursor-pointer`}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap pointer-events-none transition-opacity z-10">
                                        {count} tests on {date.toLocaleDateString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Showing activity for the last 60 days</p>
        </div>
    );
};

export default ActivityHeatmap;
