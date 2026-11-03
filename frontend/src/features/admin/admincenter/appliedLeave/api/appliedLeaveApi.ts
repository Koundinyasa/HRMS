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
    // Employees with reporting authority for the authenticated company
    // =========================================

    getReportingEmployeesForAppliedLeave: builder.query<
      ReportingEmployee[],
      number
    >({
      query: (companyId) => ({
        url: `/review/employees/${companyId}`,
      }),

      transformResponse: (response: unknown): ReportingEmployee[] => {
        const root =
          response && typeof response === "object"
            ? (response as Record<string, unknown>)
            : {};
        const data =
          root.data && typeof root.data === "object"
            ? (root.data as Record<string, unknown>)
            : {};

        if (root.success === false) {
          throw new Error(
            String(root.message ?? "Unable to load employees with reporting authority."),
          );
        }

        const employees =
          data.reportingAuthorities ??
          data.ReportingAuthorities ??
          root.reportingAuthorities ??
          root.ReportingAuthorities;
        if (!Array.isArray(employees)) return [];

        return employees.filter(
          (employee): employee is ReportingEmployee =>
            Boolean(
              employee &&
                typeof employee === "object" &&
                ((employee as ReportingEmployee).EmployeeID ??
                  (employee as Record<string, unknown>).EmployeeId ??
                  (employee as Record<string, unknown>).employeeId),
            ),
        ).map((employee) => {
          const record = employee as ReportingEmployee & {
            EmployeeId?: string;
            employeeId?: string;
            EmployeeName?: string;
            employeeName?: string;
            FullName?: string;
            fullName?: string;
          };
          return {
            ...record,
            EmployeeID: String(
              record.EmployeeID ?? record.EmployeeId ?? record.employeeId,
            ),
            EmployeeName:
              record.EmployeeName ??
              record.employeeName ??
              record.FullName ??
              record.fullName,
          };
        });
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
