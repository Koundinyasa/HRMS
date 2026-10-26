import { baseApi } from "@/app/baseApi"; 

export type LeaveApprovalViewType = "applied" | "cancellation";
export type LeaveApprovalMonthType = "current" | "non-current";

export interface LeaveApprovalRow {
  id: number;
  approverName: string;
  employeeId: string;
  employeeName: string;
  leaveName: string;
  date: string; // "17/Sep/2026"
  days: "Full Day" | "First Half" | "Second Half";
}

export interface LeaveApprovalFilters {
  branch?: string[];
  salaryStructure?: string[];
  leave?: string[];
  attendance?: string[];
  designation?: string[];
  empStatus?: string[];
  search?: string;
}

export interface LeaveApprovalQuery extends LeaveApprovalFilters {
  viewType: LeaveApprovalViewType;
  monthType: LeaveApprovalMonthType;
}

export interface ApproveRejectLeaveDto {
  leaveApplicationIds: number[];
  remarks?: string;
}

// Serializes filters/arrays into query params for the GET request
function buildParams(query: LeaveApprovalQuery): Record<string, string> {
  const params: Record<string, string> = {
    viewType: query.viewType,
    monthType: query.monthType,
  };
  if (query.search) params.search = query.search;
  (["branch", "salaryStructure", "leave", "attendance", "designation", "empStatus"] as const).forEach(
    (key) => {
      const value = query[key];
      if (value && value.length) params[key] = value.join(",");
    }
  );
  return params;
}

export const leaveApprovalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 3. GET /api/admin/ta/leave/forceleaveapproval
    // ⚠️ Implemented as query params, not a GET body — see note above.
    getForceLeaveApprovals: builder.query<LeaveApprovalRow[], LeaveApprovalQuery>({
      query: (params) => ({
        url: "/api/admin/ta/leave/forceleaveapproval",
        method: "GET",
        params: buildParams(params),
      }),
      providesTags: ["ForceLeaveApproval"],
    }),

    // 1. POST /api/admin/ta/leave/forceleaveapproval/approve
    approveLeaves: builder.mutation<void, ApproveRejectLeaveDto>({
      query: (body) => ({
        url: "/api/admin/ta/leave/forceleaveapproval/approve",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ForceLeaveApproval"],
    }),

    // 2. POST /api/admin/ta/leave/forceleaveapproval/reject
    rejectLeaves: builder.mutation<void, ApproveRejectLeaveDto>({
      query: (body) => ({
        url: "/api/admin/ta/leave/forceleaveapproval/reject",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ForceLeaveApproval"],
    }),
  }),
});

export const {
  useGetForceLeaveApprovalsQuery,
  useApproveLeavesMutation,
  useRejectLeavesMutation,
} = leaveApprovalApi;