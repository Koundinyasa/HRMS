import { IsBoolean, IsDateString, IsInt, IsString } from 'class-validator';

export class PayrollConfigurationDto {
  @IsInt()
  payrollID!: number;

  @IsInt()
  companyID!: number;

  @IsDateString()
  effectiveFrom!: string;

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

  @IsString()
  holidaysDefinedOn!: string;

  @IsString()
  weeklyHolidayDefinedOn!: string;

  @IsString()
  netSalaryRoundOff!: string;

  @IsInt()
  retirementAge!: number;

  @IsString()
  customLanguagePayslip!: string;
}
