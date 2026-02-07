import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-brand-primary/20 animate-spin border-t-brand-primary"></div>

                {/* Inner Pulse */}
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-brand-primary/10 animate-pulse"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
