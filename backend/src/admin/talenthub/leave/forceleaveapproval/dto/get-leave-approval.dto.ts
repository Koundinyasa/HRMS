 
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
 
export class GetLeaveApprovalDto {
  @IsOptional()
  @IsString()
  approverId?: string;
 
  @IsOptional()
  @IsDateString()
  fromDate?: string;
 
  @IsOptional()
  @IsDateString()
  toDate?: string;
 
  @IsOptional()
  @Transform(({ value }) => value !== 'false' && value !== false)
  @IsBoolean()
  isCurrentMonth?: boolean;
 
  @IsOptional() @Type(() => Number) @IsInt() branchId?: number;
  @IsOptional() @IsArray() @Type(() => Number) @IsInt({ each: true }) branchIds?: number[];
  @IsOptional() @Type(() => Number) @IsInt() employmentStatusId?: number;
  @IsOptional() @Type(() => Number) @IsInt() designationId?: number;
  @IsOptional() @Type(() => Number) @IsInt() leaveTypeId?: number;
  @IsOptional() @Type(() => Number) @IsInt() structureId?: number;
  @IsOptional() @Type(() => Number) @IsInt() attendanceStatusId?: number;
}
 
