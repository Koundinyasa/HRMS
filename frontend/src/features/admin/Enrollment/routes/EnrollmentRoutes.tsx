import { lazy } from "react";

// );



import { Route, Navigate } from "react-router-dom";

// Pages are loaded on demand (each one becomes its own file in the build).
const EnrollmentPage = lazy(() => import("../pages/EnrollmentPage"));
const BgvDashboardPage = lazy(() => import("../BackgroundVerification/pages/BgvDashboardPage"));
const BgvInitiatePage = lazy(() => import("../BackgroundVerification/pages/BgvInitiatePage"));
const BgvOngoingPage = lazy(() => import("../BackgroundVerification/pages/BgvOngoingPage"));
const BgvCompletedPage = lazy(() => import("../BackgroundVerification/pages/BgvCompletedPage"));
const BgvSettingsPage = lazy(() => import("../BackgroundVerification/pages/BgvSettingsPage"));
const Dashboard = lazy(() => import("../Pre-Enrollment/pages/Dashboard"));
const AddCandidate = lazy(() => import("../Pre-Enrollment/pages/AddCandidate"));
const AddCandidateForm = lazy(() => import("../Pre-Enrollment/pages/AddCandidateForm"));
const CompletedCandidate = lazy(() => import("../Pre-Enrollment/pages/CompletedCandidate"));
const CompletedCandidateDetails = lazy(() => import("../Pre-Enrollment/pages/CompletedCandidateDetails"));
const OffboardedCandidate = lazy(() => import("../Pre-Enrollment/pages/OffboardedCandidate"));
const Settings = lazy(() => import("../Pre-Enrollment/pages/Settings"));
const ImportPage = lazy(() => import("../Pre-Enrollment/pages/Import"));
const CandidateTasksPage = lazy(() => import("../Pre-Enrollment/pages/details/CandidateTasksPage"));
const CandidatePortalInfoPage = lazy(() => import("../Pre-Enrollment/pages/details/CandidatePortalInfoPage"));
const CandidateFormsPage = lazy(() => import("../Pre-Enrollment/pages/details/CandidateFormsPage"));
const EmployeePage1 = lazy(() => import("../EmployeeDetails/Pages/EmployeePage1"));
const EmployeeDetailsPage = lazy(() => import("../EmployeeDetails/Pages/EmployeeDetailsPage"));
const EmployeeGroupPage = lazy(() => import("../EmployeeDetails/Pages/EmployeeGroupPage"));
const PendingCandidatePage = lazy(() => import("../EmployeeDetails/Pages/PendingCandidatePage"));
const OrganizationChartPage = lazy(() => import("../EmployeeDetails/Pages/OrganizationChartPage"));
const ResetBlockedUserPage = lazy(() => import("../EmployeeDetails/Pages/ResetBlockedUserPage"));
const EmployeeImportPage = lazy(() => import("../EmployeeDetails/Pages/ImportPage"));
const BulkUpdateStatutoryPage = lazy(() => import("@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateStatutoryPage"));
const BulkUpdateClassificationPage = lazy(() => import("@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateClassificationPage"));
const BulkUpdateAuthorityPage = lazy(() => import("@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateAuthorityPage"));
const BulkUpdateRolePage = lazy(() => import("@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateRolePage"));
const BulkUpdatePanVerificationPage = lazy(() => import("@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdatePanVerificationPage"));
const ExitModulePage = lazy(() => import("../Separation/Pages/ExitModulePage"));
const GratuityModulePage = lazy(() => import("../Separation/Pages/GratuityModulePage"));
const FullAndFinalSettlements = lazy(() => import("../Separation/Pages/FullAndFinalSettlements"));
 
 
import AddEmployeeWizardPage from
  "../EmployeeDetails/Pages/AddEmployeeWizard";
 
//BackgroundVerification
 
//Pre-Enrollment
import PreEnrollmentLayout from "../Pre-Enrollment/pages/PreEnrollmentLayout";
 
// ---- Employee Details ----
 
 
// ---- Bulk Update ----
 
// ---- Separation ----
import SeperationLayout from "../Separation/Pages/SeperationLayout";
 
export const EnrollmentRoutes = (
  <Route path="enrollment" element={<EnrollmentPage />}>

    <Route index element={<Navigate to="background-verification" replace />} />
 
    {/*BackgroundVerification */}
    <Route path="background-verification">
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<BgvDashboardPage />} />
      <Route path="initiate" element={<BgvInitiatePage />} />
      <Route path="ongoing" element={<BgvOngoingPage />} />
      <Route path="completed" element={<BgvCompletedPage />} />
      <Route path="settings" element={<BgvSettingsPage />} />
    </Route>
 
    {/*Pre-Enrollment */}
    <Route path="pre-Enrollment" element={<PreEnrollmentLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="add-candidate" element={<AddCandidate />} />
      <Route path="add-candidate/new" element={<AddCandidateForm />} />
      <Route path="completed-candidate" element={<CompletedCandidate />} />
      <Route path="completed-candidate/:candidateId" element={<CompletedCandidateDetails />} >
        <Route index element={<CandidateTasksPage />} />
        <Route path="tasks" element={<CandidateTasksPage />} />
        <Route path="portal-info" element={<CandidatePortalInfoPage />} />
        <Route path="forms" element={<CandidateFormsPage />} />
      </Route>
      <Route path="offboarded-candidate" element={<OffboardedCandidate />} />
      <Route path="settings" element={<Settings />} />
      <Route path="import" element={<ImportPage />} />
    </Route>
 
 
    {/* EmployeeDetails */}
    <Route path="EmployeeDetails">
      <Route index element={<EmployeePage1 />} />
      <Route path="employee" element={<EmployeePage1 />} />
      <Route path="employee/:empId" element={<EmployeeDetailsPage />} />
      <Route path="employee-group" element={<EmployeeGroupPage />} />
      <Route path="add-employee" element={<AddEmployeeWizardPage />} />
      <Route path="pending-candidates" element={<PendingCandidatePage />} />
      <Route path="organization-chart" element={<OrganizationChartPage />} />
      <Route path="reset-blocked-user" element={<ResetBlockedUserPage />} />
      <Route path="import" element={<EmployeeImportPage />} />
    </Route>
 
    {/* bulkupdate */}
    <Route path="bulk-update">
      <Route index element={<Navigate to="statutory" replace />} />
      <Route path="statutory" element={<BulkUpdateStatutoryPage />} />
      <Route path="classification" element={<BulkUpdateClassificationPage />} />
      <Route path="authority" element={<BulkUpdateAuthorityPage />} />
      <Route path="role" element={<BulkUpdateRolePage />} />
      <Route path="pan-verification" element={<BulkUpdatePanVerificationPage />} />
    </Route>
 
    {/* Separation */}
    <Route path="separation" element={<SeperationLayout />}>
      <Route index element={<Navigate to="exit-module" replace />} />
      <Route path="exit-module" element={<ExitModulePage />} />
      <Route path="gratuity" element={<GratuityModulePage />} />
      <Route path="full-and-final-settlements" element={<FullAndFinalSettlements />} />
    </Route>
 
 
{/*
    <Route
  path="add-employee"
  element={<AddEmployeeWizardPage />}
/> */}
 
  </Route>
);