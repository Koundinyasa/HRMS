import { baseApi } from "@/app/baseApi";

export interface DailyEmployeeGridParams {
  policyId: number;
  month: string;
}

const dailyGridApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyLeavePolicies: builder.query<unknown, void>({
      query: () => "admin/ta/leave/daily/policies",
    }),
    getDailyLeaveMonths: builder.query<unknown, void>({
      query: () => "admin/ta/leave/daily/months",
    }),
    getDailyEmployeeGrid: builder.query<unknown, DailyEmployeeGridParams>({
      query: ({ policyId, month }) => ({
        url: "admin/ta/leave/daily/employees",
        params: { policyId, month },
      }),
    }),
  }),
});

export const {
  useGetDailyLeavePoliciesQuery,
  useGetDailyLeaveMonthsQuery,
  useGetDailyEmployeeGridQuery,
} = dailyGridApi;
