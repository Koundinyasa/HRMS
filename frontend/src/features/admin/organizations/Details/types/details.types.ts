export type OrganizationStat = {
  totalEmployees: number;
  confirmationPending: number;
  joinedEmployees: number;
  leftEmployees: number;
  maleCount: number;
  femaleCount: number;
  averageService: string;
};

export type OrganizationCompany = {
  id: string;
  name: string;
  stats: OrganizationStat;
};

export type DashboardApiResponse = {
  company?: OrganizationCompany;
  companies?: OrganizationCompany[];
  stats?: OrganizationStat;
  companyName?: string;
};

export type ComplianceRow = {
  companyName: string;
  employeeCount: number;
  pfAck: number;
  pfAmount: number;
  esiAck: number;
  esiAmount: number;
  ptAck: number;
  ptAmount: number;
  lwfAck: number;
  lwfAmount: number;
  tds: number;
};

export type ComplianceApiResponse = {
  monthYear?: string;
  rows?: ComplianceRow[];
  data?: ComplianceRow[];
};

export type SalaryParticularRow = {
  particular: string;
  currentMonth: number;
  previousMonth: number;
  difference: number;
  pctIncDec: number;
  pyYtd: number;
};

export type ConsolidatedSalaryApiResponse = {
  companyName?: string;
  rows?: SalaryParticularRow[];
  data?: SalaryParticularRow[];
};