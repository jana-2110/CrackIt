import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Add admin check logic here
    if (adminOnly && currentUser?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
