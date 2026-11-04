import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

// Pages are loaded on demand (each one becomes its own file in the build).
const AdminCenterPage = lazy(() => import("../pages/AdminCenterPage"));
const AddEmployeePage = lazy(() => import("../addEmployee/pages/AddEmployeePage"));
const EmployeeListPage = lazy(() => import("../employeeList/pages/EmployeeListPage"));
const EmployeeDetailPage = lazy(() => import("../employeeList/pages/EmployeeDetailPage"));
const CompanyDetailsPage = lazy(() => import("../company/pages/CompanyDetailsPage"));
const CompanyForm = lazy(() => import("../company/components/CompanyForm"));
const PfDetailsForm = lazy(() => import("../company/components/PfDetailsForm"));
const EsiDetailsForm = lazy(() => import("../company/components/EsiDetailsForm"));
const PtDetailsForm = lazy(() => import("../company/components/PtDetailsForm"));
const LwfDetailsForm = lazy(() => import("../company/components/LwfDetailsForm"));
const EstablishmentDetailsForm = lazy(() => import("../company/components/EstablishmentDetailsForm"));
const AppliedLeavePage = lazy(() => import("../appliedLeave/pages/AppliedLeavePage"));

/** Admin Center: Apply for Employee, Add Employee, Employee List, Company Details. */
export const AdminCenterRoutes = (
  <Route path="admin-center" element={<AdminCenterPage />}>
    <Route path="applied-leave" element={<AppliedLeavePage />} />
    <Route index element={<Navigate to="add-employee" replace />} />
    <Route path="add-employee" element={<AddEmployeePage />} />

    {/* Employee List (menu route /admin/admin-center/employee/list) */}
    <Route path="employee/list" element={<EmployeeListPage />} />
    <Route path="employee/list/:empId" element={<EmployeeDetailPage />} />

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
    </Route>
  </Route>
);
