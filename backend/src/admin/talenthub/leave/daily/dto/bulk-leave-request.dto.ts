
 
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
 
export class BulkLeaveRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MaxLength(25, { each: true }) // dbo.UT_EmployeeList.EmployeeID is VARCHAR(25)
  employeeList!: string[];
 
  // leave type id, or Mst_AttendanceStatus id when isAttendanceMarking is true
  @Type(() => Number)
  @IsInt()
  @Min(1)
  leaveTypeId!: number;
 
  @IsDateString()
  fromDate!: string;
 
  @IsDateString()
  toDate!: string;
 
  @IsOptional()
  @IsString()
  sessionFrom?: string;
 
  @IsOptional()
  @IsString()
  sessionTo?: string;
 
  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;
 
  @IsOptional()
  @IsString()
  reason?: string;
 
  @IsOptional()
  @IsString()
  documentPath?: string;
 
  @IsOptional()
  @IsBoolean()
  isHRForceApply?: boolean;
 
  @IsOptional()
  @IsBoolean()
  isAttendanceMarking?: boolean;
 
  // 1 = First Half, 2 = Second Half (SP default = 1)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  halfDayType?: number;
}
 