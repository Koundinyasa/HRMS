











// ReportingAuthorityReport.tsx
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";

const COLUMNS = [
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "dateOfJoining", label: "DOJ" },
  { key: "dateOfLeaving", label: "DOL" },
  { key: "essRole", label: "ESS Role" },
  { key: "payrollRole", label: "Payroll Role" },
  { key: "reportingAuthority", label: "Reporting Authority" },
];

export default function ReportingAuthorityReport() {
  const { filters, setFilters, clearAll } = useReportFilters();

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport } =
    useEmployeeReportData({
      reportType: "reporting-authority-report",
      filters,
      exportTitle: "Reporting Authority",
      exportColumns: COLUMNS,
    });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Reporting Authority"
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
      />

      <ReportFilters filters={filters} onFiltersChange={setFilters} onClearAll={clearAll} />

      <ReportTable columns={COLUMNS} rows={rows} loading={loading} showRowNumber />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}