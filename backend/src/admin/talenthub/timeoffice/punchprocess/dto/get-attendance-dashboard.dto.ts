import { IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAttendanceDashboardDto {
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @IsDateString()
  date?: string;
}