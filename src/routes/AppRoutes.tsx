import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import DomainVerification from "../features/domain-verification/pages/DomainVerification";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import ResetPassword from "../features/auth/pages/ResetPassword";
import AdminRoutes from "./AdminRoutes";
 
import ProtectedRoute from "./ProtectedRoute";
import EmployeeRoutes from "./EmployeeRoutes";
import FirstLoginResetPassword from "@/features/auth/pages/FirstLoginResetPassword";
 
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DomainVerification />} />
        <Route path="/:domain/login" element={<Login />} />
        <Route path="/:domain/forgot-password" element={<ForgotPassword />} />
        <Route path="/:domain/verify-otp" element={<VerifyOtp />} />
        <Route path="/:domain/reset-password" element={<ResetPassword />} />
        <Route path="/:domain/first-login-reset-password"
              element={<FirstLoginResetPassword />}
            />
 
        {/* ✅ Admin routes, role-protected */}
        <Route element={<ProtectedRoute allowedRoles={[1, 2]} />}>
          <Route path="/:domain/admin/*" element={<AdminRoutes />} />
        </Route>
 
        <Route element={<ProtectedRoute allowedRoles={[3]} />}>
          <Route path="/:domain/employee/*" element={<EmployeeRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
 
export default AppRoutes;
 