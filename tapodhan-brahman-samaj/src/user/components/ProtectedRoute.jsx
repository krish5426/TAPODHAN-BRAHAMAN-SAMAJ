import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('user_token');
  
  if (!token) {
    alert('Please login to access business registration');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;