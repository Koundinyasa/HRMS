// import { baseApi } from '@/app/baseApi';
// import type {CreateAttendance,AttendanceIntegration,ReconcileLeaveUpdate} from '../types/attendance.types';

// export const attendanceApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // ---- Configuration (GET) ----
//     getAttendance: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/configurations/configuration',
//     }),

//     getSalaryCalenderdays: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/configurations/salarycalendardays',
//     }),

//     getAttendancetypes: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/configurations/attendancetypes',
//     }),

//     // ---- Configuration (POST) ----
//     postAttendanceConfiguration: builder.mutation<any, CreateAttendance>({
//       query: (dto) => ({
//         url: 'admin/ta/attendance/configurations/save',
//         method: 'POST',
//         body: dto,
//       }),
//     }),

//     // ---- Integrations (GET) ----
//     getDescriptions: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/integrations/settings/descriptions',
//     }),

//     getIntegrations: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/integrations/settings/integrationtypes',
//     }),

//     getApplicableAttendance: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/integrations/settings/applicableattendance',
//     }),

//     getLeaveAbbreviations: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/integrations/settings/leaveabbreviations',
//     }),

//     getCalculateOT: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/integrations/settings/calculateot',
//     }),

//     // ---- Integrations (POST) ----
//     postAttendanceIntegration: builder.mutation<any, AttendanceIntegration>({
//       query: (dto) => ({
//         url: 'admin/ta/attendance/integrations/settings/save',
//         method: 'POST',
//         body: dto,
//       }),
//     }),

//     getAttendanceIntegrationDescriptions: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/integrations/attendanceintegration/descriptions',
//     }),

//     // ---- Reconcile Leave ----
//     getReconcileLeaveTypes: builder.query<any, void>({
//       query: () => 'admin/ta/attendance/integrations/reconcileleave/leavetypes',
//     }),

//     updateReconcileLeave: builder.mutation<any, ReconcileLeaveUpdate>({
//       query: (dto) => ({
//         url: 'admin/ta/attendance/integrations/reconcileleave/update',
//         method: 'POST',
//         body: dto,
//       }),
//     }),
//     getMissingLeaveRecords: builder.query<MissingLeaveRow[], ReconcileLeaveQueryParams>({
//       query: (params) => ({
//         url: 'admin/ta/attendance/integrations/reconcileleave/missingleave',
//         params,
//       }),
//     }),
 
//     // ---- Reconcile Leave: Penalty Leave Deduction tab ----
//     // Only fetches once a leaveTypeId is chosen + "Apply" is clicked —
//     // wire this up with `skip: !leaveTypeId` on the frontend.
//     getPenaltyLeaveDeductionRecords: builder.query<
//       PenaltyLeaveDeductionRow[],
//       PenaltyLeaveDeductionQueryParams
//     >({
//       query: (params) => ({
//         url: 'admin/ta/attendance/integrations/reconcileleave/penaltyleavededuction',
//         params,
//       }),
//     }),
 
//     // ---- Reconcile Leave: Leave/Punch Exist tab ----
//     getLeavePunchExistRecords: builder.query<LeavePunchExistRow[], ReconcileLeaveQueryParams>({
//       query: (params) => ({
//         url: 'admin/ta/attendance/integrations/reconcileleave/leavepunchexist',
//         params,
//       }),
//     }),
//   }),
// });

// export const {
//   useGetAttendanceQuery,
//   useGetSalaryCalenderdaysQuery,
//   useGetAttendancetypesQuery,
//   usePostAttendanceConfigurationMutation,
//   useGetDescriptionsQuery,
//   useGetIntegrationsQuery,
//   useGetApplicableAttendanceQuery,
//   useGetLeaveAbbreviationsQuery,
//   useGetCalculateOTQuery,
//   usePostAttendanceIntegrationMutation,
//   useGetAttendanceIntegrationDescriptionsQuery,
//   useGetReconcileLeaveTypesQuery,
//   useUpdateReconcileLeaveMutation,
//   useGetMissingLeaveRecordsQuery,
//   useGetPenaltyLeaveDeductionRecordsQuery,
//   useGetLeavePunchExistRecordsQuery,
// } = attendanceApi;



import { baseApi } from '@/app/baseApi';
import type {
  CreateAttendance,
  AttendanceIntegration,
  ReconcileLeaveUpdate,
  ReconcileLeaveQueryParams,
  MissingLeaveRow,
  PenaltyLeaveDeductionRow,
  PenaltyLeaveDeductionQueryParams,
  LeavePunchExistRow,
} from '../types/attendance.types';

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

    // ⚠️ URL paths are guessed (no backend route confirmed yet).
    // Update the `url` strings once the real endpoints exist.

    // ---- Reconcile Leave: Missing Leave tab ----
    getMissingLeaveRecords: builder.query<MissingLeaveRow[], ReconcileLeaveQueryParams>({
      query: (params) => ({
        url: 'admin/ta/attendance/integrations/reconcileleave/missingleave',
        params,
      }),
    }),

    // ---- Reconcile Leave: Penalty Leave Deduction tab ----
    // Only fetches once a leaveTypeId is chosen + "Apply" is clicked —
    // wired up with `skip: !leaveTypeId` on the frontend.
    getPenaltyLeaveDeductionRecords: builder.query<
      PenaltyLeaveDeductionRow[],
      PenaltyLeaveDeductionQueryParams
    >({
      query: (params) => ({
        url: 'admin/ta/attendance/integrations/reconcileleave/penaltyleavededuction',
        params,
      }),
    }),

    // ---- Reconcile Leave: Leave/Punch Exist tab ----
    getLeavePunchExistRecords: builder.query<LeavePunchExistRow[], ReconcileLeaveQueryParams>({
      query: (params) => ({
        url: 'admin/ta/attendance/integrations/reconcileleave/leavepunchexist',
        params,
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
  useGetMissingLeaveRecordsQuery,
  useGetPenaltyLeaveDeductionRecordsQuery,
  useGetLeavePunchExistRecordsQuery,
} = attendanceApi;