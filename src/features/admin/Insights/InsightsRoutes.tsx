import { Navigate, Route, Routes } from "react-router-dom";

import InsightsPage from "./Pages/InsightsPage";
import EmployeeReportPage from "./Pages/EmployeeReportPage";
import SalaryPage from "./Pages/SalaryPage";
import TDSReportPage from "./Pages/TDSReportPage";
import StatutoryReportPage from "./Pages/StatutoryReportPage";
import LeaveReportPage from "./Pages/LeaveReportPage";
import TimeOfficePage from "./Pages/TimeOfficePage";
import GeneralReportPage from "./Pages/GeneralReportPage";
import OthersPage from "./Pages/OthersPage";
import CraftReportPage from "./Pages/CraftReportPage";
import OnboardPage from "./Pages/OnboardPage";
import ExitModulePage from "./Pages/ExitModulePage";

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