import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ShiftPatternDto {
  @IsNotEmpty()
  @IsString()
  patternName!: string;

  @IsOptional()
  @IsString()
  patternCode?: string;

  @IsOptional()
  @IsString()
  patternType?: string;

  @IsOptional()
  @IsBoolean()
  employeeWiseWeekOff?: boolean;

  @IsOptional()
  @IsString()
  shiftMasterId?: string;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}