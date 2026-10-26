import { baseApi } from "@/app/baseApi";

export interface CreateLeaveAdjustmentPayload {
  employeeId: string;
  leaveTypeId: number;
  adjustmentDays: number;
  isAllot: boolean;
  adjustmentMonth: string;
}

const adjustmentFormApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdjustmentEmployees: builder.query<unknown, void>({
      query: () => "admin/ta/leave/adjustment/employees",
    }),
    getAdjustmentLeaveTypes: builder.query<unknown, void>({
      query: () => "admin/ta/leave/adjustment/leavetypes",
    }),
    getAdjustmentConfigurations: builder.query<unknown, void>({
      query: () => "admin/ta/leave/adjustment/configuration",
    }),
    createLeaveAdjustment: builder.mutation<unknown, CreateLeaveAdjustmentPayload>({
      query: (body) => ({
        url: "admin/ta/leave/adjustment/configuration",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAdjustmentEmployeesQuery,
  useGetAdjustmentLeaveTypesQuery,
  useGetAdjustmentConfigurationsQuery,
  useCreateLeaveAdjustmentMutation,
} = adjustmentFormApi;
