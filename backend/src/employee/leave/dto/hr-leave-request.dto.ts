import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class HrLeaveRequestDto {

  @IsString()
  employeeId!: string;

  @Type(() => Number)
  @IsNumber()
  leaveTypeId!: number;

  @IsString()
  fromDate!: string;

  @IsString()
  toDate!: string;

  @IsOptional()
  @IsString()
  sessionFrom?: string;

  @IsOptional()
  @IsString()
  sessionTo?: string;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;

  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  isHRForceApply?: boolean;
}