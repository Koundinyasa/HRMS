import {
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateLeavePolicyDto {
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

  @IsString()
  leaveCreditFrequency!: string;

  @IsInt()
  @Min(1)
  @Max(31)
  leaveCreditDay!: number;

  @IsBoolean()
  prorateOnJoining!: boolean;

  @IsInt()
  @Min(1)
  @Max(31)
  joiningCutOffDay!: number;

  @IsString()
  joiningCreditRule!: string;
}
