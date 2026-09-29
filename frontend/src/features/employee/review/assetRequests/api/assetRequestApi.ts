import { baseApi } from "@/app/baseApi";

import type {
  AssetRequest,
  AssetRequestActionPayload,
  AssetRequestFormData,
  AssetRequestListResponse,
  AssetRequestResponse,
} from "../types/assetRequest.types";

export const assetRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get Asset Requests
     */
    getAssetRequests: builder.query<
      AssetRequestListResponse,
      void
    >({
      query: () => ({
        url: "/assetrequests",
        method: "GET",
      }),

      providesTags: ["AssetRequests"],
    }),

    /**
     * Get Asset Request by ID
     */
    getAssetRequestById: builder.query<
      AssetRequestResponse,
      number
    >({
      query: (id) => ({
        url: `/assetrequests/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        { type: "AssetRequests", id },
      ],
    }),

    /**
     * Create Asset Request
     */
    createAssetRequest: builder.mutation<
      AssetRequestResponse,
      AssetRequestFormData
    >({
      query: (body) => ({
        url: "/assetrequests",
        method: "POST",
        body,
      }),

      invalidatesTags: ["AssetRequests"],
    }),

    /**
     * Approve Asset Request
     */
    approveAssetRequest: builder.mutation<
      AssetRequestResponse,
      AssetRequestActionPayload
    >({
      query: ({ id, remarks }) => ({
        url: `/assetrequests/${id}/approve`,
        method: "POST",
        body: {
          remarks,
        },
      }),

      invalidatesTags: ["AssetRequests"],
    }),

    /**
     * Reject Asset Request
     */
    rejectAssetRequest: builder.mutation<
      AssetRequestResponse,
      AssetRequestActionPayload
    >({
      query: ({ id, remarks }) => ({
        url: `/assetrequests/${id}/reject`,
        method: "POST",
        body: {
          remarks,
        },
      }),

      invalidatesTags: ["AssetRequests"],
    }),

    /**
     * Cancel Asset Request
     */
    cancelAssetRequest: builder.mutation<
      AssetRequestResponse,
      AssetRequestActionPayload
    >({
      query: ({ id, remarks }) => ({
        url: `/assetrequests/${id}/cancel`,
        method: "POST",
        body: {
          remarks,
        },
      }),

      invalidatesTags: ["AssetRequests"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAssetRequestsQuery,
  useGetAssetRequestByIdQuery,
  useCreateAssetRequestMutation,
  useApproveAssetRequestMutation,
  useRejectAssetRequestMutation,
  useCancelAssetRequestMutation,
} = assetRequestApi;