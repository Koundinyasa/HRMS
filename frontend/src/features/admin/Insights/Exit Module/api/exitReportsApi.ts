// import { baseApi } from "../../../../../app/baseApi";

// import type {
//   AuditLogEntry,
//   AuditLogQuery,
//   ExitEmployee,
//   ExitFilterOption,
//   ExitReportFilters,
//   LetterEmployee,
// } from "../types/exitReport.types";

// export const exitReportsApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getExitReports: builder.query<
//       ExitEmployee[],
//       Partial<ExitReportFilters>
//     >({
//       query: (filters) => ({
//         url: "/api/reports/exitmodule",
//         method: "GET",
//         params: filters,
//       }),

//       providesTags: ["ExitReport"],
//     }),

//     getExitBranches: builder.query<ExitFilterOption[], void>({
//       query: () => ({
//         url: "/api/reports/exitmodule/filters/branches",
//         method: "GET",
//       }),

//       providesTags: ["ExitBranches"],
//     }),

//     getExitSalaryStructures: builder.query<ExitFilterOption[], void>({
//       query: () => ({
//         url: "/api/reports/exitmodule/filters/salarystructures",
//         method: "GET",
//       }),

//       providesTags: ["ExitSalaryStructures"],
//     }),

//     getExitLeaves: builder.query<ExitFilterOption[], void>({
//       query: () => ({
//         url: "/api/reports/exitmodule/filters/leaves",
//         method: "GET",
//       }),

//       providesTags: ["ExitLeaves"],
//     }),

//     getExitAttendance: builder.query<ExitFilterOption[], void>({
//       query: () => ({
//         url: "/api/reports/exitmodule/filters/attendance",
//         method: "GET",
//       }),

//       providesTags: ["ExitAttendance"],
//     }),

//     getExitDesignations: builder.query<ExitFilterOption[], void>({
//       query: () => ({
//         url: "/api/reports/exitmodule/filters/designations",
//         method: "GET",
//       }),

//       providesTags: ["ExitDesignations"],
//     }),

//     getExitQueries: builder.query<ExitFilterOption[], void>({
//       query: () => ({
//         url: "/api/reports/exitmodule/filters/queries",
//         method: "GET",
//       }),

//       providesTags: ["ExitQueries"],
//     }),

//     getRelievingLetterEmployee: builder.query<
//       LetterEmployee,
//       string
//     >({
//       query: (employeeId) => ({
//         url: `/api/reports/exitmodule/relieving-letter/${employeeId}`,
//         method: "GET",
//       }),

//       providesTags: ["ExitReport"],
//     }),

//     getExperienceLetterEmployee: builder.query<
//       LetterEmployee,
//       string
//     >({
//       query: (employeeId) => ({
//         url: `/api/reports/exitmodule/experience-letter/${employeeId}`,
//         method: "GET",
//       }),

//       providesTags: ["ExitReport"],
//     }),

//     getExitAuditLog: builder.query<
//       AuditLogEntry[],
//       AuditLogQuery
//     >({
//       query: ({ reportType, ...rest }) => ({
//         url: `/api/reports/exitmodule/${reportType}/audit-log`,
//         method: "GET",
//         params: rest,
//       }),

//       providesTags: ["ExitAuditLog"],
//     }),
//   }),

//   overrideExisting: false,
// });

// export const {
//   useGetExitReportsQuery,
//   useGetExitBranchesQuery,
//   useGetExitSalaryStructuresQuery,
//   useGetExitLeavesQuery,
//   useGetExitAttendanceQuery,
//   useGetExitDesignationsQuery,
//   useGetExitQueriesQuery,
//   useGetRelievingLetterEmployeeQuery,
//   useGetExperienceLetterEmployeeQuery,
//   useGetExitAuditLogQuery,
// } = exitReportsApi;

import { baseApi } from "../../../../../app/baseApi";

