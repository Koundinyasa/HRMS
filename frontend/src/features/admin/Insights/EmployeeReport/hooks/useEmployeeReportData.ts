// // useEmployeeReportData.ts
// import { useState, useEffect, useCallback } from "react";
// import { fetchEmployeeReportData } from "../services/employeeReport.service";
// import { DEFAULT_ROWS_PER_PAGE } from "../constants/employeeReport.constants";
// import { exportRowsToPdf, exportRowsToExcel } from "../../LeaveReport/utils/reportExport";
// import type { EmployeeReportRow } from "../types/employeeReport";
// import type { ReportFilterState } from "../types/filters";

// interface ExportColumn {
//   key: string;
//   label: string;
// }

// interface UseEmployeeReportDataParams {
//   reportType: string;
//   filters: ReportFilterState;
//   /** Title used for the downloaded file name and PDF heading */
//   exportTitle?: string;
//   /** Column key/label pairs used to build the exported PDF/Excel */
//   exportColumns?: ExportColumn[];
// }

// export function useEmployeeReportData({
//   reportType,
//   filters,
//   exportTitle,
//   exportColumns,
// }: UseEmployeeReportDataParams) {
//   // Rows always start empty — nothing is ever seeded with placeholder/mock
//   // data. The EmptyState illustration renders until a real response with
//   // rows.length > 0 comes back from the backend.
//   const [rows, setRows] = useState<EmployeeReportRow[]>([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchEmployeeReportData({
//         reportType,
//         filters,
//         page,
//         pageSize,
//       });
//       setRows(res.data ?? []);
//       setTotalCount(res.totalCount ?? 0);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load report");
//       setRows([]);
//       setTotalCount(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [reportType, filters, page, pageSize]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const handleExport = useCallback(
//     (format: "pdf" | "excel") => {
//       const title = exportTitle ?? reportType;
//       const columns =
//         exportColumns ??
//         (rows[0]
//           ? Object.keys(rows[0]).map((key) => ({ key, label: key }))
//           : []);

//       if (format === "pdf") {
//         exportRowsToPdf(title, columns, rows as unknown as Record<string, unknown>[]);
//       } else {
//         exportRowsToExcel(title, columns, rows as unknown as Record<string, unknown>[]);
//       }
//     },
//     [reportType, exportTitle, exportColumns, rows]
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








import { useState, useCallback, useMemo } from "react";
import { useGetEmployeeReportQuery } from "../api/employeeReportApi";
import { DEFAULT_ROWS_PER_PAGE } from "../constants/employeeReport.constants";
import { exportRowsToPdf, exportRowsToExcel } from "../../LeaveReport/utils/reportExport";
import type { EmployeeReportRow, ResignationReportStats } from "../types/employeeReport";
import type { ReportFilterState } from "../types/filters";

interface ExportColumn {
  key: string;
  label: string;
}

interface UseEmployeeReportDataParams {
  reportType: string;
  filters: ReportFilterState;
  exportTitle?: string;
  exportColumns?: ExportColumn[];
}

export function useEmployeeReportData({
  reportType,
  filters,
  exportTitle,
  exportColumns,
}: UseEmployeeReportDataParams) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE);

  const queryParams = useMemo(
    () => ({
      reportType,
      page,
      pageSize,
      search: filters.search || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
      status: filters.status?.length ? filters.status.join(",") : undefined,
    }),
    [reportType, page, pageSize, filters]
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetEmployeeReportQuery(queryParams);

  const rows: EmployeeReportRow[] = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const stats: ResignationReportStats | undefined = data?.stats;

  const handleExport = useCallback(
    (format: "pdf" | "excel") => {
      const title = exportTitle ?? reportType;
      const columns =
        exportColumns ??
        (rows[0] ? Object.keys(rows[0]).map((key) => ({ key, label: key })) : []);

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
    stats,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading: isLoading || isFetching,
    error: isError
      ? (error as any)?.data?.message || "Failed to load report"
      : null,
    refetch,
    handleExport,
  };
}