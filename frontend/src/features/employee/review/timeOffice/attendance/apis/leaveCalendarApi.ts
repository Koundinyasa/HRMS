// import { baseApi } from "@/app/baseApi";

// import type {
//   UseMonthlyLeaveCalendarParams,
//   GetEmployeeAttendanceCountParams,
//   LeaveCalendarEmployee,
//   EmployeeAttendanceCountResponse,
// } from "../types/leavecalendar.types";

// export const leaveCalendarApi = baseApi.injectEndpoints({
//   overrideExisting: false,

//   endpoints: (builder) => ({
//     // Monthly Leave Calendar
//     getMonthlyLeaveCalendar: builder.query<
//       LeaveCalendarEmployee[],
//       UseMonthlyLeaveCalendarParams
//     >({
//       query: ({ year, month, branchId }) => ({
//         url: "/review/monthlyleavecalendar",
//         method: "POST",

//         body: {
//           year,
//           month,
//           branchId,
//         },
//       }),
//     }),

//     // Employee Attendance Count
//     getEmployeeAttendanceCount: builder.query<
//       EmployeeAttendanceCountResponse,
//       GetEmployeeAttendanceCountParams
//     >({
//       query: ({ year, month, branchId }) => ({
//         url: "/review/employee-attendance-count",
//         method: "GET",

//         params: {
//           year,
//           month,
//           branchId,
//         },
//       }),
//     }),
//   }),
// });

// export const {
//   useGetMonthlyLeaveCalendarQuery,
//   useGetEmployeeAttendanceCountQuery,
// } = leaveCalendarApi;


import { baseApi } from "@/app/baseApi";

import type {
  UseMonthlyLeaveCalendarParams,
  GetEmployeeAttendanceCountParams,
  LeaveCalendarEmployee,
  EmployeeAttendanceCountResponse,
} from "../types/leavecalendar.types";

export const leaveCalendarApi =
  baseApi.injectEndpoints({
    overrideExisting: false,

    endpoints: (builder) => ({
      // =========================
      // Monthly Leave Calendar
      // =========================
      getMonthlyLeaveCalendar: builder.query<
        LeaveCalendarEmployee[],
        UseMonthlyLeaveCalendarParams
      >({
        query: ({
          year,
          month,
          branchId,
        }) => ({
          url: "/review/monthlyleavecalendar",
          method: "POST",

          body: {
            year,
            month,
            branchId,
          },
        }),
      }),

      // =========================
      // Employee Attendance Count
      // =========================
      getEmployeeAttendanceCount:
        builder.query<
          EmployeeAttendanceCountResponse,
          GetEmployeeAttendanceCountParams
        >({
          query: ({
            year,
            month,
            branchId,
          }) => ({
            url: "/review/employee-attendance-count",
            method: "GET",

            params: {
              year,
              month,
              branchId,
            },
          }),
        }),
    }),
  });

export const {
  useGetMonthlyLeaveCalendarQuery,
  useGetEmployeeAttendanceCountQuery,
} = leaveCalendarApi;