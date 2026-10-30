import { SetMetadata } from '@nestjs/common';
import { MenuCodeValue } from '../constants/menu-codes';

export const REQUIRES_MENU_KEY = 'requiresMenu';
export const GATE_OPEN_KEY = 'gateOpen';

/**
 * Switches a route (or a whole controller) on for the listed menus.
 * The caller needs AT LEAST ONE of the menus to be enabled for their role in
 * the database (Mst_Menu + RoleMenuPermission). Enforced by ModuleGateGuard.
 *
 * @example
 *   @RequiresMenu(MenuCode.LeaveDaily)
 *   @Controller('admin/ta/leave/daily')
 */
export const RequiresMenu = (...menus: MenuCodeValue[]) =>
  SetMetadata(REQUIRES_MENU_KEY, menus);

/**
 * Switches a single route OFF inside a controller that is otherwise on
 * (answers 403 MODULE_DISABLED to everyone, Super Admin included). Use it for
 * routes that belong to a screen that is not part of the release.
 */
export const GateClosed = () => SetMetadata(REQUIRES_MENU_KEY, []);

/**
 * Lets a route through the module gate without a menu check. Use only for
 * routes that employees need inside a gated area (for example the interviewer
 * feedback routes under /recruitment). Roles are still enforced by @Roles().
 */
export const GateOpen = () => SetMetadata(GATE_OPEN_KEY, true);
