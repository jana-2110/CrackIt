import React, { useState, useEffect } from 'react';

const Timer = ({ initialMinutes = 10, onTimeUp, isRunning = true }) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    // Update timeLeft if initialMinutes changes prop
    useEffect(() => {
        setTimeLeft(initialMinutes * 60);
    }, [initialMinutes]);

    useEffect(() => {
        if (!isRunning) return;

        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, onTimeUp, isRunning]); // Keeping dependency on timeLeft for now to minimal change, but ideally should be decoupled. 
    // Actually, let's decouple to restart only if necessary.

    const isCritical = timeLeft < 60;

    return (
        <div className={`
            flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg font-mono text-xl font-bold border-2 transition-colors duration-300
            ${isCritical
                ? 'bg-red-100 border-red-500 text-red-600 animate-pulse dark:bg-red-900/20 dark:border-red-500/50'
                : 'bg-white border-blue-100 text-blue-600 dark:bg-slate-800 dark:border-blue-500/30 dark:text-blue-400'}
        `}>
            <span className="text-2xl">⏱️</span>
            <span>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
        </div>
    );
};

export default Timer;
