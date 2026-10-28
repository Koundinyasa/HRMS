// EmployeeDobReport.tsx
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";

const COLUMNS = [
  { key: "slNo", label: "Sl. No." },
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "dateOfBirth", label: "Date of Birth" },
];

export default function EmployeeDobReport() {
  const { filters, setFilters, clearAll } = useReportFilters();

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport } =
    useEmployeeReportData({
      reportType: "employee-dob-report",
      filters,
      exportTitle: "Employee DOB Report",
      exportColumns: COLUMNS,
    });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Employee DOB Report"
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
      />

      <ReportFilters filters={filters} onFiltersChange={setFilters} onClearAll={clearAll} />

      <ReportTable columns={COLUMNS} rows={rows} loading={loading} />

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