import type { SalaryComponent } from "../types/classificationTypes";

// Placeholder dataset shown until `/classifications/salary-structure/components`
// exists on the backend. Once that endpoint returns real data, this fallback
// is no longer used (see useSalaryComponent.ts — it only kicks in on API error).
export const DEFAULT_SALARY_COMPONENTS: SalaryComponent[] = [
  { Id: 1, ComponentName: "Basic", PrintName: "Basic", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 1, IsSystemDefined: true },
  { Id: 2, ComponentName: "OT1", PrintName: "OT1", IsCalculative: 1, IsOpenComponent: 0, Type: "Earnings", SortOrder: 2, IsSystemDefined: true },
  { Id: 3, ComponentName: "OT2", PrintName: "OT2", IsCalculative: 1, IsOpenComponent: 0, Type: "Earnings", SortOrder: 3, IsSystemDefined: true },
  { Id: 4, ComponentName: "Special Allowance", PrintName: "Special Allow", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 4, IsSystemDefined: true },
  { Id: 5, ComponentName: "HRA", PrintName: "HRA", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 5, IsSystemDefined: false },
  { Id: 6, ComponentName: "Conveyance Allowance", PrintName: "Conv. Allow.", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 6, IsSystemDefined: false },
  { Id: 7, ComponentName: "Dearness Allowance", PrintName: "DA", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 7, IsSystemDefined: false },
  { Id: 8, ComponentName: "Medical Allowance", PrintName: "Medical", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 8, IsSystemDefined: false },
  { Id: 9, ComponentName: "Transport Allowance", PrintName: "Transport", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 9, IsSystemDefined: false },
  { Id: 10, ComponentName: "Bonus", PrintName: "Bonus", IsCalculative: 0, IsOpenComponent: 1, Type: "Earnings", SortOrder: 10, IsSystemDefined: false },
  { Id: 11, ComponentName: "Incentive", PrintName: "Incentive", IsCalculative: 0, IsOpenComponent: 1, Type: "Earnings", SortOrder: 11, IsSystemDefined: false },
  { Id: 12, ComponentName: "Leave Travel Allowance", PrintName: "LTA", IsCalculative: 0, IsOpenComponent: 0, Type: "Earnings", SortOrder: 12, IsSystemDefined: false },
  { Id: 13, ComponentName: "Other Allowance", PrintName: "Other Allow.", IsCalculative: 0, IsOpenComponent: 1, Type: "Earnings", SortOrder: 13, IsSystemDefined: false },

  { Id: 14, ComponentName: "Provident Fund", PrintName: "PF", IsCalculative: 1, IsOpenComponent: 0, Type: "Deduction", SortOrder: 1, IsSystemDefined: true },
  { Id: 15, ComponentName: "Employee State Insurance", PrintName: "ESI", IsCalculative: 1, IsOpenComponent: 0, Type: "Deduction", SortOrder: 2, IsSystemDefined: true },
  { Id: 16, ComponentName: "Professional Tax", PrintName: "PT", IsCalculative: 0, IsOpenComponent: 0, Type: "Deduction", SortOrder: 3, IsSystemDefined: true },
  { Id: 17, ComponentName: "TDS", PrintName: "TDS", IsCalculative: 1, IsOpenComponent: 0, Type: "Deduction", SortOrder: 4, IsSystemDefined: true },
  { Id: 18, ComponentName: "Loan Deduction", PrintName: "Loan", IsCalculative: 0, IsOpenComponent: 1, Type: "Deduction", SortOrder: 5, IsSystemDefined: false },
  { Id: 19, ComponentName: "Health Insurance", PrintName: "Health Ins.", IsCalculative: 0, IsOpenComponent: 0, Type: "Deduction", SortOrder: 6, IsSystemDefined: false },
];
