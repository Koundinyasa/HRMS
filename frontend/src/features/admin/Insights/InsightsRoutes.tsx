import { Navigate, Route, Routes } from "react-router-dom";

import InsightsPage from "./pages/InsightsPage";
import EmployeeReportPage from "./pages/EmployeeReportPage";
import SalaryPage from "./pages/SalaryPage";
import TDSReportPage from "./pages/TDSReportPage";
import StatutoryReportPage from "./pages/StatutoryReportPage";
import LeaveReportPage from "./pages/LeaveReportPage";
import TimeOfficePage from "./pages/TimeOfficePage";
import GeneralReportPage from "./pages/GeneralReportPage";
import OthersPage from "./pages/OthersPage";
import CraftReportPage from "./pages/CraftReportPage";
import OnboardPage from "./pages/OnboardPage";
import ExitModulePage from "./pages/ExitModulePage";

export default function InsightsRoutes() {
  return (
    <Routes>
      <Route element={<InsightsPage />}>
        <Route
          index
          element={<Navigate to="employee-report" replace />}
        />

        <Route
          path="employee-report"
          element={<EmployeeReportPage />}
        />

        <Route path="salary" element={<SalaryPage />} />

        <Route path="tds-report" element={<TDSReportPage />} />

        <Route
          path="statutory-report"
          element={<StatutoryReportPage />}
        />

        <Route
          path="leave-report"
          element={<LeaveReportPage />}
        />

        <Route
          path="time-office"
          element={<TimeOfficePage />}
        />

        <Route
          path="general-report"
          element={<GeneralReportPage />}
        />

        <Route path="others" element={<OthersPage />} />

        <Route
          path="craft-report"
          element={<CraftReportPage />}
        />

        <Route path="onboard" element={<OnboardPage />} />

        <Route
          path="exit-module"
          element={<ExitModulePage />}
        />
      </Route>
    </Routes>
  );
}