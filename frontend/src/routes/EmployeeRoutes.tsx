
// import { Routes, Route, Navigate, useParams } from "react-router-dom";

// import Layout from "@/features/employee/components/Layout";

// import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";

// import ProfileLayout from "@/features/employee/profile/components/ProfileLayout";
// import LeaveLayout from "@/features/employee/leave/components/LeaveLayout";

// // Profile Module
// import PersonalInformationPage from "@/features/employee/profile/pages/PersonalInformationPage";
// import FamilyDetailsPage from "@/features/employee/profile/pages/FamilyDetailsPage";
// import EducationDetailsPage from "@/features/employee/profile/pages/EducationDetailsPage";
// import ExperienceDetailsPage from "@/features/employee/profile/pages/ExperienceDetailsPage";
// import BankInformationPage from "@/features/employee/profile/pages/BankInformationPage";
// import UploadedDocumentsPage from "@/features/employee/profile/pages/UploadedDocumentsPage";

// // Leave Module
// import LeaveApply from "@/features/employee/leave/pages/LeaveApply";
// import LeaveBalance from "@/features/employee/leave/pages/LeaveBalance";
// import LeaveHistory from "@/features/employee/leave/pages/LeaveHistory";
// import LeaveCancellation from "@/features/employee/leave/pages/LeaveCancellation";
// import LeaveStatus from "@/features/employee/leave/pages/LeaveStatus";

// // Asset Module
// import AssetRequest from "@/features/employee/asset/pages/AssetRequest";
// import AssetTracking from "@/features/employee/asset/pages/AssetTracking";
// import AssignedAssets from "@/features/employee/asset/pages/AssignedAssets";
// import AssetApproval from "@/features/employee/asset/pages/AssetApproval";

// // Separation Module
// import ResignationPage from "@/features/employee/separation/pages/ResignationPage";
// import StatusPage from "@/features/employee/separation/pages/StatusPage";
// import WithdrawPage from "@/features/employee/separation/pages/WithdrawPage";

// //HelpDesk Module
// import RaiseTicket from "@/features/employee/helpdesk/pages/RaiseTicket";
// import TicketStatus from "@/features/employee/helpdesk/pages/TicketStatus";
// import KnowledgeBase from "@/features/employee/helpdesk/pages/KnowledgeBase";

// // Attendance Module — NEW
// import FaceRegistrationPage from "@/features/employee/dashboard/pages/FaceRegistrationPage";


// //Review/LeaveCalender
// import LeaveCalendar from "@/features/employee/review/leaveCalendar/pages/LeaveCalendar";
// import LeaveCalendarHistory from "@/features/employee/review/leaveCalendar/components/LeaveCalendarHistory";

// function ApplyLeaveForEmployeeRedirect() {
//   const { domain } = useParams();

//   return (
//     <Navigate
//       to={`/${domain}/employee/leave/apply`}
//       state={{ forceApplyForEmployee: true }}
//       replace
//     />
//   );
// }

// export default function EmployeeRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>

//         {/* Dashboard */}
//         <Route path="dashboard" element={<EmployeeDashboard />} />

//         {/* My Profile */}
//         <Route path="profile" element={<ProfileLayout />}>
//           <Route
//             index
//             element={
//               <Navigate
//                 to="personal"
//                 replace
//               />
//             }
//           />

//           <Route
//             path="personal"
//             element={<PersonalInformationPage />}
//           />

//           <Route
//             path="family"
//             element={<FamilyDetailsPage />}
//           />

//           <Route
//             path="education"
//             element={<EducationDetailsPage />}
//           />

//           <Route
//             path="experience"
//             element={<ExperienceDetailsPage />}
//           />

//           <Route
//             path="bank"
//             element={<BankInformationPage />}
//           />

//           <Route
//             path="documents"
//             element={<UploadedDocumentsPage />}
//           />
//         </Route>

//         {/* Leave Management */}
//         <Route
//           path="leave"
//           element={<LeaveLayout />}
//         >
//           <Route
//             index
//             element={<Navigate to="apply" replace />}
//           />

//           <Route
//             path="apply"
//             element={<LeaveApply />}
//           />

//           <Route
//             path="status"
//             element={<LeaveStatus />}
//           />

//           <Route
//             path="balance"
//             element={<LeaveBalance />}
//           />

//           <Route
//             path="history"
//             element={<LeaveHistory />}
//           />

//           <Route
//             path="cancel"
//             element={<LeaveCancellation />}
//           />
//         </Route>

//         {/* Asset Management */}
//         <Route
//           path="assets/request"
//           element={<AssetRequest />}
//         />

//         <Route
//           path="assets/return"
//           element={<AssetTracking />}
//         />

//         <Route
//           path="assets/assigned"
//           element={<AssignedAssets />}
//         />

//         <Route
//           path="assets/approval"
//           element={<AssetApproval />}
//         />

//         {/* Separation Management */}
//         <Route
//           path="separation/resignation"
//           element={<ResignationPage />}
//         />

