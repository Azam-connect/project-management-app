import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../loader/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const authData = sessionStorage.getItem('authentication');
  const parsed = authData ? JSON.parse(authData) : null;
  const token = parsed?.access_token;

  const { userType } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userType) {
      setLoading(false);
    }
  }, [userType]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <Loader />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
