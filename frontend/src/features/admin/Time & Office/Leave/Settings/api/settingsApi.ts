import { baseApi } from '@/app/baseApi';
import type {
  LeavePolicySummary,
  PolicyLeaveRow,
  LeaveBehaviorSettings,
  LeavePolicyFormValues,
  AddLeaveTypeFormValues,
} from '../types/leavesettings.types';

export const leaveSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /admin/ta/leave/settings/policies
    getLeavePolicies: builder.query<LeavePolicySummary[], void>({
      query: () => 'admin/ta/leave/settings/policies',
    }),

    // 2. GET /admin/ta/leave/settings/policies/:policyId/leaves
    getPolicyLeaves: builder.query<PolicyLeaveRow[], number>({
      query: (policyId) => `admin/ta/leave/settings/policies/${policyId}/leaves`,
    }),

    // 3. GET /admin/ta/leave/settings/policies/:policyId/leaves/:leaveId
    getPolicyLeaveDetail: builder.query<
      LeaveBehaviorSettings,
      { policyId: number; leaveId: number }
    >({
      query: ({ policyId, leaveId }) =>
        `admin/ta/leave/settings/policies/${policyId}/leaves/${leaveId}`,
    }),

    // 4. PUT /admin/ta/leave/settings/policies/:policyId/leaves/:leaveId
    updatePolicyLeaveDetail: builder.mutation<
      void,
      { policyId: number; leaveId: number; body: LeaveBehaviorSettings }
    >({
      query: ({ policyId, leaveId, body }) => ({
        url: `admin/ta/leave/settings/policies/${policyId}/leaves/${leaveId}`,
        method: 'PUT',
        body,
      }),
    }),

    // 5. POST /admin/ta/leave/settings/leave-policy  (create a new policy)
    createLeavePolicy: builder.mutation<{ policyId: number }, LeavePolicyFormValues>({
      query: (body) => ({
        url: 'admin/ta/leave/settings/leave-policy',
        method: 'POST',
        body,
      }),
    }),

    // 6. PUT /admin/ta/leave/settings/leave-policy  (edit an existing policy)
    updateLeavePolicy: builder.mutation<void, LeavePolicyFormValues>({
      query: (body) => ({
        url: 'admin/ta/leave/settings/leave-policy',
        method: 'PUT',
        body,
      }),
    }),

    // 7. POST /admin/ta/leave/settings/leave-policy/details
    // (Image 3 — add a leave type to an existing policy)
    addLeaveTypeToPolicy: builder.mutation<void, AddLeaveTypeFormValues>({
      query: (body) => ({
        url: 'admin/ta/leave/settings/leave-policy/details',
        method: 'POST',
        body,
      }),
    }),

    // 8. PUT /admin/ta/leave/settings/leave-policy/details
    // ⚠️ Distinction from #4 is unconfirmed — using this for updating the
    // leave-type↔policy association itself (e.g. effectiveFrom) separately
    // from #4's full behavior-settings update. Confirm this split is right.
    updateLeaveTypeInPolicy: builder.mutation<void, AddLeaveTypeFormValues>({
      query: (body) => ({
        url: 'admin/ta/leave/settings/leave-policy/details',
        method: 'PUT',
        body,
      }),
    }),

    // ⚠️ NOT GIVEN — guessed URL, needed for the trash icon on each leave
    // row (Image 1). Confirm/replace with the real endpoint.
    removeLeaveFromPolicy: builder.mutation<void, { policyId: number; leaveId: number }>({
      query: ({ policyId, leaveId }) => ({
        url: `admin/ta/leave/settings/policies/${policyId}/leaves/${leaveId}`,
        method: 'DELETE',
      }),
    }),

    // ⚠️ NOT GIVEN — guessed URL, needed for the trash icon next to a
    // policy itself (Image 5). Confirm/replace with the real endpoint.
    deleteLeavePolicy: builder.mutation<void, number>({
      query: (policyId) => ({
        url: `admin/ta/leave/settings/leave-policy/${policyId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetLeavePoliciesQuery,
  useGetPolicyLeavesQuery,
  useGetPolicyLeaveDetailQuery,
  useUpdatePolicyLeaveDetailMutation,
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
  useAddLeaveTypeToPolicyMutation,
  useUpdateLeaveTypeInPolicyMutation,
  useRemoveLeaveFromPolicyMutation,
  useDeleteLeavePolicyMutation,
} = leaveSettingsApi;