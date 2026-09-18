import {
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class GetEmployeesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  salaryStructure?: string;

  @IsOptional()
  @IsString()
  leave?: string;

  @IsOptional()
  @IsString()
  attendance?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  employeeStatus?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}