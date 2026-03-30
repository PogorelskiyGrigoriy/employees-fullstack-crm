/**
 * @module Router
 * Central routing configuration with nested layouts and role-based protection.
 */

import { createBrowserRouter } from "react-router-dom";

import { ROUTES } from "@/config/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LayoutPage from "@/pages/LayoutPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import AddEmployeePage from "@/pages/AddEmployeePage";
import AgeStatisticsPage from "@/pages/AgeStatisticsPage";
import SalaryStatisticsPage from "@/pages/SalaryStatisticsPage";
import DepartmentStatisticPage from "@/pages/DepartmentStatisticsPage";
import ErrorPage from "@/pages/ErrorPage";

import UserManagementPage from "@/pages/UserManagementPage";
import AuditLogsPage from "@/pages/AuditLogsPage";

/**
 * Application router instance.
 * Defines public entry points and private authenticated sectors.
 */
export const appRouter = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />, 
    children: [
      // Public Route: Entry point for authentication
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      
      /**
       * Authenticated Sector:
       * All child routes are wrapped in a layout and require a valid session.
       */
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <LayoutPage />
          </ProtectedRoute>
        ),
        children: [
          // Default landing page
          { 
            index: true, 
            element: <HomePage /> 
          },

          /**
           * Administrative Modules:
           * Restricted to users with the 'ADMIN' role.
           */
          { 
            path: ROUTES.ADD_EMPLOYEE, 
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AddEmployeePage />
              </ProtectedRoute>
            ) 
          },
          { 
            path: ROUTES.ADMIN_USERS, 
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserManagementPage />
              </ProtectedRoute>
            ) 
          },
          { 
            path: ROUTES.ADMIN_LOGS, 
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AuditLogsPage />
              </ProtectedRoute>
            ) 
          },

          /**
           * Analytics Sector:
           * Shared access for both USER and ADMIN roles.
           */
          { 
            path: ROUTES.STATS_AGE, 
            element: <AgeStatisticsPage /> 
          },
          { 
            path: ROUTES.STATS_SALARY, 
            element: <SalaryStatisticsPage /> 
          },
          { 
            path: ROUTES.STATS_DEPT, 
            element: <DepartmentStatisticPage /> 
          },
        ],
      },
    ],
  },
]);