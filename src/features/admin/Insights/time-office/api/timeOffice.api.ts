// import type { TimeOfficeReport } from "../types/timeOffice.types";

// export const getTimeOfficeReports = async (): Promise<TimeOfficeReport[]> => {
//   return [];
// };

import { TIME_OFFICE_ENDPOINTS } from "./timeOffice.endpoints";

const API_BASE_URL = "http://localhost:3001/api";

const get = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Time Office data: ${response.status}`
    );
  }

  return response.json();
};

// Day-Wise Attendance
export const getLateIn = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.lateIn);

export const getEarlyOut = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.earlyOut);

export const getEarlyIn = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.earlyIn);

export const getLateOut = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.lateOut);

export const getInOutPunch = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.inOutPunch);

export const getOverTime = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.overTime);

export const getAttendanceStatus = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.attendanceStatus);

export const getWorkHours = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.workHours);

export const getWeekOff = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.weekOff);

export const getAbsentStatus = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWiseAttendance.absentStatus);

// Monthly Attendance
export const getMonthlyLateIn = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.lateIn);

export const getMonthlyEarlyOut = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.earlyOut);

export const getMonthlyEarlyIn = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.earlyIn);

export const getMonthlyLateOut = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.lateOut);

export const getMonthlyOverTime = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.overTime);

export const getMonthlyWorkHours = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.workHours);

export const getMonthlyAttendanceStatus = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.attendanceStatus);

export const getMonthlyShift = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.monthlyShift);

export const getMonthlyOverview = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.monthlyOverview);

export const getContinuousAbsentDays = () =>
  get(TIME_OFFICE_ENDPOINTS.monthlyAttendance.continuousAbsentDays);

// Day-Wise Reports
export const getDayWiseSummary = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.summary);

export const getDayWiseDetailed = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.detailed);

export const getAttendanceRegister = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.attendanceRegister);

export const getDayWiseEmployeeShift = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.employeeShift);

export const getEmployeeDaySummary = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.employeeDaySummary);

export const getEmployeeCWDetails = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.employeeCWDetails);

export const getEmployeeDayWiseOverview = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.employeeDayWiseOverview);

// TA Employee Reports
export const getAssignedShift = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.assignedShift);

export const getAssignedTempShift = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.assignedTempShift);

export const getAssignedPattern = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.assignedPattern);

export const getAssignedPolicy = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.assignedPolicy);

export const getTemporaryPolicy = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.temporaryPolicy);

export interface EmployeeTADetailsFilters {
  fromDate?: string;
  toDate?: string;
  employeeId?: string;
  employeeName?: string;
}

export const getEmployeeTADetails = (filters: EmployeeTADetailsFilters = {}) => {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const endpoint = TIME_OFFICE_ENDPOINTS.dayWise.employeeTADetails;
  return get(`${endpoint}${query.toString() ? `?${query.toString()}` : ""}`);
};

export const getNonWorkingHours = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.nonWorkingHours);

export const getPenaltyLeaveAdjustment = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.penaltyLeaveAdjustment);

export const getEmployeeBreakSlots = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.employeeBreakSlots);

export const getExceptionReport = () =>
  get(TIME_OFFICE_ENDPOINTS.dayWise.exceptionReport);

// Exceptions
export const getPersonalPermission = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.personalPermission);

export const getOfficialPermission = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.officialPermission);

export const getAutoPermission = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.autoPermission);

export const getDayWiseGrace = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.dayWiseGrace);

export const getMonthlyGrace = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.monthlyGrace);

export const getPunchCorrection = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.punchCorrection);

export const getAttendanceOverride = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.attendanceOverride);

export const getCWAuthorization = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.cwAuthorization);

export const getOTAuthorization = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.otAuthorization);

export const getOTToCWConverted = () =>
  get(TIME_OFFICE_ENDPOINTS.exceptions.otToCwConverted);

// Punch Reports
export const getPunchReport = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.punchReport);

export const getTimeCard = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.timeCard);

export const getPunchEvents = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.punchEvents);

export const getPunchPenalty = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.punchPenalty);

export const getWFHPunch = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.wfhPunch);

export const getWFHPunchSettings = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.wfhPunchSettings);

export const getODPunch = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.odPunch);

export const getMissedPunch = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.missedPunch);

export const getAbsentee = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.absentee);

export const getLocationPunches = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.locationPunches);

export const getLocationPunchesDetails = () =>
  get(TIME_OFFICE_ENDPOINTS.punch.locationPunchesDetails);