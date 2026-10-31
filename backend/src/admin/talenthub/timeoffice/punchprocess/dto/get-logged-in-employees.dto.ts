import { IsDateString, IsOptional } from 'class-validator';

export class GetLoggedInEmployeesDto {
  @IsOptional()
  @IsDateString()
  attendanceDate?: string;
}
