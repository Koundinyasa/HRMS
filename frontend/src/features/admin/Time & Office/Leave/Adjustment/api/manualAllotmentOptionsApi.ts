import { baseApi } from "@/app/baseApi";

const manualAllotmentOptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManualAllotmentPolicies: builder.query<unknown, void>({
      query: () => "admin/ta/leave/adjustment/manualallotment/policies",
    }),
    getManualAllotmentPolicyLeaves: builder.query<unknown, number>({
      query: (policyId) =>
        `admin/ta/leave/adjustment/manualallotment/policies/${policyId}/leaves`,
    }),
  }),
});

export const {
  useGetManualAllotmentPoliciesQuery,
  useGetManualAllotmentPolicyLeavesQuery,
} = manualAllotmentOptionsApi;
