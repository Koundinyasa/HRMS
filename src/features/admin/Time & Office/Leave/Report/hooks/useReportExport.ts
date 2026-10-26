import { useCallback } from "react";

interface UseReportExportOptions<T> {
  fileName: string;
  data: T[];
}

const useReportExport = <T>({
  fileName,
  data,
}: UseReportExportOptions<T>) => {
  const exportExcel = useCallback(async () => {
    if (!data.length) {
      return;
    }

    const XLSX = await import("xlsx");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }, [data, fileName]);

  return {
    exportExcel,
  };
};

export default useReportExport;