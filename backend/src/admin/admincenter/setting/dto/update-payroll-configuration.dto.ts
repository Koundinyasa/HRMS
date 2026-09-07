import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdatePayrollConfigurationDto {
  @IsNotEmpty()
  @IsInt()
  id!: number;

  @IsNotEmpty()
  @IsDateString()
  effectiveFrom!: string;

  @IsNotEmpty()
  @IsInt()
  payCycleStartDate!: number;

  @IsBoolean()
  companyWiseRoleCreation!: boolean;

  @IsBoolean()
  enableTimeAndAttendance!: boolean;

  @IsBoolean()
  enableAdvance!: boolean;

  @IsBoolean()
  enableReimbursement!: boolean;

  @IsBoolean()
  enableAdditionalSalary!: boolean;

  @IsBoolean()
  enableAttendanceIntegration!: boolean;

  @IsBoolean()
  enableLoan!: boolean;

  @IsBoolean()
  enableArrear!: boolean;

  @IsBoolean()
  enableDisbursement!: boolean;

  @IsBoolean()
  enableInsurance!: boolean;

  @IsBoolean()
  enableBonus!: boolean;

  @IsBoolean()
  enableCostCenter!: boolean;

  @IsNotEmpty()
  @IsInt()
  holidaysDefinedOn!: number;

  @IsNotEmpty()
  @IsInt()
  weeklyHolidayDefinedOn!: number;

  @IsNotEmpty()
  @IsInt()
  netSalaryRoundOff!: number;

  @IsOptional()
  @IsInt()
  retirementAge?: number;

  @IsBoolean()
  customLanguagePayslip!: boolean;
}