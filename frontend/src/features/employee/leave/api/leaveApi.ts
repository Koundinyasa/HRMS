import { baseApi } from "@/app/baseApi";

import type {
  ApplyLeavePayload,
  ApplyLeaveResponse,
  Holiday,
  LeaveBalanceResponse,
  LeaveHistoryResponse,
  LeaveStatusResponse,
  LeaveType,
  WithdrawLeavePayload,
  WithdrawLeaveResponse,
} from "../types/leave.types";

export const leaveApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    // ===============================
    // Leave Types
    // ===============================
    getLeaveTypes: builder.query<LeaveType[], void>({
      query: () => ({
        url: "/employee/leave/leavetypes",
      }),

      providesTags: ["Leave"],
    }),

    // ===============================
    // Holiday List
    // ===============================
    getHolidayList: builder.query<Holiday[], void>({
      query: () => ({
        url: "/employee/leave/holidaylist",
      }),

      providesTags: ["Leave"],
    }),

    // ===============================
    // Leave Status
    // ===============================
    getLeaveStatus: builder.query<LeaveStatusResponse, void>({
      query: () => ({
        url: "/employee/leave/status",
      }),

      providesTags: ["Leave"],
    }),

    // ===============================
    // Leave History
    // ===============================
    getLeaveHistory: builder.query<LeaveHistoryResponse, void>({
      query: () => ({
        url: "/employee/leave/history",
      }),

      providesTags: ["Leave"],
    }),

    // ===============================
    // Leave Balance
    // ===============================
    getLeaveBalance: builder.query<LeaveBalanceResponse, void>({
      query: () => ({
        url: "/employee/leave/balance",
      }),

      providesTags: ["Leave"],
    }),

    // ===============================
    // Apply Leave
    // ===============================
    applyLeave: builder.mutation<
      ApplyLeaveResponse,
      ApplyLeavePayload
    >({
      query: (body) => {
        const formData = new FormData();

        formData.append(
          "leaveTypeId",
          body.leaveTypeId.toString()
        );

        formData.append(
          "fromDate",
          body.fromDate
        );

        formData.append(
          "toDate",
          body.toDate
        );

        formData.append(
          "reason",
          body.reason
        );

        formData.append(
          "isHalfDay",
          body.isHalfDay
        );

        formData.append(
          "sessionFrom",
          body.sessionFrom
        );

        formData.append(
          "sessionTo",
          body.sessionTo
        );

        if (body.attachment) {
          formData.append(
            "document",
            body.attachment
          );
        }

        return {
          url: "/employee/leave/apply",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Leave"],
    }),

    // ===============================
    // Withdraw Leave
    // ===============================
    withdrawLeave: builder.mutation<
      WithdrawLeaveResponse[],
      WithdrawLeavePayload
    >({
      query: (body) => ({
        url: "/employee/leave/withdrawcancel",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Leave"],
    }),
  }),
});

export const {
  useGetLeaveTypesQuery,
  useGetHolidayListQuery,
  useGetLeaveStatusQuery,
  useGetLeaveHistoryQuery,
  useGetLeaveBalanceQuery,
  useApplyLeaveMutation,
  useWithdrawLeaveMutation,
} = leaveApi;