import type {
  Employee,
  EmployeeSalaryAssignment,
  PayrollRun,
  Payslip,
  PayslipLine,
  SalaryDetails,
  SalaryStructureRecord,
} from "../types/payroll.types";
import { lastDayOfPeriod } from "./payrollFormat";
import { calcCtcSummary, calcSalaryStructure } from "./salaryCalculator";

export function resolveStructure(record: SalaryStructureRecord) {
  const summary = calcCtcSummary(record.details);
  return { summary, structure: calcSalaryStructure(record.lines, summary) };
}

// The assignment in force for a period = latest one whose effective date is on/before period end
export function findActiveAssignment(
  assignments: EmployeeSalaryAssignment[],
  employeeId: string,
  period: string,
) {
  const periodEnd = lastDayOfPeriod(period);
  return assignments
    .filter((item) => item.employeeId === employeeId && item.effectiveFrom <= periodEnd)
    .sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0];
}

function monthsBetween(fromIso: string, period: string) {
  const [fy, fm] = fromIso.split("-").map(Number);
  const [py, pm] = period.split("-").map(Number);
  return (py - fy) * 12 + (pm - fm);
}

// Variable pay is paid only after the "starts after" window (counted from joining date).
// Monthly: every month. Quarterly: Mar/Jun/Sep/Dec (3 months' worth). Yearly: March (12 months' worth).
export function variablePayForPeriod(
  details: SalaryDetails,
  monthlyVariable: number,
  dateOfJoining: string,
  period: string,
) {
  const waitMonths = details.variableStartsAfter === "Immediately" ? 0 : parseInt(details.variableStartsAfter, 10) || 0;
  if (monthsBetween(dateOfJoining, period) < waitMonths) return 0;

  const month = Number(period.split("-")[1]);
  switch (details.variablePayout) {
    case "Monthly":
      return monthlyVariable;
    case "Quarterly":
      return month % 3 === 0 ? monthlyVariable * 3 : 0;
    case "Yearly":
      return month === 3 ? monthlyVariable * 12 : 0;
  }
}

export function buildPayslip(
  employee: Employee,
  record: SalaryStructureRecord,
  period: string,
): Payslip {
  const { summary, structure } = resolveStructure(record);

  const earnings: PayslipLine[] = structure.earnings.map((line) => ({
    component: line.component,
    amount: line.monthlyAmount,
  }));
  const variable = variablePayForPeriod(
    record.details,
    summary.variablePay,
    employee.dateOfJoining,
    period,
  );
  if (variable > 0) earnings.push({ component: "Variable Pay", amount: variable });

  const deductions: PayslipLine[] = structure.deductions.map((line) => ({
    component: line.component,
    amount: line.monthlyAmount,
  }));

  const grossEarnings = earnings.reduce((sum, line) => sum + line.amount, 0);
  const totalDeductions = deductions.reduce((sum, line) => sum + line.amount, 0);

  return {
    employeeId: employee.id,
    code: employee.code,
    name: employee.name,
    designation: employee.designation,
    department: employee.department,
    location: employee.location,
    dateOfJoining: employee.dateOfJoining,
    structureName: record.name,
    earnings,
    deductions,
    grossEarnings,
    totalDeductions,
    netPay: grossEarnings - totalDeductions,
  };
}

// Employees without an assignment in force for the period are skipped
export function buildPayrollRun(
  period: string,
  createdOn: string,
  employees: Employee[],
  assignments: EmployeeSalaryAssignment[],
  structures: SalaryStructureRecord[],
): PayrollRun {
  const payslips = employees.flatMap((employee) => {
    if (employee.dateOfJoining > lastDayOfPeriod(period)) return [];
    const assignment = findActiveAssignment(assignments, employee.id, period);
    const record = structures.find((item) => item.id === assignment?.structureId);
    return record ? [buildPayslip(employee, record, period)] : [];
  });

  return { id: `run-${period}`, period, status: "Completed", createdOn, payslips };
}

// Preview amount for the Configure Component screen, based on the structure currently being edited
export function calcComponentPreview(
  method: string,
  value: number,
  fixedMonthlyCtc: number,
  basicMonthly: number,
) {
  switch (method) {
    case "PERCENT_CTC":
      return Math.round((fixedMonthlyCtc * value) / 100);
    case "PERCENT_BASIC":
      return Math.round((basicMonthly * value) / 100);
    case "FIXED":
      return Math.round(value);
    default:
      return null; // BALANCE is only known once the whole structure is resolved
  }
}
