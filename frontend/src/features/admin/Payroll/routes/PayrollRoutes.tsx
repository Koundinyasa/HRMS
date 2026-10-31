import { lazy } from "react";
import { Navigate, Route } from "react-router-dom";

// Pages are loaded on demand (each one becomes its own file in the build).
const PayrollPage = lazy(() => import("../pages/PayrollPage"));

export const PayrollRoutes = (
  <Route path="payroll">
    <Route index element={<Navigate to="salary-structure-calculator" replace />} />
    <Route path=":view?/:action?" element={<PayrollPage />} />
  </Route>
);
