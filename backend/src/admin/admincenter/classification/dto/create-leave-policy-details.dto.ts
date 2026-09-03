import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateLeavePolicyDetailsDto {
  @IsInt()
  policyId!: number;

  @IsInt()
  leaveTypeId!: number;

  @IsNumber()
  annualQuota!: number;

  @IsNumber()
  monthlyAccrual!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  creditDay?: number;

  @IsNumber()
  carryForwardLimit!: number;

  @IsNumber()
  maxBalance!: number;

  @IsNumber()
  encashmentLimit!: number;

  @IsBoolean()
  probationEligible!: boolean;

  @IsBoolean()
  noticePeriodEligible!: boolean;

  @IsBoolean()
  sandwichApplicable!: boolean;

  @IsBoolean()
  includeHoliday!: boolean;

  @IsBoolean()
  includeWeekOff!: boolean;
}