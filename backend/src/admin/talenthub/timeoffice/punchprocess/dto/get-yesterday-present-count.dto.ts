import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class GetYesterdayPresentCountDto {
  @Type(() => Number)
  @IsInt()
  companyId!: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}