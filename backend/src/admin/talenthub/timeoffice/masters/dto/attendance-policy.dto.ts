import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class AttendancePolicyDto {
  @IsOptional()
  @IsBoolean()
  considerFirstIn?: boolean;

  @IsOptional()
  @IsBoolean()
  considerLastOut?: boolean;

  @IsOptional()
  @IsBoolean()
  autoCalculateAttendance?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}
