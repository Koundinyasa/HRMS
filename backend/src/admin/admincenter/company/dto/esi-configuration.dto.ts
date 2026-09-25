import { IsBoolean, IsDateString, IsInt, IsNumber } from 'class-validator';

export class ESIGroupDto {
  id!: number;
  name!: string;
}

export class ESIDefaultConfigurationDto {
  @IsInt()
  esiGroupId!: number;

  @IsDateString()
  effectiveFrom!: string;

  @IsNumber()
  cutOffAmount!: number;

  @IsNumber()
  employeeRate!: number;

  @IsNumber()
  employerRate!: number;

  @IsNumber()
  minimumDailyWage!: number;

  @IsInt()
  roundOffTypeId!: number;

  @IsBoolean()
  isDefault!: boolean;

  @IsBoolean()
  isActive!: boolean;
}

export class ESIConfigurationDto {
  group!: ESIGroupDto[];
  configuration!: ESIDefaultConfigurationDto[];
}
