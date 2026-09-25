import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
 
export class HrLeaveRequestDto {
 
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @IsNotEmpty()
  employeeId!: string;
 
  @Type(() => Number)
  @IsInt()
  leaveTypeId!: number;
 
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @IsNotEmpty()
  fromDate!: string;
 
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @IsNotEmpty()
  toDate!: string;
 
  @Transform(({ value }) => {
    const v = String(value ?? '').trim().toLowerCase();
    return v === 'true' || v === '1';
  })
  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;
 
  @Transform(({ value }) => {
    const v = String(value ?? '').trim().toLowerCase();
    return v === 'true' || v === '1';
  })
  @IsOptional()
  @IsBoolean()
  isHRForceApply?: boolean;
 
  @Transform(({ value }) => {
    if (value === undefined || value === null) return value;
    return String(value).trim();
  })
  @IsOptional()
  @IsString()
  sessionFrom?: string;
 
  @Transform(({ value }) => {
    if (value === undefined || value === null) return value;
    return String(value).trim();
  })
  @IsOptional()
  @IsString()
  sessionTo?: string;
 
  @Transform(({ value }) => {
    if (value === undefined || value === null) return value;
    return String(value).trim();
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
