









import { useState } from "react";
import { Users } from "lucide-react";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ColumnsSelector from "../components/ColumnsSelector";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";

const COLUMNS = [
  // { key: "employeeId", label: "Emp. ID", locked: true },
  // { key: "employeeName", label: "Emp. Name", locked: true },




  { key: "employeeId", label: "Emp. ID" },
{ key: "employeeName", label: "Emp. Name" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "DOB" },
  { key: "doj", label: "DOJ" },
];

const TABLE_COLUMNS = [
  { key: "employeeName", label: "Emp. Name" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "DOB" },
  { key: "doj", label: "DOJ" },
];

export default function EmployeeReport() {
  const [columnsOpen, setColumnsOpen] = useState(false);
  const { filters, setFilters, clearAll, visibleColumns, toggleColumn } = useReportFilters();

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport } =
    useEmployeeReportData({
      reportType: "employee-report-list",
      filters,
      exportTitle: "Employee Report",
      exportColumns: TABLE_COLUMNS,
    });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Employee Report"
        icon={Users}
        onToggleColumns={() => setColumnsOpen((v) => !v)}
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
      />

      <div className="flex flex-col lg:flex-row gap-3 items-start">
        <ColumnsSelector
          open={columnsOpen}
          columns={COLUMNS}
          visibleColumns={visibleColumns}
          onToggle={toggleColumn}
          onClose={() => setColumnsOpen(false)}
        />

        <div className="flex-1 min-w-0 space-y-3">
          <ReportFilters filters={filters} onFiltersChange={setFilters} onClearAll={clearAll} />

          <ReportTable columns={TABLE_COLUMNS} rows={rows} loading={loading} visibleColumns={visibleColumns} />

          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
}