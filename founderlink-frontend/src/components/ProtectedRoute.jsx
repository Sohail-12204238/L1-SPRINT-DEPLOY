import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0) {
    const normalised = role?.replace('ROLE_', '');
    if (!roles.includes(normalised)) {
      // Redirect ADMIN to /admin, others to /dashboard
      const redirectTo = normalised === 'ADMIN' ? '/admin' : '/dashboard';
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}
