
import { baseApi } from "@/app/baseApi";
import type {
  AttendanceOverviewPoint,
  IrregularityClassification,
  IrregularityPoint,
  PolicySummary,
  ProcessDrilldownRow,
  ProcessHistoryEntry,
  ProcessSummary,
  PunchMetric,
  PunchPeriod,
  PunchRecord,
  PunchRequestsSummary,
  ShiftMasterRow,
  WorkingHoursPoint,
} from "../types/timeoffice.types";

const ROOT = "admin/timeattendance/timeoffice/punchprocess";
const BASE = `${ROOT}/dashboard`;
const PROCESS_BASE = `${ROOT}/process`;
const PUNCH_TAB_BASE = `${ROOT}/punch`;
const ATT_OVERVIEW_BASE = `${ROOT}/attendanceoverview`;
const TA_INSIGHTS_BASE = `${ROOT}/tainsights`;
const PUNCH_IMPORT_BASE = `${ROOT}/import`;
const ASSIGN_BASE = "admin/timeattendance/timeoffice/assign";
const MASTERS_BASE = "admin/timeattendance/timeoffice/masters";
const POLICY_BASE = `${MASTERS_BASE}/policy`;
const SHIFT_PATTERN_BASE = `${MASTERS_BASE}/shiftpattern`;
const SHIFT_MASTER_BASE = `${MASTERS_BASE}/shiftmaster`;
const GEO_MASTER_BASE = `${MASTERS_BASE}/geolocation`;
const SETTINGS_BASE = "admin/timeattendance/timeoffice/settings";

/**
 * Metric -> backend route. Keys must match your `PunchMetric` union;
 * adjust the keys if your metric names differ.
 * Note: yesterday-absent-employees lives at the controller root, not under /dashboard.
 */
const DASHBOARD_EMPLOYEE_ROUTES: Record<string, string> = {
  yesterdayPresent: `${BASE}/yesterday-present-count`,
  yesterdayAbsent: `${ROOT}/yesterday-absent-employees`,
  onLeave: `${BASE}/on-leave-employees`,
  lateIn: `${BASE}/late-in-employees`,
  earlyIn: `${BASE}/early-in-employees`,
  earlyOut: `${BASE}/early-out-employees`,
  yetToLogin: `${BASE}/yet-to-login`,
  loggedIn: `${BASE}/logged-in-employees`,
};

interface DateRange {
  fromDate: string;
  tillDate: string;
}

/** TODO(dto): replace with the fields of the backend Get*Dto query classes. */
interface DashboardQueryParams {
  period?: PunchPeriod;
  [key: string]: string | number | undefined;
}

/** TODO(dto): replace with ProcessHistoryDto fields (companyId comes from the JWT, don't send it). */
type ProcessHistoryBody = Record<string, unknown>;

/** Backend hasn't published field names for these policy/settings DTOs yet, so they pass through as-is. */
type PolicyDto = Record<string, unknown>;

interface ShiftMasterBody {
  shiftName: string;
  shiftCode?: string;
  startTime?: string;
  endTime?: string;
  remarks?: string;
}

interface GeoLocationBody {
  locationName: string;
  locationCode?: string;
  latitude?: string;
  longitude?: string;
  radius?: string;
}

interface TaInsightsFilters {
  fromDate: string;
  toDate: string;
  query?: string;
  taPolicy?: string;
  pattern?: string;
  taSupervisor?: string;
  attendance?: string;
  leave?: string;
}

/** Tile counts, keyed by metric. */
export interface DashboardSummary {
  totalEmployees: number;
  latestPunchIntegratedAt?: string;
  counts: Partial<Record<PunchMetric, number>>;
}

export interface PunchModeSlice {
  mode: string;
  count: number;
}

export interface PendingRequest {
  id: string;
  label: string;
}
export interface HoursPoint {
  date: string;
  minutes: number;
}

