import { lazy } from "react";
import { Navigate, Route, useParams } from "react-router-dom";

// Pages are loaded on demand (each one becomes its own file in the build).
const TalentHubPage = lazy(() => import("../pages/TalentHubPage"));
const LeaveDailyPage = lazy(() => import("../Leave/Daily/pages/LeaveDailyPage"));
const LeaveDailyImportPage = lazy(() => import("../Leave/Daily/pages/LeaveDailyImportPage"));
const ForceLeaveApprovalPage = lazy(() => import("../Leave/ForceLeaveApproval/pages/ForceLeaveApprovalPage"));
const PunchDashboardPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchDashboardPage"));
const ProcessPage = lazy(() => import("../TimeOffice/pages/punchprocess/ProcessPage"));
const PunchProcessPunchPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessPunchPage"));
const PunchProcessAttendanceOverviewPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessAttendanceOverviewPage"));
const PunchProcessImportPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessImportPage"));
const PunchProcessTaInsightsPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessTaInsightsPage"));
const ShiftUnassignedPage = lazy(() => import("../TimeOffice/pages/punchprocess/ShiftUnassignedPage"));

// Menu rows in the database sometimes point at the Punch Process address for
// the leave pages; send those addresses to the real screens.
function TimeOfficeRedirect({ to }: { to: string }) {
  const { domain } = useParams();
  return <Navigate to={`${domain ? `/${domain}` : ""}/admin/time-office/${to}`} replace />;
}

/** Time & Office: Dashboard (Punch Process pages), Leave Daily, Force Leave Approval. */
export const TalentHubRoutes = (
  <Route path="time-office" element={<TalentHubPage />}>
    {/* Opening Time & Office from the sidebar lands on its dashboard. */}
    <Route index element={<Navigate to="timeoffice/punch-process/dashboard" replace />} />

    <Route path="leave">
      <Route path="daily">
        <Route index element={<Navigate to="apply-leave" replace />} />
        <Route path="apply-leave" element={<LeaveDailyPage />} />
        <Route path="import" element={<LeaveDailyImportPage />} />
      </Route>
      <Route path="forceleaveapproval" element={<ForceLeaveApprovalPage />} />
      <Route path="leave-approval" element={<ForceLeaveApprovalPage />} />
    </Route>

    <Route path="timeoffice">
      <Route index element={<Navigate to="punch-process" replace />} />
      <Route path="punch-process">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PunchDashboardPage />} />
        <Route path="process" element={<ProcessPage />} />
        <Route path="punch" element={<PunchProcessPunchPage />} />
        <Route path="attendance-overview" element={<PunchProcessAttendanceOverviewPage />} />
        <Route path="ta-insights" element={<PunchProcessTaInsightsPage />} />
        <Route path="import" element={<PunchProcessImportPage />} />
        <Route path="leave" element={<TimeOfficeRedirect to="leave/daily/apply-leave" />} />
        <Route path="forceleaveapproval" element={<TimeOfficeRedirect to="leave/forceleaveapproval" />} />
      </Route>

      <Route path="shift-unassigned">
        <Route index element={<Navigate to="shift-pattern" replace />} />
        <Route path=":tab" element={<ShiftUnassignedPage />} />
      </Route>
    </Route>
  </Route>
);
