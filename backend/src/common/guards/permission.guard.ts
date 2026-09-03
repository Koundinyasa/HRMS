// import {CanActivate,ExecutionContext,Injectable,ForbiddenException} from '@nestjs/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class PermissionGuard
//   implements CanActivate
// {
//   constructor(
//     private reflector: Reflector,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const permission =this.reflector.get(
//         'permission',
//         context.getHandler(),
//       );

//     if (!permission) {
//       return true;
//     }

//     const request =context.switchToHttp().getRequest();

//     const user = request.user;

//     console.log('RoleID:',user.roleId);
//     console.log('MenuID:',permission.menuId);
//     console.log('Action:',permission.action);
//     return true;
//   }
// }


import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from '../../database/database.service';
import { PERMISSION_KEY, PermissionMeta } from '../decorators/permission.decorator';



@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dbService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<PermissionMeta>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    // No @Permission() decorator — allow through
    if (!permission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.roleId) {
      throw new ForbiddenException('Access denied');
    }

    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('RoleID', user.roleId)
      .input('MenuID', permission.menuId)
      .execute('USP_GetRolePermissions');

    const row = result.recordset?.[0];

    if (!row || !row[permission.action]) {
      throw new ForbiddenException(
        `You do not have ${permission.action} permission for this resource`,
      );
    }

    return true;
  }
}