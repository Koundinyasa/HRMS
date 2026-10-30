import { baseApi } from '@/app/baseApi';
import type {
  DashboardSummary,
  ClassificationWiseCountDto,
  ClassificationDropdownItem,
  ClassificationDropdownResponse,
  TeamLead,
  TeamEmployee,
  TeamEmployeeDetailsResponse,
} from '../types/dashboard.types';
 
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummary, void>({
      query: () => '/admin/dashboard/summary',
    }),
 
    // Classification Wise Count
    getClassificationData: builder.query<ClassificationWiseCountDto, number>({
      query: (classificationId) =>
        `/admin/dashboard/classification/${classificationId}`,
    }),
 
    // Classification Dropdown
    getClassificationDropdown: builder.query<ClassificationDropdownItem[], void>({
      query: () => '/admin/dashboard/classifications',
      transformResponse: (
        response: ClassificationDropdownResponse | ClassificationDropdownItem[]
      ) => {
        if (Array.isArray(response)) return response;
        return response?.data ?? [];
      },
    }),
 
    // Team Leads (flag = 1)
    getTeamLeads: builder.query<TeamLead[], void>({
      query: () => ({
        url: '/admin/dashboard/team-employees',
        params: { flag: 1 },
      }),
      transformResponse: (
        response: TeamEmployeeDetailsResponse | TeamLead[]
      ) => {
        if (Array.isArray(response)) return response;
        return (response?.data as TeamLead[]) ?? [];
      },
    }),
 
    // Team Members (flag = 2)
    getTeamMembers: builder.query<TeamEmployee[], string>({
      query: (leadEmployeeId) => ({
        url: '/admin/dashboard/team-employees',
        params: {
          flag: 2,
          leadEmployeeId,
        },
      }),
      transformResponse: (
        response: TeamEmployeeDetailsResponse | TeamEmployee[]
      ) => {
        if (Array.isArray(response)) return response;
        return (response?.data as TeamEmployee[]) ?? [];
      },
    }),
  }),
});
 
export const {
  useGetDashboardSummaryQuery,
  useLazyGetDashboardSummaryQuery,
  useGetClassificationDataQuery,
  useGetClassificationDropdownQuery,
  useGetTeamLeadsQuery,
  useGetTeamMembersQuery,
  useLazyGetTeamMembersQuery,
} = dashboardApi;
 