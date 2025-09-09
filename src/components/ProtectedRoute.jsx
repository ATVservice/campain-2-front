import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import Spinner from './Spinner';

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return null; // Don't render anything until navigate redirects
  }

return (
      <Outlet />             
)}

export default ProtectedRoute;
