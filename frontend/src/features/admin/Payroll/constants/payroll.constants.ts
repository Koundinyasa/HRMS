import type { SubNavItem } from "../../components/sidebar.types";
import { Calculator, Eye, Play, Settings2, UserPlus } from "lucide-react";
import type {
  CalcMethod,
  Employee,
  EmployeeSalaryAssignment,
  PayrollRunStatus,
  SalaryComponent,
  SalaryDetails,
  SalaryLine,
  SalaryStructureRecord,
  VariablePayout,
} from "../types/payroll.types";

export const PAYROLL_SUB_NAV: SubNavItem[] = [
  { label: "Salary Structure Calculator", path: "salary-structure-calculator", icon: Calculator },
  { label: "Salary Structure Preview", path: "salary-structure-preview", icon: Eye },
  { label: "Configure Salary Component", path: "configure-salary-component", icon: Settings2 },
  { label: "Assign Salary Structure", path: "assign-salary-structure", icon: UserPlus },
  { label: "Payroll Run", path: "payroll-run", icon: Play },
];

// 16% of fixed monthly CTC is set aside for the deduction pool
export const CTC_DEDUCTION_POOL_PCT = 16;

export const VARIABLE_PAYOUT_OPTIONS: VariablePayout[] = ["Monthly", "Quarterly", "Yearly"];
export const VARIABLE_STARTS_AFTER_OPTIONS = ["Immediately", "3 Months", "6 Months", "12 Months"];

export const CALC_METHOD_LABELS: Record<CalcMethod, string> = {
  PERCENT_CTC: "% of fixed CTC",
  PERCENT_BASIC: "% of Basic",
  FIXED: "Fixed ₹",
  BALANCE: "Balance (auto)",
};

// ======================================================
// MOCK DATA (no backend endpoints yet)
// ======================================================

export const DEFAULT_SALARY_DETAILS: SalaryDetails = {
  annualCtc: 520000,
  variablePct: 0, // variable pay is switched off for now
  variablePayout: "Monthly",
  variableStartsAfter: "6 Months",
};

export const DEFAULT_SALARY_LINES: SalaryLine[] = [
  { id: "e1", kind: "EARNING", component: "Basic Salary", method: "PERCENT_CTC", value: 40, isBasic: true },
  { id: "e2", kind: "EARNING", component: "HRA", method: "PERCENT_BASIC", value: 50 },
  { id: "e3", kind: "EARNING", component: "Compensatory Allowance", method: "PERCENT_CTC", value: 7 },
  { id: "e4", kind: "EARNING", component: "Holiday Allowance", method: "PERCENT_CTC", value: 6 },
  { id: "e5", kind: "EARNING", component: "Food Wallet", method: "FIXED", value: 2000 },
  { id: "e6", kind: "EARNING", component: "Special Allowance", method: "BALANCE", value: null },
  { id: "d1", kind: "DEDUCTION", component: "Provident Fund", method: "PERCENT_BASIC", value: 25 },
  { id: "d2", kind: "DEDUCTION", component: "Medical & Insurance", method: "FIXED", value: 2000 },
  { id: "d3", kind: "DEDUCTION", component: "Other & Gratuity", method: "BALANCE", value: null },
];

export const PAYROLL_RUN_STATUSES: PayrollRunStatus[] = ["Completed"];
export const PAYROLL_RUNS_PAGE_SIZE = 5;

export const SEED_EMPLOYEES: Employee[] = [
  { id: "emp1", code: "EMP001", name: "Sathwika Achugatla", designation: "Software Engineer", department: "Engineering", location: "Hyderabad", dateOfJoining: "2026-11-01" },
  { id: "emp2", code: "EMP002", name: "Rohit Varma", designation: "Senior Engineer", department: "Engineering", location: "Hyderabad", dateOfJoining: "2025-06-16" },
  { id: "emp3", code: "EMP003", name: "Ananya Reddy", designation: "HR Executive", department: "Human Resources", location: "Bengaluru", dateOfJoining: "2026-02-01" },
  { id: "emp4", code: "EMP004", name: "Karthik Nair", designation: "QA Engineer", department: "Engineering", location: "Hyderabad", dateOfJoining: "2025-09-01" },
  { id: "emp5", code: "EMP005", name: "Meera Iyer", designation: "Associate Designer", department: "Design", location: "Pune", dateOfJoining: "2026-07-01" },
  { id: "emp6", code: "EMP006", name: "Imran Sheikh", designation: "Senior Engineer", department: "Engineering", location: "Bengaluru", dateOfJoining: "2024-11-12" },
];

