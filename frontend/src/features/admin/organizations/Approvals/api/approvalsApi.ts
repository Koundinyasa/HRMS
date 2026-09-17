import { baseApi } from '@/app/baseApi';
import type { ApprovalsApiResponse } from '../types/approvals.types';

export const approvalsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanyApprovals: builder.query<ApprovalsApiResponse, void>({
      query: () => 'admin/organizations/approvals',
    }),
  }),
});

export const { useGetAllCompanyApprovalsQuery } = approvalsApi;