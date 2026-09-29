import {
  IsDateString,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetLateInEarlyOutGraphDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  companyId!: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}