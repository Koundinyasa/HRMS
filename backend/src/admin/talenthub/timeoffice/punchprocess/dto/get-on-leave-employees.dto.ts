import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetOnLeaveEmployeesDto {
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @IsOptional()
  @IsDateString()
  fromDate?: string;
}