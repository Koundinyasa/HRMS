import { Route, Navigate } from "react-router-dom";
import EnrollmentPage from "../pages/EnrollmentPage";

//BackgroundVerification
import BgvDashboardPage from "../BackgroundVerification/pages/BgvDashboardPage";
import BgvInitiatePage from "../BackgroundVerification/pages/BgvInitiatePage";
import BgvOngoingPage from "../BackgroundVerification/pages/BgvOngoingPage";
import BgvCompletedPage from "../BackgroundVerification/pages/BgvCompletedPage";
import BgvSettingsPage from "../BackgroundVerification/pages/BgvSettingsPage";

//Pre-Enrollment
import PreEnrollmentLayout from "../Pre-Enrollment/pages/PreEnrollmentLayout";
import Dashboard from "../Pre-Enrollment/pages/Dashboard";
import AddCandidate from "../Pre-Enrollment/pages/AddCandidate";
import AddCandidateForm from "../Pre-Enrollment/pages/AddCandidateForm";
import CompletedCandidate from "../Pre-Enrollment/pages/CompletedCandidate";
import CompletedCandidateDetails from "../Pre-Enrollment/pages/CompletedCandidateDetails";
import OffboardedCandidate from "../Pre-Enrollment/pages/OffboardedCandidate";
import Settings from "../Pre-Enrollment/pages/Settings";
import ImportPage from "../Pre-Enrollment/pages/Import";
import CandidateTasksPage from "../Pre-Enrollment/pages/details/CandidateTasksPage";
import CandidatePortalInfoPage from "../Pre-Enrollment/pages/details/CandidatePortalInfoPage";
import CandidateFormsPage from "../Pre-Enrollment/pages/details/CandidateFormsPage";

// ---- Employee Details ----
import EmployeePage1 from "../EmployeeDetails/Pages/EmployeePage1";
import EmployeeDetailsPage from "../EmployeeDetails/Pages/EmployeeDetailsPage";
import EmployeeGroupPage from "../EmployeeDetails/Pages/EmployeeGroupPage";
import AddEmployeeWizard from "../EmployeeDetails/Pages/AddEmployeeWizard";
import PendingCandidatePage from "../EmployeeDetails/Pages/PendingCandidatePage";
import OrganizationChartPage from "../EmployeeDetails/Pages/OrganizationChartPage";
import ResetBlockedUserPage from "../EmployeeDetails/Pages/ResetBlockedUserPage";
// import ImportPage from "../EmployeeDetails/Pages/ImportPage";

// ---- Bulk Update ----
import BulkUpdateStatutoryPage from "@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateStatutoryPage";
import BulkUpdateClassificationPage from "@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateClassificationPage";
import BulkUpdateAuthorityPage from "@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateAuthorityPage";
import BulkUpdateRolePage from "@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdateRolePage";
import BulkUpdatePanVerificationPage from "@/features/admin/Enrollment/bulkUpdate/pages/BulkUpdatePanVerificationPage";

// ---- Separation ----
import SeperationLayout from "../Separation/Pages/SeperationLayout";
import ExitModulePage from "../Separation/Pages/ExitModulePage";
import GratuityModulePage from "../Separation/Pages/GratuityModulePage";
import FullAndFinalSettlements from "../Separation/Pages/FullAndFinalSettlements";

export const EnrollmentRoutes = (
  <Route path="Enrollment" element={<EnrollmentPage />}>

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
      <Route path="add-employee" element={<AddEmployeeWizard />} />
      <Route path="pending-candidates" element={<PendingCandidatePage />} />
      <Route path="organization-chart" element={<OrganizationChartPage />} />
      <Route path="reset-blocked-user" element={<ResetBlockedUserPage />} />
      {/* <Route path="import" element={<ImportPage />} /> */}
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

  </Route>
);