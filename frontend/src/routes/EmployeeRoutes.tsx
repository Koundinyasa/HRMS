// import { Routes, Route, Navigate, useParams } from "react-router-dom";
// import Layout from "@/features/employee/components/Layout";

// // Dashboard
// import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";
// import FaceRegistrationPage from "@/features/employee/dashboard/pages/FaceRegistrationPage";

// // Profile
// import ProfileLayout from "@/features/employee/profile/components/ProfileLayout";
// import PersonalInformationPage from "@/features/employee/profile/pages/PersonalInformationPage";
// import FamilyDetailsPage from "@/features/employee/profile/pages/FamilyDetailsPage";
// import EducationDetailsPage from "@/features/employee/profile/pages/EducationDetailsPage";
// import ExperienceDetailsPage from "@/features/employee/profile/pages/ExperienceDetailsPage";
// import BankInformationPage from "@/features/employee/profile/pages/BankInformationPage";
// import UploadedDocumentsPage from "@/features/employee/profile/pages/UploadedDocumentsPage";

// // Leave
// import LeaveLayout from "@/features/employee/leave/components/LeaveLayout";
// import LeaveApply from "@/features/employee/leave/pages/LeaveApply";
// import ApplyLeaveForEmployee from "@/features/employee/leave/components/Applyforemployee";
// import LeaveBalance from "@/features/employee/leave/pages/LeaveBalance";
// import LeaveHistory from "@/features/employee/leave/pages/LeaveHistory";
// import LeaveCancellation from "@/features/employee/leave/pages/LeaveCancellation";
// import LeaveStatus from "@/features/employee/leave/pages/LeaveStatus";
// import HolidayListPage from "@/features/employee/leave/pages/HolidayListPage";

// // Assets
// import AssetRequest from "@/features/employee/asset/pages/AssetRequest";
// import AssetTracking from "@/features/employee/asset/pages/AssetTracking";
// import AssignedAssets from "@/features/employee/asset/pages/AssignedAssets";
// import AssetApproval from "@/features/employee/asset/pages/AssetApproval";

// // Separation
// import ResignationPage from "@/features/employee/separation/pages/ResignationPage";
// import StatusPage from "@/features/employee/separation/pages/StatusPage";
// import WithdrawPage from "@/features/employee/separation/pages/WithdrawPage";

// // Helpdesk
// import RaiseTicket from "@/features/employee/helpdesk/pages/RaiseTicket";
// import TicketStatus from "@/features/employee/helpdesk/pages/TicketStatus";
// import KnowledgeBase from "@/features/employee/helpdesk/pages/KnowledgeBase";

// // Time office / punch / attendance
// import PunchPage from "@/features/employee/review/timeOffice/punch/pages/PunchPage";
// import MissedPunchPage from "@/features/employee/review/timeOffice/missedPunch/pages/MissedPunchPage";
// import TAInsightsPage from "@/features/employee/review/timeOffice/taInsights/pages/TAInsightsPage";
// import AttendanceOverview from "@/features/employee/review/Attandance overview/timeOffice/pages/AttendanceOverview";
// import LeaveCalendarHistory from "@/features/employee/review/timeOffice/attendance/components/LeaveCalendarHistory";
// import LeaveCalendar from "@/features/employee/review/leaveCalender/pages/LeaveCalendar";
// import TimeOfficeLeaveCalendar from "@/features/employee/review/timeOffice/attendance/pages/LeaveCalendar";
// import RequisitionPage from "@/features/employee/review/requisition/pages/RequisitionPage";


// function ApplyLeaveForEmployeeRedirect() {
//   const { domain } = useParams();
//   return (<Navigate to={`/${domain}/employee/leave/apply-for-employee`}replace/>);}

// // Flat routes that don't need a shared layout wrapper.
// // Grouped here (rather than repeating <Route element=.../> blocks) so new
// // entries are just one line each.
// const STANDALONE_ROUTES = [
//   // Assets
//   { path: "assets/request", element: <AssetRequest /> },
//   { path: "assets/return", element: <AssetTracking /> },
//   { path: "assets/assigned", element: <AssignedAssets /> },
//   { path: "assets/approval", element: <AssetApproval /> },

//   // Separation
//   { path: "separation/resignation", element: <ResignationPage /> },
//   { path: "separation/status", element: <StatusPage /> },
//   { path: "separation/withdraw", element: <WithdrawPage /> },

