import {
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PermissionsPolicyDto {
  @IsOptional()
  @IsBoolean()
  allowOfficialPermission?: boolean;

  @IsOptional()
  @IsNumber()
  officialMinimumMinutes?: number;

  @IsOptional()
  @IsNumber()
  officialMaximumMinutes?: number;

  @IsOptional()
  @IsNumber()
  officialMaximumLimit?: number;

  @IsOptional()
  @IsNumber()
  officialMaximumDaysPerMonth?: number;

  @IsOptional()
  @IsBoolean()
  considerOfficialWorkStatus?: boolean;

  @IsOptional()
  @IsBoolean()
  includeOfficialDurationInNetWorkHours?: boolean;

  @IsOptional()
  @IsBoolean()
  allowPersonalPermission?: boolean;

  @IsOptional()
  @IsNumber()
  personalMinimumMinutes?: number;

  @IsOptional()
  @IsNumber()
  personalMaximumMinutes?: number;

  @IsOptional()
  @IsNumber()
  personalMaximumLimit?: number;

  @IsOptional()
  @IsNumber()
  personalMaximumDaysPerMonth?: number;

  @IsOptional()
  @IsBoolean()
  considerPersonalWorkStatus?: boolean;

  @IsOptional()
  @IsBoolean()
  includePersonalDurationInNetWorkHours?: boolean;
}