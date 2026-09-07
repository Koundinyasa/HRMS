export interface CreateAttendance {
  attendanceName: string;
  shortName: string;
  salaryCalendarDayId: number;
  attendanceTypeId: number;
  independent: boolean;
  ot2Enable: boolean;
  overtime: boolean;
  lateInEarlyOut: boolean;
}

export interface AttendanceIntegration {
  description: string;
  integrationTypeId: number;
  url?: string;
  userName?: string;
  password?: string;
  applicableAttendanceId: number;
  present?: string;
  absent?: string;
  weeklyOff?: string;
  holiday?: string;
  skipHolidays?: boolean;
  autoIntegrationHours?: number;
  calculateOTId?: number;
  refNo?: string;
  processDate?: string;
  firstHalf?: string;
  secondHalf?: string;
  otUnits?: string;
}

export interface ReconcileLeaveEmployee {
  employeeId: number;
  date: string;
}

export interface ReconcileLeaveUpdate {
  leaveTypeId: number;
  employees: ReconcileLeaveEmployee[];
}