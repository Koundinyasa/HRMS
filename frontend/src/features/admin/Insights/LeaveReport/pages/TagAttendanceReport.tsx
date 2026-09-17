








// TagAttendanceReport.tsx
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";
import type { LeaveReportRow } from "../types/leaveReport";

const COLUMNS = [
  { key: "slNo", label: "Sl. No." },
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  {
    key: "attendancePercentage",
    label: "Attendance(in %)",
    align: "right" as const,
    render: (row: LeaveReportRow) => {
      const value = (row as unknown as { attendancePercentage?: number }).attendancePercentage;
      return typeof value === "number" ? `${value.toFixed(2)}%` : "-";
    },
  },
];

export default function TagAttendanceReport() {
  const f = useReportFilters();
  const d = useLeaveReportData({
    reportType: "top-attendance",
    fromMonth: f.fromMonth,
    toMonth: f.toMonth,
    filters: f.filters,
    groupBy: f.groupBy,
    exportTitle: "Top Attendance",
    exportColumns: COLUMNS,
  });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Top Attendance"
        reportType="top-attendance"
        fromMonth={f.fromMonth}
        toMonth={f.toMonth}
        monthOptions={f.monthOptions}
        onFromMonthChange={f.setFromMonth}
        onToMonthChange={f.setToMonth}
        showGroupBy={false}
        groupBy={f.groupBy}
        onGroupByChange={f.setGroupBy}
        onExportPdf={() => d.handleExport("pdf")}
        onExportExcel={() => d.handleExport("excel")}
      />
      <ReportFilters filters={f.filters} onFiltersChange={f.setFilters} onClearAll={f.clearAll} />
      <ReportTable columns={COLUMNS} rows={d.rows} loading={d.loading} />
      <Pagination page={d.page} pageSize={d.pageSize} totalCount={d.totalCount} onPageChange={d.setPage} onPageSizeChange={d.setPageSize} />
    </div>
  );
}