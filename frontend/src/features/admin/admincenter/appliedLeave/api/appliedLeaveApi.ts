import { baseApi } from "@/app/baseApi";
import type {
  ApplyLeaveResponse,
  EmployeeLeaveDetailsResponse,
  HrApplyLeavePayload,
  LeaveType,
  ReportingEmployee,
} from "../types/appliedLeave.types";

export const appliedLeaveApi = baseApi.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    // =========================================
    // Reporting Employees
    // =========================================

    getReportingEmployeesForAppliedLeave: builder.query<
      ReportingEmployee[],
      void
    >({
      query: () => ({
        url: "/employee/leave/reporting-employees",
      }),

      transformResponse: (response: ReportingEmployee[]) => {
        if (!Array.isArray(response)) {
          return [];
        }

        return response.filter((employee) => Boolean(employee.EmployeeID));
      },

      providesTags: ["Leave"],
    }),

    // =========================================
    // Leave Types for Selected Employee
    // =========================================

    getAppliedLeaveTypes: builder.query<LeaveType[], string>({
      query: (employeeId) => ({
        url: "/employee/leave/leavetypes",
        params: {
          employeeId,
        },
      }),

      providesTags: ["Leave"],
    }),

    // =========================================
    // Selected Employee Details
    // =========================================

    getAppliedLeaveEmployeeDetails: builder.query<
      EmployeeLeaveDetailsResponse,
      string
    >({
      query: (employeeId) => ({
        url: "/employee/leave/employee-details",
        params: {
          employeeId,
        },
      }),

      providesTags: ["Leave"],
    }),

    // =========================================
    // APPLY LEAVE FOR EMPLOYEE
    // =========================================

    applyLeaveForEmployee: builder.mutation<
      ApplyLeaveResponse[],
      HrApplyLeavePayload
    >({
      query: (body) => {
        const formData = new FormData();

        formData.append("employeeId", body.employeeId);

        formData.append("leaveTypeId", body.leaveTypeId.toString());

        formData.append("fromDate", body.fromDate);

        formData.append("toDate", body.toDate);

        formData.append("reason", body.reason ?? "");

        formData.append("isHalfDay", body.isHalfDay);

        formData.append("sessionFrom", body.sessionFrom ?? "");

        formData.append("sessionTo", body.sessionTo ?? "");

        // IMPORTANT:
        // Admin Center Apply Leave for Employee
        // always uses force apply.
        formData.append("isHRForceApply", "1");

        if (body.attachment) {
          formData.append("document", body.attachment);
        }

        return {
          url: "/employee/leave/applyhr",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Leave"],
    }),
  }),
});

export const {
  useGetReportingEmployeesForAppliedLeaveQuery,
  useGetAppliedLeaveTypesQuery,
  useGetAppliedLeaveEmployeeDetailsQuery,
  useApplyLeaveForEmployeeMutation,
} = appliedLeaveApi;
