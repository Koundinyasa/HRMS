import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAttendanceDashboardOverviewDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  companyId!: number;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}