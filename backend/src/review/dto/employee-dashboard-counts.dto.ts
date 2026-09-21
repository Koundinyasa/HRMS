import { IsDateString, IsOptional } from 'class-validator';

export class EmployeeDashboardCountsDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}