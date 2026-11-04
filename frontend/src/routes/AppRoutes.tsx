import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import DomainVerification from "../features/domain-verification/pages/DomainVerification";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import ResetPassword from "../features/auth/pages/ResetPassword";
import { AdminChildRoutes } from "./AdminRoutes";
import AdminLayout from "@/features/admin/components/AdminLayout";

import ProtectedRoute from "./ProtectedRoute";
import EmployeeRoutes from "./EmployeeRoutes";
import Unauthorized from "./Unauthorized";
import FirstLoginResetPassword from "@/features/auth/pages/FirstLoginResetPassword";
import {
  ADMIN_PORTAL_ROLES,
  EMPLOYEE_PORTAL_ROLES,
} from "@/shared/constants/roles";

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
        <Route element={<ProtectedRoute allowedRoles={ADMIN_PORTAL_ROLES} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {AdminChildRoutes}
          </Route>
          <Route path="/:domain/admin" element={<AdminLayout />}>
            {AdminChildRoutes}
          </Route>
        </Route>
 
        <Route element={<ProtectedRoute allowedRoles={EMPLOYEE_PORTAL_ROLES} />}>
          <Route path="/employee/*" element={<EmployeeRoutes />} />
          <Route path="/:domain/employee/*" element={<EmployeeRoutes />} />
        </Route>

        {/* Wrong role, and any address that matches nothing */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default AppRoutes;
 
