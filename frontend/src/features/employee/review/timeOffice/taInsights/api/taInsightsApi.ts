import { baseApi } from "@/app/baseApi";

import type {
  TAInsightsCounts,
  TAInsightsDetailsParams,
  TAInsightsEmployee,
  TAInsightsDashboardResponse,
  TAInsightsParams,
} from "../types/taInsights.types";

type ApiRecord = Record<string, unknown>;

interface CountsResponse {
  totalAbsent?: unknown;
  lopOverride?: unknown;
  leaveAndPunch?: unknown;
  otPendingAuth?: unknown;
  cwPendingAuth?: unknown;
  cwStatus?: unknown;
  overTime?: unknown;
  pendingPermissionPunches?: unknown;
  punchProcessPending?: unknown;
  integrationPending?: unknown;

  [key: string]: unknown;
}

interface DetailsResponse {
  data?: unknown[];
  details?: unknown[];
  employees?: unknown[];
  result?: unknown[];

  [key: string]: unknown;
}

/**
 * Returns the first matching property value.
 */
function getValue(
  record: ApiRecord,
  keys: string[]
): unknown {
  for (const key of keys) {
    if (
      record[key] !== undefined &&
      record[key] !== null
    ) {
      return record[key];
    }
  }

  return undefined;
}

/**
 * Handles APIs returning:
 *
 * {
 *   data: ...
 * }
 *
 * or directly:
 *
 * [...]
 */
function getResponseData(result: unknown): unknown {
  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result)
  ) {
    return result;
  }

  const data = (result as ApiRecord).data;

  return data !== undefined ? data : result;
}

/**
 * Converts unknown value into number.
 */
function getNumber(
  record: ApiRecord,
  keys: string[]
): number {
  const value = getValue(record, keys);

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isNaN(parsed)
      ? 0
      : parsed;
  }

  return 0;
}

/**
 * Normalize TA Insights counts.
 */
function normalizeCounts(
  record: ApiRecord
): TAInsightsCounts {
  return {
    totalAbsent: getNumber(record, [
      "totalAbsent",
      "TotalAbsent",
      "TotalAbsentCount",
      "total_absent",
    ]),

    lopOverride: getNumber(record, [
      "lopOverride",
      "LOPOverride",
      "LopOverride",
      "LOPOverrideCount",
    ]),

    leaveAndPunch: getNumber(record, [
      "leaveAndPunch",
      "LeaveAndPunch",
      "LeavePunch",
      "LeaveAndPunchCount",
    ]),

    otPendingAuth: getNumber(record, [
      "otPendingAuth",
      "OTPendingAuth",
      "OtPendingAuth",
      "OTPendingAuthorization",
    ]),

    cwPendingAuth: getNumber(record, [
      "cwPendingAuth",
      "CWPendingAuth",
      "CwPendingAuth",
      "CWPendingAuthorization",
    ]),

    cwStatus: getNumber(record, [
      "cwStatus",
      "CWStatus",
      "CWStatusCount",
    ]),

    overTime: getNumber(record, [
      "overTime",
      "OverTime",
      "Overtime",
      "OverTimeCount",
    ]),

    pendingPermissionPunches: getNumber(record, [
      "pendingPermissionPunches",
      "PendingPermissionPunches",
      "PendingPermissionPunch",
      "PermissionPunchPending",
    ]),

    punchProcessPending: getNumber(record, [
      "punchProcessPending",
      "PunchProcessPending",
      "PunchProcessPendingCount",
    ]),

    integrationPending: getNumber(record, [
      "integrationPending",
      "IntegrationPending",
      "IntegrationPendingCount",
    ]),
  };
}

/**
 * Normalize employee details.
 */
