import { baseApi } from "@/app/baseApi";
import type { EmployeeReportApiResponse } from "../types/employeeReport";

export interface EmployeeReportQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
}

export const employeeReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeReport: builder.query<
      EmployeeReportApiResponse,
      { reportType: string } & EmployeeReportQueryParams
    >({
      query: ({ reportType, ...params }) => {
        const endpointMap: Record<string, string> = {
          "employee-custom-report": "custom",
          "employee-id-card": "idcard",
          "employee-profile-report": "profile",
          "employee-dob-report": "dob",
          "employee-doj-report": "doj",
          "employee-dol-report": "dol",
          "resignation-report": "resignation",
          "login-not-disabled-report": "loginnotdisabled",
          "reporting-authority-report": "reportingauthority",
          "classification-report": "classification",
          "employee-hr-category-report": "hrcategory",
          "employee-report-list": "custom", // fallback
        };

        const endpoint = endpointMap[reportType];
        if (!endpoint) throw new Error(`Unknown reportType: ${reportType}`);

        return {
          url: `/reports/employeereport/${endpoint}`,
          params,
        };
      },
    }),
  }),
});

export const { useGetEmployeeReportQuery } = employeeReportApi;