/**
 * Role ids as stored in the database (Mst_Users.RoleID).
 * This is the only place these numbers are written down: routes, login and
 * menus import them from here instead of typing 1, 2 or 3.
 */
export const ROLE = {
  /** Admin: full access to the admin portal. */
  Admin: 1,
  /** HR Admin: admin portal, HR functions. */
  HrAdmin: 2,
  /** Employee: employee portal. */
  Employee: 3,
} as const;

/** Roles that may open the admin portal (/admin/...). */
export const ADMIN_PORTAL_ROLES: readonly number[] = [ROLE.Admin, ROLE.HrAdmin];

/** Roles that may open the employee portal (/employee/...). */
export const EMPLOYEE_PORTAL_ROLES: readonly number[] = [ROLE.Employee];

export type Portal = 'admin' | 'employee';

/** Which portal a role belongs to, or null for an unknown role. */
export function getPortal(roleId: number | string | null | undefined): Portal | null {
  const id = Number(roleId);
  if (ADMIN_PORTAL_ROLES.includes(id)) return 'admin';
  if (EMPLOYEE_PORTAL_ROLES.includes(id)) return 'employee';
  return null;
}

/** First page after login for this role, or null for an unknown role. */
export function getHomePath(
  domain: string | undefined,
  roleId: number | string | null | undefined,
): string | null {
  const portal = getPortal(roleId);
  if (!portal) return null;
  return `/${domain}/${portal}/dashboard`;
}
