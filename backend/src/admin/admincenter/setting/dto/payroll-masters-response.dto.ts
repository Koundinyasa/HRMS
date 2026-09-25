import { PayrollMasterDto } from './payroll-master.dto';

export class PayrollMastersResponseDto {
  holidaysDefinedOn!: PayrollMasterDto[];

  weeklyHolidayDefinedOn!: PayrollMasterDto[];

  netSalaryRoundOff!: PayrollMasterDto[];
}
