import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";


// Pages are loaded on demand (each one becomes its own file in the build).
const AdminCenterPage = lazy(() => import("../pages/AdminCenterPage"));
const AddEmployeePage = lazy(() => import("../addEmployee/pages/AddEmployeePage"));
const CompanyDetailsPage = lazy(() => import("../company/pages/CompanyDetailsPage"));
const CompanyDocumentsPage = lazy(() => import("../company/pages/CompanyDocumentsPage"));
const CompanyForm = lazy(() => import("../company/components/CompanyForm"));
const PfDetailsForm = lazy(() => import("../company/components/PfDetailsForm"));
const EsiDetailsForm = lazy(() => import("../company/components/EsiDetailsForm"));
const PtDetailsForm = lazy(() => import("../company/components/PtDetailsForm"));
const LwfDetailsForm = lazy(() => import("../company/components/LwfDetailsForm"));
const EstablishmentDetailsForm = lazy(() => import("../company/components/EstablishmentDetailsForm"));
const DocumentPage = lazy(() => import("../company/components/DocumentPage"));
const AppliedLeavePage = lazy(() => import("../appliedLeave/pages/AppliedLeavePage"));
const SettingsPage = lazy(() => import("../settings/pages/SettingsPage"));
const PayrollSettings = lazy(() => import("../settings/PayrollSettings"));
const ReminderSettings = lazy(() => import("../settings/ReminderSettings"));
const EmailSettings = lazy(() => import("../settings/EmailSettings"));
const TenantSettings = lazy(() => import("../settings/TenantSettings"));
const ClassificationSummaryPage = lazy(() => import("../classifications/pages/ClassificationSummaryPage"));
const BranchPage = lazy(() => import("../classifications/pages/BranchPage"));
const AdditionalClassificationPage = lazy(() => import("../classifications/pages/AdditionalClassificationPage"));
const DesignationPage = lazy(() => import("../classifications/pages/DesignationPage"));
const BanksPage = lazy(() => import("../classifications/pages/BanksPage"));
const BankFieldMappingPage = lazy(() => import("../classifications/pages/BankFieldMappingPage"));
const ImportPage = lazy(() => import("../classifications/pages/ImportPage"));
const LeavePage = lazy(() => import("../classifications/pages/LeavePage"));
const LeaveApplyPage = lazy(() => import("../classifications/pages/LeaveApplyPage"));
const LeaveSummaryPage = lazy(() => import("../classifications/pages/LeaveSummaryPage"));
const LeaveHistoryPage = lazy(() => import("../classifications/pages/LeaveHistoryPage"));
const SalaryStructurePage = lazy(() => import("../classifications/pages/SalaryStructurePage"));
const LeavePolicyPage = lazy(() => import("../classifications/pages/LeavePolicyPage"));
const LeavePolicySettingsPage = lazy(() => import("../classifications/pages/LeavePolicySettingsPage"));
const AttendancePage = lazy(() => import("../classifications/pages/AttendancePage"));
const UserManagementPage = lazy(() => import("../userManagement/pages/UserManagementPage"));
const RoleMaster = lazy(() => import("../userManagement/components/RoleMaster"));
const RoleAccessSettings = lazy(() => import("../userManagement/pages/RoleAccessSettings"));
const Circular = lazy(() => import("../ess/pages/circular/Circular"));
const Policy = lazy(() => import("../ess/pages/Policy/Policy"));
const Notification = lazy(() => import("../ess/pages/Notification/Notification"));
const FlashNews = lazy(() => import("../ess/pages/FlashNews/FlashNews"));
const HelpDesk = lazy(() => import("../ess/pages/HelpDesk/HelpDesk"));
const Poll = lazy(() => import("../ess/pages/Poll/Poll"));
const Feeds = lazy(() => import("../ess/pages/Feeds/Feeds"));
const Memories = lazy(() => import("../ess/pages/Memories/Memories"));
const WallOfFame = lazy(() => import("../ess/pages/WallOfFame/WallOffFame"));
const WorkflowsPage = lazy(() => import("../workflows/WorkflowsPage"));
const EmployeeGroup = lazy(() => import("../workflows/EmployeeGroup"));
const ModuleSettings = lazy(() => import("../workflows/ModuleSettings"));

