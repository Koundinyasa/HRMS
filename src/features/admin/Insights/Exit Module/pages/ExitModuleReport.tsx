import ReportViewShell from "../components/ReportViewShell";
import ExitReportTable from "../components/ExitReportTable";

import { useExitFilters } from "../hooks/useExitFilters";
import { useExitReports } from "../hooks/useExitReports";

export default function ExitModuleReport() {
  const filters = useExitFilters();
  const { employees, isLoading } = useExitReports(filters.filters);

  return (
    <ReportViewShell
      reportType="exit-report"
      title="Exit Module Report"
      isLoading={isLoading}
      isEmpty={employees.length === 0}
      filters={filters}
    >
      <ExitReportTable employees={employees} />
    </ReportViewShell>
  );
}
