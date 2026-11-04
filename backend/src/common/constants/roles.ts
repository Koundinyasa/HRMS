/**
 * Single source of truth for role IDs stored in the database (RoleID).
 *
 * Stage 1 only knows the three roles the application already supports.
 * Stage 2 (authorization) will extend this enum when the full role model
 * is designed. Never compare against raw numbers (1, 2, 3) elsewhere.
 */
export enum Role {
  Admin = 1,
  HR = 2,
  Employee = 3,
}

/** Roles that are allowed into the admin portal. */
export const ADMIN_PORTAL_ROLES: readonly Role[] = [Role.Admin, Role.HR];
