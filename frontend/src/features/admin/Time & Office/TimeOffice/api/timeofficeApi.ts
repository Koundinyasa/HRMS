import { baseApi } from "@/app/baseApi";
import type {
  AttendanceOverviewPoint,
  DashboardSummary,
  DateRange,
  EmployeeRawPunch,
  EmployeeRawPunchesRequest,
  GeoLocationBody,
  HoursPoint,
  IrregularityClassification,
  IrregularityPoint,
  PendingRequest,
  PolicySummary,
  ProcessDrilldownRow,
  ProcessHistoryEntry,
  ProcessSummary,
  PunchMetric,
  PunchModeSlice,
  PunchPeriod,
  PunchRecord,
  PunchRequestsSummary,
  ShiftMasterBody,
  TaInsightsQuery,
  ShiftMasterRow,
  TimeOfficeEmployee,
  WorkingHoursPoint,
} from "../types/timeoffice.types";

const PUNCH_PROCESS_BASE = "admin/timeattendance/timeoffice/punchprocess";
const BASE = `${PUNCH_PROCESS_BASE}/dashboard`;
const PROCESS_BASE = `${PUNCH_PROCESS_BASE}/process`;
const PUNCH_TAB_BASE = "admin/timeattendance/timeoffice/punchprocess/punch";
const ATT_OVERVIEW_BASE = "admin/timeattendance/timeoffice/punchprocess/attendanceoverview";
const PUNCH_IMPORT_BASE = "admin/timeattendance/timeoffice/punchprocess/import";
const ASSIGN_BASE = "admin/timeattendance/timeoffice/assign";
const MASTERS_BASE = "admin/timeattendance/timeoffice/masters";
const POLICY_BASE = `${MASTERS_BASE}/policy`;
const SHIFT_PATTERN_BASE = `${MASTERS_BASE}/shiftpattern`;
const SHIFT_MASTER_BASE = `${MASTERS_BASE}/shiftmaster`;
const GEO_MASTER_BASE = `${MASTERS_BASE}/geolocation`;
const SETTINGS_BASE = "admin/timeattendance/timeoffice/settings";

