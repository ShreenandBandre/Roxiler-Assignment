import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';;

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }

  return children;
};

export default ProtectedRoute;