import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateLeavePolicyDto {
  @IsInt()
  policyId!: number;

  @IsString()
  policyName!: string;

  @IsInt()
  employmentTypeId!: number;

  @IsOptional()
  @IsInt()
  designationId?: number;

  @IsOptional()
  @IsInt()
  departmentId?: number;

  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsDateString()
  effectiveFrom!: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @IsOptional()
  @IsString()
  leaveCreditFrequency?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  leaveCreditDay?: number;

  @IsOptional()
  @IsBoolean()
  prorateOnJoining?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  joiningCutOffDay?: number;

  @IsOptional()
  @IsString()
  joiningCreditRule?: string;
}
