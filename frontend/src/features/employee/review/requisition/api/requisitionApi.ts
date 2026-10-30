 
import { baseApi } from "@/app/baseApi";
 
import type {
  PendingLeaveRequestParams,
  PendingLeaveRequestsResponse,
} from "../types/requisition.types";
 
export interface LeaveActionRequest {
  approvalId: number;
  approverEmployeeId?: string;
  remarks?: string;
}
 
export const requisitionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingLeaveRequests: builder.mutation<
      PendingLeaveRequestsResponse,
      PendingLeaveRequestParams
    >({
      query: (body) => ({
        url: "/review/pendingleaverequests",
        method: "POST",
        body,
      }),
    }),
 
    approveLeaveRequests: builder.mutation<
      unknown,
      LeaveActionRequest
    >({
      query: (body) => ({
        url: "/review/approval",
        method: "POST",
        body: { ...body, actionStatusId: 4 },
      }),
      invalidatesTags: ["ApprovalSummary"],
    }),
 
    rejectLeaveRequests: builder.mutation<
      unknown,
      LeaveActionRequest
    >({
      query: (body) => ({
        url: "/review/approval",
        method: "POST",
        body: { ...body, actionStatusId: 5 },
      }),
      invalidatesTags: ["ApprovalSummary"],
    }),
  }),
});
 
export const {
  useGetPendingLeaveRequestsMutation,
  useApproveLeaveRequestsMutation,
  useRejectLeaveRequestsMutation,
} = requisitionApi;
 