import { IsOptional, IsString } from 'class-validator';

export class UpdateSalaryRateDto {
  @IsOptional()
  @IsString()
  salaryRate?: string;
}