import { baseApi } from "@/app/baseApi";

import type {
  AttendanceSummary,
  EmployeePunchDashboardResponse,
  EmployeeProfile,
  PunchDashboardParams,
  PunchRecord,
  RawPunch,
  ReportingEmployee,
} from "../types/punch.types";
import { PUNCH_VIEW_TYPE } from "../constants/punch.constants";

type ApiRecord = Record<string, unknown>;

interface DashboardResponse {
  employeeProfile?: unknown[];
  attendanceSummary?: unknown[];
  punchRecords?: unknown[];
}

function getValue(record: ApiRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key];
    }
  }

  return undefined;
}

function getResponseData(result: unknown): unknown {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    return result;
  }

  const data = (result as ApiRecord).data;
  return data !== undefined ? data : result;
}

function normalizeReportingEmployee(record: ApiRecord): ReportingEmployee {
  const employeeInternalId = getValue(record, [
    "employeeInternalId",
    "EmployeeInternalID",
    "EmployeeInternalId",
  ]);
  const employeeCode = getValue(record, [
    "employeeCode",
    "EmployeeCode",
    "employeeId",
    "EmployeeId",
    "EmployeeID",
  ]);
  const employeeName = getValue(record, [
    "employeeName",
    "EmployeeName",
    "name",
    "Name",
  ]);

  return {
    ...record,
    employeeId: String(employeeCode ?? "").trim(),
    employeeCode: employeeCode == null ? null : String(employeeCode).trim(),
    employeeInternalId: employeeInternalId == null ? null : String(employeeInternalId),
    employeeName: String(employeeName ?? ""),
    companyId: Number(getValue(record, ["companyId", "CompanyId", "CompanyID"])) || null,
    designation: String(getValue(record, ["designation", "Designation"]) ?? ""),
    department: String(getValue(record, ["department", "Department"]) ?? ""),
  } as ReportingEmployee;
}

function normalizeEmployeeProfile(record: ApiRecord): EmployeeProfile {
  return {
    ...record,
    employeeId: String(getValue(record, ["employeeId", "EmployeeId", "EmployeeID", "EmployeeCode"]) ?? ""),
    employeeName: String(getValue(record, ["employeeName", "EmployeeName", "name", "Name"]) ?? ""),
    reportingAuthorityName: String(getValue(record, ["reportingAuthorityName", "ReportingAuthority", "ReportingAuthorityName"]) ?? ""),
    policyName: String(getValue(record, ["policyName", "PolicyName"]) ?? ""),
    doublePunchPolicy: String(getValue(record, ["doublePunchPolicy", "PunchTypeRule"]) ?? ""),
    shiftName: String(getValue(record, ["shiftName", "CurrentShiftName"]) ?? ""),
    shiftTiming: String(getValue(record, ["shiftTiming", "ShiftTiming"]) ?? ""),
  } as EmployeeProfile;
}

function normalizeAttendance(record: ApiRecord): AttendanceSummary {
  return {
    ...record,
    date: String(getValue(record, ["FormattedDate", "AttendanceDate", "Date", "date"]) ?? ""),
    shift: String(getValue(record, ["Shift", "shift"]) ?? ""),
    firstHalf: String(getValue(record, ["FirstHalf", "firstHalf"]) ?? ""),
    secondHalf: String(getValue(record, ["SecondHalf", "secondHalf"]) ?? ""),
    dayStatus: String(getValue(record, ["DayStatus", "dayStatus"]) ?? ""),
  } as AttendanceSummary;
}

function normalizePunchRecord(record: ApiRecord): PunchRecord {
  const directionValue = getValue(record, ["direction", "Direction"]);
  const direction =
    typeof directionValue === "string" && directionValue.toUpperCase() === "OUT"
      ? "OUT"
      : Number(record.PunchType) === 2
        ? "OUT"
        : "IN";

  return {
    ...record,
    punchId: String(getValue(record, ["PunchID", "PunchId", "punchId"]) ?? ""),
    direction,
    originalTime: String(getValue(record, ["OriginalTime", "originalTime"]) ?? ""),
    correctedTime: String(getValue(record, ["CorrectedTime", "correctedTime", "OriginalTime"]) ?? ""),
    remarks: String(getValue(record, ["Remarks", "remarks"]) ?? ""),
    location: String(getValue(record, ["LocationAddress", "Location", "location"]) ?? ""),
    latitude: null,
    longitude: null,
    device: String(getValue(record, ["Device", "device", "CaptureSource"]) ?? ""),
    punchDate: (getValue(record, ["PunchDate", "punchDate"]) as string | null | undefined) ?? null,
  } as PunchRecord;
}

function normalizeDashboard(result: unknown): EmployeePunchDashboardResponse {
  const data = getResponseData(result) as DashboardResponse;

  return {
    employeeProfile: Array.isArray(data?.employeeProfile)
      ? data.employeeProfile.map((item) => normalizeEmployeeProfile(item as ApiRecord))
      : [],
    attendanceSummary: Array.isArray(data?.attendanceSummary)
      ? data.attendanceSummary.map((item) => normalizeAttendance(item as ApiRecord))
      : [],
    punchRecords: Array.isArray(data?.punchRecords)
      ? data.punchRecords.map((item) => normalizePunchRecord(item as ApiRecord))
      : [],
  };
}

export const punchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReportingEmployees: builder.query<ReportingEmployee[], void>({
      query: () => ({
        url: "/review/reporting-employees",
        method: "GET",
      }),
      transformResponse: (result: unknown) => {
        const data = getResponseData(result);
        return Array.isArray(data)
          ? data.map((item) => normalizeReportingEmployee(item as ApiRecord))
          : [];
      },
      providesTags: [{ type: "Punch", id: "REPORTING_EMPLOYEES" }],
    }),

    getEmployeePunchDashboard: builder.query<
      EmployeePunchDashboardResponse,
      PunchDashboardParams
    >({
      query: ({ employeeId, selectedDate, viewType }) => ({
        url: "/review/employeepunchdashboard",
        method: "POST",
        body: {
          employeeId: String(employeeId).trim(),
          selectedDate,
          viewType: viewType || PUNCH_VIEW_TYPE,
        },
      }),
      transformResponse: normalizeDashboard,
      providesTags: [{ type: "Punch", id: "PUNCH_DASHBOARD" }],
    }),

    getEmployeeRawPunches: builder.query<
      RawPunch[],
      { employeeId: string; date?: string }
    >({
      query: ({ employeeId, date }) => ({
        url: "/review/employeerawpunches",
        method: "POST",
        body: {
          employeeId: String(employeeId).trim(),
          date,
        },
      }),
      transformResponse: (result: unknown) => {
        const data = getResponseData(result);
        return Array.isArray(data) ? (data as RawPunch[]) : [];
      },
      providesTags: [{ type: "Punch", id: "RAW_PUNCHES" }],
    }),
  }),
});

export const {
  useGetReportingEmployeesQuery,
  useGetEmployeePunchDashboardQuery,
  useGetEmployeeRawPunchesQuery,
} = punchApi;
