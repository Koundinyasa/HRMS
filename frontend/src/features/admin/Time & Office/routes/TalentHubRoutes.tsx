import { lazy } from "react";
import { Navigate, Outlet, Route, useParams } from "react-router-dom";
 
 
 
 

// Pages are loaded on demand (each one becomes its own file in the build).
const TalentHubPage = lazy(() => import("../pages/TalentHubPage"));
const AttendancePage1 = lazy(() => import("../Attendance/pages/AttendancePage1"));
const AttendanceConfigurationPage = lazy(() => import("../Attendance/pages/AttendanceConfigurationPage"));
const AttendanceIntegrationsPage = lazy(() => import("../Attendance/pages/AttendanceIntegrationsPage"));
const ForceApprovalPanel1 = lazy(() => import("../Attendance/components/Forceapprovalpanel1").then((m) => ({ default: m.ForceApprovalPanel1 })));
const IntegrationSettingsPanel = lazy(() => import("../Attendance/components/IntegrationSettingsPanel"));
const AttendanceIntegrationPanel = lazy(() => import("../Attendance/components/AttendanceIntegrationsPanel"));
const ReconcileLeavePanel = lazy(() => import("../Attendance/components/ReconileLeavePanel"));
const LeaveSettingsPage = lazy(() => import("../Leave/Settings/pages/leavesettingspage"));
const LeaveSettingsSectionPage = lazy(() => import("../Leave/Settings/pages/LeaveSettingsSectionPage"));
const LeavePolicyPage = lazy(() => import("../Leave/Settings/pages/policypage"));
const LeaveBehaviorPage = lazy(() => import("../Leave/Settings/pages/leavebehaviourpage"));
const HolidayWeeklyOffPage = lazy(() => import("../Leave/HolidayAndWeeklyoff/pages/HolidayWeeklyOffPage"));
const HolidayPanel = lazy(() => import("../Leave/HolidayAndWeeklyoff/components/HolidayPanel"));
const WeeklyOffPanel = lazy(() => import("../Leave/HolidayAndWeeklyoff/components/Weeklyoffpanel"));
const HolidayImportPanel = lazy(() => import("../Leave/HolidayAndWeeklyoff/components/HolidayImportPanel"));
const LeaveDailyPage = lazy(() => import("../Leave/Daily/pages/LeaveDailyPage"));
const LeaveDailyImportPage = lazy(() => import("../Leave/Daily/pages/LeaveDailyImportPage"));
const AdjustmentPage = lazy(() => import("../Leave/Adjustment/pages/AdjustmentPage"));
const LeaveAdjustmentConfigurationPage = lazy(() => import("../Leave/Adjustment/pages/LeaveAdjustmentConfigurationPage"));
const ManualLeaveAllotmentPage = lazy(() => import("../Leave/Adjustment/pages/ManualLeaveAllotmentPage"));
const AdjustmentImportPage = lazy(() => import("../Leave/Adjustment/pages/AdjustmentImportPage"));
const ForceLeaveApprovalPage = lazy(() => import("../Leave/ForceLeaveApproval/pages/ForceLeaveApprovalPage"));
const LeaveAllotmentReport = lazy(() => import("../Leave/Report/pages/LeaveAllotmentReportPage"));
const LeaveReportLandingPage = lazy(() => import("../Leave/Report/pages/LeaveReportLandingPage"));
const LeaveAvailedReport = lazy(() => import("../Leave/Report/pages/LeaveAvailedReportPage"));
const LeaveLapsedReport = lazy(() => import("../Leave/Report/pages/LeaveLapsedReportPage"));
const LeaveEncashedReport = lazy(() => import("../Leave/Report/pages/LeaveEncashedReportPage"));
const LeaveSummaryReport = lazy(() => import("../Leave/Report/pages/LeaveSummaryReportPage"));
const LeaveSummaryBetweenMonths = lazy(() => import("../Leave/Report/pages/LeaveSummaryBetweenMonthsPage"));
const LeaveSummaryDetailed = lazy(() => import("../Leave/Report/pages/LeaveSummaryDetailedPage"));
const LeaveHistoryMonthWise = lazy(() => import("../Leave/Report/pages/LeaveHistoryMonthWisePage"));
const LeaveHistoryDateWise = lazy(() => import("../Leave/Report/pages/LeaveHistoryDateWisePage"));
const AttendanceRegularizationReport = lazy(() => import("../Leave/Report/pages/AttendanceIndependentReportPage"));
const HourlyAttendanceReport = lazy(() => import("../Leave/Report/pages/HourlyAttendanceReportPage"));
const AttendanceIntegrationReport = lazy(() => import("../Leave/Report/pages/AttendanceIntegrationReportPage"));
const OverTimeReport = lazy(() => import("../Leave/Report/pages/OverTimeReportPage"));
const LateEarlyOutReport = lazy(() => import("../Leave/Report/pages/LateInEarlyOutReportPage"));
const LateEarlyOutReportMonthly = lazy(() => import("../Leave/Report/pages/LateInEarlyOutMonthlyPage"));
const ExceptionReport = lazy(() => import("../Leave/Report/pages/ExceptionReconcileReportPage"));
const ExceptionReportMonthly = lazy(() => import("../Leave/Report/pages/ExceptionReconcileMonthlyPage"));
const TagAttendanceReport = lazy(() => import("../Leave/Report/pages/TopAttendancePage"));
const TagLeaveReport = lazy(() => import("../Leave/Report/pages/TopLeaveTakenPage"));
const PunchDashboardPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchDashboardPage"));
const ProcessPage = lazy(() => import("../TimeOffice/pages/punchprocess/ProcessPage"));
const PunchProcessPunchPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessPunchPage"));
const PunchProcessAttendanceOverviewPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessAttendanceOverviewPage"));
const PunchProcessImportPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessImportPage"));
const PunchProcessTaInsightsPage = lazy(() => import("../TimeOffice/pages/punchprocess/PunchProcessTaInsightsPage"));
const ShiftUnassignedPage = lazy(() => import("../TimeOffice/pages/punchprocess/ShiftUnassignedPage"));
const PunchPage = lazy(() => import("../TimeOffice/pages/regularization/PunchPage"));
const MissedPunchPage = lazy(() => import("../TimeOffice/pages/regularization/MissedPunchPage"));
const AttendancePage = lazy(() => import("../TimeOffice/pages/regularization/AttendancePage"));
const TaInsightsPage = lazy(() => import("../TimeOffice/pages/regularization/TaInsightsPage"));
const TaReportsPage = lazy(() => import("../TimeOffice/pages/TAreports/TaReportsPage"));
const ForceApprovalPanel = lazy(() => import("../TimeOffice/pages/forceapproval/ForceApprovalPanel"));
const PolicyPage = lazy(() => import("../TimeOffice/pages/masters/PolicyPage"));
const ShiftPatternPage = lazy(() => import("../TimeOffice/pages/masters/ShiftPatternPage"));
const ShiftMasterPage = lazy(() => import("../TimeOffice/pages/masters/ShiftMasterPage"));
const GeoLocationPage = lazy(() => import("../TimeOffice/pages/masters/GeoLocationPage"));
const MastersImportPage = lazy(() => import("../TimeOffice/pages/masters/MastersImportPage"));
const GeneralSettingsPage = lazy(() => import("../TimeOffice/pages/settings/GeneralSettingsPage"));
const AutoProcessPage = lazy(() => import("../TimeOffice/pages/settings/AutoProcessPage"));
const MailSchedulerPage = lazy(() => import("../TimeOffice/pages/settings/MailSchedulerPage"));
const PunchIntegrationPage = lazy(() => import("../TimeOffice/pages/settings/PunchIntegrationPage"));
const GeoLocationAssignPage = lazy(() => import("../TimeOffice/pages/assign/GeoLocationAssignPage"));
const PolicyUpdateAssignPage = lazy(() => import("../TimeOffice/pages/assign/PolicyUpdateAssignPage"));
const FaceTemplateAssignPage = lazy(() => import("../TimeOffice/pages/assign/FaceTemplateAssignPage"));
const AssignImportPage = lazy(() => import("../TimeOffice/pages/assign/AssignImportPage"));
 
