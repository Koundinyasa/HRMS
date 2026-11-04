import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
 
export class GetMonthlyLeaveCalendarDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2099)
  year?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  branchId?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  employmentStatusId?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  designationId?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  policyId?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  leaveTypeId?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  structureId?: number;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  attendanceStatusId?: number;
}