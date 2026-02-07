import React from 'react';

const PlaceholderPage = ({ title }) => {
    return (
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Coming Soon</h2>
            <p className="text-gray-500">{title} module is currently under development.</p>
        </div>
    );
};

export default PlaceholderPage;
