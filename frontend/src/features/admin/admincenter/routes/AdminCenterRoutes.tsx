import { Navigate, Route } from "react-router-dom";


import AdminCenterPage from "../pages/AdminCenterPage";

//Company
import CompanyDetailsPage from "../company/pages/CompanyDetailsPage";
import CompanyDocumentsPage from "../company/pages/CompanyDocumentsPage";
import CompanyForm from "../company/components/CompanyForm";
import PfDetailsForm from "../company/components/PfDetailsForm";
import EsiDetailsForm from "../company/components/EsiDetailsForm";
import PtDetailsForm from "../company/components/PtDetailsForm";
import LwfDetailsForm from "../company/components/LwfDetailsForm";
import EstablishmentDetailsForm from "../company/components/EstablishmentDetailsForm";
import DocumentPage from "../company/components/DocumentPage";


//Settings
import SettingsPage from "../settings/pages/SettingsPage";
import PayrollSettings from "../settings/PayrollSettings";
import ReminderSettings from "../settings/ReminderSettings";
import EmailSettings from "../settings/EmailSettings";
import TenantSettings from "../settings/TenantSettings";

//Classifications
import ClassificationSummaryPage from "../classifications/pages/ClassificationSummaryPage";
import BranchPage from "../classifications/pages/BranchPage";
import AdditionalClassificationPage from "../classifications/pages/AdditionalClassificationPage";
import DesignationPage from "../classifications/pages/DesignationPage";
import BanksPage from "../classifications/pages/BanksPage";
import BankFieldMappingPage from "../classifications/pages/BankFieldMappingPage";
import ImportPage from "../classifications/pages/ImportPage";
import LeavePage from "../classifications/pages/LeavePage";
import LeaveApplyPage from "../classifications/pages/LeaveApplyPage";
import LeaveSummaryPage from "../classifications/pages/LeaveSummaryPage";
import LeaveHistoryPage from "../classifications/pages/LeaveHistoryPage";
import SalaryStructurePage from "../classifications/pages/SalaryStructurePage";
import LeavePolicyPage from "../classifications/pages/LeavePolicyPage";
import LeavePolicySettingsPage from "../classifications/pages/LeavePolicySettingsPage";
import AttendancePage from "../classifications/pages/AttendancePage";


//userManagement
import UserManagementPage from "../userManagement/pages/UserManagementPage";
import RoleMaster from "../userManagement/components/RoleMaster";
import RoleAccessSettings from "../userManagement/pages/RoleAccessSettings";


// //ess
import Circular from "../ess/pages/circular/Circular";
import Policy from "../ess/pages/Policy/Policy";
import Notification from "../ess/pages/Notification/Notification";
import FlashNews from "../ess/pages/FlashNews/FlashNews";
import HelpDesk from "../ess/pages/HelpDesk/HelpDesk";
import Poll from "../ess/pages/Poll/Poll";
import Feeds from "../ess/pages/Feeds/Feeds";
import Memories from "../ess/pages/Memories/Memories";
import WallOfFame from "../ess/pages/WallOfFame/WallOffFame";


//workflows
import WorkflowsPage from "../workflows/Pages/WorkflowsPage";
import EmployeeGroup from "../workflows/components/EmployeeGroup";
import ModuleSettings from "../workflows/components/ModuleSettings";


export const AdminCenterRoutes = (
  <Route path="admin-center" element={<AdminCenterPage />}>


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
        <Route path="document" element={<DocumentPage/>}/>
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
        <Route path="banks/:bankId/field-mapping" element={<BankFieldMappingPage />} />
        <Route path="import" element={<ImportPage />} />
        <Route path="salary-structure" element={<SalaryStructurePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave-policy" element={<Navigate to="employee" replace />} />
        <Route path="leave-policy/:group" element={<LeavePolicyPage />} />
        <Route path="leave-policy/:group/:leaveCode/settings/:settingTab" element={<LeavePolicySettingsPage />} />
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
        <Route path="role-access-settings" element={<RoleAccessSettings />}/>
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
      <Route path="module-settings" element={<ModuleSettings />}/>
    </Route>


  </Route>
);