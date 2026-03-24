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
import DepartmentStatisticPage from "@/pages/DepartmentStatisticPage";
import ErrorPage from "@/pages/ErrorPage";

/**
 * Application router instance.
 * Defines public entry points and private authenticated sectors.
 */
export const appRouter = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />, // Global fallback for 404s and runtime errors
    children: [
      // Public Route: Accessible to everyone
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      
      /**
       * Protected Sector:
       * Requires basic authentication for all child routes.
       */
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <LayoutPage />
          </ProtectedRoute>
        ),
        children: [
          // Landing page for authenticated users
          { 
            index: true, 
            element: <HomePage /> 
          },
          /**
           * Restricted Route: 
           * Only accessible to users with the 'ADMIN' role.
           */
          { 
            path: ROUTES.ADD_EMPLOYEE, 
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AddEmployeePage />
              </ProtectedRoute>
            ) 
          },
          // Analytics & Statistics section
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