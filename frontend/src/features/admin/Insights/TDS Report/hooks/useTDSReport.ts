import { useCallback, useEffect, useState } from "react";
import { fetchTDSReport } from "../api/tdsReport.api";

export default function useTDSReport(endpoint?: string) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [financialYears, setFinancialYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLocaleLowerCase();
    if (!search) return rows;

    return rows.filter((row) =>
      Object.entries(row)
        .filter(([key]) => /employee|emp|staff|email/i.test(key))
        .some(([, value]) => String(value ?? "").toLocaleLowerCase().includes(search)),
    );
  }, [rows, searchValue]);

  const fetchReport = useCallback(async () => {
    if (!endpoint) return;
    setLoading(true);
    setError(null);

    try {
      const reportRows = await fetchTDSReport(endpoint);
      setRows(reportRows);

      const years = reportRows
        .map((row) =>
          row.financialYear ??
          row.FinancialYear ??
          row.financial_year ??
          row["Financial Year"],
        )
        .filter((year): year is string => typeof year === "string" && year.trim() !== "");

      setFinancialYears([...new Set(years)]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch TDS report."
      );
      setRows([]);
      setFinancialYears([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchReport();
    });
  }, [fetchReport]);

  return {
    rows,
    filteredRows,
    searchValue,
    setSearchValue,
    financialYears,
    loading,
    error,
    fetchReport,
  };
}
