import { baseApi } from "@/app/baseApi";

import type { ProfileResponse, HolidayResponse, MenuResponse,ApprovalSummaryResponse, } from "../types/dashboard.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/employee/dashboard/profile",
        method: "GET",
      }),
    }),

    getHolidayList: builder.query<
      HolidayResponse,
      void>({
        query: () => ({
          url: "/employee/dashboard/list",
          method: "GET",
        }),
      }),

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
    
  }),
});

export const { useGetProfileQuery, useGetHolidayListQuery, useGetMenusQuery,useGetApprovalSummaryQuery, } = dashboardApi;