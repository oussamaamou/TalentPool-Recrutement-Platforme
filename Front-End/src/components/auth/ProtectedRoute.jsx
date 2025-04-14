import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (role && user.role !== role) {

    switch(user.role) {
      case 'Administrateur':
        return <Navigate to="/admin/dashboard" />;

      case 'Recruteur':
        return <Navigate to="/recruteur/dashboard" />;

      case 'Candidat':
        return <Navigate to="/candidat/dashboard" />;

      default:
        return <Navigate to="/" />;
    }
  }
  
  return <Outlet />;
};

export default ProtectedRoute;