import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {
  GATE_OPEN_KEY,
  REQUIRES_MENU_KEY,
} from '../decorators/module-gate.decorator';
import { MenuAccessService } from '../menu/menu-access.service';
import { Role } from '../constants/roles';

export const MODULE_DISABLED = 'MODULE_DISABLED';

/** Controller path prefixes the gate protects. Everything else is untouched. */
const GATED_PREFIXES = ['admin', 'recruitment', 'review'] as const;

/**
 * Allow-list gate for the Phase 1 release (global guard, runs after
 * JwtAuthGuard and RolesGuard).
 *
 * Every controller under admin/, recruitment/ and review/ answers 403
 * MODULE_DISABLED unless the route is tagged:
 *   @RequiresMenu(...)  needs one of the menus to be enabled for the caller
 *   @GateOpen()         passes without a menu check (roles still apply)
 *
 * A new controller added to those areas is therefore OFF until someone
 * decides which menu switches it on. Super Admin skips the menu lookup but
 * still cannot reach an untagged route.
 */
@Injectable()
export class ModuleGateGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly menus: MenuAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'http') return true;

    const targets = [context.getHandler(), context.getClass()];

    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets)) return true;
    if (this.reflector.getAllAndOverride<boolean>(GATE_OPEN_KEY, targets)) return true;

    if (!this.isGated(context.getClass())) return true;

    const required = this.reflector.getAllAndOverride<string[] | undefined>(
      REQUIRES_MENU_KEY,
      targets,
    );
    if (!required || required.length === 0) throw this.disabled();

    const user = context.switchToHttp().getRequest().user;
    if (!user) throw new UnauthorizedException('Token missing or invalid');

    if (Number(user.roleId) === Role.Admin) return true;

    const enabled = await this.menus.menuCodesFor(user);
    if (required.some((code) => enabled.has(code))) return true;

    throw this.disabled();
  }

  private isGated(controller: Function): boolean {
    const raw = Reflect.getMetadata(PATH_METADATA, controller);
    const paths: string[] = Array.isArray(raw) ? raw : [raw ?? ''];
    return paths.some((p) => {
      const path = String(p).replace(/^\/+/, '').toLowerCase();
      return GATED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
    });
  }

  private disabled(): ForbiddenException {
    return new ForbiddenException({
      statusCode: 403,
      message: 'This module is not available.',
      code: MODULE_DISABLED,
    });
  }
}
