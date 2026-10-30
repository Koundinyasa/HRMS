import 'reflect-metadata';
import { Controller, Get } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ModuleGateGuard, MODULE_DISABLED } from './module-gate.guard';
import { GateOpen, RequiresMenu } from '../decorators/module-gate.decorator';
import { Public } from '../decorators/public.decorator';
import { MenuCode } from '../constants/menu-codes';

@RequiresMenu(MenuCode.LeaveDaily)
@Controller('admin/ta/leave/daily')
class Daily { @Get() a() {} }

@Controller('admin/ta/leave/holiday')
class Untagged { @Get() a() {} }

@RequiresMenu(MenuCode.Review)
@Controller('review')
class Review {
  @Get() a() {}
  @RequiresMenu(MenuCode.Review, MenuCode.ForceLeaveApproval)
  @Get('approval') approval() {}
}

@Controller('recruitment')
class Recruitment {
  @GateOpen() @Get('open') open() {}
  @Get('closed') closed() {}
}

@Controller('/employee/leave')
class EmployeeLeave { @Get() a() {} }

@Public()
@Controller('admin/health')
class PublicRoute { @Get() a() {} }

const MENUS: Record<string, string[]> = {
  hr: [MenuCode.LeaveDaily, MenuCode.ForceLeaveApproval],
  rm: [MenuCode.Review],
  ess: [],
};

const guard = new ModuleGateGuard(new Reflector(), {
  menuCodesFor: async (u: any) => new Set(MENUS[u.employeeId] ?? []),
} as any);

const ctx = (cls: any, method: string, user?: any) =>
  ({
    getType: () => 'http',
    getClass: () => cls,
    getHandler: () => cls.prototype[method],
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as any;

const hr = { employeeId: 'hr', roleId: 2 };
const rm = { employeeId: 'rm', roleId: 3 };
const ess = { employeeId: 'ess', roleId: 3 };
const superAdmin = { employeeId: 'sa', roleId: 1 };

const disabled = { response: { code: MODULE_DISABLED } };

describe('ModuleGateGuard', () => {
  it('lets HR Admin into a tagged Phase 1 route when the menu is enabled', async () => {
    await expect(guard.canActivate(ctx(Daily, 'a', hr))).resolves.toBe(true);
  });

  it('denies an untagged admin route, even for Super Admin', async () => {
    await expect(guard.canActivate(ctx(Untagged, 'a', hr))).rejects.toMatchObject(disabled);
    await expect(guard.canActivate(ctx(Untagged, 'a', superAdmin))).rejects.toMatchObject(disabled);
  });

  it('lets Super Admin into a tagged route without a menu lookup', async () => {
    await expect(guard.canActivate(ctx(Daily, 'a', superAdmin))).resolves.toBe(true);
  });

  it('denies a tagged route when the menu is not enabled for the caller', async () => {
    await expect(guard.canActivate(ctx(Daily, 'a', ess))).rejects.toMatchObject(disabled);
  });

  it('gives Review to the reporting manager only', async () => {
    await expect(guard.canActivate(ctx(Review, 'a', rm))).resolves.toBe(true);
    await expect(guard.canActivate(ctx(Review, 'a', ess))).rejects.toMatchObject(disabled);
    await expect(guard.canActivate(ctx(Review, 'a', hr))).rejects.toMatchObject(disabled);
  });

  it('also lets HR Admin with Force Leave Approval use review/approval', async () => {
    await expect(guard.canActivate(ctx(Review, 'approval', hr))).resolves.toBe(true);
  });

  it('lets GateOpen routes through and keeps the rest of the controller closed', async () => {
    await expect(guard.canActivate(ctx(Recruitment, 'open', ess))).resolves.toBe(true);
    await expect(guard.canActivate(ctx(Recruitment, 'closed', ess))).rejects.toMatchObject(disabled);
  });

  it('does not touch controllers outside admin, recruitment and review', async () => {
    await expect(guard.canActivate(ctx(EmployeeLeave, 'a', ess))).resolves.toBe(true);
  });

  it('lets @Public routes through', async () => {
    await expect(guard.canActivate(ctx(PublicRoute, 'a'))).resolves.toBe(true);
  });

  it('answers 401 when a tagged route has no signed-in user', async () => {
    await expect(guard.canActivate(ctx(Daily, 'a'))).rejects.toMatchObject({ status: 401 });
  });
});
