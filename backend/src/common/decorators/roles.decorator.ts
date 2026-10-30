import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles';

export const ROLES_KEY = 'roles';

/**
 * Restricts a controller or a route to the listed roles.
 * Enforced by the global RolesGuard. Routes without @Roles() are open to any
 * authenticated user (Stage 2 will assign roles to every admin route).
 *
 * @example
 *   @Roles(Role.Admin, Role.HR)
 *   @Post('send-temp-password/:employeeId')
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
