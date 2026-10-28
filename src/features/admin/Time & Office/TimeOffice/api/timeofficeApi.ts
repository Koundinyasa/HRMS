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

const BASE = "admin/timeattendance/timeoffice/punchprocess/dashboard";
const PROCESS_BASE = "admin/timeattendance/timeoffice/punchprocess/process";
const PUNCH_TAB_BASE = "admin/timeattendance/timeoffice/punchprocess/punch";
const ATT_OVERVIEW_BASE = "admin/timeattendance/timeoffice/punchprocess/attendanceoverview";
const TA_INSIGHTS_BASE = "admin/timeattendance/timeoffice/punchprocess/tainsights";
const PUNCH_IMPORT_BASE = "admin/timeattendance/timeoffice/punchprocess/import";
const ASSIGN_BASE = "admin/timeattendance/timeoffice/assign";
const MASTERS_BASE = "admin/timeattendance/timeoffice/masters";
const POLICY_BASE = `${MASTERS_BASE}/policy`;
const SHIFT_PATTERN_BASE = `${MASTERS_BASE}/shiftpattern`;
const SHIFT_MASTER_BASE = `${MASTERS_BASE}/shiftmaster`;
const GEO_MASTER_BASE = `${MASTERS_BASE}/geolocation`;
const SETTINGS_BASE = "admin/timeattendance/timeoffice/settings";

interface DateRange {
  fromDate: string;
  tillDate: string;
}

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

/** Avg work and avg OT are separate endpoints, so each returns a single series. */
export interface HoursPoint {
  date: string;
  minutes: number;
}

export const timeofficeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getDashboardSummary: builder.query<DashboardSummary, PunchPeriod>({
      query: (period) => ({ url: `${BASE}/summary`, params: { period } }),
      providesTags: [{ type: "TimeOffice", id: "SUMMARY" }],
    }),

    /** One endpoint backs every KPI drill-down; `metric` selects which list. */
    getDashboardEmployees: builder.query<PunchRecord[], { metric: PunchMetric; period: PunchPeriod }>({
      query: ({ metric, period }) => ({ url: `${BASE}/employees`, params: { metric, period } }),
      providesTags: (_result, _error, { metric }) => [{ type: "TimeOffice", id: metric }],
    }),

    getAttendanceOverview: builder.query<AttendanceOverviewPoint[], void>({
      query: () => `${BASE}/attendanceoverview`,
      providesTags: [{ type: "TimeOffice", id: "OVERVIEW" }],
    }),

    getPunchModeDistribution: builder.query<PunchModeSlice[], PunchPeriod>({
      query: (period) => ({ url: `${BASE}/punchmodedistribution`, params: { period } }),
      providesTags: [{ type: "TimeOffice", id: "PUNCH_MODE" }],
    }),

    getIrregularities: builder.query<IrregularityPoint[], IrregularityClassification>({
      query: (classification) => ({ url: `${BASE}/irregularities`, params: { classification } }),
      providesTags: [{ type: "TimeOffice", id: "IRREGULARITIES" }],
    }),

    getAverageWorkingHours: builder.query<HoursPoint[], void>({
      query: () => `${BASE}/averageworkinghours`,
      providesTags: [{ type: "TimeOffice", id: "WORK_HOURS" }],
    }),

    getAverageOtHours: builder.query<HoursPoint[], void>({
      query: () => `${BASE}/averageothours`,
      providesTags: [{ type: "TimeOffice", id: "OT_HOURS" }],
    }),

    getPolicies: builder.query<PolicySummary[], void>({
      query: () => `${BASE}/policies`,
      providesTags: [{ type: "TimeOffice", id: "POLICIES" }],
    }),

    getPendingRequests: builder.query<PendingRequest[], void>({
      query: () => `${BASE}/pendingrequests`,
      providesTags: [{ type: "TimeOffice", id: "PENDING_REQUESTS" }],
    }),

    getProcessSummary: builder.query<ProcessSummary, DateRange>({
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/summary`, params: { fromDate, tillDate } }),
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
      query: ({ fromDate, tillDate }) => ({ url: `${PROCESS_BASE}/missedpunch`, params: { fromDate, tillDate } }),
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

    getProcessHistory: builder.query<ProcessHistoryEntry[], void>({
      query: () => `${PROCESS_BASE}/history`,
      providesTags: [{ type: "TimeOffice", id: "PROCESS_HISTORY" }],
    }),

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

    // ---- Punch Process: Punch tab ----

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
  useGetDashboardSummaryQuery,
  useGetDashboardEmployeesQuery,
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
