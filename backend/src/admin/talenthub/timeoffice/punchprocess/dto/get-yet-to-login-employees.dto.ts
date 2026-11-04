import { IsDateString, IsOptional } from 'class-validator';

export class GetYetToLoginEmployeesDto {
  @IsOptional()
  @IsDateString()
  attendanceDate?: string;
}
