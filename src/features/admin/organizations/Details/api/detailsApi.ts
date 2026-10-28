import { baseApi } from '@/app/baseApi';
import type {
  DashboardApiResponse,
  ComplianceApiResponse,
  ConsolidatedSalaryApiResponse,
  GroupDashboardRequest,
} from '../types/details.types';

export const detailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroupDashboard: builder.query<DashboardApiResponse, GroupDashboardRequest>({
      query: (body) => ({
        url: 'admin/group-of-company/details/dashboard/employee-dashboard',
        method: 'POST',
        body,
      }),
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