export const SEED_STRUCTURES: SalaryStructureRecord[] = [
  {
    id: "st1",
    name: "Software Engineer - 5.2 LPA",
    details: DEFAULT_SALARY_DETAILS,
    lines: DEFAULT_SALARY_LINES,
    createdOn: "2026-04-01",
  },
  {
    id: "st2",
    name: "Senior Engineer - 9.6 LPA",
    details: { annualCtc: 960000, variablePct: 0, variablePayout: "Quarterly", variableStartsAfter: "3 Months" },
    lines: [
      { id: "e1", kind: "EARNING", component: "Basic Salary", method: "PERCENT_CTC", value: 40, isBasic: true },
      { id: "e2", kind: "EARNING", component: "HRA", method: "PERCENT_BASIC", value: 50 },
      { id: "e3", kind: "EARNING", component: "Food Wallet", method: "FIXED", value: 2000 },
      { id: "e4", kind: "EARNING", component: "Special Allowance", method: "BALANCE", value: null },
      { id: "d1", kind: "DEDUCTION", component: "Provident Fund", method: "PERCENT_BASIC", value: 25 },
      { id: "d2", kind: "DEDUCTION", component: "Medical & Insurance", method: "FIXED", value: 2000 },
      { id: "d3", kind: "DEDUCTION", component: "Other & Gratuity", method: "BALANCE", value: null },
    ],
    createdOn: "2026-04-01",
  },
  {
    id: "st3",
    name: "Associate - 3.6 LPA",
    details: { annualCtc: 360000, variablePct: 0, variablePayout: "Monthly", variableStartsAfter: "Immediately" },
    lines: [
      { id: "e1", kind: "EARNING", component: "Basic Salary", method: "PERCENT_CTC", value: 40, isBasic: true },
      { id: "e2", kind: "EARNING", component: "HRA", method: "PERCENT_BASIC", value: 50 },
      { id: "e3", kind: "EARNING", component: "Special Allowance", method: "BALANCE", value: null },
      { id: "d1", kind: "DEDUCTION", component: "Provident Fund", method: "PERCENT_BASIC", value: 25 },
      { id: "d2", kind: "DEDUCTION", component: "Other & Gratuity", method: "BALANCE", value: null },
    ],
    createdOn: "2026-04-01",
  },
];

export const SEED_ASSIGNMENTS: EmployeeSalaryAssignment[] = [
  { id: "as1", employeeId: "emp1", structureId: "st1", effectiveFrom: "2026-11-01" },
  { id: "as2", employeeId: "emp2", structureId: "st2", effectiveFrom: "2025-06-16" },
  { id: "as3", employeeId: "emp3", structureId: "st3", effectiveFrom: "2026-02-01" },
  { id: "as4", employeeId: "emp4", structureId: "st1", effectiveFrom: "2025-09-01" },
  { id: "as5", employeeId: "emp6", structureId: "st2", effectiveFrom: "2024-11-12" },
];

// Periods of the runs that exist on first load (they are computed from the data above)
export const SEED_RUN_PERIODS = ["2026-08", "2026-09", "2026-10", "2026-11"];

const NO_FLAGS = {
  taxable: true,
  statutory: false,
  prorated: true,
  partOfCtc: true,
  includeInPfWage: false,
  includeInEsiWage: false,
  active: true,
};

export const DEFAULT_COMPONENT_FLAGS = NO_FLAGS;

export const SEED_COMPONENTS: SalaryComponent[] = [
  { id: "c1", name: "Basic Salary", postingType: "EARNING", method: "PERCENT_CTC", value: 40, ...NO_FLAGS, includeInPfWage: true, includeInEsiWage: true },
  { id: "c2", name: "HRA", postingType: "EARNING", method: "PERCENT_BASIC", value: 50, ...NO_FLAGS },
  { id: "c3", name: "Compensatory Allowance", postingType: "EARNING", method: "PERCENT_CTC", value: 7, ...NO_FLAGS },
  { id: "c4", name: "Holiday Allowance", postingType: "EARNING", method: "PERCENT_CTC", value: 6, ...NO_FLAGS },
  { id: "c5", name: "Food Wallet", postingType: "EARNING", method: "FIXED", value: 2000, ...NO_FLAGS, taxable: false },
  { id: "c6", name: "Special Allowance", postingType: "EARNING", method: "BALANCE", value: null, ...NO_FLAGS },
  { id: "c7", name: "Provident Fund", postingType: "DEDUCTION", method: "PERCENT_BASIC", value: 25, ...NO_FLAGS, taxable: false, statutory: true },
  { id: "c8", name: "Medical & Insurance", postingType: "DEDUCTION", method: "FIXED", value: 2000, ...NO_FLAGS, taxable: false, prorated: false },
  { id: "c9", name: "Other & Gratuity", postingType: "DEDUCTION", method: "BALANCE", value: null, ...NO_FLAGS, taxable: false, statutory: true },
];
