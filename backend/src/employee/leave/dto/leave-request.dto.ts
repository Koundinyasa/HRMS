import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class LeaveRequestDto {
  @Type(() => Number)
  @IsNumber()
  leaveTypeId: number;

  @IsString()
  fromDate: string;

  @IsString()
  toDate: string;

  @IsOptional()
  @IsString()
  sessionFrom?: string;

  @IsOptional()
  @IsString()
  sessionTo?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return false;
  })
  @IsBoolean()
  @IsOptional()
  isHalfDay?: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}