import type {
  AuditLogEntry,
  AuditLogQuery,
  ExitEmployee,
  ExitFilterOption,
  ExitReportFilters,
  LetterEmployee,
} from "../types/exitReport.types";

export const exitReportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =======================================================
       EXIT REPORT
       ======================================================= */
    getExitReports: builder.query<
      ExitEmployee[],
      Partial<ExitReportFilters>
    >({
      query: (filters) => ({
        url: "/reports/exitmodule",
        method: "GET",
        params: filters,
      }),

      providesTags: ["ExitReport"],
    }),

    /* =======================================================
       BRANCHES
       ======================================================= */
    getExitBranches: builder.query<ExitFilterOption[], void>({
      query: () => ({
        url: "/reports/exitmodule/filters/branches",
        method: "GET",
      }),

      providesTags: ["ExitBranches"],
    }),

    /* =======================================================
       SALARY STRUCTURES
       ======================================================= */
    getExitSalaryStructures: builder.query<ExitFilterOption[], void>({
      query: () => ({
        url: "/reports/exitmodule/filters/salarystructures",
        method: "GET",
      }),

      providesTags: ["ExitSalaryStructures"],
    }),

    /* =======================================================
       LEAVES
       ======================================================= */
    getExitLeaves: builder.query<ExitFilterOption[], void>({
      query: () => ({
        url: "/reports/exitmodule/filters/leaves",
        method: "GET",
      }),

      providesTags: ["ExitLeaves"],
    }),

    /* =======================================================
       ATTENDANCE
       ======================================================= */
    getExitAttendance: builder.query<ExitFilterOption[], void>({
      query: () => ({
        url: "/reports/exitmodule/filters/attendance",
        method: "GET",
      }),

      providesTags: ["ExitAttendance"],
    }),

    /* =======================================================
       DESIGNATIONS
       ======================================================= */
    getExitDesignations: builder.query<ExitFilterOption[], void>({
      query: () => ({
        url: "/reports/exitmodule/filters/designations",
        method: "GET",
      }),

      providesTags: ["ExitDesignations"],
    }),

    /* =======================================================
       QUERIES
       ======================================================= */
    getExitQueries: builder.query<ExitFilterOption[], void>({
      query: () => ({
        url: "/reports/exitmodule/filters/queries",
        method: "GET",
      }),

      providesTags: ["ExitQueries"],
    }),

    /* =======================================================
       RELIEVING LETTER
       ======================================================= */
    getRelievingLetterEmployee: builder.query<
      LetterEmployee,
      string
    >({
      query: (employeeId) => ({
        url: `/reports/exitmodule/relieving-letter/${employeeId}`,
        method: "GET",
      }),

      providesTags: ["ExitReport"],
    }),

    /* =======================================================
       EXPERIENCE LETTER
       ======================================================= */
    getExperienceLetterEmployee: builder.query<
      LetterEmployee,
      string
    >({
      query: (employeeId) => ({
        url: `/reports/exitmodule/experience-letter/${employeeId}`,
        method: "GET",
      }),

      providesTags: ["ExitReport"],
    }),

    /* =======================================================
       AUDIT LOG
       ======================================================= */
    getExitAuditLog: builder.query<
      AuditLogEntry[],
      AuditLogQuery
    >({
      query: ({ reportType, ...rest }) => ({
        url: `/reports/exitmodule/${reportType}/audit-log`,
        method: "GET",
        params: rest,
      }),

      providesTags: ["ExitAuditLog"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetExitReportsQuery,
  useGetExitBranchesQuery,
  useGetExitSalaryStructuresQuery,
  useGetExitLeavesQuery,
  useGetExitAttendanceQuery,
  useGetExitDesignationsQuery,
  useGetExitQueriesQuery,
  useGetRelievingLetterEmployeeQuery,
  useGetExperienceLetterEmployeeQuery,
  useGetExitAuditLogQuery,
} = exitReportsApi;