export const AdminCenterRoutes = (
  <Route path="admin-center" element={<AdminCenterPage />}>
    <Route path="applied-leave" element={<AppliedLeavePage />} />
    <Route index element={<Navigate to="add-employee" replace />} />
    <Route path="add-employee" element={<AddEmployeePage />} />

    {/* Company */}
    <Route path="company">
      <Route path="details" element={<CompanyDetailsPage />}>
        <Route index element={<CompanyForm />} />
        <Route path="company" element={<CompanyForm />} />
        <Route path="pf" element={<PfDetailsForm />} />
        <Route path="esi" element={<EsiDetailsForm />} />
        <Route path="pt" element={<PtDetailsForm />} />
        <Route path="lwf" element={<LwfDetailsForm />} />
        <Route path="establishment" element={<EstablishmentDetailsForm />} />
      </Route>

      <Route path="documents" element={<CompanyDocumentsPage />}>
        <Route index element={<Navigate to="document" replace />} />
        <Route path="document" element={<DocumentPage />} />
      </Route>
    </Route>

    {/* Settings */}
    <Route path="settings" element={<SettingsPage />}>
      <Route index element={<Navigate to="payroll" replace />} />
      <Route path="payroll" element={<PayrollSettings />} />
      <Route path="reminder" element={<ReminderSettings />} />
      <Route path="email" element={<EmailSettings />} />
      <Route path="tenant" element={<TenantSettings />} />
    </Route>

    {/*Classifications */}
    <Route path="classifications">
      <Route index element={<ClassificationSummaryPage />} />
      <Route path="branch" element={<BranchPage />} />
      <Route path="additional" element={<AdditionalClassificationPage />} />
      <Route path="designation" element={<DesignationPage />} />
      <Route path="banks" element={<BanksPage />} />
      <Route
        path="banks/:bankId/field-mapping"
        element={<BankFieldMappingPage />}
      />
      <Route path="import" element={<ImportPage />} />
      <Route path="salary-structure" element={<SalaryStructurePage />} />
      <Route path="attendance" element={<AttendancePage />} />
      <Route path="leave-policy" element={<Navigate to="employee" replace />} />
      <Route path="leave-policy/:group" element={<LeavePolicyPage />} />
      <Route
        path="leave-policy/:group/:leaveCode/settings/:settingTab"
        element={<LeavePolicySettingsPage />}
      />
      <Route path="leave" element={<LeavePage />}>
        <Route index element={<Navigate to="apply" replace />} />
        <Route path="apply" element={<LeaveApplyPage />} />
        <Route path="summary" element={<LeaveSummaryPage />} />
        <Route path="history" element={<LeaveHistoryPage />} />
      </Route>
    </Route>

    {/*User Management  */}

    <Route path="user-management" element={<UserManagementPage />}>
      <Route index element={<Navigate to="roles" replace />} />
      <Route path="roles" element={<RoleMaster />} />
      <Route path="role-access-settings" element={<RoleAccessSettings />} />
    </Route>

    {/*ESS */}
    <Route path="ess">
      <Route index element={<Navigate to="circular" replace />} />
      <Route path="circular" element={<Circular />} />
      <Route path="policy" element={<Policy />} />
      <Route path="notification" element={<Notification />} />
      <Route path="flash-news" element={<FlashNews />} />
      <Route path="help-desk" element={<HelpDesk />} />
      <Route path="poll" element={<Poll />} />
      <Route path="feeds" element={<Feeds />} />
      <Route path="memories" element={<Memories />} />
      <Route path="wall-of-fame" element={<WallOfFame />} />
    </Route>

    {/*WorkFlows*/}
    <Route path="workflows">
      <Route index element={<WorkflowsPage />} />
      <Route path="employee-group" element={<EmployeeGroup />} />
      <Route path="module-settings" element={<ModuleSettings />} />
    </Route>
  </Route>
);
