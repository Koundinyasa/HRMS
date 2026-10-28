import { baseApi } from "@/app/baseApi";

import type { ProfileInfoResponse } from "../types/profile.types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileInfo: builder.query<
      ProfileInfoResponse,
      void
    >({
      query: () => ({
        url: "/employee/profile/info",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProfileInfoQuery, } = profileApi;