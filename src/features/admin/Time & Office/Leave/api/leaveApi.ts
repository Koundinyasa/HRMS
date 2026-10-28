
import { baseApi } from "@/app/baseApi";

interface LeaveAllotmentReportRequest {
  FromMonth: string;
  ToMonth: string;
  LeavePolicyId?: number;
}

interface LeaveAllotmentReportResponse {
  success: boolean;
  data: Record<string, unknown>[];
  message?: string;
}

interface LeaveReportRequest {
  path: string;
  method: "GET" | "POST";
  params?: Record<string, string>;
  body?: Record<string, unknown>;
}

interface LeaveReportResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

// Temporary response type until the actual API response interfaces
// are available in the project.
type ApiResponse = unknown;

export const attendanceApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    // =====================================================
    // Leave Adjustment
    // =====================================================

    getTalentHubLeaveTypes: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/adjustment/leavetypes",
    }),

    getLeaveAdjustmentConfiguration: builder.query<ApiResponse, number>({
      query: (leaveId) =>
        `admin/ta/leave/adjustment/configuration/${leaveId}`,
    }),

    getEmployees: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/adjustment/employees",
    }),

    getCreateLeaveAdjustment: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/adjustment/configuration",
    }),

    getAdjustmentLeavePolicies: builder.query<ApiResponse, void>({
      query: () =>
        "admin/ta/leave/adjustment/manualallotment/policies",
    }),

    getAdjustmentPolicyLeaves: builder.query<ApiResponse, number>({
      query: (policyId) =>
        `admin/ta/leave/adjustment/manualallotment/policies/${policyId}/leaves`,
    }),

    getEmployeeAllotments: builder.query<ApiResponse, void>({
      query: () =>
        "admin/ta/leave/adjustment/manualallotment/employees",
    }),

    getManualAllotment: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/adjustment/manualallotment",
    }),

    getPayMonths: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/adjustment/import/paymonths",
    }),

    postLeaveAdjustment: builder.query<ApiResponse, void>({
      query: () => ({
        url: "admin/ta/leave/adjustment/import",
      }),
    }),

    // =====================================================
    // Daily Leave
    // =====================================================

    getPolicies: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/policies",
    }),

    getDailyLeaveMonths: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/months",
    }),

    getDailyLeaveTypes: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/leavetypes",
    }),

    getDailyLeaveEmployees: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/employees",
    }),

    getLeaveForm: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/leaveform",
    }),

    postSaveLeaveForm: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/leaveform",
    }),

    postApplyLeave: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/apply",
    }),

    postReprocess: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/reprocess",
    }),

    postImportDailyLeave: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/daily/import",
    }),

    // =====================================================
    // Force Leave Approval
    // =====================================================

    getLeaveApproval: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/forceleaveapproval",
    }),

    postApproveLeave: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/forceleaveapproval/approve",
    }),

    postRejectLeave: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/forceleaveapproval/reject",
    }),

    // =====================================================
    // Holiday Settings
    // =====================================================

    getHolidayMonths: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/holidaysettings/months",
    }),

    getHolidayList: builder.query<ApiResponse, number>({
      query: (monthId) =>
        `admin/ta/leave/holidaysettings/months/${monthId}`,
    }),

    postCreateHoliday: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/holidaysettings",
    }),

    getWeeklyOffList: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/holidaysettings/weeklyoff",
    }),

    postUploadHolidayFile: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/holidaysettings/import",
    }),

    // =====================================================
    // Leave Reports
    // =====================================================

    getMonths: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/report/months",
    }),

    getLeaveAllotmentReport: builder.query<
      LeaveAllotmentReportResponse,
      LeaveAllotmentReportRequest
    >({
      query: (body) => ({
        url: "admin/ta/leave/report/allotment",
        method: "POST",
        body,
      }),
    }),

    getReportData: builder.query<
      LeaveReportResponse,
      LeaveReportRequest
    >({
      query: ({ path, method, params, body }) => ({
        url: path,
        method,
        params,
        body,
      }),
    }),

    getAttendanceIndependentReport: builder.query<ApiResponse, void>({
      query: () =>
        "admin/ta/leave/report/attendanceindependent",
    }),

    getTopAttendanceReport: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/report/topattendance",
    }),

    getTopLeaveTakenReport: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/report/topleavetaken",
    }),

    // =====================================================
    // Leave Policy Settings
    // =====================================================

    getLeavePolicies: builder.query<ApiResponse, void>({
      query: () => "admin/ta/leave/settings/policies",
    }),

    getPolicyLeaves: builder.query<ApiResponse, number>({
      query: (policyId) =>
        `admin/ta/leave/settings/policies/${policyId}/leaves`,
    }),

    getLeavePolicySettings: builder.query<
      ApiResponse,
      { policyId: number; leaveId: number }
    >({
      query: ({ policyId, leaveId }) =>
        `admin/ta/leave/settings/policies/${policyId}/leaves/${leaveId}`,
    }),

    updateLeavePolicySettings: builder.query<
      ApiResponse,
      { policyId: number; leaveId: number }
    >({
      query: ({ policyId, leaveId }) => ({
        url: `admin/ta/leave/settings/policies/${policyId}/leaves/${leaveId}`,
      }),
    }),
  }),
});