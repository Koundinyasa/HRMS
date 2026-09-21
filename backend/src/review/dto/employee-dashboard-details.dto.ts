import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EmployeeDashboardDetailsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  insightId!: number;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}