// import { useLocation } from "react-router-dom";

// export default function useStatutoryReport() {
//   const location = useLocation();

//   return {
//     pathname: location.pathname,
//   };
// }

import { useLocation } from "react-router-dom";

import {
  useGetPFMonthlyReportQuery,
  useSubmitPFAcknowledgementMutation,
  useGetPFAcknowledgementQuery,

  useGetESIMonthlyReportQuery,
  useSubmitESIAcknowledgementMutation,
  useGetESIAcknowledgementQuery,

  useGetLWFMonthlyReportQuery,
  useSubmitLWFAcknowledgementMutation,
  useGetLWFAcknowledgementQuery,

  useGetPTMonthlyReportQuery,
  useGetPTHalfYearlyReportQuery,
  useGetPTYearlyReportQuery,
  useSubmitPTAcknowledgementMutation,
  useGetPTAcknowledgementQuery,
} from "../api/statutoryReportApi";

import type {
  MonthlyStatutoryReportParams,
  PTHalfYearlyReportParams,
  PTYearlyReportParams,
  StatutoryAcknowledgementParams,
  StatutoryAcknowledgementRequest,
} from "../types/statutoryReport.types";

// ============================================================
// PF MONTHLY
// ============================================================

export const usePFMonthlyReport = (
  params: MonthlyStatutoryReportParams,
) => {
  return useGetPFMonthlyReportQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// PF ACKNOWLEDGEMENT GET
// ============================================================

export const usePFAcknowledgement = (
  params: StatutoryAcknowledgementParams,
) => {
  return useGetPFAcknowledgementQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// PF ACKNOWLEDGEMENT POST
// ============================================================

export const useSubmitPFAcknowledgement = () => {
  return useSubmitPFAcknowledgementMutation();
};

// ============================================================
// ESI MONTHLY
// ============================================================

export const useESIMonthlyReport = (
  params: MonthlyStatutoryReportParams,
) => {
  return useGetESIMonthlyReportQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// ESI ACKNOWLEDGEMENT GET
// ============================================================

export const useESIAcknowledgement = (
  params: StatutoryAcknowledgementParams,
) => {
  return useGetESIAcknowledgementQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// ESI ACKNOWLEDGEMENT POST
// ============================================================

export const useSubmitESIAcknowledgement = () => {
  return useSubmitESIAcknowledgementMutation();
};

// ============================================================
// LWF MONTHLY
// ============================================================

export const useLWFMonthlyReport = (
  params: MonthlyStatutoryReportParams,
) => {
  return useGetLWFMonthlyReportQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// LWF ACKNOWLEDGEMENT GET
// ============================================================

export const useLWFAcknowledgement = (
  params: StatutoryAcknowledgementParams,
) => {
  return useGetLWFAcknowledgementQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// LWF ACKNOWLEDGEMENT POST
// ============================================================

export const useSubmitLWFAcknowledgement = () => {
  return useSubmitLWFAcknowledgementMutation();
};

// ============================================================
// PT MONTHLY
// ============================================================

export const usePTMonthlyReport = (
  params: MonthlyStatutoryReportParams,
) => {
  return useGetPTMonthlyReportQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// PT HALF YEARLY
// ============================================================

export const usePTHalfYearlyReport = (
  params: PTHalfYearlyReportParams,
) => {
  return useGetPTHalfYearlyReportQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// PT YEARLY
// ============================================================

export const usePTYearlyReport = (
  params: PTYearlyReportParams,
) => {
  return useGetPTYearlyReportQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// PT ACKNOWLEDGEMENT GET
// ============================================================

export const usePTAcknowledgement = (
  params: StatutoryAcknowledgementParams,
) => {
  return useGetPTAcknowledgementQuery(params, {
    refetchOnMountOrArgChange: true,
  });
};

// ============================================================
// PT ACKNOWLEDGEMENT POST
// ============================================================

export const useSubmitPTAcknowledgement = () => {
  return useSubmitPTAcknowledgementMutation();
};

// ============================================================
// ROUTE / LOCATION HOOK
// ============================================================

export default function useStatutoryReport() {
  const location = useLocation();

  return {
    pathname: location.pathname,
  };
};