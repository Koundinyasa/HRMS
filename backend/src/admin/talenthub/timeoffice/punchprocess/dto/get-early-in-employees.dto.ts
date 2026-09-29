import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEarlyInEmployeesDto {
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}