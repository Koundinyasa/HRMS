import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";

// Pages are loaded on demand (each one becomes its own file in the build).
const DetailsTabBar = lazy(() => import("../Details/components/DetailsTabBar"));
const OrganizationsDashboardPage = lazy(() => import("../Details/pages/OrganizationsDashboardPage"));
const ComplianceOverviewPage = lazy(() => import("../Details/pages/ComplianceOverviewPage"));
const ConsolidatedSalaryPage = lazy(() => import("../Details/pages/ConsolidatedSalaryPage"));
const ConsolidatedSalarySheetPage = lazy(() => import("../Details/pages/ConsolidatedSalarySheetPage"));
const AllCompanyApprovalsPage = lazy(() => import("../Approvals/pages/AllCompanyApprovalsPage"));

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