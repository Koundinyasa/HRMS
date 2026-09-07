import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export type PermissionAction =
  | 'CanView'
  | 'CanAdd'
  | 'CanEdit'
  | 'CanDelete'
  | 'CanApprove';


  
export interface PermissionMeta {
  menuId: number;
  action: PermissionAction;
}

export const Permission = (menuId: number, action: PermissionAction) =>
  SetMetadata<string, PermissionMeta>(PERMISSION_KEY, { menuId, action });

