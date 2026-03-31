/**
 * @module RBACGuard
 * A declarative wrapper for Role-Based Access Control.
 * Only renders its children if the current user has one of the required roles.
 */
import React from "react";
import { useUserRole } from "@/store/auth-store";
import { type UserRole } from "@crm/shared/schemas/auth.schema.js";

interface RBACGuardProps {
  /** Array of roles permitted to see the content */
  roles: UserRole[];
  /** Content to render if access is granted */
  children: React.ReactNode;
  /** Optional content to render if access is denied (e.g., a message or null) */
  fallback?: React.ReactNode;
}

export const RBACGuard = ({ roles, children, fallback = null }: RBACGuardProps) => {
  const currentRole = useUserRole();

  // If role is not yet loaded or not in the allowed list, show fallback
  const hasAccess = currentRole && roles.includes(currentRole as UserRole);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};