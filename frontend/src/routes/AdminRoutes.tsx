import { Route } from "react-router-dom";

import { AdminCenterRoutes } from "@/features/admin/admincenter/routes/AdminCenterRoutes";
import { EnrollmentRoutes } from "@/features/admin/Enrollment/routes/EnrollmentRoutes";
import { TalentHubRoutes } from "@/features/admin/Time & Office/routes/TalentHubRoutes";
import { RecruitmentRoutes } from "@/features/admin/TalentHub/routes/RecruitmentRoutes";
import { PayrollRoutes } from "@/features/admin/Payroll/routes/PayrollRoutes";
import { InsightsRoutes } from "@/features/admin/Insights/routes/InsightRoutes";
import { OrganizationsRoutes } from "@/features/admin/organizations/routes/organizationsRoutes";
import DashboardPage from "@/features/admin/dashboard/pages/DashboardPage";

export const AdminChildRoutes = (
  <>
    <Route path="dashboard" element={<DashboardPage />} />
    {AdminCenterRoutes}
    {EnrollmentRoutes}
    {RecruitmentRoutes}
    {PayrollRoutes}
    {TalentHubRoutes}
    {InsightsRoutes}
    {OrganizationsRoutes}
  </>
);
