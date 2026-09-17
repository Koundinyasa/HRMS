import { baseApi } from '@/app/baseApi';
import type {
  DashboardApiResponse,
  ComplianceApiResponse,
  ConsolidatedSalaryApiResponse,
} from '../types/details.types';

export const detailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroupDashboard: builder.query<DashboardApiResponse, void>({
      query: () => 'admin/organizations/details/dashboard',
    }),

    getComplianceOverview: builder.query<ComplianceApiResponse, { monthYear?: string } | void>({
      query: (params) => ({
        url: 'admin/organizations/details/compliance-overview',
        params: params?.monthYear ? { monthYear: params.monthYear } : undefined,
      }),
    }),

    getConsolidatedSalary: builder.query<ConsolidatedSalaryApiResponse, { monthYear?: string } | void>({
      query: (params) => ({
        url: 'admin/organizations/details/consolidated-salary',
        params: params?.monthYear ? { monthYear: params.monthYear } : undefined,
      }),
    }),
  }),
});

export const {
  useGetGroupDashboardQuery,
  useGetComplianceOverviewQuery,
  useGetConsolidatedSalaryQuery,
} = detailsApi;