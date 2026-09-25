import EmailSettings from "@/features/admin/admincenter/settings/EmailSettings";
import SettingsPage from "@/features/admin/admincenter/settings/pages/SettingsPage";
import PayrollSettings from "@/features/admin/admincenter/settings/PayrollSettings";
import ReminderSettings from "@/features/admin/admincenter/settings/ReminderSettings";
import TenantSettings from "@/features/admin/admincenter/settings/TenantSettings";
import RoleMaster from "@/features/admin/admincenter/userManagement/components/RoleMaster";
import RoleAccessSettings from "@/features/admin/admincenter/userManagement/pages/RoleAccessSettings";
import UserManagementPage from "@/features/admin/admincenter/userManagement/pages/UserManagementPage";
import WorkflowsPage from "@/features/admin/admincenter/workflows/Pages/WorkflowsPage";
import { Navigate, Route } from "react-router-dom";

// Settings

export const AdminManagementRoutes = (
  <Route path="admin-center">
    {/* Settings */}
    <Route path="settings" element={<SettingsPage />}>
      <Route
        index
        element={<Navigate to="payroll" replace />}
      />

      <Route
        path="payroll"
        element={<PayrollSettings />}
      />

      <Route
        path="reminder"
        element={<ReminderSettings />}
      />

      <Route
        path="email"
        element={<EmailSettings />}
      />

      <Route
        path="tenant"
        element={<TenantSettings />}
      />
    </Route>

    {/* Workflows */}
    <Route
      path="workflows"
      element={<WorkflowsPage />}
    />

    {/* User Management */}
    <Route
      path="user-management"
      element={<UserManagementPage />}
    >
      <Route
        index
        element={<Navigate to="roles" replace />}
      />

      <Route
        path="roles"
        element={<RoleMaster />}
      />

      <Route
        path="role-access-settings"
        element={<RoleAccessSettings />}
      />
    </Route>
  </Route>
);