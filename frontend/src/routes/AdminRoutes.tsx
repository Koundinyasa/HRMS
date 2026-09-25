import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "@/features/admin/components/AdminLayout";
import { AdminCenterRoutes } from "@/features/admin/admincenter/routes/AdminCenterRoutes";
import {EnrollmentRoutes} from "@/features/admin/Enrollment/routes/EnrollmentRoutes";
import { TalentHubRoutes } from "@/features/admin/TalentHub/routes/TalentHubRoutes";
import { InsightsRoutes } from "@/features/admin/Insights/routes/InsightRoutes";
import { OrganizationsRoutes } from "@/features/admin/organizations/routes/organizationsRoutes"
import DashboardPage from "@/features/admin/dashboard/pages/DashboardPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        {AdminCenterRoutes}
        {EnrollmentRoutes}
        {TalentHubRoutes}
        {InsightsRoutes}
        {OrganizationsRoutes}
      </Route>
    </Routes>
  );
}