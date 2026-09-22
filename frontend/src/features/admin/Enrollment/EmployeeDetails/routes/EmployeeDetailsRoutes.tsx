// import { Route } from "react-router-dom";

// import EmployeePage from "../Pages/EmployeePage";
// import EmployeeGroupPage from "../Pages/EmployeeGroupPage";
// import AddEmployeeWizard from "../Pages/AddEmployeeWizard";
// import PendingCandidatePage from "../Pages/PendingCandidatePage";
// import OrganizationChartPage from "../Pages/OrganizationChartPage";
// import ResetBlockedUserPage from "../Pages/ResetBlockedUserPage";
// import ImportPage from "../Pages/ImportPage";

// export const EmployeeDetailsRoutes = (
//   <>
//     <Route index element={<EmployeePage />} />

//     <Route path="employee-group" element={<EmployeeGroupPage />} />

//     <Route path="add-employee" element={<AddEmployeeWizard />} />

//     <Route path="pending-candidates" element={<PendingCandidatePage />} />

//     <Route path="organization-chart" element={<OrganizationChartPage />} />

//     <Route path="reset-blocked-user" element={<ResetBlockedUserPage />} />

//     <Route path="import" element={<ImportPage />} />
//   </>
// );


// import { Route } from "react-router-dom";

// import EmployeePage from "../Pages/EmployeePage1";
// import EmployeeGroupPage from "../Pages/EmployeeGroupPage";
// import AddEmployeeWizard from "../Pages/AddEmployeeWizard";
// import PendingCandidatePage from "../Pages/PendingCandidatePage";
// import OrganizationChartPage from "../Pages/OrganizationChartPage";
// import ResetBlockedUserPage from "../Pages/ResetBlockedUserPage";
// import ImportPage from "../Pages/ImportPage";
// import EmployeeDetailsPage from "../Pages/EmployeeDetailsPage";

// export const EmployeeDetailsRoutes = (
//   <>
//     <Route index element={<EmployeePage />} />

//     <Route path="employee/:empId" element={<EmployeeDetailsPage />} />

//     <Route path="employee-group" element={<EmployeeGroupPage />} />

//     <Route path="add-employee" element={<AddEmployeeWizard />} />

//     <Route path="pending-candidates" element={<PendingCandidatePage />} />

//     <Route path="organization-chart" element={<OrganizationChartPage />} />

//     <Route path="reset-blocked-user" element={<ResetBlockedUserPage />} />

//     <Route path="import" element={<ImportPage />} />
//   </>
// );













import { Route } from "react-router-dom";

import EmployeePage from "../Pages/EmployeePage1";
import EmployeeGroupPage from "../Pages/EmployeeGroupPage";
import AddEmployeeWizard from "../Pages/AddEmployeeWizard";
import PendingCandidatePage from "../Pages/PendingCandidatePage";
import OrganizationChartPage from "../Pages/OrganizationChartPage";
import ResetBlockedUserPage from "../Pages/ResetBlockedUserPage";
import ImportPage from "../Pages/ImportPage";
import EmployeeDetailsPage from "../Pages/EmployeeDetailsPage";

export const EmployeeDetailsRoutes = (
  <>
    <Route index element={<EmployeePage />} />

    <Route path="employee/:empId" element={<EmployeeDetailsPage />} />

    <Route path="employee-group" element={<EmployeeGroupPage />} />

    <Route path="add-employee" element={<AddEmployeeWizard />} />

    <Route path="pending-candidates" element={<PendingCandidatePage />} />

    <Route path="organization-chart" element={<OrganizationChartPage />} />

    <Route path="reset-blocked-user" element={<ResetBlockedUserPage />} />

    <Route path="import" element={<ImportPage />} />
  </>
);