import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaInsightsDto {
  @IsDateString()
  fromDate!: string;

  @IsDateString()
  toDate!: string;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  taPolicy?: string;

  @IsOptional()
  @IsString()
  pattern?: string;

  @IsOptional()
  @IsString()
  taSupervisor?: string;

  @IsOptional()
  @IsString()
  attendance?: string;

  @IsOptional()
  @IsString()
  leave?: string;
}