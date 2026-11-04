import { IsDateString, IsOptional } from 'class-validator';

export class GetYesterdayAbsentEmployeesDto {
  @IsOptional()
  @IsDateString()
  attendanceDate?: string;
}
