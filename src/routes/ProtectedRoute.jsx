import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgLight dark:bg-bgDark">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If trying to access admin dashboard, redirect to admin login, else user login
    const isAccessingAdmin = location.pathname.startsWith('/admin');
    return <Navigate to={isAccessingAdmin ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Authenticated but does not have the required role
    return <Navigate to="/" replace />;
  }

  return children;
};
