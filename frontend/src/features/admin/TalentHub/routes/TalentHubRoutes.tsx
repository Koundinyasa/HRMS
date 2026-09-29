// import {Route,Navigate} from "react-router-dom";
// import TalentHubPage from "../pages/TalentHubPage";
// // import AttendancePage from "../Attendance/pages/AttendancePage";

// //Attendance
// import AttendancePage1 from "../Attendance/pages/AttendancePage1";
// import AttendanceConfigurationPage from "../Attendance/pages/AttendanceConfigurationPage";
// import AttendanceIntegrationsPage from "../Attendance/pages/AttendanceIntegrationsPage";
// import { ForceApprovalPanel1 } from "../Attendance/components/Forceapprovalpanel1";
// import IntegrationSettingsPanel from "../Attendance/components/IntegrationSettingsPanel";
// import AttendanceIntegrationPanel from "../Attendance/components/AttendanceIntegrationsPanel";
// import ReconcileLeavePanel from "../Attendance/components/ReconileLeavePanel";



// //Leave

// //Leave //Settings
// import LeaveSettingsPage from "../Leave/Settings/pages/leavesettingspage";
// import LeavePolicyPage from "../Leave/Settings/pages/policypage";
// import LeaveBehaviorPage from "../Leave/Settings/pages/leavebehaviourpage";


// //Leave//Holiday and weeklyoff
// import HolidayWeeklyOffPage from "../Leave/HolidayAndWeeklyoff/pages/HolidayWeeklyOffPage";
// import HolidayPanel from "../Leave/HolidayAndWeeklyoff/components/HolidayPanel";
// import WeeklyOffPanel from "../Leave/HolidayAndWeeklyoff/components/Weeklyoffpanel";
// import HolidayImportPanel from "../Leave/HolidayAndWeeklyoff/components/HolidayImportPanel";

// //Timeoffice Routes

// import PunchDashboardPage from "../TimeOffice/pages/punchprocess/PunchDashboardPage";
// import ProcessPage from "../TimeOffice/pages/punchprocess/ProcessPage";
// import PunchPlaceholderPage from "../TimeOffice/pages/punchprocess/PunchPlaceholderPage";
// import PunchProcessPunchPage from "../TimeOffice/pages/punchprocess/PunchProcessPunchPage";
// import PunchProcessAttendanceOverviewPage from "../TimeOffice/pages/punchprocess/PunchProcessAttendanceOverviewPage";
// import PunchProcessImportPage from "../TimeOffice/pages/punchprocess/PunchProcessImportPage";
// import PunchPage from "../TimeOffice/pages/regularization/PunchPage";
// import MissedPunchPage from "../TimeOffice/pages/regularization/MissedPunchPage";
// import AttendancePage from "../TimeOffice/pages/regularization/AttendancePage";
// import TaInsightsPage from "../TimeOffice/pages/regularization/TaInsightsPage";
// import TaReportsPage from "../TimeOffice/pages/TAreports/TaReportsPage";
// import ForceApprovalPanel from "../TimeOffice/pages/forceapproval/ForceApprovalPanel";
// import PolicyPage from "../TimeOffice/pages/masters/PolicyPage";
// import ShiftPatternPage from "../TimeOffice/pages/masters/ShiftPatternPage";
// import ShiftMasterPage from "../TimeOffice/pages/masters/ShiftMasterPage";
// import GeoLocationPage from "../TimeOffice/pages/masters/GeoLocationPage";
// import MastersImportPage from "../TimeOffice/pages/masters/MastersImportPage";
// import GeneralSettingsPage from "../TimeOffice/pages/settings/GeneralSettingsPage";
// import AutoProcessPage from "../TimeOffice/pages/settings/AutoProcessPage";
// import MailSchedulerPage from "../TimeOffice/pages/settings/MailSchedulerPage";
// import PunchIntegrationPage from "../TimeOffice/pages/settings/PunchIntegrationPage";
// import GeoLocationAssignPage from "../TimeOffice/pages/assign/GeoLocationAssignPage";
// import PolicyUpdateAssignPage from "../TimeOffice/pages/assign/PolicyUpdateAssignPage";
// import FaceTemplateAssignPage from "../TimeOffice/pages/assign/FaceTemplateAssignPage";
// import AssignImportPage from "../TimeOffice/pages/assign/AssignImportPage";

