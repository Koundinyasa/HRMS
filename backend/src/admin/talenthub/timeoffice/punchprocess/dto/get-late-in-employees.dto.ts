import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLateInEmployeesDto {
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}