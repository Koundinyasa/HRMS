import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
 
export class EmployeeMonthlyAttendanceDetailsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  employeeId!: string;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  month?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;
}
 