import { lazy } from "react";
import { Route } from "react-router-dom";

import { AdminCenterRoutes } from "@/features/admin/admincenter/routes/AdminCenterRoutes";
import { EnrollmentRoutes } from "@/features/admin/Enrollment/routes/EnrollmentRoutes";
import { TalentHubRoutes } from "@/features/admin/Time & Office/routes/TalentHubRoutes";
import { RecruitmentRoutes } from "@/features/admin/TalentHub/routes/RecruitmentRoutes";
import { PayrollRoutes } from "@/features/admin/Payroll/routes/PayrollRoutes";
import { OrganizationsRoutes } from "@/features/admin/organizations/routes/organizationsRoutes";
import PageNotAvailable from "./PageNotAvailable";

// Pages are loaded on demand (each one becomes its own file in the build).
const DashboardPage = lazy(() => import("@/features/admin/dashboard/pages/DashboardPage"));

export const AdminChildRoutes = (
  <>
    <Route path="dashboard" element={<DashboardPage />} />
    {AdminCenterRoutes}
    {EnrollmentRoutes}
    {RecruitmentRoutes}
    {PayrollRoutes}
    {TalentHubRoutes}
    {OrganizationsRoutes}
    {/* Anything else (for example Insights, not in Phase 1) */}
    <Route path="*" element={<PageNotAvailable />} />
  </>
);
