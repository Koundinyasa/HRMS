import { baseApi } from "@/app/baseApi";
import type {
  AttendanceEmployeeRow,
  DailyLog,
  InsightTile,
  MissedPunchRow,
  ProcessDrilldownRow,
  PunchDetailRow,
} from "../types/timeoffice.types";

const REG_BASE = "admin/timeattendance/timeoffice/regularization";
const FORCE_APPROVAL_BASE = "admin/timeattendance/timeoffice/forceapproval";

interface PunchBody {
  punchType: "In" | "Out";
  time: string;
  remarks?: string;
}

export const regularizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---- Punch tab ----

    getPunchDetails: builder.query<PunchDetailRow[], { date: string; employeeId?: string }>({
      query: ({ date, employeeId }) => ({ url: `${REG_BASE}/punch`, params: { date, employeeId } }),
      providesTags: [{ type: "TimeOffice", id: "REG_PUNCH" }],
    }),

    addPunch: builder.mutation<void, { date: string } & PunchBody>({
      query: (body) => ({ url: `${REG_BASE}/punch`, method: "POST", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "REG_PUNCH" }],
    }),

    updatePunch: builder.mutation<void, { punchId: string } & PunchBody>({
      query: ({ punchId, ...body }) => ({ url: `${REG_BASE}/punch/${punchId}`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "REG_PUNCH" }],
    }),

    // ---- Missed Punch tab ----

    getMissedPunchList: builder.query<MissedPunchRow[], { fromDate: string; toDate: string }>({
      query: ({ fromDate, toDate }) => ({ url: `${REG_BASE}/missedpunch`, params: { fromDate, toDate } }),
      providesTags: [{ type: "TimeOffice", id: "MISSED_PUNCH_LIST" }],
    }),

    getMissedPunchRegularizationDetails: builder.query<PunchDetailRow[], { employeeId: string; punchDate: string }>({
      query: ({ employeeId, punchDate }) => `${REG_BASE}/missedpunch/${employeeId}/${punchDate}`,
      providesTags: [{ type: "TimeOffice", id: "MISSED_PUNCH_DETAILS" }],
    }),

    saveMissedPunchRegularization: builder.mutation<void, { employeeId: string; punchDate: string } & PunchBody>({
      query: ({ employeeId, punchDate, ...body }) => ({
        url: `${REG_BASE}/missedpunch/regularize`,
        method: "POST",
        params: { employeeId, punchDate },
        body,
      }),
      invalidatesTags: [
        { type: "TimeOffice", id: "MISSED_PUNCH_LIST" },
        { type: "TimeOffice", id: "MISSED_PUNCH_DETAILS" },
      ],
    }),

    // ---- Attendance tab ----

    getAttendanceMatrix: builder.query<AttendanceEmployeeRow[], { month: string; employeeId?: string }>({
      query: ({ month, employeeId }) => ({ url: `${REG_BASE}/attendance`, params: { month, employeeId } }),
      providesTags: [{ type: "TimeOffice", id: "ATTENDANCE_MATRIX" }],
    }),

    getDailyLog: builder.query<DailyLog, { employeeId: string; date: string }>({
      query: ({ employeeId, date }) => ({ url: `${REG_BASE}/attendance/dailylog`, params: { employeeId, date } }),
      providesTags: [{ type: "TimeOffice", id: "DAILY_LOG" }],
    }),

    correctDailyLogStatus: builder.mutation<void, { employeeId: string; date: string; status: string; remarks?: string }>({
      query: ({ employeeId, date, ...body }) => ({
        url: `${REG_BASE}/attendance/dailylog/status`,
        method: "PUT",
        params: { employeeId, date },
        body,
      }),
      invalidatesTags: [
        { type: "TimeOffice", id: "DAILY_LOG" },
        { type: "TimeOffice", id: "ATTENDANCE_MATRIX" },
      ],
    }),

    applyDailyLogLeave: builder.mutation<void, { employeeId: string; date: string; leaveTypeId: number; remarks?: string }>({
      query: ({ employeeId, date, ...body }) => ({
        url: `${REG_BASE}/attendance/dailylog/leave`,
        method: "POST",
        params: { employeeId, date },
        body,
      }),
      invalidatesTags: [
        { type: "TimeOffice", id: "DAILY_LOG" },
        { type: "TimeOffice", id: "ATTENDANCE_MATRIX" },
      ],
    }),

    addDailyLogPunch: builder.mutation<void, { employeeId: string; date: string } & PunchBody>({
      query: ({ employeeId, ...body }) => ({
        url: `${REG_BASE}/attendance/dailylog/punch`,
        method: "POST",
        params: { employeeId },
        body,
      }),
      invalidatesTags: [{ type: "TimeOffice", id: "DAILY_LOG" }],
    }),

    editDailyLogPunch: builder.mutation<void, { punchId: string } & PunchBody>({
      query: ({ punchId, ...body }) => ({ url: `${REG_BASE}/attendance/dailylog/punch/${punchId}`, method: "PUT", body }),
      invalidatesTags: [{ type: "TimeOffice", id: "DAILY_LOG" }],
    }),

    // ---- TA Insights tab ----

    getTaInsightsSummary: builder.query<InsightTile[], { fromDate: string; toDate: string }>({
      query: ({ fromDate, toDate }) => ({ url: `${REG_BASE}/tainsights`, params: { fromDate, toDate } }),
      providesTags: [{ type: "TimeOffice", id: "TA_INSIGHTS_SUMMARY" }],
    }),

    getTaInsightsDetails: builder.query<ProcessDrilldownRow[], { type: string; fromDate: string; toDate: string }>({
      query: (params) => ({ url: `${REG_BASE}/tainsights/details`, params }),
      providesTags: [{ type: "TimeOffice", id: "TA_INSIGHTS_DETAILS" }],
    }),

    // ---- Force Approval ----

    getPunchApproval: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${FORCE_APPROVAL_BASE}/punch`,
      providesTags: [{ type: "TimeOffice", id: "FORCE_APPROVAL_PUNCH" }],
    }),

    getFaceTemplateApproval: builder.query<ProcessDrilldownRow[], void>({
      query: () => `${FORCE_APPROVAL_BASE}/facetemplate`,
      providesTags: [{ type: "TimeOffice", id: "FORCE_APPROVAL_FACE_TEMPLATE" }],
    }),
  }),
});

export const {
  useGetPunchDetailsQuery,
  useAddPunchMutation,
  useUpdatePunchMutation,
  useGetMissedPunchListQuery,
  useGetMissedPunchRegularizationDetailsQuery,
  useSaveMissedPunchRegularizationMutation,
  useGetAttendanceMatrixQuery,
  useGetDailyLogQuery,
  useCorrectDailyLogStatusMutation,
  useApplyDailyLogLeaveMutation,
  useAddDailyLogPunchMutation,
  useEditDailyLogPunchMutation,
  useGetTaInsightsSummaryQuery,
  useGetTaInsightsDetailsQuery,
  useGetPunchApprovalQuery,
  useGetFaceTemplateApprovalQuery,
} = regularizationApi;
