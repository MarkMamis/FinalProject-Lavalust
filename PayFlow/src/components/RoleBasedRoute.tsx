import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'hr' | 'employee')[];
}

export function RoleBasedRoute({ children, allowedRoles }: RoleBasedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Still loading auth state
  if (isLoading) return null;

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Not authorized for this role
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
