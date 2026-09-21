import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class MonthlyLeaveCalendarDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  companyId!: number;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2099)
  year?: number;
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId?: number;
}