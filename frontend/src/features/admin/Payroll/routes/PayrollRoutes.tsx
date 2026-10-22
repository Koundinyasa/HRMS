import { Navigate, Route } from "react-router-dom";
import PayrollPage from "../pages/PayrollPage";

export const PayrollRoutes = (
  <Route path="payroll">
    <Route index element={<Navigate to="salary-structure-calculator" replace />} />
    <Route path=":view?/:action?" element={<PayrollPage />} />
  </Route>
);
