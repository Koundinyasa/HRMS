import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class EmployeeMonthlyAttendanceDetailsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeeId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  companyId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  year?: number;

  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1, 2, 3, 4, 5, 6])
  flag: number;
}