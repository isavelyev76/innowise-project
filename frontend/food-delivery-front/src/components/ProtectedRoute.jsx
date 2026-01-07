import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (status === 'DEACTIVATED' && location.pathname !== '/reactivate') {
    return <Navigate to="/reactivate" replace />;
  }

  if (status === 'ACTIVE' && location.pathname === '/reactivate') {
    return <Navigate to="/restaurants" replace />;
  }

  if (requiredRole) {
    const currentRole = Array.isArray(role) ? (role.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER') : role;

    if (currentRole !== requiredRole) {
      return <div style={{ padding: 20 }}>Доступ запрещен. Нужна роль {requiredRole}</div>;
    }
  }

  return children;
};

export default ProtectedRoute;