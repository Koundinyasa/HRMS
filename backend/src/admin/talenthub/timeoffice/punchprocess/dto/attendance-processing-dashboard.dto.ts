import { IsDateString, IsOptional } from 'class-validator';

export class AttendanceProcessingDashboardDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}