export const timeofficeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ================= Dashboard (synced with PunchProcessController) =================

    /** GET dashboard/counts */
    getPunchProcessDashboardSummary: builder.query<DashboardSummary, PunchPeriod>({
      query: (period) => ({ url: `${BASE}/counts`, params: { period } }),
      providesTags: [{ type: "TimeOffice", id: "SUMMARY" }],
    }),

    /** One entry point for every KPI drill-down; `metric` selects which backend route is hit. */
    getDashboardEmployees: builder.query<PunchRecord[], { metric: PunchMetric; period: PunchPeriod }>({
      query: ({ metric, period }) => ({
        url: DASHBOARD_EMPLOYEE_ROUTES[metric as string],
        params: { period },
      }),
      providesTags: (_result, _error, { metric }) => [{ type: "TimeOffice", id: metric }],
    }),

    /** GET dashboard/yesterday-present-count */
    getYesterdayPresentCount: builder.query<unknown, DashboardQueryParams | void>({
      query: (params) => ({ url: `${BASE}/yesterday-present-count`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "YESTERDAY_PRESENT" }],
    }),

    /** GET yesterday-absent-employees (no /dashboard prefix on the backend) */
    getYesterdayAbsentEmployees: builder.query<PunchRecord[], DashboardQueryParams | void>({
      query: (params) => ({ url: `${ROOT}/yesterday-absent-employees`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "YESTERDAY_ABSENT" }],
    }),

    /** GET dashboard/on-leave-employees */
    getOnLeaveEmployees: builder.query<PunchRecord[], DashboardQueryParams | void>({
      query: (params) => ({ url: `${BASE}/on-leave-employees`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "ON_LEAVE" }],
    }),

    /** GET dashboard/late-in-employees */
    getLateInEmployees: builder.query<PunchRecord[], DashboardQueryParams | void>({
      query: (params) => ({ url: `${BASE}/late-in-employees`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "LATE_IN" }],
    }),

    /** GET dashboard/early-in-employees */
    getEarlyInEmployees: builder.query<PunchRecord[], DashboardQueryParams | void>({
      query: (params) => ({ url: `${BASE}/early-in-employees`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "EARLY_IN" }],
    }),

    /** GET dashboard/early-out-employees */
    getEarlyOutEmployees: builder.query<PunchRecord[], DashboardQueryParams | void>({
      query: (params) => ({ url: `${BASE}/early-out-employees`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "EARLY_OUT" }],
    }),

    /** GET dashboard/yet-to-login */
    getYetToLoginEmployees: builder.query<PunchRecord[], DashboardQueryParams | void>({
      query: (params) => ({ url: `${BASE}/yet-to-login`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "YET_TO_LOGIN" }],
    }),

    /** GET dashboard/logged-in-employees */
    getLoggedInEmployees: builder.query<PunchRecord[], DashboardQueryParams | void>({
      query: (params) => ({ url: `${BASE}/logged-in-employees`, params: params ?? undefined }),
      providesTags: [{ type: "TimeOffice", id: "LOGGED_IN" }],
    }),

    /** GET dashboard/overview */
    getAttendanceOverview: builder.query<AttendanceOverviewPoint[], void>({
      query: () => `${BASE}/overview`,
      providesTags: [{ type: "TimeOffice", id: "OVERVIEW" }],
    }),

    /** GET dashboard/late-in-early-out-graph */
    getIrregularities: builder.query<IrregularityPoint[], IrregularityClassification>({
      query: (classification) => ({ url: `${BASE}/late-in-early-out-graph`, params: { classification } }),
      providesTags: [{ type: "TimeOffice", id: "IRREGULARITIES" }],
    }),

    /** GET dashboard/average-ot-work-hours */
    getAverageOtHours: builder.query<HoursPoint[], void>({
      query: () => `${BASE}/average-ot-work-hours`,
      providesTags: [{ type: "TimeOffice", id: "OT_HOURS" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getPunchModeDistribution: builder.query<PunchModeSlice[], PunchPeriod>({
      query: (period) => ({ url: `${BASE}/punchmodedistribution`, params: { period } }),
      providesTags: [{ type: "TimeOffice", id: "PUNCH_MODE" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getAverageWorkingHours: builder.query<HoursPoint[], void>({
      query: () => `${BASE}/averageworkinghours`,
      providesTags: [{ type: "TimeOffice", id: "WORK_HOURS" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getPolicies: builder.query<PolicySummary[], void>({
      query: () => `${BASE}/policies`,
      providesTags: [{ type: "TimeOffice", id: "POLICIES" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getPendingRequests: builder.query<PendingRequest[], void>({
      query: () => `${BASE}/pendingrequests`,
      providesTags: [{ type: "TimeOffice", id: "PENDING_REQUESTS" }],
    }),

    // ================= Process (synced with PunchProcessController) =================

    /** GET dashboard/processing (companyId is taken from the JWT on the backend) */
    getProcessSummary: builder.query<ProcessSummary, DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${BASE}/processing`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "PROCESS_SUMMARY" }],
    }),

    /** GET process/missed-punch-employees */
    getMissedPunch: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({
        url: `${PROCESS_BASE}/missed-punch-employees`,
        params: { fromDate, tillDate },
      }),
      providesTags: [{ type: "TimeOffice", id: "MISSED_PUNCH" }],
    }),

    /** POST history (companyId is taken from the JWT on the backend) */
    getProcessHistory: builder.query<ProcessHistoryEntry[], ProcessHistoryBody | void>({
      query: (body) => ({ url: `${ROOT}/history`, method: "POST", body: body ?? {} }),
      providesTags: [{ type: "TimeOffice", id: "PROCESS_HISTORY" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    processAttendance: builder.mutation<void, DateRange>({
      query: (body) => ({ url: PROCESS_BASE, method: "POST", body }),
      invalidatesTags: [
        { type: "TimeOffice", id: "PROCESS_SUMMARY" },
        { type: "TimeOffice", id: "PROCESS_HISTORY" },
      ],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getShiftUnassigned: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/shiftunassigned`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "SHIFT_UNASSIGNED" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getYetToProcess: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/yettoprocess`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "YET_TO_PROCESS" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getProcessed: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/processed`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "PROCESSED" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getReprocessEffectiveDate: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({
        url: `${PROCESS_BASE}/reprocesseffectivedate`,
        params: { fromDate, tillDate },
      }),
      providesTags: [{ type: "TimeOffice", id: "REPROCESS_EFFECTIVE_DATE" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getAllReprocess: builder.query<ProcessDrilldownRow[], DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/allreprocess`, params: { fromDate, tillDate } }),
      providesTags: [{ type: "TimeOffice", id: "ALL_REPROCESS" }],
    }),

    // NOT IN PunchProcessController (kept as-is)
    getPunchRequestsSummary: builder.query<PunchRequestsSummary, void>({
      query: () => `${PROCESS_BASE}/punchrequests`,
      providesTags: [{ type: "TimeOffice", id: "PUNCH_REQUESTS_SUMMARY" }],
    }),

    // ---- Assign ----

    getAssignGeoLocationList: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${ASSIGN_BASE}/geolocation`,
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_GEOLOCATION" }],
    }),

    getAssignLocationOptions: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${ASSIGN_BASE}/geolocation/locations`,
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_LOCATIONS" }],
    }),

    getAssignGeoLocationDetails: builder.query<ProcessDrilldownRow, string>({
      query: (employeeId) => `${ASSIGN_BASE}/geolocation/${employeeId}`,
      providesTags: (_result, _error, employeeId) => [{ type: "TimeOffice", id: `ASSIGN_GEOLOCATION_${employeeId}` }],
    }),

    updateAssignGeoLocation: builder.mutation<void, { employeeIds: string[]; locationId: string; effectiveDate: string }>({
      query: (body) => ({ url: `${ASSIGN_BASE}/geolocation`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "ASSIGN_GEOLOCATION" }],
    }),

    getAssignPolicyList: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${ASSIGN_BASE}/policyupdate`,
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_POLICY" }],
    }),

    getAssignPolicyOptions: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${ASSIGN_BASE}/policyupdate/policies`,
      providesTags: [{ type: "TimeOffice", id: "ASSIGN_POLICY_OPTIONS" }],
    }),

    updateAssignPolicy: builder.mutation<
      void,
      { employeeIds: string[]; fromPolicyId: string; toPolicyId: string; effectiveDate: string; temporary: boolean }
    >({
      query: (body) => ({ url: `${ASSIGN_BASE}/policyupdate`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "ASSIGN_POLICY" }],
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

    // ---- Punch Process: TA Insights tab ----

    getPunchProcessTaInsights: builder.query<ProcessDrilldownRow[], TaInsightsFilters>({
      query: (params) => ({ url: TA_INSIGHTS_BASE, params }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_TA_INSIGHTS" }],
    }),

    getPunchProcessTaInsightsDetails: builder.query<ProcessDrilldownRow[], { type: string } & TaInsightsFilters>({
      query: (params) => ({ url: `${TA_INSIGHTS_BASE}/details`, params }),
      providesTags: [{ type: "TimeOffice", id: "PUNCHPROCESS_TA_INSIGHTS_DETAILS" }],
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
      query: () => SHIFT_MASTER_BASE,
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
  useGetPunchProcessDashboardSummaryQuery,
  useGetDashboardEmployeesQuery,
  useGetYesterdayPresentCountQuery,
  useGetYesterdayAbsentEmployeesQuery,
  useGetOnLeaveEmployeesQuery,
  useGetLateInEmployeesQuery,
  useGetEarlyInEmployeesQuery,
  useGetEarlyOutEmployeesQuery,
  useGetYetToLoginEmployeesQuery,
  useGetLoggedInEmployeesQuery,
  useGetAttendanceOverviewQuery,
  useGetPunchModeDistributionQuery,
  useGetIrregularitiesQuery,
  useGetAverageWorkingHoursQuery,
  useGetAverageOtHoursQuery,
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
  useGetPunchRequestsSummaryQuery,

  useGetAssignGeoLocationListQuery,
  useGetAssignLocationOptionsQuery,
  useGetAssignGeoLocationDetailsQuery,
  useUpdateAssignGeoLocationMutation,
  useGetAssignPolicyListQuery,
  useGetAssignPolicyOptionsQuery,
  useUpdateAssignPolicyMutation,

  useGetPunchProcessPunchDetailsQuery,

  useGetPunchProcessAttendanceEmployeesQuery,
  useGetPunchProcessAttendanceOverviewQuery,
  useGetPunchProcessAttendanceMonthlySummaryQuery,
  useGetPunchProcessAttendancePunchDetailsQuery,
  useGetPunchProcessAttendanceRequestStatusQuery,

  useGetPunchProcessTaInsightsQuery,
  useGetPunchProcessTaInsightsDetailsQuery,

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