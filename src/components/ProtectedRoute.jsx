import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoute() {
  const { user } = useAuth();
  // console.log('user', user);

  // If the user is not logged in, navigate to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user is logged in, render the nested routes (children)
  return <Outlet />;
}

export default ProtectedRoute;