//         <Route
//           path="separation/status"
//           element={<StatusPage />}
//         />

//         <Route
//           path="separation/withdraw"
//           element={<WithdrawPage />}
//         />

//         {/* Help Desk */}
//         <Route path="helpdesk/ticket" element={<RaiseTicket />} />
//         <Route path="helpdesk/status" element={<TicketStatus />} />
//         <Route path="helpdesk/kb" element={<KnowledgeBase />}
//         />

//         {/* Review */}
//         <Route
//           path="applyleaveemployee"
//           element={<ApplyLeaveForEmployeeRedirect />}
//         />

//         {/* Attendance Management — NEW */}
//         <Route path="attendance/face-registration" element={<FaceRegistrationPage />} />
//       </Route>
//     </Routes>
//   );
// }



import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
 
/* ============================================================
   EMPLOYEE LAYOUT
============================================================ */
 
import Layout from "@/features/employee/components/Layout";
 
/* ============================================================
   DASHBOARD
============================================================ */
 
import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";
 
/* ============================================================
   PROFILE
============================================================ */
 
import ProfileLayout from "@/features/employee/profile/components/ProfileLayout";
 
import PersonalInformationPage from "@/features/employee/profile/pages/PersonalInformationPage";
import FamilyDetailsPage from "@/features/employee/profile/pages/FamilyDetailsPage";
import EducationDetailsPage from "@/features/employee/profile/pages/EducationDetailsPage";
import ExperienceDetailsPage from "@/features/employee/profile/pages/ExperienceDetailsPage";
import BankInformationPage from "@/features/employee/profile/pages/BankInformationPage";
import UploadedDocumentsPage from "@/features/employee/profile/pages/UploadedDocumentsPage";
 
/* ============================================================
   LEAVE
============================================================ */
 
import LeaveLayout from "@/features/employee/leave/components/LeaveLayout";
 
import LeaveApply from "@/features/employee/leave/pages/LeaveApply";
import LeaveBalance from "@/features/employee/leave/pages/LeaveBalance";
import LeaveHistory from "@/features/employee/leave/pages/LeaveHistory";
import LeaveCancellation from "@/features/employee/leave/pages/LeaveCancellation";
import LeaveStatus from "@/features/employee/leave/pages/LeaveStatus";
 
/* ============================================================
   LEAVE CALENDAR
============================================================ */
 
import LeaveCalendar from "@/features/employee/review/leaveCalendar/pages/LeaveCalendar";
 
import LeaveCalendarHistory from "@/features/employee/review/leaveCalendar/components/LeaveCalendarHistory";
 
/* ============================================================
   ASSETS
============================================================ */
 
import AssetRequest from "@/features/employee/asset/pages/AssetRequest";
import AssetTracking from "@/features/employee/asset/pages/AssetTracking";
import AssignedAssets from "@/features/employee/asset/pages/AssignedAssets";
import AssetApproval from "@/features/employee/asset/pages/AssetApproval";
 
/* ============================================================
   SEPARATION
============================================================ */
 
import ResignationPage from "@/features/employee/separation/pages/ResignationPage";
import StatusPage from "@/features/employee/separation/pages/StatusPage";
import WithdrawPage from "@/features/employee/separation/pages/WithdrawPage";
 
/* ============================================================
   HELP DESK
============================================================ */
 
import RaiseTicket from "@/features/employee/helpdesk/pages/RaiseTicket";
import TicketStatus from "@/features/employee/helpdesk/pages/TicketStatus";
import KnowledgeBase from "@/features/employee/helpdesk/pages/KnowledgeBase";
 
/* ============================================================
   REVIEW → TIME OFFICE
============================================================ */
 
/*
  IMPORTANT:
  There is NO Regularization.tsx inside:
 
  features/employee/review/timeOffice/pages/
 
  Existing pages are:
  - PunchPage.tsx
  - MissedPunchPage.tsx
  - AttendanceOverview.tsx
  - TAInsightsPage.tsx
*/
 
// import PunchPage from "@/features/employee/review/timeOffice/pages/PunchPage";
// import MissedPunchPage from "@/features/employee/review/timeOffice/pages/MissedPunchPage";
// import AttendanceOverview from "@/features/employee/review/timeOffice/pages/AttendanceOverview";
// import TAInsightsPage from "@/features/employee/review/timeOffice/pages/TAInsightsPage";
 
/* ============================================================
   EMPLOYEE ROUTES
============================================================ */
 
