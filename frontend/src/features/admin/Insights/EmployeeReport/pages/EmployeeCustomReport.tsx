





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
  { key: "employeeId", label: "Emp. ID" },
  { key: "employeeName", label: "Emp. Name" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "DOB" },
  { key: "doj", label: "DOJ" },
];

const TABLE_COLUMNS = [
  { key: "employeeId", label: "Emp. ID" },
  { key: "employeeName", label: "Emp. Name" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "DOB" },
  { key: "doj", label: "DOJ" },
];
const DEFAULT_VISIBLE = { department: false, designation: false };

export default function EmployeeCustomReport() {
  const [columnsOpen, setColumnsOpen] = useState(true);
  const { filters, setFilters, clearAll, visibleColumns, toggleColumn } = useReportFilters(DEFAULT_VISIBLE);

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport } =
    useEmployeeReportData({
      reportType: "employee-custom-report",
      filters,
      exportTitle: "Employee Custom Report",
      exportColumns: TABLE_COLUMNS.filter((c) => visibleColumns[c.key] !== false),
    });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Employee Custom Report"
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

          <ReportTable
            columns={TABLE_COLUMNS}
            rows={rows}
            loading={loading}
            visibleColumns={visibleColumns}
            showRowNumber={false}
          />

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