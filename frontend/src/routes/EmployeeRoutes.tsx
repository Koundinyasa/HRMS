import {
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

/* =========================================================
   EMPLOYEE LAYOUT
========================================================= */

 
import Layout from "@/features/employee/components/Layout";

/* =========================================================
   DASHBOARD
========================================================= */

import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";
import FaceRegistrationPage from "@/features/employee/dashboard/pages/FaceRegistrationPage";

/* =========================================================
   PROFILE
========================================================= */

import ProfileLayout from "@/features/employee/profile/components/ProfileLayout";

import PersonalInformationPage from "@/features/employee/profile/pages/PersonalInformationPage";
import FamilyDetailsPage from "@/features/employee/profile/pages/FamilyDetailsPage";
import EducationDetailsPage from "@/features/employee/profile/pages/EducationDetailsPage";
import ExperienceDetailsPage from "@/features/employee/profile/pages/ExperienceDetailsPage";
import BankInformationPage from "@/features/employee/profile/pages/BankInformationPage";
import UploadedDocumentsPage from "@/features/employee/profile/pages/UploadedDocumentsPage";

/* =========================================================
   LEAVE
========================================================= */

import LeaveLayout from "@/features/employee/leave/components/LeaveLayout";

import LeaveApply from "@/features/employee/leave/pages/LeaveApply";
import LeaveBalance from "@/features/employee/leave/pages/LeaveBalance";
import LeaveHistory from "@/features/employee/leave/pages/LeaveHistory";
import LeaveCancellation from "@/features/employee/leave/pages/LeaveCancellation";
import LeaveStatus from "@/features/employee/leave/pages/LeaveStatus";
import HolidayListPage from "@/features/employee/leave/pages/HolidayListPage";

/* =========================================================
   ASSETS
========================================================= */

import AssetRequest from "@/features/employee/asset/pages/AssetRequest";
import AssetTracking from "@/features/employee/asset/pages/AssetTracking";
import AssignedAssets from "@/features/employee/asset/pages/AssignedAssets";
import AssetApproval from "@/features/employee/asset/pages/AssetApproval";

/* =========================================================
   SEPARATION
========================================================= */

import ResignationPage from "@/features/employee/separation/pages/ResignationPage";
import StatusPage from "@/features/employee/separation/pages/StatusPage";
import WithdrawPage from "@/features/employee/separation/pages/WithdrawPage";

/* =========================================================
   HELPDESK
========================================================= */

import RaiseTicket from "@/features/employee/helpdesk/pages/RaiseTicket";
import TicketStatus from "@/features/employee/helpdesk/pages/TicketStatus";
import KnowledgeBase from "@/features/employee/helpdesk/pages/KnowledgeBase";

/* =========================================================
   TIME OFFICE → PUNCH
========================================================= */

import PunchPage from "@/features/employee/review/timeOffice/punch/pages/PunchPage";

import MissedPunchPage from "@/features/employee/review/timeOffice/missedPunch/pages/MissedPunchPage";
import TAInsightsPage from "@/features/employee/review/timeOffice/taInsights/pages/TAInsightsPage";
import AttendanceOverview from "@/features/employee/review/Attandance overview/timeOffice/pages/AttendanceOverview";
import LeaveCalendarHistory from "@/features/employee/review/timeOffice/attendance/components/LeaveCalendarHistory";
import LeaveCalendar from "@/features/employee/review/leaveCalender/pages/LeaveCalendar";
import TimeOfficeLeaveCalendar from "@/features/employee/review/timeOffice/attendance/pages/LeaveCalendar";

/* =========================================================
   APPLY LEAVE FOR EMPLOYEE REDIRECT
========================================================= */

function ApplyLeaveForEmployeeRedirect() {
  const { domain } = useParams();
 
  return (
    <Navigate
      to={`/${domain}/employee/leave/apply`}
      state={{
        forceApplyForEmployee: true,
      }}
      replace
    />
  );
}

/* =========================================================
   EMPLOYEE ROUTES
========================================================= */

export default function EmployeeRoutes() {
  return (
    <Routes>

      {/* =====================================================
          EMPLOYEE MAIN LAYOUT
      ===================================================== */}

      <Route
        path="/"
        element={<Layout />}
      >

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <Route
          path="dashboard"
          element={<EmployeeDashboard />}
        />

        {/* ===================================================
            PROFILE
        =================================================== */}

        <Route
          path="profile"
          element={<ProfileLayout />}
        >

          {/* /profile → /profile/personal */}

          <Route
            index
            element={
              <Navigate
                to="personal"
                replace
              />
            }
          />

          {/* Personal Information */}

          <Route
            path="personal"
            element={
              <PersonalInformationPage />
            }
          />

          {/* Family Details */}

          <Route
            path="family"
            element={
              <FamilyDetailsPage />
            }
          />

          {/* Education Details */}

          <Route
            path="education"
            element={
              <EducationDetailsPage />
            }
          />

          {/* Experience Details */}

          <Route
            path="experience"
            element={
              <ExperienceDetailsPage />
            }
          />

          {/* Bank Information */}

          <Route
            path="bank"
            element={
              <BankInformationPage />
            }
          />

          {/* Uploaded Documents */}

          <Route
            path="documents"
            element={
              <UploadedDocumentsPage />
            }
          />

        </Route>

        {/* ===================================================
            LEAVE
        =================================================== */}

        <Route
          path="leave"
          element={<LeaveLayout />}
        >

          {/* /leave → /leave/apply */}

          <Route
            index
            element={
              <Navigate
                to="apply"
                replace
              />
            }
          />

          {/* Apply Leave */}

          <Route
            path="apply"
            element={<LeaveApply />}
          />

          {/* Leave Status */}

          <Route
            path="status"
            element={<LeaveStatus />}
          />

          {/* Leave Balance */}

          <Route
            path="balance"
            element={<LeaveBalance />}
          />

          {/* Leave History */}

          <Route
            path="history"
            element={<LeaveHistory />}
          />

          {/* Leave Cancellation */}

          <Route
            path="cancel"
            element={
              <LeaveCancellation />
            }
          />

          {/* Holiday List */}

          <Route
            path="holidaylist"
            element={
              <HolidayListPage />
            }
          />

        </Route>

        {/* ===================================================
            ASSETS
        =================================================== */}

        {/* Asset Request */}

        <Route
          path="assets/request"
          element={<AssetRequest />}
        />

        {/* Asset Return / Tracking */}

        <Route
          path="assets/return"
          element={<AssetTracking />}
        />

        {/* Assigned Assets */}

        <Route
          path="assets/assigned"
          element={<AssignedAssets />}
        />

        {/* Asset Approval */}

        <Route
          path="assets/approval"
          element={<AssetApproval />}
        />

        {/* ===================================================
            SEPARATION
        =================================================== */}

        {/* Resignation */}

        <Route
          path="separation/resignation"
          element={<ResignationPage />}
        />

        {/* Separation Status */}

        <Route
          path="separation/status"
          element={<StatusPage />}
        />

        {/* Withdraw Resignation */}

        <Route
          path="separation/withdraw"
          element={<WithdrawPage />}
        />

        {/* ===================================================
            HELPDESK
        =================================================== */}

        {/* Raise Ticket */}

        <Route
          path="helpdesk/ticket"
          element={<RaiseTicket />}
        />

        {/* Ticket Status */}

        <Route
          path="helpdesk/status"
          element={<TicketStatus />}
        />

        {/* Knowledge Base */}

        <Route
          path="helpdesk/kb"
          element={<KnowledgeBase />}
        />

        {/* ===================================================
            APPLY LEAVE FOR EMPLOYEE
        =================================================== */}

        <Route
          path="Applyleaveemployee"
          element={
            <ApplyLeaveForEmployeeRedirect />
          }
        />

        {/* ===================================================
            TIME OFFICE
        =================================================== */}

        {/* ===================================================
            PUNCH
        =================================================== */}

        <Route
          path="Punch"
          element={<PunchPage />}
        />

        {/* ===================================================
            MISSED PUNCH
        =================================================== */}

        <Route
          path="MissedPunch"
          element={<MissedPunchPage />}
        />

        {/* ===================================================
            OLD / REGULARIZATION ROUTES
            Keep these for existing navigation
        =================================================== */}

        <Route
          path="Regularization/Punch"
          element={<PunchPage />}
        />

        <Route
          path="Regularization/MissedPunch"
          element={<MissedPunchPage />}
        />

        <Route
          path="Regularization/TAInsights"
          element={<TAInsightsPage />}
        />

        <Route
          path="Regularization/Attendance"
          element={<TimeOfficeLeaveCalendar />}
        />

        <Route
          path="TAInsights"
          element={<TAInsightsPage />}
        />

        <Route
          path="time-office/regularization/attendance"
          element={<TimeOfficeLeaveCalendar />}
        />

        {/* ===================================================
            ATTENDANCE
            FACE REGISTRATION
        =================================================== */}

        <Route
          path="attendance/face-registration"
          element={
            <FaceRegistrationPage />
          }
        />

        <Route
          path="Leavecalender"
          element={<LeaveCalendar />}
        />

        <Route
          path="review/leave-calendar/history"
          element={<LeaveCalendarHistory />}
        />

        <Route
          path="TA/attendanceoverview"
          element={<AttendanceOverview />}
        />

      </Route>
      
    </Routes>
  );
}