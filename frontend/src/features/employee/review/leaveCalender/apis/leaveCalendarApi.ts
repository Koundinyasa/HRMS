import { baseApi } from "@/app/baseApi";

import type {
  UseMonthlyLeaveCalendarParams,
  GetEmployeeAttendanceCountParams,
  LeaveCalendarEmployee,
  EmployeeAttendanceCountResponse,
} from "../types/leavecalendar.types";

type ApiRecord = Record<string, unknown>;

function isApiRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeMonthlyLeaveCalendar(
  response: unknown,
): LeaveCalendarEmployee[] {
  const rows =
    Array.isArray(response)
      ? response
      : isApiRecord(response) && Array.isArray(response.data)
        ? response.data
        : null;

  if (!rows) {
    throw new Error("Unexpected monthly leave calendar response.");
  }

  return rows.map((row, index) => {
    if (!isApiRecord(row)) {
      throw new Error(`Invalid monthly leave calendar row at index ${index}.`);
    }

    const employeeId = row.EmployeeID ?? row.employeeId ?? row.EmployeeId;
    const fullName = row.FullName ?? row.fullName ?? row.EmployeeName;
    if (employeeId == null || fullName == null) {
      throw new Error(
        `Monthly leave calendar row ${index + 1} is missing employee details.`,
      );
    }

    const employee: LeaveCalendarEmployee = {
      EmployeeID: String(employeeId),
      FullName: String(fullName),
    };

    for (const [key, value] of Object.entries(row)) {
      if (key !== "EmployeeID" && key !== "FullName" && value != null) {
        if (typeof value === "string" || typeof value === "number") {
          employee[key] = String(value);
        }
      }
    }

    return employee;
  });
}

export const leaveCalendarApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    // Monthly Leave Calendar
    getReviewMonthlyLeaveCalendar: builder.query<
      LeaveCalendarEmployee[],
      UseMonthlyLeaveCalendarParams
    >({
      query: ({ year, month, branchId }) => ({
        url: "/review/monthlyleavecalendar",
        method: "POST",

        body: {
          year,
          month,
          branchId,
        },
      }),
      transformResponse: normalizeMonthlyLeaveCalendar,
    }),

    // Employee Attendance Count
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
    }),
  }),
});

export const {
  useGetReviewMonthlyLeaveCalendarQuery,
  useGetEmployeeAttendanceCountQuery,
} = leaveCalendarApi;