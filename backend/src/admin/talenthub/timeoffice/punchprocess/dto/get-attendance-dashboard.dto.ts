import { IsDateString } from 'class-validator';

export class GetAttendanceDashboardDto {
  @IsDateString()
  date?: string;
}
