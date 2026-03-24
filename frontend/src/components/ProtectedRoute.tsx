/**
 * @module ProtectedRoute
 * High-order component (HOC) for route protection.
 * Manages authentication checks and granular role-based access control.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, useIsAuthenticated } from "@/store/useAuthStore";
import { ROUTES } from "@/config/navigation";
import type { UserRole, UserData } from "@/schemas/auth.schema";

interface ProtectedRouteProps {
  /** Components to render if access is granted */
  children: React.ReactNode;
  /** Optional list of roles permitted to access this route */
  allowedRoles?: UserRole[];
}

/**
 * Guard component that wraps sensitive application views.
 */
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  
  // Cast user to UserData to ensure role access
  const user = useAuthStore((state) => state.user as UserData | null);

  /**
   * 1. Authentication Check:
   * If not logged in, redirect to Login page.
   * 'state={{ from: location }}' allows us to return the user to their
   * intended destination after a successful login.
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
   * 2. Authorization (RBAC) Check:
   * If roles are specified and the user's role isn't among them,
   * bounce them back to the Home/Dashboard.
   */
  const hasAccess = !allowedRoles || (user && allowedRoles.includes(user.role));

  if (!hasAccess) {
    // Replace prevents the user from getting stuck in a back-button loop
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};