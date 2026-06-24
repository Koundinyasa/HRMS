import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard
  implements CanActivate
{
  constructor(
    private reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const permission =
      this.reflector.get(
        'permission',
        context.getHandler(),
      );

    if (!permission) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user = request.user;

    console.log(
      'RoleID:',
      user.roleId,
    );

    console.log(
      'MenuID:',
      permission.menuId,
    );

    console.log(
      'Action:',
      permission.action,
    );

    return true;
  }
}



// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   ForbiddenException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { DatabaseService } from '../database/database.service';

// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private dbService: DatabaseService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const permission = this.reflector.get(
//       'permission',
//       context.getHandler(),
//     );

//     if (!permission) return true;

//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     const roleId = user.roleId;
//     const { menuId, action } = permission;

//     // STEP 1: Get permission from DB
//     const result = await this.dbService.query(
//       `
//       SELECT CanView, CanAdd, CanEdit, CanDelete, CanApprove
//       FROM RoleMenuPermission
//       WHERE RoleId = @roleId AND MenuId = @menuId
//       `,
//       [
//         { roleId },
//         { menuId },
//       ],
//     );

//     if (!result.length) {
//       throw new ForbiddenException('No permission assigned for this menu');
//     }

//     const p = result[0];

//     // STEP 2: Validate action
//     const isAllowed =
//       (action === 'CanView' && p.CanView) ||
//       (action === 'CanAdd' && p.CanAdd) ||
//       (action === 'CanEdit' && p.CanEdit) ||
//       (action === 'CanDelete' && p.CanDelete) ||
//       (action === 'CanApprove' && p.CanApprove);

//     if (!isAllowed) {
//       throw new ForbiddenException('Access denied');
//     }

//     return true;
//   }
// }