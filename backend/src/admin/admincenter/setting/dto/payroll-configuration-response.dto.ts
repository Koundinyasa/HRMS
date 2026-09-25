export class PayrollConfigurationResponseDto {
  PayrollID!: number;
  CompanyID!: number;
  EffectiveFrom!: string;
  PayCycleStartDate!: number;

  CompanyWiseRoleCreation!: boolean;
  EnableTimeAndAttendance!: boolean;
  EnableAdvance!: boolean;
  EnableReimbursement!: boolean;
  EnableAdditionalSalary!: boolean;
  EnableAttendanceIntegration!: boolean;
  EnableLoan!: boolean;
  EnableArrear!: boolean;
  EnableDisbursement!: boolean;
  EnableInsurance!: boolean;
  EnableBonus!: boolean;
  EnableCostCenter!: boolean;

  HolidaysDefinedOn!: number;
  WeeklyHolidayDefinedOn!: number;
  NetSalaryRoundOff!: number;
  RetirementAge!: number | null;
  CustomLanguagePayslip!: boolean;
}