// export const TalentHubRoutes = (
//   <Route path="talent-hub" element={<TalentHubPage />}>
//     <Route path="attendance" element={<AttendancePage1 />}>
//       <Route index element={<Navigate to="configuration" replace />} />
//       <Route path="configuration" element={<AttendanceConfigurationPage />}>
//         <Route index element={<Navigate to="forceapproval" replace />} />
//         <Route path="forceapproval" element={<ForceApprovalPanel1 />} />
//       </Route>
//       <Route path="integration" element={<AttendanceIntegrationsPage />}>
//         <Route index element={<Navigate to="settings" replace />} />
//         <Route path="settings" element={<IntegrationSettingsPanel />} />
//         <Route path="attendanceintegrations" element={<AttendanceIntegrationPanel />} />
//         <Route path="reconcileleave" element={<ReconcileLeavePanel />} />
//       </Route>
//     </Route>
//     <Route path="leave">
//       <Route path="settings" element={<LeaveSettingsPage />}>
//         <Route index element={<Navigate to="policy" replace />} />
//         <Route path="policy" element={<LeavePolicyPage />} />
//         <Route path="policy/:policyId/leave/:leaveId/behavior" element={<LeaveBehaviorPage />} />
//       </Route>
//       <Route index element={<Navigate to="holidayandweekOff" replace />} />

//       <Route path="holidayandweekOff" element={<HolidayWeeklyOffPage />}>
//         <Route index element={<Navigate to="holiday" replace />} />
//         <Route path="holiday" element={<HolidayPanel />} />
//         <Route path="weeklyoff" element={<WeeklyOffPanel />} />
//         <Route path="import" element={<HolidayImportPanel />} />
//       </Route>
//     </Route>

//     <Route path="timeoffice">
//       <Route index element={<Navigate to="punch-process" replace />} />
//       <Route path="punch-process">
//         <Route index element={<Navigate to="dashboard" replace />} />
//         <Route path="dashboard" element={<PunchDashboardPage />} />
//         <Route path="process" element={<ProcessPage />} />
//         <Route path="punch" element={<PunchProcessPunchPage />} />
//         <Route
//           path="attendance-overview"
//           element={<PunchProcessAttendanceOverviewPage />}
//         />
//         <Route
//           path="ta-insights"
//           element={<PunchPlaceholderPage title="TA Insights" />}
//         />
//         <Route path="import" element={<PunchProcessImportPage />} />
//       </Route>

//       <Route path="regularization">
//         <Route index element={<Navigate to="punch" replace />} />
//         <Route path="punch" element={<PunchPage />} />
//         <Route path="missed-punch" element={<MissedPunchPage />} />
//         <Route path="attendance" element={<AttendancePage />} />
//         <Route path="ta-insights" element={<TaInsightsPage />} />
//       </Route>

//       <Route path="ta-reports" element={<TaReportsPage />} />

//       <Route path="force-approval">
//         <Route index element={<Navigate to="punch" replace />} />
//         <Route
//           path="punch"
//           element={<ForceApprovalPanel title="Punch" endpoint="punch" />}
//         />
//         <Route
//           path="weekly-off"
//           element={<ForceApprovalPanel title="Weekly Off" />}
//         />
//         <Route
//           path="over-time"
//           element={<ForceApprovalPanel title="Over Time" />}
//         />
//         <Route
//           path="official-permission"
//           element={<ForceApprovalPanel title="Official Permission" />}
//         />
//         <Route
//           path="personal-permission"
//           element={<ForceApprovalPanel title="Personal Permission" />}
//         />
//         <Route path="shift" element={<ForceApprovalPanel title="Shift" />} />
//         <Route
//           path="face-template"
//           element={
//             <ForceApprovalPanel title="Face Template" endpoint="facetemplate" />
//           }
//         />
//       </Route>

