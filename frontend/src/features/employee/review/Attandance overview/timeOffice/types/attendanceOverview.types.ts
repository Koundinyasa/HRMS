import type { ReactNode } from "react";

import type {
  AttendanceDay,
  AttendanceOverviewData,
  Employee,
  PunchType,
} from "./regularization.types";

// ============================================================
// ATTENDANCE NAVIGATION
// ============================================================

export type AttendanceTab =
  | "overview"
  | "insights";

export type AttendanceView =
  | "list"
  | "calendar";

export type PunchTab =
  | "processed"
  | "raw";

// ============================================================
// TOAST
// ============================================================

export type ToastTone =
  | "success"
  | "info";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

// ============================================================
// OVERVIEW DETAILS
// ============================================================

export type OverviewDetailKey =
  | "present"
  | "absent"
  | "earlyIn"
  | "lateIn"
  | "earlyOut"
  | "overstay";

// ============================================================
// OVERVIEW STAT
// ============================================================

export interface OverviewStat {
  label: string;
  value: string;
  total: string;
  percent: number;
  icon: ReactNode;
  barColor: string;
  valueColor: string;
}

// ============================================================
// PUNCH ROW
// ============================================================
//
// UI representation of a PunchRecord.
// Backend raw punch type is IN / OUT.
// ============================================================

export interface PunchRow {
  time: string;
  type: PunchType;
  source: string;
  approverStatus?: string;
}

// ============================================================
// TABLE ROW
// ============================================================

export interface RowDef {
  label: string;
  render: (record: AttendanceDay) => ReactNode;
}

// ============================================================
// OVERVIEW DETAIL CONFIG
// ============================================================

export interface OverviewDetailConfig {
  title: string;
  columns: string[];
}

// ============================================================
// ATTENDANCE DROPDOWN
// ============================================================

export interface AttendanceDropdownProps {
  trigger: (
    open: boolean,
    toggle: () => void,
  ) => ReactNode;

  children: ReactNode;

  align?: "left" | "right";

  widthClass?: string;
}

export interface AttendanceDropdownItemProps {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}

// ============================================================
// EMPTY STATE
// ============================================================

export interface EmptyStateIllustrationsProps {
  type?: "empty" | "confused";
}

// ============================================================
// ATTENDANCE FILTERS
// ============================================================

export interface AttendanceFiltersProps {
  selectedDate: number;

  employees: Employee[];

  reportingEmployeesLoading?: boolean;

  selectedEmployee: Employee | null;

  managerEmployee?: Employee | null;

  onEmployeeChange: (
    employee: Employee,
  ) => void;

  selectedMonthNumber: number;

  selectedYear: number;

  assignedShift: string;

  workedShift: string;

  assignedPolicy: string;

  assignedPattern: string;

  processed: boolean;

  processedAt: string | null;

  processMenuOpen: boolean;

  days: AttendanceDay[];

  onDateChange: (
    date: number,
  ) => void;

  onShiftChange: (
    value: string,
  ) => void;

  onWorkedShiftChange: (
    value: string,
  ) => void;

  onPolicyChange: (
    value: string,
  ) => void;

  onPatternChange: (
    value: string,
  ) => void;

  onProcessClick: () => void;

  onReprocess: () => void;

  onUndoProcess: () => void;

  onExport: () => void;

  onProcessMenuOpenChange: (
    open: boolean,
  ) => void;
}

// ============================================================
// ATTENDANCE TABLE
// ============================================================

export interface AttendanceTableProps {
  days: AttendanceDay[];

  view: AttendanceView;

  selectedDate: number;

  onSelectDate: (
    date: number,
  ) => void;

  onInfo: (
    message: string,
  ) => void;
}

// ============================================================
// MONTHLY OVERVIEW
// ============================================================

export interface MonthlyOverviewProps {
  selectedMonth: string;

  overview: AttendanceOverviewData;

  overviewStats: OverviewStat[];

  onOpenDetail: (
    key: OverviewDetailKey,
  ) => void;
}

// ============================================================
// PUNCH DETAILS
// ============================================================

export interface PunchDetailsProps {
  selectedDate: number;

  selectedMonthNumber: number;

  selectedYear: number;

  activeDay?: AttendanceDay;

  punchTab: PunchTab;

  punches: PunchRow[];

  onPunchTabChange: (
    tab: PunchTab,
  ) => void;
}

// ============================================================
// REQUEST STATUS
// ============================================================
//
// Kept for the current UI.
// The actual request API has not been supplied yet.
// ============================================================

export interface RequestStatusProps {
  onRaiseRequest: () => void;
}

// ============================================================
// TOAST STACK
// ============================================================

export interface ToastStackProps {
  toasts: Toast[];

  onDismiss: (
    id: number,
  ) => void;
}

// ============================================================
// TA INSIGHTS
// ============================================================
//
// We will later add API-derived attendance data here.
// Static weeklyHours / insightBreakdown are removed.
// ============================================================

export interface TAInsightsProps {
  employeeName: string;

  month: string;

  days: AttendanceDay[];
}