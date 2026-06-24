import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const Permission = (
  menuId: number,
  action:
    | 'CanView'
    | 'CanAdd'
    | 'CanEdit'
    | 'CanDelete'
    | 'CanApprove',
) =>
  SetMetadata(PERMISSION_KEY, {
    menuId,
    action,
  });