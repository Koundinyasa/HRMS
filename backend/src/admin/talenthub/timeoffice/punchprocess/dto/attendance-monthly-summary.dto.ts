import { IsNotEmpty, IsString } from 'class-validator';

export class AttendanceMonthlySummaryDto {
  @IsString()
  @IsNotEmpty()
  month!: string;

  @IsString()
  @IsNotEmpty()
  employeeId!: string;
}