function normalizeTAInsightEmployee(
  record: ApiRecord
): TAInsightsEmployee {
  return {
    ...record,

    empId: String(
      getValue(record, [
        "empId",
        "EmpId",
        "EmpID",
        "EmployeeId",
        "EmployeeID",
        "employeeId",
      ]) ?? ""
    ).trim(),

    empName: String(
      getValue(record, [
        "empName",
        "EmpName",
        "EmployeeName",
        "employeeName",
        "Name",
      ]) ?? ""
    ).trim(),

    date: String(
      getValue(record, [
        "date",
        "Date",
        "AttendanceDate",
        "PunchDate",
        "FormattedDate",
      ]) ?? ""
    ).trim(),

    firstPunch: String(
      getValue(record, [
        "firstPunch",
        "FirstPunch",
        "FirstPunchTime",
        "FirstPunchTimeFormatted",
      ]) ?? ""
    ).trim(),

    lastPunch: String(
      getValue(record, [
        "lastPunch",
        "LastPunch",
        "LastPunchTime",
        "LastPunchTimeFormatted",
      ]) ?? ""
    ).trim(),

    workHours: String(
      getValue(record, [
        "workHours",
        "WorkHours",
        "TotalWorkHours",
        "WorkingHours",
      ]) ?? ""
    ).trim(),

    attendanceStatus: String(
      getValue(record, [
        "attendanceStatus",
        "AttendanceStatus",
        "Status",
        "DayStatus",
      ]) ?? ""
    ).trim(),
  } as TAInsightsEmployee;
}

/**
 * Normalize counts API response.
 */
function normalizeCountsResponse(
  result: unknown
): TAInsightsCounts {
  const responseData = getResponseData(result);
  const data = Array.isArray(responseData)
    ? responseData[0]
    : responseData;

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data)
  ) {
    return {
      totalAbsent: 0,
      lopOverride: 0,
      leaveAndPunch: 0,
      otPendingAuth: 0,
      cwPendingAuth: 0,
      cwStatus: 0,
      overTime: 0,
      pendingPermissionPunches: 0,
      punchProcessPending: 0,
      integrationPending: 0,
    };
  }

  return normalizeCounts(
    data as ApiRecord
  );
}

/**
 * Normalize details API response.
 */
function normalizeDetailsResponse(
  result: unknown
): TAInsightsEmployee[] {
  const data = getResponseData(result);

  if (Array.isArray(data)) {
    return data.map((item) =>
      normalizeTAInsightEmployee(
        item as ApiRecord
      )
    );
  }

  if (
    data &&
    typeof data === "object"
  ) {
    const response =
      data as DetailsResponse;

    const list =
      response.data ??
      response.details ??
      response.employees ??
      response.result;

    if (Array.isArray(list)) {
      return list.map((item) =>
        normalizeTAInsightEmployee(
          item as ApiRecord
        )
      );
    }
  }

  return [];
}

/**
 * Optional combined normalizer.
 */
function normalizeDashboard(
  counts: TAInsightsCounts,
  details: TAInsightsEmployee[]
): TAInsightsDashboardResponse {
  return {
    counts,
    details,
  };
}

export const taInsightsApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({

      /**
       * TA Insights dashboard counts
       *
       * POST /review/employeedashboardcounts
       */
      getTAInsightsCounts: builder.query<
        TAInsightsCounts,
        TAInsightsParams
      >({
        query: ({ fromDate, toDate }) => ({
          url: "/review/employeedashboardcounts",
          method: "POST",
          body: {
            fromDate,
            toDate,
          },
        }),

        transformResponse:
          normalizeCountsResponse,

        providesTags: [
          {
            type: "TAInsights",
            id: "COUNTS",
          },
        ],
      }),

      /**
       * TA Insights employee details
       *
       * POST /review/employeedashboarddetails
       */
      getTAInsightsDetails: builder.query<
        TAInsightsEmployee[],
        TAInsightsDetailsParams
      >({
        query: ({ insightId, fromDate, toDate }) => ({
          url: "/review/employeedashboarddetails",
          method: "POST",
          body: {
            insightId,
            fromDate,
            toDate,
          },
        }),

        transformResponse:
          normalizeDetailsResponse,

        providesTags: [
          {
            type: "TAInsights",
            id: "DETAILS",
          },
        ],
      }),
    }),
  });

export const {
  useGetTAInsightsCountsQuery,
  useGetTAInsightsDetailsQuery,
} = taInsightsApi;