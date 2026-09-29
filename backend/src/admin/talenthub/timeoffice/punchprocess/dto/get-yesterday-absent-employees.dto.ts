import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetYesterdayAbsentEmployeesDto {
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @IsOptional()
  @IsDateString()
  attendanceDate?: string;
}