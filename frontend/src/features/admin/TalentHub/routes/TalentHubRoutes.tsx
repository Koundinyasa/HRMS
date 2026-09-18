import {Route,Navigate} from "react-router-dom";
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

    <Route path="leave"></Route>

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