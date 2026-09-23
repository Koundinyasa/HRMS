// import { baseApi } from "@/app/baseApi";
// import type {
//   PendingLeaveRequestParams,
//   PendingLeaveRequestsResponse,
// } from "../types/requisition.types";

// export const requisitionApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getPendingLeaveRequests: builder.mutation<
//       PendingLeaveRequestsResponse,
//       PendingLeaveRequestParams
//     >({
//       query: (body) => ({
//         url: "/review/pendingleaverequests",
//         method: "POST",
//         body,
//       }),
//     }),
//     approveLeaveRequests: builder.mutation<
//       unknown,
//       { approvalId: number; actionStatusId: 4; remarks?: string }
//     >({
//       query: (body) => ({
//         url: "/review/approval",
//         method: "POST",
//         body,
//       }),
//     }),
//     rejectLeaveRequests: builder.mutation<
//       unknown,
//       { approvalId: number; actionStatusId: 5; remarks?: string }
//     >({
//       query: (body) => ({
//         url: "/review/approval",
//         method: "POST",
//         body,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetPendingLeaveRequestsMutation,
//   useApproveLeaveRequestsMutation,
//   useRejectLeaveRequestsMutation,
// } = requisitionApi;




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
    }),
  }),
});

export const {
  useGetPendingLeaveRequestsMutation,
  useApproveLeaveRequestsMutation,
  useRejectLeaveRequestsMutation,
} = requisitionApi;