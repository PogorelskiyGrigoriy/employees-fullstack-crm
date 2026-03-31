/**
 * @module AppBadge
 * A unified badge component for Chakra UI 3.x.
 * Uses strict typing from shared schemas to ensure data consistency.
 */
import { Badge, type BadgeProps } from "@chakra-ui/react";
import { type UserRole } from "@crm/shared/schemas/auth.schema.js";
import { type AuditAction } from "@crm/shared/schemas/audit.schema.js";

type BadgeType = "role" | "action" | "dept" | "count";

interface AppBadgeProps extends BadgeProps {
  type: BadgeType;
  // Using 'any' here or a union, but the internal mapping will handle the specific types
  value: UserRole | AuditAction | string | number;
}

/**
 * Interface for the return type of our config functions 
 * to satisfy the TypeScript compiler.
 */
interface BadgeStyle {
  colorPalette: string;
  label: string;
}

const CONFIG: Record<BadgeType, (val: any) => BadgeStyle> = {
  role: (val: UserRole) => ({
    colorPalette: val === "ADMIN" ? "purple" : "gray",
    label: val,
  }),
  action: (val: AuditAction) => {
    const actionMap: Record<AuditAction, string> = {
      USER_LOGIN: "blue",
      USER_LOGOUT: "gray",
      USER_CREATE: "green",
      USER_UPDATE: "orange",
      USER_DELETE: "red",
      ROLE_CHANGE: "purple",
    };
    return { 
      colorPalette: actionMap[val] || "teal", 
      label: val.replace("USER_", "").replace("_", " ") // Cleaner labels
    };
  },
  dept: (val: string) => ({
    colorPalette: "brand", 
    label: val,
  }),
  count: (val: number | string) => ({
    colorPalette: "blue",
    label: val.toString(),
  }),
};

export const AppBadge = ({ type, value, ...props }: AppBadgeProps) => {
  const { colorPalette, label } = CONFIG[type](value);

  return (
    <Badge
      variant="subtle"
      colorPalette={colorPalette}
      size="sm"
      px="2"
      borderRadius="md"
      textTransform="capitalize"
      {...props}
    >
      {label}
    </Badge>
  );
};