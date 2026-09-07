import { baseApi } from '@/app/baseApi';
import type {CreateAttendance,AttendanceIntegration,ReconcileLeaveUpdate} from '../types/attendance.types';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---- Configuration (GET) ----
    getAttendance: builder.query<any, void>({
      query: () => 'admin/ta/attendance/configurations/configuration',
    }),

    getSalaryCalenderdays: builder.query<any, void>({
      query: () => 'admin/ta/attendance/configurations/salarycalendardays',
    }),

    getAttendancetypes: builder.query<any, void>({
      query: () => 'admin/ta/attendance/configurations/attendancetypes',
    }),

    // ---- Configuration (POST) ----
    postAttendanceConfiguration: builder.mutation<any, CreateAttendance>({
      query: (dto) => ({
        url: 'admin/ta/attendance/configurations/save',
        method: 'POST',
        body: dto,
      }),
    }),

    // ---- Integrations (GET) ----
    getDescriptions: builder.query<any, void>({
      query: () => 'admin/ta/attendance/integrations/settings/descriptions',
    }),

    getIntegrations: builder.query<any, void>({
      query: () => 'admin/ta/attendance/integrations/settings/integrationtypes',
    }),

    getApplicableAttendance: builder.query<any, void>({
      query: () => 'admin/ta/attendance/integrations/settings/applicableattendance',
    }),

    getLeaveAbbreviations: builder.query<any, void>({
      query: () => 'admin/ta/attendance/integrations/settings/leaveabbreviations',
    }),

    getCalculateOT: builder.query<any, void>({
      query: () => 'admin/ta/attendance/integrations/settings/calculateot',
    }),

    // ---- Integrations (POST) ----
    postAttendanceIntegration: builder.mutation<any, AttendanceIntegration>({
      query: (dto) => ({
        url: 'admin/ta/attendance/integrations/settings/save',
        method: 'POST',
        body: dto,
      }),
    }),

    getAttendanceIntegrationDescriptions: builder.query<any, void>({
      query: () => 'admin/ta/attendance/integrations/attendanceintegration/descriptions',
    }),

    // ---- Reconcile Leave ----
    getReconcileLeaveTypes: builder.query<any, void>({
      query: () => 'admin/ta/attendance/integrations/reconcileleave/leavetypes',
    }),

    updateReconcileLeave: builder.mutation<any, ReconcileLeaveUpdate>({
      query: (dto) => ({
        url: 'admin/ta/attendance/integrations/reconcileleave/update',
        method: 'POST',
        body: dto,
      }),
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useGetSalaryCalenderdaysQuery,
  useGetAttendancetypesQuery,
  usePostAttendanceConfigurationMutation,
  useGetDescriptionsQuery,
  useGetIntegrationsQuery,
  useGetApplicableAttendanceQuery,
  useGetLeaveAbbreviationsQuery,
  useGetCalculateOTQuery,
  usePostAttendanceIntegrationMutation,
  useGetAttendanceIntegrationDescriptionsQuery,
  useGetReconcileLeaveTypesQuery,
  useUpdateReconcileLeaveMutation,
} = attendanceApi;