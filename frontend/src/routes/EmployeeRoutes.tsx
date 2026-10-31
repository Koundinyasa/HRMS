import { lazy } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

import Layout from "@/features/employee/components/Layout";
import PageNotAvailable from "./PageNotAvailable";
import ReviewMenuRoute from "./ReviewMenuRoute";
 
// Profile Module
import ProfileLayout from "@/features/employee/profile/components/ProfileLayout";

// Leave Module
import LeaveLayout from "@/features/employee/leave/components/LeaveLayout";

// Pages are loaded on demand (each one becomes its own file in the build).
const EmployeeDashboard = lazy(() => import("@/features/employee/dashboard/pages/DashboardPage"));
const PersonalInformationPage = lazy(() => import("@/features/employee/profile/pages/PersonalInformationPage"));
const FamilyDetailsPage = lazy(() => import("@/features/employee/profile/pages/FamilyDetailsPage"));
const EducationDetailsPage = lazy(() => import("@/features/employee/profile/pages/EducationDetailsPage"));
const ExperienceDetailsPage = lazy(() => import("@/features/employee/profile/pages/ExperienceDetailsPage"));
const BankInformationPage = lazy(() => import("@/features/employee/profile/pages/BankInformationPage"));
const UploadedDocumentsPage = lazy(() => import("@/features/employee/profile/pages/UploadedDocumentsPage"));
const LeaveApply = lazy(() => import("@/features/employee/leave/pages/LeaveApply"));
const ApplyLeaveForEmployee = lazy(() => import("@/features/employee/leave/components/ApplyleaveForEmployee"));
const LeaveBalance = lazy(() => import("@/features/employee/leave/pages/LeaveBalance"));
const LeaveHistory = lazy(() => import("@/features/employee/leave/pages/LeaveHistory"));
const LeaveStatus = lazy(() => import("@/features/employee/leave/pages/LeaveStatus"));
const HolidayListPage = lazy(() => import("@/features/employee/leave/pages/HolidayListPage"));
const AssetRequest = lazy(() => import("@/features/employee/asset/pages/AssetRequest"));
const AssetTracking = lazy(() => import("@/features/employee/asset/pages/AssetTracking"));
const AssignedAssets = lazy(() => import("@/features/employee/asset/pages/AssignedAssets"));
const AssetApproval = lazy(() => import("@/features/employee/asset/pages/AssetApproval"));
const ResignationPage = lazy(() => import("@/features/employee/separation/pages/ResignationPage"));
const StatusPage = lazy(() => import("@/features/employee/separation/pages/StatusPage"));
const WithdrawPage = lazy(() => import("@/features/employee/separation/pages/WithdrawPage"));
const RaiseTicket = lazy(() => import("@/features/employee/helpdesk/pages/RaiseTicket"));
const TicketStatus = lazy(() => import("@/features/employee/helpdesk/pages/TicketStatus"));
const KnowledgeBase = lazy(() => import("@/features/employee/helpdesk/pages/KnowledgeBase"));
const PunchPage = lazy(() => import("@/features/employee/review/timeOffice/punch/pages/PunchPage"));
const MissedPunchPage = lazy(() => import("@/features/employee/review/timeOffice/missedPunch/pages/MissedPunchPage"));
const AttendanceOverview = lazy(() => import("@/features/employee/review/attendanceOverview/pages/AttendanceOverview"));
const LeaveCalendarHistory = lazy(() => import("@/features/employee/review/timeOffice/attendance/components/LeaveCalendarHistory"));
const LeaveCalendar = lazy(() => import("@/features/employee/review/leaveCalender/pages/LeaveCalendar"));
const TimeOfficeLeaveCalendar = lazy(() => import("@/features/employee/review/timeOffice/attendance/pages/LeaveCalendar"));
const RequisitionPage = lazy(() => import("@/features/employee/review/requisition/pages/RequisitionPage"));
const FaceRegistrationPage = lazy(() => import("@/features/employee/dashboard/pages/FaceRegistrationPage"));
const AssetRequestsApprovalPage = lazy(() => import("@/features/employee/review/assetRequests/pages/AssetRequestsApprovalPage"));
const HelpdeskRequestsPage = lazy(() => import("@/features/employee/review/helpdeskRequests/pages/HelpdeskRequestsPage"));
const ResignationRequestPage = lazy(() => import("@/features/employee/review/resignationRequest/pages/ResignationRequestPage"));

// Redirect the backend menu URL to the dedicated team-lead page.
function ApplyLeaveForEmployeeRedirect() {
  const { domain } = useParams();

  return (
    <Navigate to={`/${domain}/employee/leave/apply-for-employee`} replace />
  );
}

