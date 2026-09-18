// LeaveAvailedReport.tsx
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";

const COLUMNS = [
  { key: "slNo", label: "Sl. No." },
  { key: "employeeId", label: "Employee ID." },
  { key: "employeeName", label: "Employee Name" },
  { key: "cl", label: "CL", align: "right" as const },
  { key: "sl", label: "SL", align: "right" as const },
  { key: "ml", label: "ML", align: "right" as const },
];

export default function LeaveAvailedReport() {
  const f = useReportFilters();
  const d = useLeaveReportData({
    reportType: "leave-availed-report",
    fromMonth: f.fromMonth,
    toMonth: f.toMonth,
    filters: f.filters,
    groupBy: f.groupBy,
    exportTitle: "Leave Availed Report",
    exportColumns: COLUMNS,
  });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Leave Availed Report"
        reportType="leave-availed-report"
        fromMonth={f.fromMonth}
        toMonth={f.toMonth}
        monthOptions={f.monthOptions}
        onFromMonthChange={f.setFromMonth}
        onToMonthChange={f.setToMonth}
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