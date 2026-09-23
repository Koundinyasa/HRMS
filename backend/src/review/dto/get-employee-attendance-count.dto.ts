import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class GetEmployeeAttendanceCountDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;
}