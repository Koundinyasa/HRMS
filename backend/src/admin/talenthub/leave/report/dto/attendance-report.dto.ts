import {
  IsDateString,
  IsOptional,
} from 'class-validator';

export class AttendanceReportDto {
  @IsOptional()
  @IsDateString()
  FromMonth?: string;

  @IsOptional()
  @IsDateString()
  ToMonth?: string;
}