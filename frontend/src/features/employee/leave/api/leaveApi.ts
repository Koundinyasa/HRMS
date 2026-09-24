import { baseApi } from "@/app/baseApi";

import type {
  ApplyLeavePayload,
  ApplyLeaveResponse,
  EmployeeLeaveDetailsResponse,
  Holiday,
  HrApplyLeavePayload,
  LeaveBalanceResponse,
  LeaveHistoryResponse,
  LeaveStatusResponse,
  LeaveType,
  ReportingEmployee,
  WithdrawLeavePayload,
  WithdrawLeaveResponse,
} from "../types/leave.types";

export const leaveApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    // ===============================
    // Leave Types
    // ===============================
    getLeaveTypes: builder.query<LeaveType[], string | void>({
      query: (employeeId) => ({
        url: "/employee/leave/leavetypes",
        params: employeeId ? { employeeId } : undefined,
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
    applyLeave: builder.mutation<ApplyLeaveResponse, ApplyLeavePayload>({
      query: (body) => {
        const formData = new FormData();

        formData.append("leaveTypeId", body.leaveTypeId.toString());

        formData.append("fromDate", body.fromDate);

        formData.append("toDate", body.toDate);

        formData.append("reason", body.reason);

        formData.append("isHalfDay", body.isHalfDay);

        formData.append("sessionFrom", body.sessionFrom);

        formData.append("sessionTo", body.sessionTo);

        if (body.attachment) {
          formData.append("document", body.attachment);
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

    // ===============================
    // Reporting Employees
    // ===============================
    getReportingEmployees: builder.query<ReportingEmployee[], void>({
      query: () => ({
        url: "/employee/leave/reporting-employees",
      }),

      // The SP reports failures as a 200 row {StatusCode, StatusMessage}.
      transformResponse: (rows: ReportingEmployee[]) =>
        Array.isArray(rows) ? rows.filter((r) => r.EmployeeID) : [],

      providesTags: ["Leave"],
    }),

    // ===============================
    // Employee Leave Details (manager view)
    // ===============================
    getEmployeeLeaveDetails: builder.query<
      EmployeeLeaveDetailsResponse,
      string
    >({
      query: (employeeId) => ({
        url: "/employee/leave/employee-details",
        params: { employeeId },
      }),

      providesTags: ["Leave"],
    }),

    // ===============================
    // HR / Manager Apply Leave
    // ===============================
    hrApplyLeave: builder.mutation<ApplyLeaveResponse[], HrApplyLeavePayload>({
      query: (body) => {
        const formData = new FormData();

        formData.append("employeeId", body.employeeId);
        formData.append("leaveTypeId", body.leaveTypeId.toString());
        formData.append("fromDate", body.fromDate);
        formData.append("toDate", body.toDate);
        formData.append("reason", body.reason);
        formData.append("isHalfDay", body.isHalfDay);
        formData.append("sessionFrom", body.sessionFrom);
        formData.append("sessionTo", body.sessionTo);
        formData.append("isHRForceApply", String(body.isHRForceApply ? 1 : 0));

        if (body.attachment) {
          formData.append("document", body.attachment);
        }

        return {
          url: "/employee/leave/applyhr",
          method: "POST",
          body: formData,
        };
      },

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
  useGetReportingEmployeesQuery,
  useGetEmployeeLeaveDetailsQuery,
  useHrApplyLeaveMutation,
  useApplyLeaveMutation,
  useWithdrawLeaveMutation,
} = leaveApi;