export default function EmployeeRoutes() {
  return (
    <Routes>
 
      {/* ======================================================
          EMPLOYEE LAYOUT
      ====================================================== */}
 
      <Route element={<Layout />}>
 
        {/* ====================================================
            DASHBOARD
        ==================================================== */}
 
        <Route
          path="dashboard"
          element={
            <EmployeeDashboard />
          }
        />
 
        {/* ====================================================
            PROFILE
        ==================================================== */}
 
        <Route
          path="profile"
          element={
            <ProfileLayout />
          }
        >
 
          {/* Default Profile */}
 
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
 
        {/* ====================================================
            LEAVE
        ==================================================== */}
 
        <Route
          path="leave"
          element={
            <LeaveLayout />
          }
        >
 
          {/* Default Leave */}
 
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
            element={
              <LeaveApply />
            }
          />
 
          {/* Leave Balance */}
 
          <Route
            path="balance"
            element={
              <LeaveBalance />
            }
          />
 
          {/* Leave History */}
 
          <Route
            path="history"
            element={
              <LeaveHistory />
            }
          />
 
          {/* Leave Cancellation */}
 
          <Route
            path="cancellation"
            element={
              <LeaveCancellation />
            }
          />
 
          {/* Leave Status */}
 
          <Route
            path="status"
            element={
              <LeaveStatus />
            }
          />
 
        </Route>
 
        {/* ====================================================
            LEAVE CALENDAR
        ==================================================== */}
 
        <Route
          path="leave-calendar"
          element={
            <LeaveCalendar />
          }
        />
 
        <Route
          path="leave-calendar/history"
          element={
            <LeaveCalendarHistory />
          }
        />
 
        {/* ====================================================
            ASSETS
        ==================================================== */}
 
        <Route
          path="assets/request"
          element={
            <AssetRequest />
          }
        />
 
        <Route
          path="assets/tracking"
          element={
            <AssetTracking />
          }
        />
 
        <Route
          path="assets/assigned"
          element={
            <AssignedAssets />
          }
        />
 
        <Route
          path="assets/approval"
          element={
            <AssetApproval />
          }
        />
 
        {/* ====================================================
            SEPARATION
        ==================================================== */}
 
        <Route
          path="separation/resignation"
          element={
            <ResignationPage />
          }
        />
 
        <Route
          path="separation/status"
          element={
            <StatusPage />
          }
        />
 
        <Route
          path="separation/withdraw"
          element={
            <WithdrawPage />
          }
        />
 
        {/* ====================================================
            HELP DESK
        ==================================================== */}
 
        <Route
          path="helpdesk/raise-ticket"
          element={
            <RaiseTicket />
          }
        />
 
        <Route
          path="helpdesk/ticket-status"
          element={
            <TicketStatus />
          }
        />
 
        <Route
          path="helpdesk/knowledge-base"
          element={
            <KnowledgeBase />
          }
        />
 
        {/* ====================================================
            TIME OFFICE
        ==================================================== */}
 
        {/*
          Regularization was previously used as a parent route,
          but Regularization.tsx does not exist.
 
          Therefore each existing Time Office page has its own
          route.
        */}
 
        {/* Regularization / Punch */}
 
        {/* <Route
          path="time-office/regularization"
          element={
            <PunchPage />
          }
        /> */}
 
        {/* Missed Punch */}
 
        {/* <Route
          path="time-office/regularization/missed-punch"
          element={
            <MissedPunchPage />
          }
        /> */}
 
        {/* Attendance */}
 
        {/* <Route
          path="time-office/regularization/attendance"
          element={
            <AttendanceOverview />
          }
        /> */}
 
        {/* TA Insights */}
 
        {/* <Route
          path="time-office/regularization/ta-insights"
          element={
            <TAInsightsPage />
          }
        /> */}
 
        {/* ====================================================
            REVIEW
        ==================================================== */}
 
        {/* Review → Apply Leave */}
 
        <Route
          path="review/apply-leave"
          element={
            <LeaveApply />
          }
        />
 
        {/* Review → Leave Calendar */}
 
        <Route
          path="review/leave-calendar"
          element={
            <LeaveCalendar />
          }
        />
 
        {/* Review → Leave Calendar History */}
 
        <Route
          path="review/leave-calendar/history"
          element={
            <LeaveCalendarHistory />
          }
        />
 
        {/* ====================================================
            REVIEW → TIME OFFICE
        ==================================================== */}
 
        {/* Review → Time Office → Punch / Regularization */}
 
        {/* <Route
          path="review/time-office/regularization"
          element={
            <PunchPage />
          }
        /> */}
 
        {/* Review → Time Office → Missed Punch */}
 
        {/* <Route
          path="review/time-office/regularization/missed-punch"
          element={
            <MissedPunchPage />
          }
        /> */}
 
        {/* Review → Time Office → Attendance */}
 
        {/* <Route
          path="review/time-office/regularization/attendance"
          element={
            <AttendanceOverview />
          }
        /> */}
 
        {/* Review → Time Office → TA Insights */}
 
        {/* <Route
          path="review/time-office/regularization/ta-insights"
          element={
            <TAInsightsPage />
          }
        /> */}
 
        {/* ====================================================
            DEFAULT EMPLOYEE ROUTE
        ==================================================== */}
 
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />
 
      </Route>
 
      {/* ======================================================
          FALLBACK
      ====================================================== */}
 
      <Route
        path="*"
        element={
          <Navigate
            to="dashboard"
            replace
          />
        }
      />
 
    </Routes>
  );
}
 