const timeOfficeAuthHeaders = () => {
  const token = typeof localStorage === "undefined"
    ? null
    : localStorage.getItem("hrms_auth_accessToken") ?? localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

/** Backend hasn't published field names for these policy/settings DTOs yet, so they pass through as-is. */
type PolicyDto = Record<string, unknown>;

const normalizeFieldName = (field: string) => field.replace(/[^a-z0-9]/gi, "").toLowerCase();

const getRecordValue = (record: Record<string, unknown>, candidates: string[]) => {
  const candidateNames = new Set(candidates.map(normalizeFieldName));
  const key = Object.keys(record).find((field) => candidateNames.has(normalizeFieldName(field)));
  return key ? record[key] : undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapResponse = (raw: unknown): unknown => {
  let value = raw;
  const envelopeNames = new Set(["data", "result", "results", "items", "records", "rows", "value"]);

  for (let depth = 0; depth < 4 && isRecord(value); depth += 1) {
    const key = Object.keys(value).find((name) => envelopeNames.has(normalizeFieldName(name)));
    if (!key || value[key] === null || value[key] === undefined) break;
    value = value[key];
  }

  return value;
};

const getTextValue = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);

const getCount = (record: Record<string, unknown>, candidates: string[]) => {
  const value = getRecordValue(record, candidates);
  const count = typeof value === "number" ? value : Number(value);
  return Number.isFinite(count) ? count : 0;
};

const toRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;

const toRows = (value: unknown): Record<string, unknown>[] => {
  const unwrapped = unwrapResponse(value);
  if (Array.isArray(unwrapped)) return unwrapped.filter(isRecord);
  const record = toRecord(unwrapped);
  if (!record) return [];
  for (const key of ["data", "result", "recordset", "items", "rows"]) {
    if (Array.isArray(record[key])) return (record[key] as unknown[]).filter(isRecord);
  }
  return [];
};

const toProcessDrilldownRows = (value: unknown): ProcessDrilldownRow[] =>
  toRows(value).map((row) =>
    Object.fromEntries(
      Object.entries(row).filter(
        ([, fieldValue]) =>
          typeof fieldValue === "string" || typeof fieldValue === "number",
      ),
    ) as ProcessDrilldownRow,
  );

const mapDashboardCounts = (
  response: unknown,
  period: PunchPeriod,
): DashboardSummary => {
  const envelope = toRecord(unwrapResponse(response)) ?? {};
  const selected = toRecord(getRecordValue(envelope, [period])) ?? {};
  const counts: Partial<Record<PunchMetric, number>> = {
    "yet-to-login": getCount(selected, ["yetToLogin", "yetToLoginCount", "yetToLoginEmployees", "employeesYetToLogin"]),
    "logged-in": getCount(selected, ["loggedIn", "loggedInCount", "loggedInEmployees", "employeesLoggedIn"]),
    present: getCount(selected, ["present", "presentCount", "presentEmployees", "presentEmployeeCount"]),
    absent: getCount(selected, ["absent", "absentCount", "absentEmployees", "absentEmployeeCount"]),
    "late-in": getCount(selected, ["lateIn", "lateInCount", "lateInEmployees"]),
    "early-in": getCount(selected, ["earlyIn", "earlyInCount", "earlyInEmployees"]),
    "early-out": getCount(selected, ["earlyOut", "earlyOutCount", "earlyOutEmployees"]),
    "on-leave": getCount(selected, ["onLeave", "onLeaveCount", "onLeaveEmployees", "leaveCount"]),
    "week-off": getCount(selected, ["weekOff", "weekOffCount", "weekOffEmployees"]),
    holiday: getCount(selected, ["holiday", "holidayCount", "holidayEmployees", "generalHoliday"]),
  };

  return {
    totalEmployees: getCount(selected, ["totalEmployees", "totalEmployeeCount", "employeeCount", "totalStaff"]),
    latestPunchIntegratedAt: formatDashboardTimestamp(getRecordValue(selected, ["latestPunchIntegratedAt", "latestPunchDateTime", "latestPunchTime", "lastPunchIntegratedAt", "lastIntegratedAt"])),
    selectedDate: getTextValue(getRecordValue(selected, ["selectedDate", "attendanceDate", "date"])) || undefined,
    counts,
  };
};

const toMinutes = (value: unknown): number => {
  if (typeof value === "number") return value;
  const text = getTextValue(value).trim();
  if (!text) return 0;
  if (text.includes(":")) {
    const [hours, minutes] = text.split(":").map(Number);
    return Number.isFinite(hours) && Number.isFinite(minutes) ? hours * 60 + minutes : 0;
  }
  const number = Number(text);
  return Number.isFinite(number) ? number : 0;
};

const formatDashboardDate = (value: unknown) => {
  const text = getTextValue(value);
  // The irregularity stored procedure already returns dates as `dd MMM`.
  if (/^\d{1,2}\s+[a-z]{3}$/i.test(text)) return text;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(text);
  return Number.isNaN(date.getTime())
    ? text
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const formatDashboardTimestamp = (value: unknown) => {
  const text = getTextValue(value).trim();
  if (!text) return undefined;
  const date = new Date(text);
  return Number.isNaN(date.getTime())
    ? text
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const mapPunchEmployee = (record: Record<string, unknown>): PunchRecord => ({
  employeeId: getTextValue(getRecordValue(record, ["employeeId", "employeeCode", "employeeNo", "empId", "code"])),
  employeeName: getTextValue(getRecordValue(record, ["employeeName", "employeeFullName", "employeeDisplayName", "fullName", "name"])),
  shiftAssigned: getTextValue(getRecordValue(record, ["shiftAssigned", "shiftName", "shiftCode"])),
  shiftStartTime: getTextValue(getRecordValue(record, ["shiftStartTime", "shiftStart", "startTime"])),
  shiftEndTime: getTextValue(getRecordValue(record, ["shiftEndTime", "shiftEnd", "endTime"])),
  checkInTime: getTextValue(getRecordValue(record, ["checkInTime", "checkIn", "inTime", "firstIn"])) || undefined,
  checkOutTime: getTextValue(getRecordValue(record, ["checkOutTime", "checkOut", "outTime", "lastOut"])) || undefined,
  leaveStatus: getTextValue(getRecordValue(record, ["leaveStatus", "leaveType", "leaveName"])) || undefined,
  isWeekOff: Boolean(getRecordValue(record, ["isWeekOff", "weekOff"])),
  isHoliday: Boolean(getRecordValue(record, ["isHoliday", "holiday", "generalHoliday"])),
  punchMode: getTextValue(getRecordValue(record, ["punchMode", "mode", "punchSource"])) as PunchRecord["punchMode"],
  department: getTextValue(getRecordValue(record, ["department", "departmentName"])),
  team: getTextValue(getRecordValue(record, ["team", "teamName"])),
  branch: getTextValue(getRecordValue(record, ["branch", "branchName"])),
  salaryStructure: getTextValue(getRecordValue(record, ["salaryStructure", "salaryStructureName"])),
  leavePolicy: getTextValue(getRecordValue(record, ["leavePolicy", "leavePolicyName"])),
  attendance: getTextValue(getRecordValue(record, ["attendance", "attendanceType"])),
  designation: getTextValue(getRecordValue(record, ["designation", "designationName"])),
  costCenter: getTextValue(getRecordValue(record, ["costCenter", "costCenterName"])),
  taPolicy: getTextValue(getRecordValue(record, ["taPolicy", "attendancePolicy"])),
  pattern: getTextValue(getRecordValue(record, ["pattern", "shiftPattern"])),
  taSupervisor: getTextValue(getRecordValue(record, ["taSupervisor", "supervisor", "supervisorName"])),
});

const mapProcessSummary = (rows: Record<string, unknown>[]): ProcessSummary => {
  const cardKeys: Record<string, keyof ProcessSummary> = {
    "timeattendance": "timeAttendance",
    "nontimeattendance": "nonTimeAttendance",
    "missedpunch": "missedPunch",
    "shiftunassigned": "shiftUnassigned",
    "processed": "processed",
    "yettoprocess": "yetToProcess",
    "reprocesseffectivedate": "reProcessEffectiveDate",
    "allreprocess": "allReProcess",
  };
  const summary: ProcessSummary = {
    timeAttendance: 0,
    nonTimeAttendance: 0,
    missedPunch: 0,
    shiftUnassigned: 0,
    processed: 0,
    yetToProcess: 0,
    reProcessEffectiveDate: 0,
    allReProcess: 0,
  };

  for (const row of rows) {
    const cardName = normalizeFieldName(String(getRecordValue(row, ["CardName"]) ?? ""));
    const key = cardKeys[cardName];
    if (key) summary[key] = getCount(row, ["Count"]);
  }

  if (rows.some((row) => getRecordValue(row, ["CardName"]) !== undefined)) {
    return summary;
  }

  const record = rows[0] ?? {};
  return {
    timeAttendance: getCount(record, ["timeAttendance", "timeAttendanceCount", "totalTimeAttendance"]),
    nonTimeAttendance: getCount(record, ["nonTimeAttendance", "nonTimeAttendanceCount", "totalNonTimeAttendance"]),
    missedPunch: getCount(record, ["missedPunch", "missedPunchCount", "totalMissedPunch"]),
    shiftUnassigned: getCount(record, ["shiftUnassigned", "shiftUnassignedCount", "unassignedShiftCount"]),
    processed: getCount(record, ["processed", "processedCount", "totalProcessed"]),
    yetToProcess: getCount(record, ["yetToProcess", "yetToProcessCount", "pendingProcessCount"]),
    reProcessEffectiveDate: getCount(record, ["reProcessEffectiveDate", "reProcessEffectiveDateCount"]),
    allReProcess: getCount(record, ["allReProcess", "allReProcessCount", "reProcessCount"]),
  };
};

const mapProcessHistory = (rows: Record<string, unknown>[]): ProcessHistoryEntry[] =>
  rows.map((record, index) => {
    const fromDate = String(getRecordValue(record, ["fromDate", "startDate"]) ?? "");
    const toDate = String(getRecordValue(record, ["toDate", "tillDate", "endDate"]) ?? fromDate);
    const processedOn = String(getRecordValue(record, ["processedOn", "processDate", "createdOn", "processedAt"]) ?? "");
    const rawStatus = String(getRecordValue(record, ["status", "processStatus", "statusName"]) ?? "").toLowerCase();
    const status: ProcessHistoryEntry["status"] =
      rawStatus.includes("complete") || rawStatus.includes("success") || rawStatus === "processed"
        ? "Completed"
        : rawStatus.includes("fail") || rawStatus.includes("error")
          ? "Failed"
          : rawStatus.includes("process") || rawStatus.includes("running") || rawStatus.includes("pending")
            ? "Processing"
            : "Unknown";

    return {
      id: String(getRecordValue(record, ["id", "processId", "historyId"]) ?? `${fromDate}-${toDate}-${index}`),
      rangeLabel: fromDate && toDate ? `${fromDate} to ${toDate}` : fromDate || toDate || "Process history",
      processedOn,
      status,
    };
  });

export const timeofficeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getTimeOfficeDashboardSummary: builder.query<DashboardSummary, PunchPeriod>({
      query: () => ({ url: `${BASE}/counts`, headers: timeOfficeAuthHeaders() }),
      transformResponse: (response: unknown, _meta, period) => mapDashboardCounts(response, period),
      providesTags: [{ type: "TimeOffice", id: "SUMMARY" }],
    }),

    /** Detail lists use the matching company-scoped DB endpoint for each KPI. */
    getDashboardEmployees: builder.query<PunchRecord[], { metric: PunchMetric; period: PunchPeriod; selectedDate?: string }>({
      query: ({ metric, period, selectedDate }) => {
        const fallbackDate = new Date();
        if (period === "yesterday") fallbackDate.setDate(fallbackDate.getDate() - 1);
        const localDate = `${fallbackDate.getFullYear()}-${String(fallbackDate.getMonth() + 1).padStart(2, "0")}-${String(fallbackDate.getDate()).padStart(2, "0")}`;
        const attendanceDate = selectedDate?.match(/^\d{4}-\d{2}-\d{2}$/)
          ? selectedDate
          : localDate;
        const routes: Record<PunchMetric, { path: string; dateParam?: string }> = {
          "yet-to-login": { path: `${BASE}/yet-to-login` },
          "logged-in": { path: `${BASE}/logged-in-employees` },
          present: { path: `${BASE}/yesterday-present-employees`, dateParam: "date" },
          absent: { path: `${PUNCH_PROCESS_BASE}/yesterday-absent-employees` },
          "late-in": { path: `${BASE}/late-in-employees`, dateParam: "date" },
          "early-in": { path: `${BASE}/early-in-employees`, dateParam: "date" },
          "early-out": { path: `${BASE}/early-out-employees`, dateParam: "date" },
          "on-leave": { path: `${BASE}/on-leave-employees`, dateParam: "fromDate" },
          "week-off": { path: `${PUNCH_PROCESS_BASE}/holiday-weekoff-employees`, dateParam: "date" },
          holiday: { path: `${PUNCH_PROCESS_BASE}/holiday-weekoff-employees`, dateParam: "date" },
        };
        const route = routes[metric];
        return {
          url: route.path,
          params: {
            [route.dateParam ?? "attendanceDate"]: attendanceDate,
            ...(metric === "week-off" ? { type: 4 } : {}),
            ...(metric === "holiday" ? { type: 5 } : {}),
          },
        };
      },
      transformResponse: (response: unknown) => toRows(response).map(mapPunchEmployee),
      providesTags: (_result, _error, { metric }) => [{ type: "TimeOffice", id: metric }],
    }),

    getAttendanceOverview: builder.query<AttendanceOverviewPoint[], void>({
      query: () => `${BASE}/overview`,
      transformResponse: (response: unknown) => {
        const data = toRecord(unwrapResponse(response)) ?? {};
        return toRows(data.attendanceOverview).map((row) => ({
          date: formatDashboardDate(getRecordValue(row, ["date", "attendanceDate"])),
          present: getCount(row, ["present", "presentCount", "presentEmployees"]),
          absent: getCount(row, ["absent", "absentCount", "absentEmployees"]),
          leave: getCount(row, ["leave", "leaveCount", "onLeave"]),
          weekOff: getCount(row, ["weekOff", "weekOffCount"]),
          generalHoliday: getCount(row, ["generalHoliday", "holiday", "holidayCount"]),
        }));
      },
      providesTags: [{ type: "TimeOffice", id: "OVERVIEW" }],
    }),

    getPunchModeDistribution: builder.query<PunchModeSlice[], PunchPeriod>({
      query: () => ({ url: `${BASE}/overview`, headers: timeOfficeAuthHeaders() }),
      transformResponse: (response: unknown) => {
        const unwrapped = unwrapResponse(response);
        const data = toRecord(unwrapped);
        const distribution = data
          ? getRecordValue(data, ["punchModeDistribution", "modeDistribution"])
          : unwrapped;

        return toRows(distribution).map((row) => ({
          mode: getTextValue(getRecordValue(row, ["mode", "punchMode", "punchModeName", "punchType", "name"])),
          count: getCount(row, ["count", "employeeCount", "total", "totalCount", "punchCount", "punchModeCount"]),
        }));
      },
      providesTags: [{ type: "TimeOffice", id: "PUNCH_MODE" }],
    }),

    getIrregularities: builder.query<IrregularityPoint[], IrregularityClassification>({
      query: () => ({ url: `${BASE}/late-in-early-out-graph`, headers: timeOfficeAuthHeaders() }),
      transformResponse: (response: unknown) => {
        const data = toRecord(unwrapResponse(response)) ?? {};
        const lateRows = toRows(data.lateIn);
        const earlyRows = toRows(data.earlyOut);
        const points = new Map<string, IrregularityPoint>();
        for (const row of lateRows) {
          const date = formatDashboardDate(getRecordValue(row, ["date", "attendanceDate"]));
          points.set(date, { date, lateIn: getCount(row, ["count", "employeeCount", "lateInCount", "late in"]), earlyOut: 0 });
        }
        for (const row of earlyRows) {
          const date = formatDashboardDate(getRecordValue(row, ["date", "attendanceDate"]));
          const point = points.get(date) ?? { date, lateIn: 0, earlyOut: 0 };
          point.earlyOut = getCount(row, ["count", "employeeCount", "earlyOutCount", "early out"]);
          points.set(date, point);
        }
        return [...points.values()];
      },
      providesTags: [{ type: "TimeOffice", id: "IRREGULARITIES" }],
    }),

    getAverageWorkingHours: builder.query<HoursPoint[], void>({
      query: () => ({ url: `${BASE}/average-ot-work-hours`, headers: timeOfficeAuthHeaders() }),
      transformResponse: (response: unknown) => {
        const data = unwrapResponse(response);
        const rows = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
        return (rows as unknown[]).filter(isRecord).map((row) => ({
          date: formatDashboardDate(getRecordValue(row, ["date", "attendanceDate"])),
          minutes: toMinutes(getRecordValue(row, ["minutes", "averageWorkMinutes", "avgWorkMinutes", "averageWorkHours", "avgWorkHours", "workHours"])),
        }));
      },
      providesTags: [{ type: "TimeOffice", id: "WORK_HOURS" }],
    }),

    getAverageOtHours: builder.query<HoursPoint[], void>({
      query: () => ({ url: `${BASE}/average-ot-work-hours`, headers: timeOfficeAuthHeaders() }),
      transformResponse: (response: unknown) => {
        const data = unwrapResponse(response);
        const rows = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : [];
        return (rows as unknown[]).filter(isRecord).map((row) => ({
          date: formatDashboardDate(getRecordValue(row, ["date", "attendanceDate"])),
          minutes: toMinutes(getRecordValue(row, ["minutes", "averageOtMinutes", "avgOtMinutes", "averageOtHours", "avgOtHours", "otHours", "overTimeHours"])),
        }));
      },
      providesTags: [{ type: "TimeOffice", id: "OT_HOURS" }],
    }),

    getAttendancePolicyShifts: builder.query<{
      attendancePolicies: PolicySummary[];
      shifts: ShiftMasterRow[];
    }, void>({
      query: () => ({
        url: `${PUNCH_PROCESS_BASE}/attendance-policy-shifts`,
        headers: timeOfficeAuthHeaders(),
      }),
      transformResponse: (response: unknown) => {
        const data = toRecord(unwrapResponse(response)) ?? {};
        const attendancePolicies = toRows(getRecordValue(data, ["attendancePolicies", "policies"]))
          .map((row) => ({
            name: getTextValue(getRecordValue(row, ["policyName", "attendancePolicyName", "name"])) || "Attendance Policy",
            effectiveFrom: getTextValue(getRecordValue(row, ["effectiveFrom", "effectiveDate", "startDate"])),
            updatedAgo: getTextValue(getRecordValue(row, ["updatedAgo", "updatedAt", "modifiedAt", "modifiedDate"])),
          }));
        const shifts = toRows(getRecordValue(data, ["shifts", "shiftList"]))
          .map((row) => ({
            shiftCode: getTextValue(getRecordValue(row, ["shiftCode", "code"])),
            shiftName: getTextValue(getRecordValue(row, ["shiftName", "name"])),
            startTime: getTextValue(getRecordValue(row, ["startTime", "shiftStartTime"])),
            endTime: getTextValue(getRecordValue(row, ["endTime", "shiftEndTime"])),
          }));
        return { attendancePolicies, shifts };
      },
      providesTags: [{ type: "TimeOffice", id: "ATTENDANCE_POLICY_SHIFTS" }],
    }),

    getPolicies: builder.query<PolicySummary[], void>({
      query: () => ({ url: `${POLICY_BASE}/attendance`, headers: timeOfficeAuthHeaders() }),
      transformResponse: (response: unknown) => toRows(response).map((row) => ({
        name: getTextValue(getRecordValue(row, ["policyName", "attendanceName", "name"])) || "Attendance Policy",
        effectiveFrom: getTextValue(getRecordValue(row, ["effectiveFrom", "effectiveDate"])),
        updatedAgo: getTextValue(getRecordValue(row, ["updatedAgo", "updatedAt", "modifiedAt"])),
      })),
      providesTags: [{ type: "TimeOffice", id: "POLICIES" }],
    }),

    getPendingRequests: builder.query<PendingRequest[], void>({
      query: () => `${BASE}/pendingrequests`,
      providesTags: [{ type: "TimeOffice", id: "PENDING_REQUESTS" }],
    }),

    getProcessSummary: builder.query<ProcessSummary, DateRange>({
      query: ({ fromDate, tillDate }) => ({
        url: `${BASE}/processing`,
        params: { fromDate, toDate: tillDate },
      }),
      // These endpoints may return a raw recordset or a standard API envelope.
      // Normalize both shapes before mapping so a wrapped response doesn't make
      // RTK Query treat otherwise successful requests as errors.
      transformResponse: (response: unknown) => mapProcessSummary(toRows(response)),
      providesTags: [{ type: "TimeOffice", id: "PROCESS_SUMMARY" }],
    }),

    processAttendance: builder.mutation<void, DateRange>({
      query: (body) => ({ url: PROCESS_BASE, method: "POST", body }),
      invalidatesTags: [
        { type: "TimeOffice", id: "PROCESS_SUMMARY" },
        { type: "TimeOffice", id: "PROCESS_HISTORY" },
      ],
    }),

    getMissedPunch: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({
        url: `${PROCESS_BASE}/missed-punch-employees`,
        params: { fromDate, toDate: tillDate },
      }),
      transformResponse: toProcessDrilldownRows,
      providesTags: [{ type: "TimeOffice", id: "MISSED_PUNCH" }],
    }),

    getShiftUnassigned: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/shiftunassigned`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "SHIFT_UNASSIGNED" }],
    }),

    getYetToProcess: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/yettoprocess`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "YET_TO_PROCESS" }],
    }),

    getProcessed: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/processed`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "PROCESSED" }],
    }),

    getReprocessEffectiveDate: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({
        url: `${PROCESS_BASE}/reprocesseffectivedate`,
        params: { fromDate, tillDate },
      }),
      providesTags: [{ type: "TimeOffice", id: "REPROCESS_EFFECTIVE_DATE" }],
    }),

    getAllReprocess: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/allreprocess`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "ALL_REPROCESS" }],
    }),

    getProcessHistory: builder.query<ProcessHistoryEntry[], DateRange>({
      query: ({ fromDate, tillDate }) => ({
        url: `${PUNCH_PROCESS_BASE}/history`,
        method: "POST",
        body: { fromDate, toDate: tillDate },
      }),
      transformResponse: (response: unknown) => mapProcessHistory(toRows(response)),
      providesTags: [{ type: "TimeOffice", id: "PROCESS_HISTORY" }],
    }),

    getPunchProcessTaInsightsCounts: builder.query<Record<string, unknown>, Pick<TaInsightsQuery, "fromDate" | "toDate">>({
      query: (params) => ({
        url: `${PUNCH_PROCESS_BASE}/employee-dashboard-counts`,
        params,
      }),
      providesTags: [{ type: "TimeOffice", id: "TA_INSIGHTS_SUMMARY" }],
    }),

    getPunchProcessTaInsightsDetails: builder.query<ProcessDrilldownRow[], TaInsightsQuery & { insightId: number }>({
      query: ({ insightId, fromDate, toDate }) => ({
        url: `${PUNCH_PROCESS_BASE}/employee-dashboard-details`,
        params: { insightId, fromDate, toDate },
      }),
      providesTags: [{ type: "TimeOffice", id: "TA_INSIGHTS_DETAILS" }],
    }),

    getPunchRequestsSummary: builder.query<PunchRequestsSummary, void>({
      query: () => `${PROCESS_BASE}/punchrequests`,
      providesTags: [{ type: "TimeOffice", id: "PUNCH_REQUESTS_SUMMARY" }],
    }),

    // ---- Assign ----

    getAssignGeoLocationList: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${ASSIGN_BASE}/geo-location`,
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_GEOLOCATION" }],
    }),

    getAssignLocationOptions: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${ASSIGN_BASE}/geo-location/locations`,
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_LOCATIONS" }],
    }),

    getAssignGeoLocationDetails: builder.query<ProcessDrilldownRow, string>({
      query: (employeeId) => `${ASSIGN_BASE}/geo-location/${employeeId}`,
      providesTags: (_result, _error, employeeId) => [{ type: "TimeOffice", id: `ASSIGN_GEOLOCATION_${employeeId}` }],
    }),

    updateAssignGeoLocation: builder.mutation<void, { employeeIds: string[]; locationId: string; effectiveDate: string }>({
      query: (body) => ({ url: `${ASSIGN_BASE}/geo-location`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "ASSIGN_GEOLOCATION" }],
    }),

    getAssignPolicyList: builder.query<ProcessDrilldownRow[], void>({
      query: () => ({ url: `${ASSIGN_BASE}/policy-update`, headers: timeOfficeAuthHeaders() }),
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_POLICY" }],
    }),

    getAssignPolicyOptions: builder.query<ProcessDrilldownRow[], void>({
      query: () => ({ url: `${ASSIGN_BASE}/policy-update/policies`, headers: timeOfficeAuthHeaders() }),
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_POLICY_OPTIONS" }],
    }),

    updateAssignPolicy: builder.mutation<
      void,
      { employeeIds: string[]; fromPolicyId: string; toPolicyId: string; effectiveDate: string; temporary: boolean }
    >({
      query: (body) => ({ url: `${ASSIGN_BASE}/policy-update`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "ASSIGN_POLICY" }],
    }),

    // ---- Punch Process: Punch tab ----

    postPpEmployeeRawPunches: builder.mutation<EmployeeRawPunch[], EmployeeRawPunchesRequest>({
      query: (body) => ({
        url: `${PUNCH_PROCESS_BASE}/employeerawpunches`,
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => toRows(raw) as EmployeeRawPunch[],
    }),

    getPpEmployeesByCompany: builder.query<TimeOfficeEmployee[], void>({
      query: () => ({
        url: `${PUNCH_PROCESS_BASE}/employees-by-company`,
      }),
      transformResponse: (raw: unknown): TimeOfficeEmployee[] => {
        const response = unwrapResponse(raw);
        const rows = isRecord(response)
          ? getRecordValue(response, ["employees", "employeeList"])
          : response;
        if (!Array.isArray(rows)) return [];

        return rows.filter(isRecord).flatMap((row) => {
          const employeeId = getTextValue(getRecordValue(
            row,
            [
              "EmployeeID",
              "EmployeeId",
              "employeeId",
              "EmployeeCode",
              "EmployeeNo",
              "EmployeeNumber",
              "EmpID",
              "EmpCode",
              "EmployeeInternalID",
              "Code",
              "id",
            ],
          )).trim();
          const employeeName = getTextValue(getRecordValue(
            row,
            ["EmployeeName", "employeeName", "EmployeeFullName", "EmployeeDisplayName", "FullName", "DisplayName", "Name"],
          )).trim() || employeeId;
          const classificationId = Number(getRecordValue(row, ["ClassificationId", "classificationId"]));
          if (!employeeId) return [];
          return [{
            employeeId,
            employeeName,
            ...(Number.isFinite(classificationId) && classificationId > 0 ? { classificationId } : {}),
          }];
        });
      },
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_EMPLOYEES" }],
    }),

    getPpEmployeeMonthlyAttendanceDetails: builder.query<
      Record<string, unknown>[],
      { employeeId: string; month: number; year: number }
    >({
      query: ({ employeeId, month, year }) => ({
        url: `${PUNCH_PROCESS_BASE}/employee-monthly-attendance-details`,
        params: { employeeId, month, year },
        headers: timeOfficeAuthHeaders(),
      }),
      transformResponse: (raw: unknown) => toRows(raw),
    }),

    getPpEmployeeAttendanceOverview: builder.query<
      Record<string, unknown>[],
      { employeeId: string; month: number; year: number }
    >({
      query: ({ employeeId, month, year }) => ({
        url: `${PUNCH_PROCESS_BASE}/employee-attendance-overview`,
        params: { employeeId, month, year },
        headers: timeOfficeAuthHeaders(),
      }),
      transformResponse: (raw: unknown) => toRows(raw),
    }),

    getPunchProcessPunchDetails: builder.query<ProcessDrilldownRow[], { date: string; search?: string }>({
      query: ({ date, search }) => ({ url: PUNCH_TAB_BASE, params: { date, search } }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_PUNCH" }],
    }),

    // ---- Punch Process: Attendance Overview tab ----

    getPunchProcessAttendanceEmployees: builder.query<ProcessDrilldownRow[], { search?: string }>({
      query: ({ search }) => ({ url: `${ATT_OVERVIEW_BASE}/employees`, params: { search } }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_ATT_EMPLOYEES" }],
    }),

    getPunchProcessAttendanceOverview: builder.query<ProcessDrilldownRow, { month: string; employeeId: string }>({
      query: (params) => ({ url: ATT_OVERVIEW_BASE, params }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_ATT_OVERVIEW" }],
    }),

    getPunchProcessAttendanceMonthlySummary: builder.query<ProcessDrilldownRow, { month: string; employeeId: string }>({
      query: (params) => ({ url: `${ATT_OVERVIEW_BASE}/monthlysummary`, params }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_ATT_MONTHLY_SUMMARY" }],
    }),

    getPunchProcessAttendancePunchDetails: builder.query<ProcessDrilldownRow[], { date: string; employeeId: string }>({
      query: (params) => ({ url: `${ATT_OVERVIEW_BASE}/punchdetails`, params }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_ATT_PUNCH_DETAILS" }],
    }),

    getPunchProcessAttendanceRequestStatus: builder.query<ProcessDrilldownRow[], { employeeId: string }>({
      query: ({ employeeId }) => ({ url: `${ATT_OVERVIEW_BASE}/requeststatus`, params: { employeeId } }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_ATT_REQUEST_STATUS" }],
    }),

    // ---- Punch Process: Import tab ----

    importPunchFile: builder.mutation<void, FormData>({
      query: (body) => ({ url: PUNCH_IMPORT_BASE, method: "POST", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_PUNCH" }],
    }),

    // ---- Masters: Policy ----

    getAttendancePolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/attendance`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_ATTENDANCE" }],
    }),

    updateAttendancePolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/attendance`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_ATTENDANCE" }],
    }),

    addAttendancePolicyIp: builder.mutation<void, { ipAddress: string; remarks?: string }>({
      query: (body) => ({ url: `${POLICY_BASE}/attendance/ip`, method: "POST", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_ATTENDANCE" }],
    }),

    getWorkHoursPolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/workhours`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_WORKHOURS" }],
    }),

    updateWorkHoursPolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/workhours`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_WORKHOURS" }],
    }),

    getLateInPolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/latein`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_LATEIN" }],
    }),

    updateLateInPolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/latein`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_LATEIN" }],
    }),

    getEarlyOutPolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/earlyout`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_EARLYOUT" }],
    }),

    updateEarlyOutPolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/earlyout`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_EARLYOUT" }],
    }),

    getOnDutyPolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/onduty`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_ONDUTY" }],
    }),

    updateOnDutyPolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/onduty`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_ONDUTY" }],
    }),

    getWorkFromHomePolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/workfromhome`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_WFH" }],
    }),

    updateWorkFromHomePolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/workfromhome`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_WFH" }],
    }),

    getPermissionsPolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/permissions`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_PERMISSIONS" }],
    }),

    updatePermissionsPolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/permissions`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_PERMISSIONS" }],
    }),

    getAdvancedPolicy: builder.query<PolicyDto, void>({
      query: () => `${POLICY_BASE}/advanced`,
      providesTags: [{ type: "TimeOffice", id: "POLICY_ADVANCED" }],
    }),

    updateAdvancedPolicy: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${POLICY_BASE}/advanced`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "POLICY_ADVANCED" }],
    }),

    // ---- Masters: Shift Pattern ----

    getShiftPatternList: builder.query<ProcessDrilldownRow[], void>({
      query: () => SHIFT_PATTERN_BASE,
      providesTags: [{ type: "TimeOffice", id: "SHIFT_PATTERN" }],
    }),

    getShiftPatternDetails: builder.query<ProcessDrilldownRow, string>({
      query: (shiftPatternId) => `${SHIFT_PATTERN_BASE}/${shiftPatternId}`,
      providesTags: (_result, _error, shiftPatternId) => [{ type: "TimeOffice", id: `SHIFT_PATTERN_${shiftPatternId}` }],
    }),

    addShiftPattern: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: SHIFT_PATTERN_BASE, method: "POST", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SHIFT_PATTERN" }],
    }),

    updateShiftPattern: builder.mutation<void, { shiftPatternId: string } & PolicyDto>({
      query: ({ shiftPatternId, ...body }) => ({ url: `${SHIFT_PATTERN_BASE}/${shiftPatternId}`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SHIFT_PATTERN" }],
    }),

    // ---- Masters: Shift Master ----

    getShiftMasterList: builder.query<ShiftMasterRow[], void>({
      query: () => ({
        url: SHIFT_MASTER_BASE,
        headers: timeOfficeAuthHeaders(),
      }),
      transformResponse: (response: unknown) => toRows(response).map((row) => ({
        shiftCode: getTextValue(getRecordValue(row, ["shiftCode", "code"])),
        shiftName: getTextValue(getRecordValue(row, ["shiftName", "name"])),
        startTime: getTextValue(getRecordValue(row, ["startTime", "shiftStartTime"])),
        endTime: getTextValue(getRecordValue(row, ["endTime", "shiftEndTime"])),
      })),
      providesTags: [{ type: "TimeOffice", id: "SHIFT_MASTER" }],
    }),

    getShiftMasterDetails: builder.query<ShiftMasterRow, string>({
      query: (shiftId) => `${SHIFT_MASTER_BASE}/${shiftId}`,
      providesTags: (_result, _error, shiftId) => [{ type: "TimeOffice", id: `SHIFT_MASTER_${shiftId}` }],
    }),

    addShiftMaster: builder.mutation<void, ShiftMasterBody>({
      query: (body) => ({ url: SHIFT_MASTER_BASE, method: "POST", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SHIFT_MASTER" }],
    }),

    updateShiftMaster: builder.mutation<void, { shiftId: string } & ShiftMasterBody>({
      query: ({ shiftId, ...body }) => ({ url: `${SHIFT_MASTER_BASE}/${shiftId}`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SHIFT_MASTER" }],
    }),

    deleteShiftMaster: builder.mutation<void, string>({
      query: (shiftId) => ({ url: `${SHIFT_MASTER_BASE}/${shiftId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "TimeOffice", id: "SHIFT_MASTER" }],
    }),

    // ---- Masters: Geo Location ----

    getMasterGeoLocationList: builder.query<ProcessDrilldownRow[], void>({
      query: () => GEO_MASTER_BASE,
      providesTags: [{ type: "TimeOffice", id: "MASTER_GEOLOCATION" }],
    }),

    getMasterGeoLocationDetails: builder.query<ProcessDrilldownRow, string>({
      query: (locationId) => `${GEO_MASTER_BASE}/${locationId}`,
      providesTags: (_result, _error, locationId) => [{ type: "TimeOffice", id: `MASTER_GEOLOCATION_${locationId}` }],
    }),

    addMasterGeoLocation: builder.mutation<void, GeoLocationBody>({
      query: (body) => ({ url: GEO_MASTER_BASE, method: "POST", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "MASTER_GEOLOCATION" }],
    }),

    updateMasterGeoLocation: builder.mutation<void, { locationId: string } & GeoLocationBody>({
      query: ({ locationId, ...body }) => ({ url: `${GEO_MASTER_BASE}/${locationId}`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "MASTER_GEOLOCATION" }],
    }),

    deleteMasterGeoLocation: builder.mutation<void, string>({
      query: (locationId) => ({ url: `${GEO_MASTER_BASE}/${locationId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "TimeOffice", id: "MASTER_GEOLOCATION" }],
    }),

    // ---- Masters: Import ----

    importMastersData: builder.mutation<void, FormData>({
      query: (body) => ({ url: `${MASTERS_BASE}/import`, method: "POST", body }),
    }),

    // ---- Settings ----

    getGeneralSettings: builder.query<PolicyDto, void>({
      query: () => `${SETTINGS_BASE}/general`,
      providesTags: [{ type: "TimeOffice", id: "SETTINGS_GENERAL" }],
    }),

    updateGeneralSettings: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${SETTINGS_BASE}/general`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SETTINGS_GENERAL" }],
    }),

    getAutoProcessSettings: builder.query<PolicyDto, void>({
      query: () => `${SETTINGS_BASE}/autoprocess`,
      providesTags: [{ type: "TimeOffice", id: "SETTINGS_AUTOPROCESS" }],
    }),

    updateAutoProcessSettings: builder.mutation<
      void,
      { intervalType: "SECONDS" | "MINUTES" | "HOURS" | "DAILY" | "MONTHLY"; intervalValue: number }
    >({
      query: (body) => ({ url: `${SETTINGS_BASE}/autoprocess`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SETTINGS_AUTOPROCESS" }],
    }),

    getMailSchedulerSettings: builder.query<PolicyDto, void>({
      query: () => `${SETTINGS_BASE}/mailscheduler`,
      providesTags: [{ type: "TimeOffice", id: "SETTINGS_MAILSCHEDULER" }],
    }),

    updateMailSchedulerSettings: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${SETTINGS_BASE}/mailscheduler`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SETTINGS_MAILSCHEDULER" }],
    }),

    getPunchIntegrationSettings: builder.query<PolicyDto, void>({
      query: () => `${SETTINGS_BASE}/punchintegration`,
      providesTags: [{ type: "TimeOffice", id: "SETTINGS_PUNCH_INTEGRATION" }],
    }),

    updatePunchIntegrationSettings: builder.mutation<void, PolicyDto>({
      query: (body) => ({ url: `${SETTINGS_BASE}/punchintegration`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "SETTINGS_PUNCH_INTEGRATION" }],
    }),

    readPunchIntegrationData: builder.mutation<void, { locationId: string; fromDate: string; toDate: string }>({
      query: (body) => ({ url: `${SETTINGS_BASE}/punchintegration/readdata`, method: "POST", body }),
    }),
  }),
});

export const {
  useGetTimeOfficeDashboardSummaryQuery,
  useGetDashboardEmployeesQuery,
  useGetAttendanceOverviewQuery,
  useGetPunchModeDistributionQuery,
  useGetIrregularitiesQuery,
  useGetAverageWorkingHoursQuery,
  useGetAverageOtHoursQuery,
  useGetAttendancePolicyShiftsQuery,
  useGetPoliciesQuery,
  useGetPendingRequestsQuery,
  useGetProcessSummaryQuery,
  useProcessAttendanceMutation,
  useGetMissedPunchQuery,
  useGetShiftUnassignedQuery,
  useGetYetToProcessQuery,
  useGetProcessedQuery,
  useGetReprocessEffectiveDateQuery,
  useGetAllReprocessQuery,
  useGetProcessHistoryQuery,
  useGetPunchProcessTaInsightsCountsQuery,
  useGetPunchProcessTaInsightsDetailsQuery,
  useGetPunchRequestsSummaryQuery,

  useGetAssignGeoLocationListQuery,
  useGetAssignLocationOptionsQuery,
  useGetAssignGeoLocationDetailsQuery,
  useUpdateAssignGeoLocationMutation,
  useGetAssignPolicyListQuery,
  useGetAssignPolicyOptionsQuery,
  useUpdateAssignPolicyMutation,

  useGetPunchProcessPunchDetailsQuery,
  usePostPpEmployeeRawPunchesMutation,
  useGetPpEmployeesByCompanyQuery,
  useGetPpEmployeeMonthlyAttendanceDetailsQuery,
  useGetPpEmployeeAttendanceOverviewQuery,

  useGetPunchProcessAttendanceEmployeesQuery,
  useGetPunchProcessAttendanceOverviewQuery,
  useGetPunchProcessAttendanceMonthlySummaryQuery,
  useGetPunchProcessAttendancePunchDetailsQuery,
  useGetPunchProcessAttendanceRequestStatusQuery,

  useImportPunchFileMutation,

  useGetAttendancePolicyQuery,
  useUpdateAttendancePolicyMutation,
  useAddAttendancePolicyIpMutation,
  useGetWorkHoursPolicyQuery,
  useUpdateWorkHoursPolicyMutation,
  useGetLateInPolicyQuery,
  useUpdateLateInPolicyMutation,
  useGetEarlyOutPolicyQuery,
  useUpdateEarlyOutPolicyMutation,
  useGetOnDutyPolicyQuery,
  useUpdateOnDutyPolicyMutation,
  useGetWorkFromHomePolicyQuery,
  useUpdateWorkFromHomePolicyMutation,
  useGetPermissionsPolicyQuery,
  useUpdatePermissionsPolicyMutation,
  useGetAdvancedPolicyQuery,
  useUpdateAdvancedPolicyMutation,

  useGetShiftPatternListQuery,
  useGetShiftPatternDetailsQuery,
  useAddShiftPatternMutation,
  useUpdateShiftPatternMutation,

  useGetShiftMasterListQuery,
  useGetShiftMasterDetailsQuery,
  useAddShiftMasterMutation,
  useUpdateShiftMasterMutation,
  useDeleteShiftMasterMutation,

  useGetMasterGeoLocationListQuery,
  useGetMasterGeoLocationDetailsQuery,
  useAddMasterGeoLocationMutation,
  useUpdateMasterGeoLocationMutation,
  useDeleteMasterGeoLocationMutation,

  useImportMastersDataMutation,

  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useGetAutoProcessSettingsQuery,
  useUpdateAutoProcessSettingsMutation,
  useGetMailSchedulerSettingsQuery,
  useUpdateMailSchedulerSettingsMutation,
  useGetPunchIntegrationSettingsQuery,
  useUpdatePunchIntegrationSettingsMutation,
  useReadPunchIntegrationDataMutation,
} = timeofficeApi;

/** Merges the two hours endpoints into the shape the chart component wants. */
export const mergeHours = (work: HoursPoint[] = [], ot: HoursPoint[] = []): WorkingHoursPoint[] => {
  const otByDate = new Map(ot.map((point) => [point.date, point.minutes]));
  return work.map((point) => ({
    date: point.date,
    avgWorkMinutes: point.minutes,
    avgOtMinutes: otByDate.get(point.date) ?? 0,
  }));
};
