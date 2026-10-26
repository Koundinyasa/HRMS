import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class MissedPunchEmployeesDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  companyId!: number;
}