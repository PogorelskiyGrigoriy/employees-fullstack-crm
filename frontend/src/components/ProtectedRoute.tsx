/**
 * @module ProtectedRoute
 * Route-level security guard for the Midnight Slate ecosystem.
 * Refactored to support 'readonly' roles and maintain strict RBAC.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, useIsAuthenticated } from "@/store/auth-store";
import { ROUTES } from "@/config/navigation";
import type { UserRole } from "@crm/shared/schemas/auth.schema.js";

interface ProtectedRouteProps {
  children: React.ReactNode;
  readonly allowedRoles?: readonly UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthStore((state) => state.user);

  /**
   * 1. Authentication Check
   * If the user isn't logged in, send them to the Login page.
   * We store the 'from' location so we can teleport them back after login.
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
   * 2. Authorization Check (RBAC)
   * If the route is restricted, verify the user's clearance level.
   */
  const hasAccess = !allowedRoles || (user && allowedRoles.includes(user.role));

  if (!hasAccess) {
    /**
     * If authenticated but unauthorized, kick back to Home.
     * This happens if a USER tries to manually type /users in the URL.
     */
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // 3. All checks passed: Welcome to the page!
  return <>{children}</>;
};