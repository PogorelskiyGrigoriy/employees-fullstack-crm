/**
 * @module ProtectedRoute
 * High-order component (HOC) for authentication and role-based access control.
 */
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";
import { ROUTES } from "@/config/navigation";
import type { UserRole } from "@crm/shared/schemas/auth.schema.js";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Optional: List of roles allowed to access this route */
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthStore((state) => state.user);

  /**
   * 1. Authentication Guard:
   * Redirect to Login if not authenticated. 
   * Includes 'from' state to redirect back after successful login.
   */
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={ROUTES.LOGIN} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  /**
   * 2. Authorization Guard (RBAC):
   * Checks if the user's role is permitted for this specific route.
   */
  const hasAccess = !allowedRoles || (user && allowedRoles.includes(user.role));

  if (!hasAccess) {
    // Redirect to home if the user lacks the required role
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};