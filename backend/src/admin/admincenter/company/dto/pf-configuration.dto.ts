import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PFConfigurationDto {
  group!: any[];
  configuration!: any[];
}

export class PFDefaultConfigurationDto {
  @Type(() => Number)
  @IsInt()
  id!: number;

  @Type(() => Number)
  @IsInt()
  pfGroupId!: number;

  @IsDateString()
  effectiveFrom!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  epfPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  employerEPFPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pensionFundPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cutoff?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  accountNo02Rate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  accountNo21Rate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minimumChargesAccNo02?: number;

  @IsOptional()
  @IsBoolean()
  pfOnPayDays?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roundOffTypeId?: number;

  @IsOptional()
  @IsBoolean()
  restrictEmployerShare?: boolean;

  @IsOptional()
  @IsBoolean()
  restrictEmployerEmployeeWise?: boolean;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}