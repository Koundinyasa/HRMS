import { baseApi } from '@/app/baseApi';
import type { DashboardSummary , ClassificationWiseCountDto} from '../types/dashboard.types';
import type { ClassificationId } from '../constants/dashboard.constants';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => '/admin/dashboard/summary',
    }),

    getClassificationData:builder.query<ClassificationWiseCountDto[],ClassificationId>({
      query:(classificationId)=>`/admin/dashboard/classification/${classificationId}`,
    })
  }),
});

export const { useGetDashboardSummaryQuery, useLazyGetDashboardSummaryQuery,useGetClassificationDataQuery, } =dashboardApi;