import { IsDateString, IsOptional } from 'class-validator';

export class LeaveHistoryDateWiseReportDto {
  @IsOptional()
  @IsDateString()
  FromDate?: string;

  @IsOptional()
  @IsDateString()
  ToDate?: string;
}
