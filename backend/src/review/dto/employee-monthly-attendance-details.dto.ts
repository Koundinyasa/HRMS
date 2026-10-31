import { Type } from 'class-transformer';

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class EmployeeMonthlyAttendanceDetailsDto {
  // Employee ids are text in the database (for example 21WERTYU21), up to 25
  // characters, so this is not a number.
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  employeeId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  classificationId?: number;
}
