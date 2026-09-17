import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getGeneralReportFields,
  getGeneralReports,
  getPinnedReports,
  saveGeneralReport,
  updateGeneralReport,
  deleteGeneralReport,
} from "../api/generalReport.api";

export default function useGeneralReport() {
  const [fields, setFields] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [pinnedReports, setPinnedReports] =
    useState<any[]>([]);

  const [loadingFields, setLoadingFields] =
    useState(false);

  const [loadingReports, setLoadingReports] =
    useState(false);

  const [loadingPinnedReports, setLoadingPinnedReports] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [updating, setUpdating] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================
  // GET FIELDS
  // ==========================================

  const fetchFields = useCallback(async () => {
    try {
      setLoadingFields(true);
      setError(null);

      const data = await getGeneralReportFields();

      setFields(
        Array.isArray(data) ? data : []
      );

      return data;
    } catch (error) {
      console.error(
        "Failed to fetch General Report fields:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch General Report fields"
      );

      return [];
    } finally {
      setLoadingFields(false);
    }
  }, []);

  // ==========================================
  // GET REPORTS
  // ==========================================

  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      setError(null);

      const data = await getGeneralReports();

      setReports(
        Array.isArray(data) ? data : []
      );

      return data;
    } catch (error) {
      console.error(
        "Failed to fetch General Reports:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch General Reports"
      );

      return [];
    } finally {
      setLoadingReports(false);
    }
  }, []);

  // ==========================================
  // GET PINNED REPORTS
  // ==========================================

  const fetchPinnedReports =
    useCallback(async () => {
      try {
        setLoadingPinnedReports(true);
        setError(null);

        const data = await getPinnedReports();

        setPinnedReports(
          Array.isArray(data) ? data : []
        );

        return data;
      } catch (error) {
        console.error(
          "Failed to fetch pinned reports:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch pinned reports"
        );

        return [];
      } finally {
        setLoadingPinnedReports(false);
      }
    }, []);

  // ==========================================
  // CREATE REPORT
  // ==========================================

  const createReport = useCallback(
    async (
      reportData: Record<string, unknown>
    ) => {
      try {
        setSaving(true);
        setError(null);

        const data =
          await saveGeneralReport(reportData);

        await fetchReports();

        return data;
      } catch (error) {
        console.error(
          "Failed to save General Report:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to save General Report"
        );

        throw error;
      } finally {
        setSaving(false);
      }
    },
    [fetchReports]
  );

  // ==========================================
  // UPDATE REPORT
  // ==========================================

  const editReport = useCallback(
    async (
      reportId: string,
      reportData: Record<string, unknown>
    ) => {
      try {
        setUpdating(true);
        setError(null);

        const data =
          await updateGeneralReport(
            reportId,
            reportData
          );

        await fetchReports();

        return data;
      } catch (error) {
        console.error(
          "Failed to update General Report:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to update General Report"
        );

        throw error;
      } finally {
        setUpdating(false);
      }
    },
    [fetchReports]
  );

  // ==========================================
  // DELETE REPORT
  // ==========================================

  const removeReport = useCallback(
    async (reportId: string) => {
      try {
        setDeleting(true);
        setError(null);

        const data =
          await deleteGeneralReport(reportId);

        await fetchReports();

        return data;
      } catch (error) {
        console.error(
          "Failed to delete General Report:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to delete General Report"
        );

        throw error;
      } finally {
        setDeleting(false);
      }
    },
    [fetchReports]
  );

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchFields();
    fetchReports();
    fetchPinnedReports();
  }, [
    fetchFields,
    fetchReports,
    fetchPinnedReports,
  ]);

  // ==========================================
  // RETURN
  // ==========================================

  return {
    fields,
    reports,
    pinnedReports,

    loadingFields,
    loadingReports,
    loadingPinnedReports,

    saving,
    updating,
    deleting,

    error,

    fetchFields,
    fetchReports,
    fetchPinnedReports,

    createReport,
    editReport,
    removeReport,
  };
}