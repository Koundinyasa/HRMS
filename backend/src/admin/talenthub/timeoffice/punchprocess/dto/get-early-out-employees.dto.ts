import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class GetEarlyOutEmployeesDto {
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}