import type { AttendanceConfig } from "../types/attendance.types";

export const ATTENDANCE_SECTION_PATH = "admin-center/classifications/attendance";

export const DEFAULT_ATTENDANCE_CONFIGS: AttendanceConfig[] = [
  {
    Id: 1,
    Name: "Daily",
    ShortName: "Daily",
    SalaryCalendarDays: "Actual days/Month",
    AttendanceType: "Daily",
    Independent: false,
    OtEnable: false,
    LateInEarlyOutEnable: false,
    Active: true,
  },
];

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
