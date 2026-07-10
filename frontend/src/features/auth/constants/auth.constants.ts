export const ROLES = {
  ADMIN: "admin",
  HR: "hr",
  EMPLOYEE: "employee",
} as const;

export const AUTH_ROUTES = {
  LOGIN: "api/auth/login",        
};

export const DASHBOARD_ROUTES = {
  admin: "/admin/dashboard",
  hr: "/hr/dashboard",
  employee: "/employee/dashboard",
};