import { baseApi } from "@/app/baseApi";

import type {
  ApiResponse,
  ResignationRequest,
  SeparationStatusResponse,
  WithdrawRequest,
} from "../types/separation.types";

export const separationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Separation Status
     */
    getSeparationStatus: builder.query<
      SeparationStatusResponse,
      void
    >({
      query: () => ({
        url: "/employee/separation/status",
        method: "GET",
      }),

      providesTags: ["Separation"],
    }),

    /**
     * Submit Resignation
     */
    submitResignation: builder.mutation<
      ApiResponse,
      ResignationRequest
    >({
      query: (body) => ({
        url: "/employee/separation/resignation",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Separation"],
    }),

    /**
     * Withdraw Resignation
     */
    withdrawResignation: builder.mutation<
      ApiResponse,
      WithdrawRequest
    >({
      query: (body) => ({
        url: "/employee/separation/withdraw",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Separation"],
    }),
  }),
});

export const {
  useGetSeparationStatusQuery,
  useLazyGetSeparationStatusQuery,
  useSubmitResignationMutation,
  useWithdrawResignationMutation,
} = separationApi;