function AttendanceAliasRedirect() {
  const { domain } = useParams();
  const employeePath = domain ? `/${domain}/employee` : "/employee";

  return <Navigate to={`${employeePath}/Regularization/Attendance`} replace />;
}

export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        {/* Dashboard */}
        <Route path="dashboard" element={<EmployeeDashboard />} />
        {/* My Profile */}
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="personal" replace />} />

          <Route path="personal" element={<PersonalInformationPage />} />

          <Route path="family" element={<FamilyDetailsPage />} />

          <Route path="education" element={<EducationDetailsPage />} />

          <Route path="experience" element={<ExperienceDetailsPage />} />

          <Route path="bank" element={<BankInformationPage />} />

          <Route path="documents" element={<UploadedDocumentsPage />} />
        </Route>
        {/* Leave Management */}
        <Route path="leave" element={<LeaveLayout />}>
          <Route index element={<Navigate to="apply" replace />} />

          <Route path="apply" element={<LeaveApply />} />

          {/* Reporting managers only */}
          <Route element={<ReviewMenuRoute />}>
            <Route
              path="apply-for-employee"
              element={<ApplyLeaveForEmployee />}
            />
          </Route>

          <Route path="status" element={<LeaveStatus />} />

          <Route path="balance" element={<LeaveBalance />} />

          <Route path="history" element={<LeaveHistory />} />


          <Route path="holidaylist" element={<HolidayListPage />} />

          {/* Menu URL redirects to the existing Apply Leave page */}
          <Route element={<ReviewMenuRoute />}>
            <Route
              path="Applyleaveemployee"
              element={<ApplyLeaveForEmployeeRedirect />}
            />
          </Route>
        </Route>
        {/* Asset Management */}
        <Route path="assets/request" element={<AssetRequest />} />
        <Route path="assets/return" element={<AssetTracking />} />
        <Route path="assets/assigned" element={<AssignedAssets />} />
        {/* Approver screen: same gate as the Review menu (reporting managers) */}
        <Route element={<ReviewMenuRoute />}>
          <Route path="assets/approval" element={<AssetApproval />} />
        </Route>
        {/* Separation Management */}
        <Route path="separation/resignation" element={<ResignationPage />} />
        <Route path="separation/status" element={<StatusPage />} />
        <Route path="separation/withdraw" element={<WithdrawPage />} />
        {/* Help Desk */}
        <Route path="helpdesk/ticket" element={<RaiseTicket />} />
        <Route path="helpdesk/status" element={<TicketStatus />} />
        <Route path="helpdesk/kb" element={<KnowledgeBase />} />
        {/* Review (reporting managers only) */}
        <Route element={<ReviewMenuRoute />}>
        <Route
          path="review/requisition"
          element={<Navigate to="appliedleave" replace />}
        />
        <Route
          path="review/requisition/appliedleave"
          element={<RequisitionPage />}
        />
        <Route
          path="review/asset-requests"
          element={<AssetRequestsApprovalPage />}
        />
        <Route
          path="Review/requisition/Assetrequests"
          element={<AssetRequestsApprovalPage />}
        />
        <Route
          path="Review/requisition/Resignationrequests"
          element={<ResignationRequestPage />}
        />
        <Route path="TA/HelpdeskRequests" element={<HelpdeskRequestsPage />} />
        <Route path="Punch" element={<PunchPage />} />
        <Route path="MissedPunch" element={<MissedPunchPage />} />
        <Route path="Regularization/Punch" element={<PunchPage />} />
        <Route
          path="Regularization/MissedPunch"
          element={<MissedPunchPage />}
        />
        <Route
          path="Regularization/Attendance"
          element={<TimeOfficeLeaveCalendar />}
        />
        <Route
          path="time-office/regularization/attendance"
          element={<AttendanceAliasRedirect />}
        />
        {/* Review Module */}
        {/* Apply Leave for Employee */}
        <Route
          path="Applyleaveemployee"
          element={<ApplyLeaveForEmployeeRedirect />}
        />
        <Route path="Leavecalender" element={<LeaveCalendar />} />
        <Route
          path="review/leave-calendar/history"
          element={<LeaveCalendarHistory />}
        />
        <Route path="TA/attendanceoverview" element={<AttendanceOverview />} />
        <Route path="attendanceoverview" element={<AttendanceOverview />} />
        </Route>
        {/* Attendance Management — NEW */}
        <Route
          path="attendance/face-registration"
          element={<FaceRegistrationPage />}
        />
        {/* Anything else is not a Phase 1 page */}
        <Route path="*" element={<PageNotAvailable />} />
      </Route>
    </Routes>
  );
}
