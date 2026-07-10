import {Routes, Route } from "react-router-dom";

import Layout from "@/features/employee/components/Layout";

import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";

export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="dashboard" element={<EmployeeDashboard />} />
      </Route>
    </Routes>
  );
}