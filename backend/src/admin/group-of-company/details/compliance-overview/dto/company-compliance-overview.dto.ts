import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ComplianceOverviewDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(2000)
  year?: number;
}