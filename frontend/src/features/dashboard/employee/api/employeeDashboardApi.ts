import { baseApi } from "../../../../app/baseApi";
import type {
  EmployeeProfileResponse,
} from "../types/dashboard.types";

export const employeeDashboardApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getEmployeeProfile:
        builder.query<
          EmployeeProfileResponse,
          void
        >({
          query: () =>
            "/employee/profile",
        }),
    }),
  });

export const {
  useGetEmployeeProfileQuery,
} = employeeDashboardApi;