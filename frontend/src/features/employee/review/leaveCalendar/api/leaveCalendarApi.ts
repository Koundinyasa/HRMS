import { baseApi } from "@/app/baseApi";

import type {
  UseMonthlyLeaveCalendarParams,
  GetEmployeeAttendanceCountParams,
  LeaveCalendarEmployee,
  EmployeeAttendanceCountResponse,
} from "../types/leavecalendar.types";
export const leaveCalendarApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getMonthlyLeaveCalendar: builder.query<
      LeaveCalendarEmployee[],
      UseMonthlyLeaveCalendarParams
    >({
      query: ({ companyId, year, month, branchId }) => ({
        url: "/review/monthlyleavecalendar",
        method: "GET",
        params: {
          companyId,
          year,
          month,
          branchId,
        },
      }),
      //providesTags: ["Leave"],
    }),
    getEmployeeAttendanceCount: builder.query<
      EmployeeAttendanceCountResponse,
      GetEmployeeAttendanceCountParams
    >({
      query: ({ year, month, branchId }) => ({
        url: "/review/employee-attendance-count",
        method: "GET",
        params: {
          year,
          month,
          branchId,
        },
      }),
      //providesTags: ["Leave"],
    }),
  }),
});

export const {
  useGetMonthlyLeaveCalendarQuery,
  useGetEmployeeAttendanceCountQuery,
} = leaveCalendarApi;
