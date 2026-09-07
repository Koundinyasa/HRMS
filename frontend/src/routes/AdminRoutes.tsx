import { Routes, Route } from "react-router-dom";
import DashboardPage from "@/features/admin/dashboard/pages/DashboardPage";
import AdminLayout from "@/features/admin/components/AdminLayout";
import { AdminCenterRoutes } from "@/features/admin/admincenter/routes/AdminCenterRoutes";
import {EnrollmentRoutes} from "@/features/admin/Enrollment/routes/EnrollmentRoutes";
import { TalentHubRoutes } from "@/features/admin/TalentHub/routes/TalentHubRoutes";
import { InsightsRoutes } from "@/features/admin/Insights/routes/InsightRoutes";

export default function AdminRoutes() {
  return (
    <Routes>

      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        {AdminCenterRoutes}
        {EnrollmentRoutes}
        {TalentHubRoutes}
        {InsightsRoutes}
      </Route>
    </Routes>
  );
}