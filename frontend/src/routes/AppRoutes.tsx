import { BrowserRouter, Routes, Route } from "react-router-dom";

import DomainVerification from "@/features/domain-verification/pages/DomainVerification";

import Login from "@/features/auth/pages/Login";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import VerifyOtp from "@/features/auth/pages/VerifyOtp";
import ResetPassword from "@/features/auth/pages/ResetPassword";

import EmployeeRoutes from "./EmployeeRoutes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Domain Verification */}

        <Route
          path="/"
          element={<DomainVerification />}
        />

        {/* Authentication */}

        <Route
          path="/:domain/login"
          element={<Login />}
        />

        <Route
          path="/:domain/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/:domain/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/:domain/reset-password"
          element={<ResetPassword />}
        />

        {/* Employee Module */}

        {EmployeeRoutes()}

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;