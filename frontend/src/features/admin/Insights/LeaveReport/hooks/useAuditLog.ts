// useAuditLog.ts
import { useState, useEffect, useCallback } from "react";
import { fetchAuditLog, exportAuditLog } from "../services/auditLog.service";
import { DEFAULT_ROWS_PER_PAGE } from "../constants/leaveReport.constants";
import { DEFAULT_AUDIT_LOG_FILTERS } from "../types/auditLog";
import type { AuditLogEntry, AuditLogFilterState } from "../types/auditLog";

interface UseAuditLogParams {
  reportType: string;
  /** Only fetch while the modal is actually open. */
  enabled: boolean;
}

export function useAuditLog({ reportType, enabled }: UseAuditLogParams) {
  const [rows, setRows] = useState<AuditLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_ROWS_PER_PAGE);
  const [filters, setFiltersState] = useState<AuditLogFilterState>(DEFAULT_AUDIT_LOG_FILTERS);

  const setFilters = useCallback((next: AuditLogFilterState) => {
    setFiltersState(next);
    setPage(1);
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAuditLog({ reportType, filters, page, pageSize });
      setRows(res.data);
      setTotalCount(res.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit log");
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [enabled, reportType, filters, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = useCallback(
    async (format: "pdf" | "excel") => {
      const blob = await exportAuditLog(reportType, format);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportType}-audit-log.${format === "pdf" ? "pdf" : "xlsx"}`;
      link.click();
      URL.revokeObjectURL(url);
    },
    [reportType]
  );

  return {
    rows,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    loading,
    error,
    refetch: load,
    handleExport,
  };
}