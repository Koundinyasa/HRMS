import {
  IsDateString,
  IsOptional,
} from 'class-validator';

export class LeaveSummaryDetailedDto {
  @IsOptional()
  @IsDateString()
  FromMonth?: string;

  @IsOptional()
  @IsDateString()
  ToMonth?: string;
}