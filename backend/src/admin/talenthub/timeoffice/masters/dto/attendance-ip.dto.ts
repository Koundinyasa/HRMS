import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AttendanceIpDto {
  @IsNotEmpty()
  @IsString()
  ipAddress!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
