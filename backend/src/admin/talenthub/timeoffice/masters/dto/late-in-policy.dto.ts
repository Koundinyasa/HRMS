import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class LateInPolicyDto {
  @IsOptional()
  @IsNumber()
  gracePeriodMinutes?: number;

  @IsOptional()
  @IsBoolean()
  gracePeriodRestriction?: boolean;

  @IsOptional()
  @IsBoolean()
  considerGracePeriod?: boolean;

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;
}