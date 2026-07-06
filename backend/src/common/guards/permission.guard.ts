import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, PermissionMeta } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<PermissionMeta>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    // No @Permission() decorator — allow through
    if (!permission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // this.logger.log(`[PermissionGuard] user: ${JSON.stringify(user)}`);

    // Just verify the user is authenticated and has a role
    // Actual menu permissions are returned by Usp_AdminDashboard (MenuCTE result set)
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}