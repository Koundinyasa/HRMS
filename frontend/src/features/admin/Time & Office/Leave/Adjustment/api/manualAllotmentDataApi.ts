import { baseApi } from "@/app/baseApi";

export interface ManualAllotmentListParams {
  leaveTypeId?: number;
  month?: number;
  year?: number;
}

export interface SaveManualLeaveAllotmentPayload {
  employeeId: string;
  leaveTypeId: number;
  adjustmentMonth?: number;
  allotment: number;
}

const manualAllotmentDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManualAllotmentList: builder.query<unknown, ManualAllotmentListParams>({
      query: (params) => ({
        url: "admin/ta/leave/adjustment/manual-allotment",
        params,
      }),
    }),
    saveManualLeaveAllotment: builder.mutation<unknown, SaveManualLeaveAllotmentPayload>({
      query: (body) => ({
        url: "admin/ta/leave/adjustment/manual-allotment",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetManualAllotmentListQuery,
  useSaveManualLeaveAllotmentMutation,
} = manualAllotmentDataApi;
