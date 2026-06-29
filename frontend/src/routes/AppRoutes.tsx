import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "../features/auth/pages/Login";
import DomainVerification from "../features/domain-verification/pages/DomainVerification";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import ResetPassword from "../features/auth/pages/ResetPassword";

import EmployeeDashboard from "../features/dashboard/employee/pages/EmployeeDashboard";



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <DomainVerification />
          }
        />

        <Route
          path="/:domain/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />

        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;