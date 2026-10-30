import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Global guard (registered as APP_GUARD after JwtAuthGuard).
 * Does nothing unless the route or controller carries @Roles(...).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') return true;

    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const user = context.switchToHttp().getRequest().user;
    const roleId = Number(user?.roleId);

    if (!Number.isInteger(roleId) || !requiredRoles.includes(roleId)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
