import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdvancedPolicyDto {
  @IsOptional()
  @IsNumber()
  breakLateInBufferMinutes?: number;

  @IsOptional()
  @IsNumber()
  breakEarlyOutBufferMinutes?: number;

  @IsOptional()
  @IsBoolean()
  advancedBreakDeduction?: boolean;

  @IsOptional()
  @IsString()
  definedBreakDuration?: string;

  @IsOptional()
  @IsBoolean()
  applySandwichLeaveForWeekOff?: boolean;

  @IsOptional()
  @IsBoolean()
  oneSideWeekOffPrefix?: boolean;

  @IsOptional()
  @IsBoolean()
  oneSideWeekOffSuffix?: boolean;

  @IsOptional()
  @IsBoolean()
  oneSideWeekOffBoth?: boolean;

  @IsOptional()
  @IsBoolean()
  applySandwichRuleForHoliday?: boolean;

  @IsOptional()
  @IsBoolean()
  holidayPrefix?: boolean;

  @IsOptional()
  @IsBoolean()
  holidaySuffix?: boolean;

  @IsOptional()
  @IsBoolean()
  holidayBoth?: boolean;
}
