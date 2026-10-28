import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class EmployeeDashboardDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  branchId?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(12)
  month?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(2000)
  year?: number;
}
