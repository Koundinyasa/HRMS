import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RolePermissionDto {
  @IsNotEmpty()
  @IsInt()
  menuId!: number;

  @IsBoolean()
  canCreate!: boolean;

  @IsBoolean()
  canRead!: boolean;

  @IsBoolean()
  canUpdate!: boolean;

  @IsBoolean()
  canDelete!: boolean;

  @IsBoolean()
  canAudit!: boolean;
}

export class UpdateRoleAccessDto {
  @IsNotEmpty()
  @IsInt()
  roleId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RolePermissionDto)
  permissions!: RolePermissionDto[];
}