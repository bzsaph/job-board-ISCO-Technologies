
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly=false }) {
  const auth = useSelector(s => s.auth);
  if (!auth.token) return <Navigate to="/login" replace />;
  if (adminOnly && auth.user?.role !== 'admin') return <div className="p-4">Forbidden</div>;
  return children;
}
