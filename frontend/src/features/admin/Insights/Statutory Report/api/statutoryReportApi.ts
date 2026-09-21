// import { baseApi } from "@/app/baseApi";

// export const statutoryReportApi = baseApi.injectEndpoints({
//   endpoints: () => ({}),
//   overrideExisting: false,
// });

import { baseApi } from "@/app/baseApi";

import {
  STATUTORY_REPORT_API_ROUTES,
} from "../constants/statutoryReport.constants";

import type {
  MonthlyStatutoryReportParams,
  PTHalfYearlyReportParams,
  PTYearlyReportParams,
  StatutoryAcknowledgementParams,
  StatutoryAcknowledgementRequest,
  StatutoryMonthlyReportResponse,
  PTHalfYearlyReportResponse,
  PTYearlyReportResponse,
  StatutoryAcknowledgementResponse,
} from "../types/statutoryReport.types";

// ============================================================
// Statutory Report API
// ============================================================

export const statutoryReportApi =
  baseApi.injectEndpoints({
    overrideExisting: false,

    endpoints: (builder) => ({
      // ========================================================
      // PF MONTHLY
      // GET /statutory-report/pf/monthly
      // ========================================================

      getPFMonthlyReport: builder.query<
        StatutoryMonthlyReportResponse,
        MonthlyStatutoryReportParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url: STATUTORY_REPORT_API_ROUTES.PF_MONTHLY,
          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),

      // ========================================================
      // PF ACKNOWLEDGEMENT - POST
      // POST /statutory-report/pf/acknowledgement
      // ========================================================

      submitPFAcknowledgement: builder.mutation<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementRequest
      >({
        query: (body) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.PF_ACKNOWLEDGEMENT,

          method: "POST",

          body,
        }),
      }),

      // ========================================================
      // PF ACKNOWLEDGEMENT - GET
      // GET /statutory-report/pf/acknowledgement
      // ========================================================

      getPFAcknowledgement: builder.query<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.PF_ACKNOWLEDGEMENT,

          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),

      // ========================================================
      // ESI MONTHLY
      // GET /statutory-report/esi/monthly
      // ========================================================

      getESIMonthlyReport: builder.query<
        StatutoryMonthlyReportResponse,
        MonthlyStatutoryReportParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.ESI_MONTHLY,

          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),

      // ========================================================
      // ESI ACKNOWLEDGEMENT - POST
      // POST /statutory-report/esi/acknowledgement
      // ========================================================

      submitESIAcknowledgement: builder.mutation<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementRequest
      >({
        query: (body) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.ESI_ACKNOWLEDGEMENT,

          method: "POST",

          body,
        }),
      }),

      // ========================================================
      // ESI ACKNOWLEDGEMENT - GET
      // GET /statutory-report/esi/acknowledgement
      // ========================================================

      getESIAcknowledgement: builder.query<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.ESI_ACKNOWLEDGEMENT,

          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),

      // ========================================================
      // LWF MONTHLY
      // GET /statutory-report/lwf/monthly
      // ========================================================

      getLWFMonthlyReport: builder.query<
        StatutoryMonthlyReportResponse,
        MonthlyStatutoryReportParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.LWF_MONTHLY,

          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),

      // ========================================================
      // LWF ACKNOWLEDGEMENT - POST
      // POST /statutory-report/lwf/acknowledgement
      // ========================================================

      submitLWFAcknowledgement: builder.mutation<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementRequest
      >({
        query: (body) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.LWF_ACKNOWLEDGEMENT,

          method: "POST",

          body,
        }),
      }),

      // ========================================================
      // LWF ACKNOWLEDGEMENT - GET
      // GET /statutory-report/lwf/acknowledgement
      // ========================================================

      getLWFAcknowledgement: builder.query<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.LWF_ACKNOWLEDGEMENT,

          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),

      // ========================================================
      // PT MONTHLY
      // GET /statutory-report/pt/monthly
      // ========================================================

      getPTMonthlyReport: builder.query<
        StatutoryMonthlyReportResponse,
        MonthlyStatutoryReportParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.PT_MONTHLY,

          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),

      // ========================================================
      // PT HALF YEARLY
      // GET /statutory-report/pt/half-yearly
      // ========================================================

      getPTHalfYearlyReport: builder.query<
        PTHalfYearlyReportResponse,
        PTHalfYearlyReportParams
      >({
        query: ({
          companyId,
          year,
          halfYear,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.PT_HALF_YEARLY,

          method: "GET",

          params: {
            companyId,
            year,
            halfYear,
            branchId,
          },
        }),
      }),

      // ========================================================
      // PT YEARLY
      // GET /statutory-report/pt/yearly
      // ========================================================

      getPTYearlyReport: builder.query<
        PTYearlyReportResponse,
        PTYearlyReportParams
      >({
        query: ({
          companyId,
          year,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.PT_YEARLY,

          method: "GET",

          params: {
            companyId,
            year,
            branchId,
          },
        }),
      }),

      // ========================================================
      // PT ACKNOWLEDGEMENT - POST
      // POST /statutory-report/pt/acknowledgement
      // ========================================================

      submitPTAcknowledgement: builder.mutation<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementRequest
      >({
        query: (body) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.PT_ACKNOWLEDGEMENT,

          method: "POST",

          body,
        }),
      }),

      // ========================================================
      // PT ACKNOWLEDGEMENT - GET
      // GET /statutory-report/pt/acknowledgement
      // ========================================================

      getPTAcknowledgement: builder.query<
        StatutoryAcknowledgementResponse,
        StatutoryAcknowledgementParams
      >({
        query: ({
          companyId,
          year,
          month,
          branchId,
        }) => ({
          url:
            STATUTORY_REPORT_API_ROUTES.PT_ACKNOWLEDGEMENT,

          method: "GET",

          params: {
            companyId,
            year,
            month,
            branchId,
          },
        }),
      }),
    }),
  });

// ============================================================
// RTK QUERY HOOKS
// ============================================================

export const {
  // PF
  useGetPFMonthlyReportQuery,
  useSubmitPFAcknowledgementMutation,
  useGetPFAcknowledgementQuery,

  // ESI
  useGetESIMonthlyReportQuery,
  useSubmitESIAcknowledgementMutation,
  useGetESIAcknowledgementQuery,

  // LWF
  useGetLWFMonthlyReportQuery,
  useSubmitLWFAcknowledgementMutation,
  useGetLWFAcknowledgementQuery,

  // PT
  useGetPTMonthlyReportQuery,
  useGetPTHalfYearlyReportQuery,
  useGetPTYearlyReportQuery,
  useSubmitPTAcknowledgementMutation,
  useGetPTAcknowledgementQuery,
} = statutoryReportApi;