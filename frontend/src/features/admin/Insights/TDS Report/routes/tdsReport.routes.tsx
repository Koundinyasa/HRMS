import type { RouteObject } from "react-router-dom";

import TDSReportPage from "../pages/TDSReportPage";
import StatementOfTotalIncomePage from "../pages/StatementOfTotalIncomePage";
import STIWithSalaryExtractPage from "../pages/STIWithSalaryExtractPage";
import STIWithAnnexuresPage from "../pages/STIWithAnnexuresPage";
import TaxRegimeComparisonPage from "../pages/TaxRegimeComparisonPage";
import RentLandlordPage from "../pages/RentLandlordPage";
import Form12BBWithDataPage from "../pages/Form12BBWithDataPage";
import Form12BBWithoutDataPage from "../pages/Form12BBWithoutDataPage";
import Form12BAAPage from "../pages/Form12BAAPage";
import Form12BAAnnexuresPage from "../pages/Form12BAAnnexuresPage";
import Form16Page from "../pages/Form16Page";

export const TDS_REPORT_ROUTES: RouteObject[] = [
  {
    path: "tds-report",
    element: <TDSReportPage />,
  },
  {
    path: "tds-report/statement-of-total-income",
    element: <StatementOfTotalIncomePage />,
  },
  {
    path: "tds-report/sti-with-salary-extract",
    element: <STIWithSalaryExtractPage />,
  },
  {
    path: "tds-report/sti-with-annexures",
    element: <STIWithAnnexuresPage />,
  },
  {
    path: "tds-report/tax-regime-comparison",
    element: <TaxRegimeComparisonPage />,
  },
  {
    path: "tds-report/rent-landlord",
    element: <RentLandlordPage />,
  },
  {
    path: "tds-report/form-12bb-with-data",
    element: <Form12BBWithDataPage />,
  },
  {
    path: "tds-report/form-12bb-without-data",
    element: <Form12BBWithoutDataPage />,
  },
  {
    path: "tds-report/form-12baa",
    element: <Form12BAAPage />,
  },
  {
    path: "tds-report/form-12ba-annexures",
    element: <Form12BAAnnexuresPage />,
  },
  {
    path: "tds-report/form-16",
    element: <Form16Page />,
  },
];
