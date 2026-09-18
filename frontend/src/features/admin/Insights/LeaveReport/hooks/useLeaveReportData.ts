// // useLeaveReportData.ts
// import { useState, useEffect, useCallback } from "react";
// import { fetchLeaveReportData, exportLeaveReport } from "../services/leaveReport.service";
// import { DEFAULT_ROWS_PER_PAGE } from "../constants/leaveReport.constants";
// import type { LeaveReportRow } from "../types/leaveReport";
// import type { ReportFilterState, GroupByLeavePolicyState } from "../types/filters";

// interface UseLeaveReportDataParams {
//   reportType: string;
//   fromMonth: string;
//   toMonth: string;
//   filters: ReportFilterState;
//   groupBy: GroupByLeavePolicyState;
// }

// export function useLeaveReportData({
//   reportType,
//   fromMonth,
//   toMonth,
//   filters,
//   groupBy,
// }: UseLeaveReportDataParams) {
//   const [rows, setRows] = useState<LeaveReportRow[]>([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchLeaveReportData({
//         reportType,
//         fromMonth,
//         toMonth,
//         filters,
//         groupBy,
//         page,
//         pageSize,
//       });
//       setRows(res.data);
//       setTotalCount(res.totalCount);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load report");
//       setRows([]);
//       setTotalCount(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [reportType, fromMonth, toMonth, filters, groupBy, page, pageSize]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const handleExport = useCallback(
//     async (format: "pdf" | "excel") => {
//       const blob = await exportLeaveReport(reportType, format, {
//         reportType,
//         fromMonth,
//         toMonth,
//         filters,
//         groupBy,
//       });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${reportType}.${format === "pdf" ? "pdf" : "xlsx"}`;
//       link.click();
//       URL.revokeObjectURL(url);
//     },
//     [reportType, fromMonth, toMonth, filters, groupBy]
//   );

//   return {
//     rows,
//     totalCount,
//     page,
//     setPage,
//     pageSize,
//     setPageSize,
//     loading,
//     error,
//     refetch: load,
//     handleExport,
//   };
// }







// useLeaveReportData.ts
import { useState, useEffect, useCallback } from "react";
import { fetchLeaveReportData } from "../services/leaveReport.service";
import { DEFAULT_ROWS_PER_PAGE } from "../constants/leaveReport.constants";
import { exportRowsToPdf, exportRowsToExcel } from "../utils/reportExport";
import type { LeaveReportRow } from "../types/leaveReport";
import type { ReportFilterState, GroupByLeavePolicyState } from "../types/filters";

interface ExportColumn {
  key: string;
  label: string;
}

interface UseLeaveReportDataParams {
  reportType: string;
  fromMonth: string;
  toMonth: string;
  filters: ReportFilterState;
  groupBy: GroupByLeavePolicyState;
  /** Title used for the downloaded file name and PDF heading */
  exportTitle?: string;
  /** Column key/label pairs used to build the exported PDF/Excel */
  exportColumns?: ExportColumn[];
}

export function useLeaveReportData({
  reportType,
  fromMonth,
  toMonth,
  filters,
  groupBy,
  exportTitle,
  exportColumns,
}: UseLeaveReportDataParams) {
  const [rows, setRows] = useState<LeaveReportRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchLeaveReportData({
        reportType,
        fromMonth,
        toMonth,
        filters,
        groupBy,
        page,
        pageSize,
      });
      setRows(res.data);
      setTotalCount(res.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [reportType, fromMonth, toMonth, filters, groupBy, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = useCallback(
    (format: "pdf" | "excel") => {
      const title = exportTitle ?? reportType;
      const columns =
        exportColumns ??
        (rows[0]
          ? Object.keys(rows[0]).map((key) => ({ key, label: key }))
          : []);

      if (format === "pdf") {
        exportRowsToPdf(title, columns, rows as unknown as Record<string, unknown>[]);
      } else {
        exportRowsToExcel(title, columns, rows as unknown as Record<string, unknown>[]);
      }
    },
    [reportType, exportTitle, exportColumns, rows]
  );

  return {
    rows,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    error,
    refetch: load,
    handleExport,
  };
}