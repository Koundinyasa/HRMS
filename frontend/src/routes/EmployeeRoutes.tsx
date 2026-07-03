import { Route } from "react-router-dom";

import Layout from "@/features/employee/components/Layout";

import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";

export default function EmployeeRoutes() {
  return (
    <>
      <Route
        path="/:domain/employee"
        element={<Layout />}
      >
        <Route
          path="dashboard"
          element={<EmployeeDashboard />}
        />
      </Route>
    </>
  );
}