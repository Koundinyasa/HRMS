import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class EmployeeDashboardDetailsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  insightId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  companyId!: number;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}