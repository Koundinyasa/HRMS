import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class WorkHoursPolicyDto {
  @IsOptional()
  @IsNumber()
  minimumHoursForHalfDay?: number;

  @IsOptional()
  @IsNumber()
  minimumHoursForFullDay?: number;

  @IsOptional()
  @IsBoolean()
  includeEarlyInMinutes?: boolean;

  @IsOptional()
  @IsNumber()
  maximumEarlyInMinutes?: number;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}
