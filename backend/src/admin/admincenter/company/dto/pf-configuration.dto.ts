import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
} from 'class-validator';

export class PFGroupDto {
  id!: number;
  name!: string;
}

export class PFDefaultConfigurationDto {
  @IsInt()
  pfGroupId!: number;

  @IsDateString()
  effectiveFrom!: string;

  @IsNumber()
  epfPercentage!: number;

  @IsNumber()
  employerEPFPercentage!: number;

  @IsNumber()
  pensionFundPercentage!: number;

  @IsNumber()
  cutoff!: number;

  @IsNumber()
  accountNo02Rate!: number;

  @IsNumber()
  accountNo21Rate!: number;

  @IsNumber()
  minimumChargesAccNo02!: number;

  @IsBoolean()
  pfOnPayDays!: boolean;

  @IsInt()
  roundOffTypeId!: number;

  @IsBoolean()
  restrictEmployerShare!: boolean;

  @IsBoolean()
  restrictEmployerEmployeeWise!: boolean;

  @IsBoolean()
  isDefault!: boolean;

  @IsBoolean()
  isActive!: boolean;
}

export class PFConfigurationDto {
  group!: PFGroupDto[];
  configuration!: PFDefaultConfigurationDto[];
}