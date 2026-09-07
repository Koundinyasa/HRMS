import {
  IsDateString,
  IsOptional,
} from 'class-validator';

export class LeaveHistoryMonthWiseReportDto {
  @IsOptional()
  @IsDateString()
  FromMonth?: string;

  @IsOptional()
  @IsDateString()
  ToMonth?: string;
}