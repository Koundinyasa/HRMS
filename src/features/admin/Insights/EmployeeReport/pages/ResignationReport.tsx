






import { LogOut } from "lucide-react";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import ResignationStatCards from "../components/common/ResignationStatCards";
import StatusBadge from "../components/common/StatusBadge";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";
import type { EmployeeReportRow } from "../types/employeeReport";

const COLUMNS = [
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "resignationDate", label: "Resignation Date" },
  { key: "dateOfLeaving", label: "Date of Leaving" },
  { key: "noticePeriod", label: "Notice Period" },
  { key: "status", label: "Status", render: (row: EmployeeReportRow) => <StatusBadge status={row.status as string} /> },
  { key: "reason", label: "Reason for Resignation" },
  { key: "tenure", label: "Tenure" },
];

export default function ResignationReport() {
  const { filters, setFilters, clearAll } = useReportFilters();

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport, stats } =
    useEmployeeReportData({
      reportType: "resignation-report",
      filters,
      exportTitle: "Resignation Report",
      exportColumns: COLUMNS,
    });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Resignation Report"
        icon={LogOut}
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
      />

      <ResignationStatCards
        totalResignations={stats?.total ?? 0}
        pendingInReview={stats?.pending ?? 0}
        approved={stats?.approved ?? 0}
        thisMonth={stats?.thisMonth ?? 0}
        thisMonthLabel={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      />

      <ReportFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={clearAll}
        showDateRange
      />

      <ReportTable columns={COLUMNS} rows={rows} loading={loading} />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        variant="entries"
      />
    </div>
  );
}