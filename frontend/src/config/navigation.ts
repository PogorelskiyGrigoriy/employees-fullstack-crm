/**
 * @module NavigationConfig
 * Centralized navigation configuration. 
 * Defines application routes and role-based access control (RBAC) for navigation links.
 */

import type { UserRole } from "@/schemas/auth.schema";

/**
 * Unique identifiers for all application routes.
 * Using 'as const' ensures type safety when referencing routes throughout the app.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADD_EMPLOYEE: "/add-employee",
  STATS_AGE: "/statistics/age",
  STATS_SALARY: "/statistics/salary",
  STATS_DEPT: "/statistics/department",
} as const;

/**
 * Configuration structure for a single navigation item.
 */
export interface NavItemConfig {
  readonly to: string;              // Target URL path
  readonly label: string;           // Display text for the link
  readonly roles: readonly UserRole[]; // Authorized roles allowed to see/access this link
}

/**
 * Primary navigation links displayed in the main Navbar area.
 * Accessible based on the user's role.
 */
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
];

/**
 * Secondary navigation links typically grouped under a 'Statistics' dropdown or menu.
 */
export const STATS_NAV_LINKS: readonly NavItemConfig[] = [
  { 
    to: ROUTES.STATS_AGE, 
    label: "Age Stats", 
    roles: ["USER", "ADMIN"] 
  },
  { 
    to: ROUTES.STATS_SALARY, 
    label: "Salary Stats", 
    roles: ["USER", "ADMIN"] 
  },
  { 
    to: ROUTES.STATS_DEPT, 
    label: "Dept Stats", 
    roles: ["USER", "ADMIN"] 
  },
];