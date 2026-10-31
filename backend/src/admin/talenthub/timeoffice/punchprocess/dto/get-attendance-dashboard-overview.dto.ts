import { IsDateString, IsOptional } from 'class-validator';

export class GetAttendanceDashboardOverviewDto {
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
