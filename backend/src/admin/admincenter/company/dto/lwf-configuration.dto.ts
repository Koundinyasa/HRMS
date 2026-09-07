import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
} from 'class-validator';

export class LWFGroupDto {
  id!: number;
  defaultLWF!: string;
  state!: string;
}

export class LWFDefaultConfigurationDto {
  @IsInt()
  stateId!: number;

  @IsInt()
  lwfGroupId!: number;

  @IsDateString()
  effectiveFrom!: string;

  @IsNumber()
  cutoffAmount!: number;

  @IsNumber()
  employeeContribution!: number;

  @IsNumber()
  employerContribution!: number;

  @IsBoolean()
  january!: boolean;

  @IsBoolean()
  february!: boolean;

  @IsBoolean()
  march!: boolean;

  @IsBoolean()
  april!: boolean;

  @IsBoolean()
  may!: boolean;

  @IsBoolean()
  june!: boolean;

  @IsBoolean()
  july!: boolean;

  @IsBoolean()
  august!: boolean;

  @IsBoolean()
  september!: boolean;

  @IsBoolean()
  october!: boolean;

  @IsBoolean()
  november!: boolean;

  @IsBoolean()
  december!: boolean;

  @IsBoolean()
  isActive!: boolean;

  @IsBoolean()
  isDefault!: boolean;
}

export class LWFConfigurationDto {
  group!: LWFGroupDto[];
  configuration!: LWFDefaultConfigurationDto[];
}