//       <Route path="masters">
//         <Route index element={<Navigate to="policy" replace />} />
//         <Route path="policy" element={<PolicyPage />} />
//         <Route path="shift-pattern" element={<ShiftPatternPage />} />
//         <Route path="shift-master" element={<ShiftMasterPage />} />
//         <Route path="geo-location" element={<GeoLocationPage />} />
//         <Route path="import" element={<MastersImportPage />} />
//       </Route>

//       <Route path="assign">
//         <Route index element={<Navigate to="geo-location" replace />} />
//         <Route path="geo-location" element={<GeoLocationAssignPage />} />
//         <Route path="policy-update" element={<PolicyUpdateAssignPage />} />
//         <Route path="face-template" element={<FaceTemplateAssignPage />} />
//         <Route path="import" element={<AssignImportPage />} />
//       </Route>

//       <Route path="settings">
//         <Route index element={<Navigate to="general-settings" replace />} />
//         <Route path="general-settings" element={<GeneralSettingsPage />} />
//         <Route path="auto-process" element={<AutoProcessPage />} />
//         <Route path="mail-scheduler" element={<MailSchedulerPage />} />
//         <Route path="punch-integration" element={<PunchIntegrationPage />} />
//       </Route>
//     </Route>
//   </Route>
// );

 
 
import { Navigate, Outlet, Route } from "react-router-dom";
import TalentHubPage from "../pages/TalentHubPage";
// import AttendancePage from "../Attendance/pages/AttendancePage";
 
//Attendance
import AttendancePage1 from "../Attendance/pages/AttendancePage1";
import AttendanceConfigurationPage from "../Attendance/pages/AttendanceConfigurationPage";
import AttendanceIntegrationsPage from "../Attendance/pages/AttendanceIntegrationsPage";
import { ForceApprovalPanel1 } from "../Attendance/components/Forceapprovalpanel1";
import IntegrationSettingsPanel from "../Attendance/components/IntegrationSettingsPanel";
import AttendanceIntegrationPanel from "../Attendance/components/AttendanceIntegrationsPanel";
import ReconcileLeavePanel from "../Attendance/components/ReconileLeavePanel";
 
 
 
//Leave
 
//Leave //Settings
import LeaveSettingsPage from "../Leave/Settings/pages/leavesettingspage";
import LeavePolicyPage from "../Leave/Settings/pages/policypage";
import LeaveBehaviorPage from "../Leave/Settings/pages/leavebehaviourpage";
 
 
//Leave//Holiday and weeklyoff
import HolidayWeeklyOffPage from "../Leave/HolidayAndWeeklyoff/pages/HolidayWeeklyOffPage";
import HolidayPanel from "../Leave/HolidayAndWeeklyoff/components/HolidayPanel";
import WeeklyOffPanel from "../Leave/HolidayAndWeeklyoff/components/Weeklyoffpanel";
import HolidayImportPanel from "../Leave/HolidayAndWeeklyoff/components/HolidayImportPanel";
import LeaveDailyPage from "../Leave/Daily/pages/LeaveDailyPage";
import LeaveDailyImportPage from "../Leave/Daily/pages/LeaveDailyImportPage";
import AdjustmentPage from "../Leave/Adjustment/pages/AdjustmentPage";
import LeaveAdjustmentConfigurationPage from "../Leave/Adjustment/pages/LeaveAdjustmentConfigurationPage";
import ManualLeaveAllotmentPage from "../Leave/Adjustment/pages/ManualLeaveAllotmentPage";
import AdjustmentImportPage from "../Leave/Adjustment/pages/AdjustmentImportPage";
import ForceLeaveApprovalPage from "../Leave/ForceLeaveApproval/pages/ForceLeaveApprovalPage";
 