//   // Helpdesk
//   { path: "helpdesk/ticket", element: <RaiseTicket /> },
//   { path: "helpdesk/status", element: <TicketStatus /> },
//   { path: "helpdesk/kb", element: <KnowledgeBase /> },

//   // Legacy leave-apply-for-employee redirect

//   // Review — requisition
//   { path: "review/requisition/appliedleave", element: <RequisitionPage /> },

//   // Time office — punch
//   { path: "Punch", element: <PunchPage /> },
//   { path: "MissedPunch", element: <MissedPunchPage /> },
//   { path: "TAInsights", element: <TAInsightsPage /> },
//   { path: "time-office/regularization/attendance", element: <TimeOfficeLeaveCalendar /> },

//   // Time office — old "Regularization/*" paths, kept for existing navigation
//   { path: "Regularization/Punch", element: <PunchPage /> },
//   { path: "Regularization/MissedPunch", element: <MissedPunchPage /> },
//   { path: "Regularization/TAInsights", element: <TAInsightsPage /> },
//   { path: "Regularization/Attendance", element: <TimeOfficeLeaveCalendar /> },

//   // Attendance
//   { path: "attendance/face-registration", element: <FaceRegistrationPage /> },
//   { path: "Leavecalender", element: <LeaveCalendar /> },
//   { path: "review/leave-calendar/history", element: <LeaveCalendarHistory /> },
//   { path: "TA/attendanceoverview", element: <AttendanceOverview /> },
// ];

// export default function EmployeeRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
//         <Route path="dashboard" element={<EmployeeDashboard />} />

//         {/* Profile */}
//         <Route path="profile" element={<ProfileLayout />}>
//           <Route index element={<Navigate to="personal" replace />} />
//           <Route path="personal" element={<PersonalInformationPage />} />
//           <Route path="family" element={<FamilyDetailsPage />} />
//           <Route path="education" element={<EducationDetailsPage />} />
//           <Route path="experience" element={<ExperienceDetailsPage />} />
//           <Route path="bank" element={<BankInformationPage />} />
//           <Route path="documents" element={<UploadedDocumentsPage />} />
//         </Route>

//         {/* Leave */}
//         <Route path="leave" element={<LeaveLayout />}>
//           <Route index element={<Navigate to="apply" replace />} />
//           <Route path="apply" element={<LeaveApply />} />
//           <Route
//             path="apply-for-employee"
//             element={<ApplyLeaveForEmployee />}
//           />
//           <Route path="status" element={<LeaveStatus />} />
//           <Route path="balance" element={<LeaveBalance />} />
//           <Route path="history" element={<LeaveHistory />} />
//           <Route path="cancel" element={<LeaveCancellation />} />
//           <Route path="holidaylist" element={<HolidayListPage />} />
//           <Route
//             path="Applyleaveemployee"
//             element={<ApplyLeaveForEmployeeRedirect />}
//           />
//         </Route>

//         {/* Assets, separation, helpdesk, time office, attendance */}
//         {STANDALONE_ROUTES.map(({ path, element }) => (
//           <Route key={path} path={path} element={element} />
//         ))}
//       </Route>
//     </Routes>
//   );
// }



import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Layout from "@/features/employee/components/Layout";
import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";
 
// Profile Module
import ProfileLayout from "@/features/employee/profile/components/ProfileLayout";
import PersonalInformationPage from "@/features/employee/profile/pages/PersonalInformationPage";
import FamilyDetailsPage from "@/features/employee/profile/pages/FamilyDetailsPage";
import EducationDetailsPage from "@/features/employee/profile/pages/EducationDetailsPage";
import ExperienceDetailsPage from "@/features/employee/profile/pages/ExperienceDetailsPage";
import BankInformationPage from "@/features/employee/profile/pages/BankInformationPage";
import UploadedDocumentsPage from "@/features/employee/profile/pages/UploadedDocumentsPage";
 
// Leave Module
import LeaveLayout from "@/features/employee/leave/components/LeaveLayout";
import LeaveApply from "@/features/employee/leave/pages/LeaveApply";
import ApplyLeaveForEmployee from "@/features/employee/leave/components/Applyforemployee";
import LeaveBalance from "@/features/employee/leave/pages/LeaveBalance";
import LeaveHistory from "@/features/employee/leave/pages/LeaveHistory";
import LeaveCancellation from "@/features/employee/leave/pages/LeaveCancellation";
import LeaveStatus from "@/features/employee/leave/pages/LeaveStatus";
import HolidayListPage from "@/features/employee/leave/pages/HolidayListPage";
 
