// userManagementApi.ts
// Thin async wrapper around the mock data in constants/userManagementConstants.ts.
// Swap the bodies below for real network calls when the backend is ready —
// the hooks that call these functions won't need to change.

import {
  CREATED_EMPLOYEES,
  PENDING_EMPLOYEES,
  INACTIVE_EMPLOYEES,
  EMPLOYEE_TOTAL_RECORDS,
  EMPLOYEE_TOTAL_PAGES,
  MOCK_USERS,
  USER_TOTAL_RECORDS,
  USER_TOTAL_PAGES,
  MOCK_ROLES,
  ROLE_ACCESS_DATA,
} from "../constants/userManagementConstants";
import type { CreatedEmployee, PendingEmployee } from "../types/employee.types";
import type { UserRow, AddUserPayload } from "../types/user.types";
import type { RoleRow } from "../types/role.types";
import type { RoleAccessConfig } from "../types/role-access.types";

const simulateRequest = <T,>(data: T, delay = 150): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

/* ---------------------------------------------------------------- *
 * Employees
 * ---------------------------------------------------------------- */

export const fetchCreatedEmployees = (): Promise<CreatedEmployee[]> =>
  simulateRequest(CREATED_EMPLOYEES);

export const fetchPendingEmployees = (): Promise<PendingEmployee[]> =>
  simulateRequest(PENDING_EMPLOYEES);

export const fetchInactiveEmployees = (): Promise<CreatedEmployee[]> =>
  simulateRequest(INACTIVE_EMPLOYEES);

export const fetchEmployeeSummary = (): Promise<{ totalRecords: number; totalPages: number }> =>
  simulateRequest({ totalRecords: EMPLOYEE_TOTAL_RECORDS, totalPages: EMPLOYEE_TOTAL_PAGES });

export const resendEmployeeInvitation = (employeeId: number): Promise<{ success: true }> => {
  console.log("Resending invitation to employee", employeeId);
  return simulateRequest({ success: true }, 200);
};

/* ---------------------------------------------------------------- *
 * Users
 * ---------------------------------------------------------------- */

export const fetchUsers = (): Promise<UserRow[]> => simulateRequest(MOCK_USERS);

export const fetchUserSummary = (): Promise<{ totalRecords: number; totalPages: number }> =>
  simulateRequest({ totalRecords: USER_TOTAL_RECORDS, totalPages: USER_TOTAL_PAGES });

export const saveUser = (payload: AddUserPayload): Promise<{ success: true }> => {
  // Replace with a real POST /users call once the endpoint exists.
  console.log("Saving user", payload);
  return simulateRequest({ success: true }, 200);
};

/* ---------------------------------------------------------------- *
 * Roles
 * ---------------------------------------------------------------- */

export const fetchRoles = (): Promise<RoleRow[]> => simulateRequest(MOCK_ROLES);

export const fetchRoleAccessData = (): Promise<Record<string, RoleAccessConfig>> =>
  simulateRequest(ROLE_ACCESS_DATA);

export const savePermissionGrid = (
  role: string,
  moduleTab: string
): Promise<{ success: true }> => {
  console.log("Saving permission grid for", role, moduleTab);
  return simulateRequest({ success: true }, 200);
};
