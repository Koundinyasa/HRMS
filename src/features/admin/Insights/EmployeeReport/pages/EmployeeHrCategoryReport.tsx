




// EmployeeHrCategoryReport.tsx
import ReportHeader from "../components/ReportHeader";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";
import { DEFAULT_REPORT_FILTERS } from "../types/filters";

const COLUMNS = [
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "hrCategory", label: "HR Category" },
  { key: "hrCategoryDescription", label: "Description" },
];

export default function EmployeeHrCategoryReport() {
  const { filters, setFilters } = useReportFilters();

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport } =
    useEmployeeReportData({
      reportType: "employee-hr-category-report",
      filters,
      exportTitle: "Employee HR Category Report",
      exportColumns: COLUMNS,
    });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Employee HR Category Report"
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
        searchValue={filters.search}
        onSearchChange={(value) => setFilters({ ...filters, search: value })}
        onClearSearch={() => setFilters({ ...DEFAULT_REPORT_FILTERS })}
      />

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