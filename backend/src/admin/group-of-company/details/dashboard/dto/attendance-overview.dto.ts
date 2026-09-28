import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AttendanceOverviewDto {
  @IsNotEmpty()
  @IsString()
  EmployeeID!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  CompanyID!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  Year!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  Month!: number;
}