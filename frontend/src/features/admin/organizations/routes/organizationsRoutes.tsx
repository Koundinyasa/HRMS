import { Route, Navigate } from "react-router-dom";
import DetailsTabBar from "../Details/components/DetailsTabBar";
import OrganizationsDashboardPage from "../Details/pages/OrganizationsDashboardPage";
import ComplianceOverviewPage from "../Details/pages/ComplianceOverviewPage";
import ConsolidatedSalaryPage from "../Details/pages/ConsolidatedSalaryPage";
import ConsolidatedSalarySheetPage from "../Details/pages/ConsolidatedSalarySheetPage";
import AllCompanyApprovalsPage from "../Approvals/pages/AllCompanyApprovalsPage";

export const OrganizationsRoutes = (
  <Route path="organizations">
    <Route index element={<Navigate to="details/dashboard" replace />} />

    <Route path="details" element={<DetailsTabBar />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<OrganizationsDashboardPage />} />
      <Route path="compliance-overview" element={<ComplianceOverviewPage />} />
      <Route path="consolidated-salary" element={<ConsolidatedSalaryPage />} />
      <Route
        path="consolidated-salary/sheet"
        element={<ConsolidatedSalarySheetPage />}
      />
    </Route>

    <Route path="approvals">
      <Route index element={<Navigate to="all-company-approvals" replace />} />
      <Route
        path="all-company-approvals"
        element={<AllCompanyApprovalsPage />}
      />
    </Route>
  </Route>
);