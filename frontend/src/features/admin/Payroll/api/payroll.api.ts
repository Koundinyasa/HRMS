import { baseApi } from "@/app/baseApi";
import type {
  SaveSalaryStructureRequest,
  SaveSalaryStructureResponse,
} from "../types/payroll.types";

// NOTE: add "Payroll" to tagTypes in "@/app/baseApi".
// URLs are placeholders until the backend endpoints are ready.
export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveSalaryStructure: builder.mutation<
      SaveSalaryStructureResponse,
      SaveSalaryStructureRequest
    >({
      query: (body) => ({
        url: "/payroll/salarystructure",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payroll"],
    }),
  }),
});

export const { useSaveSalaryStructureMutation } = payrollApi;
