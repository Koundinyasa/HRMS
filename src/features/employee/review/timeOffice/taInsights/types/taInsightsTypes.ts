export interface TAInsightsParams {
  employeeId?: string;
  selectedDate?: string;
  fromDate?: string;
  toDate?: string;
  viewType?: string;
}

export interface TAInsightsCounts {
  totalAbsent: number;
  lopOverride: number;
  leaveAndPunch: number;
  otPendingAuth: number;
  cwPendingAuth: number;
  cwStatus: number;
  overTime: number;
  pendingPermissionPunches: number;
  punchProcessPending: number;
  integrationPending: number;
}

export interface TAInsightsEmployee {
  empId: string;
  empName: string;
  date: string;
  firstPunch: string;
  lastPunch: string;
  workHours: string;
  attendanceStatus: string;
}

export interface TAInsightsDashboardResponse {
  counts: TAInsightsCounts;
  details: TAInsightsEmployee[];
}

export interface TAInsightsDetailsParams {
  insightId: number;
  fromDate?: string;
  toDate?: string;
}

export interface TAInsightCount {
  key: keyof TAInsightsCounts;
  title: string;
  count: number;
  employeeCount: number;
  employeeText: string;
  borderColor: string;
  textColor: string;
  insightId: number;
  enabled: boolean;
}

export type TAInsightCard = TAInsightCount;

export interface TAInsightFilters {
  employeeId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export type TAInsightEmployee = TAInsightsEmployee;

export interface TAInsightCardLegacy {
  key: keyof TAInsightsCounts;
  title: string;
  count: number;
  color: string;
  enabled: boolean;
}