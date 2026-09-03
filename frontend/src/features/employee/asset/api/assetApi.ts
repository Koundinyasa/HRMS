import { baseApi } from "@/app/baseApi";
import type {
  ApiMessageResponse,
  AssetHistoryResponse,
  AssetRequestStatusResponse,
  AssetTypeItem,
  AssetTypesResponse,
  CreateAssetRequestResponse,
  PendingAssetResponse,
} from "../types/assetTypes";


function throwIfApiError<T extends { StatusCode?: number; Message?: string }>(response: T): T {
  if (response.StatusCode && response.StatusCode >= 400) {
    throw { status: response.StatusCode, data: response };
  }
  return response;
}

export const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    createAssetRequest: builder.mutation<
      CreateAssetRequestResponse,
      { assetId: number; remarks: string }
    >({
      query: (body) => ({
        url: "/asset/request",
        method: "POST",
        body,
      }),
      transformResponse: throwIfApiError<CreateAssetRequestResponse>,
      invalidatesTags: ["AssetRequests"],
    }),

    
    getAssetHistory: builder.query<AssetHistoryResponse, void>({
      query: () => ({
        url: "/asset/history",
        method: "GET",
        cache: "no-store" as RequestCache,
      }),
      providesTags: ["AssetRequests"],
    }),

    
    getPendingAssetRequests: builder.query<PendingAssetResponse, void>({
      query: () => ({
        url: "/asset/pendingrequests",
        method: "GET",
        cache: "no-store" as RequestCache,
      }),
      providesTags: ["AssetRequests"],
    }),

    
    getMyAssetRequestStatus: builder.query<AssetRequestStatusResponse,void>({
      query: () => ({
        url: "/asset/return",
        method: "GET",
        cache: "no-store" as RequestCache,
      }),
      providesTags: ["AssetRequests"],
    }),

   
    approveAssetStage: builder.mutation<
      ApiMessageResponse,
      { requestId: number; stageOrder: number; actionStatusId: number; remarks: string }
    >({
      query: (body) => ({
        url: "/asset/approvestage",
        method: "PUT",
        body,
      }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["AssetRequests"],
    }),

    
    allocateAsset: builder.mutation<
      ApiMessageResponse,
      {
        assetRequestId: number;
        assetNumber: string;
        configuration: string;
        assetCondition: string;
        location: string;
        assignedBy: string;
      }
    >({
      query: (body) => ({
        url: "/asset/allocation",
        method: "POST",
        body,
      }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["AssetRequests"],
    }),

    
    createAssetType: builder.mutation<ApiMessageResponse, { assetName: string }>({
      query: (body) => ({
        url: "/asset/type",
        method: "POST",
        body,
      }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["AssetTypes"],
    }),

    
    updateAssetType: builder.mutation<
      ApiMessageResponse,
      { assetName: string; newAssetName: string }
    >({
      query: (body) => ({
        url: "/asset/type/update",
        method: "PUT",
        body,
      }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["AssetTypes"],
    }),

    
    updateAssetTypeStatus: builder.mutation<
      ApiMessageResponse,
      { assetName: string; isActive: 0 | 1 }
    >({
      query: (body) => ({
        url: "/asset/type/status",
        method: "PUT",
        body,
      }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["AssetTypes"],
    }),

    
    getAssetTypes: builder.query<AssetTypeItem[], void>({
  query: () => ({
    url: "/asset/types",
    method: "GET",
    cache: "no-store" as RequestCache,
  }),

  transformResponse: (response: AssetTypesResponse) => {
    const section = response.sections.find(
      (section) => section.title === "Asset Types"
    );

    if (!section) return [];

    return section.records.map((record) => {
      const assetId = record.fields.find(
        (field) => field.label === "AssetID"
      )?.value;

      const assetName = record.fields.find(
        (field) => field.label === "AssetName"
      )?.value;

      return {
        AssetID: Number(assetId),
        AssetName: String(assetName),
      };
    });
  },

  providesTags: ["AssetTypes"],
}),
  }),
});

export const {
  useCreateAssetRequestMutation,
  useGetAssetHistoryQuery,
  useGetPendingAssetRequestsQuery,
  useGetMyAssetRequestStatusQuery,
  useApproveAssetStageMutation,
  useAllocateAssetMutation,
  useCreateAssetTypeMutation,
  useUpdateAssetTypeMutation,
  useUpdateAssetTypeStatusMutation,
  useGetAssetTypesQuery,
} = assetApi;