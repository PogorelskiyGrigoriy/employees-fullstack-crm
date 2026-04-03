/**
 * @module RBACGuard
 * Fixed: Now accepts 'readonly' arrays to support strict configuration constants.
 */
import React from "react";
import { useUserRole } from "@/entities/user/model/auth-store";
import { type UserRole } from "@crm/shared/schemas/auth.schema.js";

interface RBACGuardProps {
  roles: readonly UserRole[]; 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RBACGuard = ({ roles, children, fallback = null }: RBACGuardProps) => {
  const currentRole = useUserRole();
  const hasAccess = currentRole && roles.includes(currentRole as UserRole);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};