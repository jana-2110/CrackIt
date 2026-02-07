import React from 'react';

const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {[...Array(count)].map((_, index) => (
                <div key={index} className="animate-pulse">
                    {type === 'text' && (
                        <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    )}
                    {type === 'card' && (
                        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 h-48 space-y-4">
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-800 rounded w-12"></div>
                            </div>
                            <div className="h-4 bg-gray-800 rounded w-full"></div>
                            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                            <div className="pt-4 flex gap-2">
                                <div className="h-8 bg-gray-800 rounded w-1/2"></div>
                                <div className="h-8 bg-gray-800 rounded w-1/2"></div>
                            </div>
                        </div>
                    )}
                    {type === 'table-row' && (
                        <div className="flex items-center space-x-4 p-4">
                            <div className="rounded-full bg-gray-800 h-10 w-10"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-800 rounded w-1/6"></div>
                            </div>
                            <div className="h-4 bg-gray-800 rounded w-12"></div>
                            <div className="h-6 bg-gray-800 rounded w-16"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
