import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class AvailedReportDto {
  @IsOptional()
  @IsDateString()
  FromMonth?: string;

  @IsOptional()
  @IsDateString()
  ToMonth?: string;

  @IsOptional()
  @IsInt()
  LeavePolicyId?: number;
}
