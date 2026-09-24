// import { Transform, Type } from 'class-transformer';
// import {
//   IsBoolean,
//   IsNumber,
//   IsOptional,
//   IsString,
// } from 'class-validator';

// export class HrLeaveRequestDto {

//   @IsString()
//   employeeId!: string;

//   @Type(() => Number)
//   @IsNumber()
//   leaveTypeId!: number;

//   @IsString()
//   fromDate!: string;

//   @IsString()
//   toDate!: string;

//   @IsOptional()
//   @IsString()
//   sessionFrom?: string;

//   @IsOptional()
//   @IsString()
//   sessionTo?: string;

//   @Transform(({ value }) => value === 'true')
//   @IsOptional()
//   @IsBoolean()
//   isHalfDay?: boolean;

//   @IsOptional()
//   @IsString()
//   reason?: string;

//   @Transform(({ value }) => value === 'true')
//   @IsOptional()
//   @IsBoolean()
//   isHRForceApply?: boolean;
// }


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