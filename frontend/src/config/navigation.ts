/**
 * @module NavigationConfig
 * Centralized route paths and RBAC settings for navigation.
 */
import type { UserRole } from "@crm/shared/schemas/auth.schema";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADD_EMPLOYEE: "/add-employee",
  ADMIN_USERS: "/admin/users",
  ADMIN_LOGS: "/admin/logs",
  STATS_AGE: "/statistics/age",
  STATS_SALARY: "/statistics/salary",
  STATS_DEPT: "/statistics/department",
} as const;

export interface NavItemConfig {
  readonly to: string;
  readonly label: string;
  readonly roles: readonly UserRole[];
}

export const MAIN_NAV_LINKS: readonly NavItemConfig[] = [
  {
    to: ROUTES.HOME,
    label: "Home",
    roles: ["USER", "ADMIN"]
  },
  {
    to: ROUTES.ADD_EMPLOYEE,
    label: "Add Employee",
    roles: ["ADMIN"]
  },
  {
    to: ROUTES.ADMIN_USERS,
    label: "Users Management",
    roles: ["ADMIN"]
  },
  {
    to: ROUTES.ADMIN_LOGS,
    label: "Audit Logs",
    roles: ["ADMIN"]
  },
];

export const STATS_NAV_LINKS: readonly NavItemConfig[] = [
  { to: ROUTES.STATS_AGE, label: "Age Stats", roles: ["USER", "ADMIN"] },
  { to: ROUTES.STATS_SALARY, label: "Salary Stats", roles: ["USER", "ADMIN"] },
  { to: ROUTES.STATS_DEPT, label: "Dept Stats", roles: ["USER", "ADMIN"] },
];