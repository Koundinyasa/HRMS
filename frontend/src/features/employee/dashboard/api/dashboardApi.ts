import { baseApi } from "@/app/baseApi";

import type {
  ProfileResponse,
  HolidayResponse,
  MenuResponse,
  ApprovalSummaryResponse,
  TeamAttendanceResponse,
} from "../types/dashboard.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // Employee Profile
    // =========================
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/employee/dashboard/profile",
        method: "GET",
      }),
    }),

    // =========================
    // Holiday List
    // =========================
    getHolidayList: builder.query<HolidayResponse, void>({
      query: () => ({
        url: "/employee/dashboard/list",
        method: "GET",
      }),
    }),

    // =========================
    // Employee Menus
    // =========================
    getMenus: builder.query<MenuResponse, void>({
      query: () => ({
        url: "/employee/dashboard/menus",
        method: "GET",
      }),
    }),

    getApprovalSummary: builder.query<ApprovalSummaryResponse, void>({
      query: () => ({
        url: "/employee/dashboard/approval-summary",
        method: "GET",
      }),
    }),

    getTeamAttendance: builder.query<TeamAttendanceResponse, string | void>({
      query: (date) => ({
        url: "/employee/dashboard/team-attendance",
        method: "GET",
        params: date ? { date } : undefined,
      }),
    }),

    sendWish: builder.mutation<
      { success: boolean; message: string },
      { employeeId: string; eventType: "BIRTHDAY" | "WORK_ANNIVERSARY"; message: string }
    >({
      query: (body) => ({
        url: "/auth/send-wish",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetHolidayListQuery,
  useGetMenusQuery,
  useGetApprovalSummaryQuery,
  useGetTeamAttendanceQuery,
  useSendWishMutation,
} = dashboardApi;