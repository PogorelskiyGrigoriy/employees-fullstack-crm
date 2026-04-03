/**
 * @module NavigationConfig
 * Centralized route paths and RBAC settings for navigation.
 * All icons are updated to match react-icons/lu v1.7.0 (Lucide 0.400+ naming).
 */
import { 
  LuHouse,
  LuUserPlus, 
  LuUserCog, 
  LuClipboardList, 
  LuChartPie,
  LuChartBar,
  LuTrendingUp 
} from "react-icons/lu";
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
  readonly icon: React.ElementType;
}

/**
 * 1. Primary Links (Always visible in the main navbar)
 */
export const MAIN_NAV_LINKS: readonly NavItemConfig[] = [
  {
    to: ROUTES.HOME,
    label: "Home",
    roles: ["USER", "ADMIN"],
    icon: LuHouse
  },
];

/**
 * 2. Admin Actions (Consolidated within the Admin Drawer)
 */
export const ADMIN_NAV_LINKS: readonly NavItemConfig[] = [
  {
    to: ROUTES.ADD_EMPLOYEE,
    label: "Add Employee",
    roles: ["ADMIN"],
    icon: LuUserPlus
  },
  {
    to: ROUTES.ADMIN_USERS,
    label: "Users Management",
    roles: ["ADMIN"],
    icon: LuUserCog
  },
  {
    to: ROUTES.ADMIN_LOGS,
    label: "Audit Logs",
    roles: ["ADMIN"],
    icon: LuClipboardList
  },
];

/**
 * 3. Analytics (Grouped within the StatisticsSelector dropdown)
 */
export const STATS_NAV_LINKS: readonly NavItemConfig[] = [
  { 
    to: ROUTES.STATS_AGE, 
    label: "Age Stats", 
    roles: ["USER", "ADMIN"],
    icon: LuChartPie
  },
  { 
    to: ROUTES.STATS_SALARY, 
    label: "Salary Stats", 
    roles: ["USER", "ADMIN"],
    icon: LuTrendingUp 
  },
  { 
    to: ROUTES.STATS_DEPT, 
    label: "Dept Stats", 
    roles: ["USER", "ADMIN"],
    icon: LuChartBar
  },
];