// Leave reports use the shared TalentHub report pages and components.
import LeaveAllotmentReport from "../Leave/Report/pages/LeaveAllotmentReportPage";
import LeaveReportLandingPage from "../Leave/Report/pages/LeaveReportLandingPage";
import LeaveAvailedReport from "../Leave/Report/pages/LeaveAvailedReportPage";
import LeaveLapsedReport from "../Leave/Report/pages/LeaveLapsedReportPage";
import LeaveEncashedReport from "../Leave/Report/pages/LeaveEncashedReportPage";
import LeaveSummaryReport from "../Leave/Report/pages/LeaveSummaryReportPage";
import LeaveSummaryBetweenMonths from "../Leave/Report/pages/LeaveSummaryBetweenMonthsPage";
import LeaveSummaryDetailed from "../Leave/Report/pages/LeaveSummaryDetailedPage";
import LeaveHistoryMonthWise from "../Leave/Report/pages/LeaveHistoryMonthWisePage";
import LeaveHistoryDateWise from "../Leave/Report/pages/LeaveHistoryDateWisePage";
import AttendanceRegularizationReport from "../Leave/Report/pages/AttendanceIndependentReportPage";
import HourlyAttendanceReport from "../Leave/Report/pages/HourlyAttendanceReportPage";
import AttendanceIntegrationReport from "../Leave/Report/pages/AttendanceIntegrationReportPage";
import OverTimeReport from "../Leave/Report/pages/OverTimeReportPage";
import LateEarlyOutReport from "../Leave/Report/pages/LateInEarlyOutReportPage";
import LateEarlyOutReportMonthly from "../Leave/Report/pages/LateInEarlyOutMonthlyPage";
import ExceptionReport from "../Leave/Report/pages/ExceptionReconcileReportPage";
import ExceptionReportMonthly from "../Leave/Report/pages/ExceptionReconcileMonthlyPage";
import TagAttendanceReport from "../Leave/Report/pages/TopAttendancePage";
import TagLeaveReport from "../Leave/Report/pages/TopLeaveTakenPage";
 
//Timeoffice Routes
 
import PunchDashboardPage from "../TimeOffice/pages/punchprocess/PunchDashboardPage";
import ProcessPage from "../TimeOffice/pages/punchprocess/ProcessPage";
import PunchPlaceholderPage from "../TimeOffice/pages/punchprocess/PunchPlaceholderPage";
import PunchProcessPunchPage from "../TimeOffice/pages/punchprocess/PunchProcessPunchPage";
import PunchProcessAttendanceOverviewPage from "../TimeOffice/pages/punchprocess/PunchProcessAttendanceOverviewPage";
import PunchProcessImportPage from "../TimeOffice/pages/punchprocess/PunchProcessImportPage";
import PunchPage from "../TimeOffice/pages/regularization/PunchPage";
import MissedPunchPage from "../TimeOffice/pages/regularization/MissedPunchPage";
import AttendancePage from "../TimeOffice/pages/regularization/AttendancePage";
import TaInsightsPage from "../TimeOffice/pages/regularization/TaInsightsPage";
import TaReportsPage from "../TimeOffice/pages/TAreports/TaReportsPage";
import ForceApprovalPanel from "../TimeOffice/pages/forceapproval/ForceApprovalPanel";
import PolicyPage from "../TimeOffice/pages/masters/PolicyPage";
import ShiftPatternPage from "../TimeOffice/pages/masters/ShiftPatternPage";
import ShiftMasterPage from "../TimeOffice/pages/masters/ShiftMasterPage";
import GeoLocationPage from "../TimeOffice/pages/masters/GeoLocationPage";
import MastersImportPage from "../TimeOffice/pages/masters/MastersImportPage";
import GeneralSettingsPage from "../TimeOffice/pages/settings/GeneralSettingsPage";
import AutoProcessPage from "../TimeOffice/pages/settings/AutoProcessPage";
import MailSchedulerPage from "../TimeOffice/pages/settings/MailSchedulerPage";
import PunchIntegrationPage from "../TimeOffice/pages/settings/PunchIntegrationPage";
import GeoLocationAssignPage from "../TimeOffice/pages/assign/GeoLocationAssignPage";
import PolicyUpdateAssignPage from "../TimeOffice/pages/assign/PolicyUpdateAssignPage";
import FaceTemplateAssignPage from "../TimeOffice/pages/assign/FaceTemplateAssignPage";
import AssignImportPage from "../TimeOffice/pages/assign/AssignImportPage";
 
export const TalentHubRoutes = (
  <Route path="talent-hub" element={<TalentHubPage />}>
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
        <Route
          path="ta-insights"
          element={<PunchPlaceholderPage title="TA Insights" />}
        />
        <Route path="import" element={<PunchProcessImportPage />} />
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