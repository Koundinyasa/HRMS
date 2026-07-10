import { baseApi } from '@/app/baseApi';
import type { DashboardSummary } from '../types/dashboard.types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => '/admin/dashboard/summary',
    }),
  }),
});

export const { useGetDashboardSummaryQuery, useLazyGetDashboardSummaryQuery } =
  dashboardApi;