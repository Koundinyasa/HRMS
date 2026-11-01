import { lazy } from "react";
import { Route } from "react-router-dom";

import { AdminCenterRoutes } from "@/features/admin/admincenter/routes/AdminCenterRoutes";
import { ReviewRoutes } from "@/features/admin/admincenter/routes/ReviewRoutes";
import { TalentHubRoutes } from "@/features/admin/Time & Office/routes/TalentHubRoutes";
import PageNotAvailable from "./PageNotAvailable";

// Pages are loaded on demand (each one becomes its own file in the build).
const DashboardPage = lazy(() => import("@/features/admin/dashboard/pages/DashboardPage"));

export const AdminChildRoutes = (
  <>
    <Route path="dashboard" element={<DashboardPage />} />
    {AdminCenterRoutes}
    {ReviewRoutes}
    {TalentHubRoutes}
    {/* Anything else (Enrollment, Recruitment, Payroll, Organizations and the rest are not in Phase 1) */}
    <Route path="*" element={<PageNotAvailable />} />
  </>
);
