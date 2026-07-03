import { baseApi } from "@/app/baseApi";

import type { ProfileResponse,HolidayResponse} from "../types/dashboard.types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/employee/profile",
        method: "GET",
      }),
    }),

     getHolidayList: builder.query<
      HolidayResponse,
      void>({
      query: () => ({
        url: "/employee/list",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProfileQuery,useGetHolidayListQuery,} = dashboardApi;