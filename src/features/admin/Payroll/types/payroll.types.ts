// ======================================================
// UI TYPES
// ======================================================

export type PayrollView =
  | "salary-structure-calculator"
  | "salary-structure-preview"
  | "configure-salary-component"
  | "assign-salary-structure"
  | "payroll-run";

export type CalcMethod = "PERCENT_CTC" | "PERCENT_BASIC" | "FIXED" | "BALANCE";
export type SalaryLineKind = "EARNING" | "DEDUCTION";
export type VariablePayout = "Monthly" | "Quarterly" | "Yearly";

export interface SalaryDetails {
  annualCtc: number;
  variablePct: number;
  variablePayout: VariablePayout;
  variableStartsAfter: string;
}

export interface SalaryLine {
  id: string;
  kind: SalaryLineKind;
  component: string;
  method: CalcMethod;
  value: number | null; // null when method is BALANCE
  isBasic?: boolean;
}

export interface ResolvedSalaryLine extends SalaryLine {
  monthlyAmount: number;
}

export interface CtcSummary {
  annualCtc: number;
  monthlyCtc: number;
  variablePay: number;
  fixedMonthlyCtc: number;
  deductionPool: number;
  earningsTarget: number;
}

export interface SalaryStructureResult {
  earnings: ResolvedSalaryLine[];
  deductions: ResolvedSalaryLine[];
  totalEarnings: number;
  totalDeductions: number;
  total: number;
  isBalanced: boolean;
}

// ======================================================
// SALARY COMPONENTS (master list)
// ======================================================

export interface SalaryComponent {
  id: string;
  name: string;
  postingType: SalaryLineKind; // EARNING = Credit, DEDUCTION = Debit
  method: CalcMethod;
  value: number | null; // null when method is BALANCE
  taxable: boolean;
  statutory: boolean;
  prorated: boolean;
  partOfCtc: boolean;
  includeInPfWage: boolean;
  includeInEsiWage: boolean;
  active: boolean;
}

// ======================================================
// SAVED STRUCTURES, EMPLOYEES, ASSIGNMENTS
// ======================================================

export interface SalaryStructureRecord {
  id: string;
  name: string;
  details: SalaryDetails;
  lines: SalaryLine[];
  createdOn: string; // ISO date (YYYY-MM-DD)
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  designation: string;
  department: string;
  location: string;
  dateOfJoining: string; // ISO date
}

export interface EmployeeSalaryAssignment {
  id: string;
  employeeId: string;
  structureId: string;
  effectiveFrom: string; // ISO date
}

// ======================================================
// PAYROLL RUN & PAYSLIP
// ======================================================

export interface PayslipLine {
  component: string;
  amount: number;
}

export interface Payslip {
  employeeId: string;
  code: string;
  name: string;
  designation: string;
  department: string;
  location: string;
  dateOfJoining: string;
  structureName: string;
  earnings: PayslipLine[];
  deductions: PayslipLine[];
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
}

export type PayrollRunStatus = "Completed";

export interface PayrollRun {
  id: string;
  period: string; // "YYYY-MM"
  status: PayrollRunStatus;
  createdOn: string; // ISO date
  payslips: Payslip[];
}

// ======================================================
// API REQUEST / RESPONSE TYPES (used by payroll.api.ts)
// Backend endpoints are not ready yet - shapes are placeholders.
// ======================================================

export interface SaveSalaryStructureRequest {
  details: SalaryDetails;
  lines: SalaryLine[];
  isDraft: boolean;
}

export interface SaveSalaryStructureResponse {
  success: boolean;
  message?: string;
}
