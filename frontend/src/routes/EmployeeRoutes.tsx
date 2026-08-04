import { Routes, Route, Navigate } from "react-router-dom"; 
import Layout from "@/features/employee/components/Layout";
import EmployeeDashboard from "@/features/employee/dashboard/pages/DashboardPage";
import ProfileLayout from "@/features/employee/profile/components/ProfileLayout";
import LeaveLayout from "@/features/employee/leave/components/LeaveLayout";
 
// Profile Module
import PersonalInformationPage from "@/features/employee/profile/pages/PersonalInformationPage";
import FamilyDetailsPage from "@/features/employee/profile/pages/FamilyDetailsPage";
import EducationDetailsPage from "@/features/employee/profile/pages/EducationDetailsPage";
import ExperienceDetailsPage from "@/features/employee/profile/pages/ExperienceDetailsPage";
import BankInformationPage from "@/features/employee/profile/pages/BankInformationPage";
import UploadedDocumentsPage from "@/features/employee/profile/pages/UploadedDocumentsPage";
 

// // Leave Module
import LeaveApply from "@/features/employee/leave/pages/LeaveApply";
import LeaveBalance from "@/features/employee/leave/pages/LeaveBalance";
import LeaveHistory from "@/features/employee/leave/pages/LeaveHistory";
import LeaveCancellation from "@/features/employee/leave/pages/LeaveCancellation";
import LeaveStatus from "@/features/employee/leave/pages/LeaveStatus";

// Asset Module
import AssetRequest from "@/features/employee/asset/pages/AssetRequest";
import AssetTracking from "@/features/employee/asset/pages/AssetTracking";
import AssignedAssets from "@/features/employee/asset/pages/AssignedAssets";
import AssetApproval from "@/features/employee/asset/pages/AssetApproval";

// Separation Module
import ResignationPage from "@/features/employee/separation/pages/ResignationPage";
import StatusPage from "@/features/employee/separation/pages/StatusPage";
import WithdrawPage from "@/features/employee/separation/pages/WithdrawPage";


export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="dashboard" element={<EmployeeDashboard />} />


        {/* Profile Management */}
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
           <Route path="status" element={<LeaveStatus />} />
           <Route path="balance" element={<LeaveBalance />} />
           <Route path="history" element={<LeaveHistory />} />
           <Route path="cancel" element={<LeaveCancellation />} />
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
      </Route>
    </Routes>
  );
}