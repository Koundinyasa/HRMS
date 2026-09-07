import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class GetManualLeaveAllotmentListDto {
  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsInt()
  leaveTypeId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsInt()
  year?: number;
}