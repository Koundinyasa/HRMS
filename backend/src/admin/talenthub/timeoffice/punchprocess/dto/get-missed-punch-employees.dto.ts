import { IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMissedPunchEmployeesDto {
  @IsDateString()
  fromDate!: string;

  @IsDateString()
  toDate!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  companyId!: number;
}