// Menu rows in the database sometimes point at the Punch Process address for
// the leave pages; send those addresses to the real screens.
function TimeOfficeRedirect({ to }: { to: string }) {
  const { domain } = useParams();
  return <Navigate to={`${domain ? `/${domain}` : ""}/admin/time-office/${to}`} replace />;
}

export const TalentHubRoutes = (
  <Route path="time-office" element={<TalentHubPage />}>
    <Route path="attendance" element={<AttendancePage1 />}>
      <Route index element={<Navigate to="configuration" replace />} />
      <Route path="configuration" element={<AttendanceConfigurationPage />}>
        <Route index element={<Navigate to="forceapproval" replace />} />
        <Route path="forceapproval" element={<ForceApprovalPanel1 />} />
      </Route>
      <Route path="integration" element={<AttendanceIntegrationsPage />}>
        <Route index element={<Navigate to="settings" replace />} />
        <Route path="settings" element={<IntegrationSettingsPanel />} />
        <Route path="attendanceintegrations" element={<AttendanceIntegrationPanel />} />
        <Route path="reconcileleave" element={<ReconcileLeavePanel />} />
      </Route>
    </Route>
    <Route path="leave">
      <Route path="settings" element={<LeaveSettingsPage />}>
        <Route index element={<Navigate to="policy" replace />} />
        <Route path="policy" element={<LeavePolicyPage />} />
        <Route path="definitions" element={<LeaveSettingsSectionPage section="definitions" />} />
        <Route path="allot-avail-date" element={<LeaveSettingsSectionPage section="allot-avail-date" />} />
        <Route path="allot-avail-dates" element={<Navigate to="../allot-avail-date" replace />} />
        <Route path="opening-balance" element={<LeaveSettingsSectionPage section="opening-balance" />} />
        <Route path="import" element={<LeaveSettingsSectionPage section="import" />} />
        <Route path="policy/:policyId/leave/:leaveId/behavior" element={<LeaveBehaviorPage />} />
      </Route>
      <Route path="adjustment" element={<AdjustmentPage />}>
        <Route index element={<Navigate to="configuration" replace />} />
        <Route path="configuration" element={<LeaveAdjustmentConfigurationPage />} />
        <Route path="manual-leave-allotment" element={<ManualLeaveAllotmentPage />} />
        <Route path="import" element={<AdjustmentImportPage />} />
      </Route>
      <Route path="daily">
        <Route index element={<Navigate to="apply-leave" replace />} />
        <Route path="apply-leave" element={<LeaveDailyPage />} />
        <Route path="import" element={<LeaveDailyImportPage />} />
      </Route>
      <Route path="forceleaveapproval" element={<ForceLeaveApprovalPage />} />
      <Route path="leave-approval" element={<ForceLeaveApprovalPage />} />
      <Route path="report" element={<Outlet />}>
        <Route index element={<LeaveReportLandingPage />} />
        <Route path="leave-allotment-report" element={<LeaveAllotmentReport />} />
        <Route path="leave-availed-report" element={<LeaveAvailedReport />} />
        <Route path="leave-lapsed-report" element={<LeaveLapsedReport />} />
        <Route path="leave-encashed-report" element={<LeaveEncashedReport />} />
        <Route path="leave-summary-report" element={<LeaveSummaryReport />} />
        <Route path="leave-summary-report-between-months" element={<LeaveSummaryBetweenMonths />} />
        <Route path="leave-summary-report-detailed" element={<LeaveSummaryDetailed />} />
        <Route path="leave-history-report-month-wise" element={<LeaveHistoryMonthWise />} />
        <Route path="leave-history-report-date-wise" element={<LeaveHistoryDateWise />} />
        <Route path="attendance-independent-report" element={<AttendanceRegularizationReport />} />
        <Route path="hourly-attendance-report" element={<HourlyAttendanceReport />} />
        <Route path="attendance-integration-report" element={<AttendanceIntegrationReport />} />
        <Route path="over-time-report" element={<OverTimeReport />} />
        <Route path="late-in-early-out-report" element={<LateEarlyOutReport />} />
        <Route path="late-in-early-out-report-monthly" element={<LateEarlyOutReportMonthly />} />
        <Route path="exception-report-reconcile" element={<ExceptionReport />} />
        <Route path="exception-report-reconcile-monthly" element={<ExceptionReportMonthly />} />
        <Route path="top-attendance" element={<TagAttendanceReport />} />
        <Route path="top-leave-taken" element={<TagLeaveReport />} />
      </Route>
      <Route index element={<Navigate to="holidayandweekOff" replace />} />
 
      <Route path="holidayandweekOff" element={<HolidayWeeklyOffPage />}>
        <Route index element={<Navigate to="holiday" replace />} />
        <Route path="holiday" element={<HolidayPanel />} />
        <Route path="weeklyoff" element={<WeeklyOffPanel />} />
        <Route path="import" element={<HolidayImportPanel />} />
      </Route>
    </Route>
    <Route path="timeoffice">
      <Route index element={<Navigate to="punch-process" replace />} />
      <Route path="punch-process">
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PunchDashboardPage />} />
        <Route path="process" element={<ProcessPage />} />
        <Route path="punch" element={<PunchProcessPunchPage />} />
        <Route
          path="attendance-overview"
          element={<PunchProcessAttendanceOverviewPage />}
        />
        <Route path="ta-insights" element={<PunchProcessTaInsightsPage />} />
        <Route path="import" element={<PunchProcessImportPage />} />
        <Route path="leave" element={<TimeOfficeRedirect to="leave/daily/apply-leave" />} />
        <Route path="forceleaveapproval" element={<TimeOfficeRedirect to="leave/forceleaveapproval" />} />
      </Route>

      <Route path="shift-unassigned">
        <Route index element={<Navigate to="shift-pattern" replace />} />
        <Route path=":tab" element={<ShiftUnassignedPage />} />
      </Route>
 
      <Route path="regularization">
        <Route index element={<Navigate to="punch" replace />} />
        <Route path="punch" element={<PunchPage />} />
        <Route path="missed-punch" element={<MissedPunchPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="ta-insights" element={<TaInsightsPage />} />
      </Route>
 
      <Route path="ta-reports" element={<TaReportsPage />} />
 
      <Route path="force-approval">
        <Route index element={<Navigate to="punch" replace />} />
        <Route
          path="punch"
          element={<ForceApprovalPanel title="Punch" endpoint="punch" />}
        />
        <Route
          path="weekly-off"
          element={<ForceApprovalPanel title="Weekly Off" />}
        />
        <Route
          path="over-time"
          element={<ForceApprovalPanel title="Over Time" />}
        />
        <Route
          path="official-permission"
          element={<ForceApprovalPanel title="Official Permission" />}
        />
        <Route
          path="personal-permission"
          element={<ForceApprovalPanel title="Personal Permission" />}
        />
        <Route path="shift" element={<ForceApprovalPanel title="Shift" />} />
        <Route
          path="face-template"
          element={
            <ForceApprovalPanel title="Face Template" endpoint="facetemplate" />
          }
        />
      </Route>
 
      <Route path="masters">
        <Route index element={<Navigate to="policy" replace />} />
        <Route path="policy" element={<PolicyPage />} />
        <Route path="shift-pattern" element={<ShiftPatternPage />} />
        <Route path="shift-master" element={<ShiftMasterPage />} />
        <Route path="geo-location" element={<GeoLocationPage />} />
        <Route path="import" element={<MastersImportPage />} />
      </Route>
 
      <Route path="assign">
        <Route index element={<Navigate to="geo-location" replace />} />
        <Route path="geo-location" element={<GeoLocationAssignPage />} />
        <Route path="policy-update" element={<PolicyUpdateAssignPage />} />
        <Route path="face-template" element={<FaceTemplateAssignPage />} />
        <Route path="import" element={<AssignImportPage />} />
      </Route>
 
      <Route path="settings">
        <Route index element={<Navigate to="general-settings" replace />} />
        <Route path="general-settings" element={<GeneralSettingsPage />} />
        <Route path="auto-process" element={<AutoProcessPage />} />
        <Route path="mail-scheduler" element={<MailSchedulerPage />} />
        <Route path="punch-integration" element={<PunchIntegrationPage />} />
      </Route>
    </Route>
  </Route>
);
