










// LoginNotDisabledReport.tsx
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";

const COLUMNS = [
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "dateOfLeaving", label: "Date Of Leaving" },
];

export default function LoginNotDisabledReport() {
  const { filters, setFilters, clearAll } = useReportFilters();

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport } =
    useEmployeeReportData({
      reportType: "login-not-disabled-report",
      filters,
      exportTitle: "Login Not Disabled",
      exportColumns: COLUMNS,
    });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Login Not Disabled"
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
      />

      <ReportFilters filters={filters} onFiltersChange={setFilters} onClearAll={clearAll} />

      {/* This screen showed the empty-state illustration in the recording —
          it renders automatically here whenever rows.length === 0. */}
      <ReportTable
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        showRowNumber
        headerClassName="bg-blue-100"
      />

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