export type AttendanceType = "Daily" | "Weekly" | "Monthly" | "Shift Based";

export interface AttendanceConfig {
  Id: number;
  Name: string;
  ShortName: string;
  SalaryCalendarDays: string; // e.g. "Actual days/Month"
  AttendanceType: AttendanceType;
  Independent: boolean;
  OtEnable: boolean;
  LateInEarlyOutEnable: boolean;
  Active: boolean;
}
