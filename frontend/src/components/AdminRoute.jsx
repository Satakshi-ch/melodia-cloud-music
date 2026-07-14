import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center animate-bounce shadow-brand-neon">
          <span className="text-2xl">🎵</span>
        </div>
        <p className="mt-4 text-gray-400 font-display text-sm tracking-wider animate-pulse">
          VERIFYING ACCESS...
        </p>
      </div>
    );
  }

  // Redirect to dashboard or landing if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
