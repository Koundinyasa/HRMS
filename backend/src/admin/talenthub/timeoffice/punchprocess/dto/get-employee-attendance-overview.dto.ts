import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class GetEmployeeAttendanceOverviewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  employeeId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;
}