// Asset Module
import AssetRequest from "@/features/employee/asset/pages/AssetRequest";
import AssetTracking from "@/features/employee/asset/pages/AssetTracking";
import AssignedAssets from "@/features/employee/asset/pages/AssignedAssets";
import AssetApproval from "@/features/employee/asset/pages/AssetApproval";
 
// Separation Module
import ResignationPage from "@/features/employee/separation/pages/ResignationPage";
import StatusPage from "@/features/employee/separation/pages/StatusPage";
import WithdrawPage from "@/features/employee/separation/pages/WithdrawPage";
 
//HelpDesk Module
import RaiseTicket from "@/features/employee/helpdesk/pages/RaiseTicket";
import TicketStatus from "@/features/employee/helpdesk/pages/TicketStatus";
import KnowledgeBase from "@/features/employee/helpdesk/pages/KnowledgeBase";
 
import PunchPage from "@/features/employee/review/timeOffice/punch/pages/PunchPage";
 
import MissedPunchPage from "@/features/employee/review/timeOffice/missedPunch/pages/MissedPunchPage";
import TAInsightsPage from "@/features/employee/review/timeOffice/taInsights/pages/TAInsightsPage";
import AttendanceOverview from "@/features/employee/review/Attandance overview/timeOffice/pages/AttendanceOverview";
import LeaveCalendarHistory from "@/features/employee/review/timeOffice/attendance/components/LeaveCalendarHistory";
import LeaveCalendar from "@/features/employee/review/leaveCalender/pages/LeaveCalendar";
import TimeOfficeLeaveCalendar from "@/features/employee/review/timeOffice/attendance/pages/LeaveCalendar";
 
// Attendance Module — NEW
import FaceRegistrationPage from "@/features/employee/dashboard/pages/FaceRegistrationPage";
 
// Redirect the backend menu URL to the dedicated team-lead page.
function ApplyLeaveForEmployeeRedirect() {
  const { domain } = useParams();
 
  return (
    <Navigate to={`/${domain}/employee/leave/apply-for-employee`} replace />
  );
}
 
export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
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
 
         
          <Route
            path="apply-for-employee"
            element={<ApplyLeaveForEmployee />} />
         
 
          <Route path="status" element={<LeaveStatus />} />
 
          <Route path="balance" element={<LeaveBalance />} />
 
          <Route path="history" element={<LeaveHistory />} />
 
          <Route path="cancel" element={<LeaveCancellation />} />
 
          <Route path="holidaylist" element={<HolidayListPage />} />
 
          {/* Menu URL redirects to the existing Apply Leave page */}
        <Route
          path="Applyleaveemployee"
          element={<ApplyLeaveForEmployeeRedirect />}
        />
        </Route>
 
        {/* Asset Management */}
        <Route path="assets/request" element={<AssetRequest />} />
 
        <Route path="assets/return" element={<AssetTracking />} />
 
        <Route path="assets/assigned" element={<AssignedAssets />} />
 
        <Route path="assets/approval" element={<AssetApproval />} />
 
        {/* Separation Management */}
        <Route path="separation/resignation" element={<ResignationPage />} />
 
        <Route path="separation/status" element={<StatusPage />} />
 
        <Route path="separation/withdraw" element={<WithdrawPage />} />
 
        {/* Help Desk */}
        <Route path="helpdesk/ticket" element={<RaiseTicket />} />
        <Route path="helpdesk/status" element={<TicketStatus />} />
        <Route path="helpdesk/kb" element={<KnowledgeBase />} />
 
       <Route
          path="Punch"
          element={<PunchPage />}
        />
 
        <Route
          path="MissedPunch"
          element={<MissedPunchPage />}
        />
 
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
 
        {/* Review Module */}
 
        {/* Apply Leave for Employee */}
        <Route
          path="Applyleaveemployee"
          element={<ApplyLeaveForEmployeeRedirect />}
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
 
        <Route
          path="attendanceoverview"
          element={<AttendanceOverview />}
        />
 
        {/* Attendance Management — NEW */}
        <Route
          path="attendance/face-registration"
          element={<FaceRegistrationPage />}
        />
      </Route>
    </Routes>
  );
}