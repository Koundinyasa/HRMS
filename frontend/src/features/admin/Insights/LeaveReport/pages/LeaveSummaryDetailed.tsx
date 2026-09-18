// LeaveSummaryDetailed.tsx
import { Eye } from "lucide-react";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";

const COLUMNS = [
  { key: "slNo", label: "Sl.No." },
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  {
    key: "action",
    label: "Action",
    align: "right" as const,
    render: () => (
      <button type="button" aria-label="View details" className="text-orange-800 hover:text-orange-900 transition-colors">
        <Eye size={18} />
      </button>
    ),
  },
];

export default function LeaveSummaryDetailed() {
  const f = useReportFilters();
  const d = useLeaveReportData({
    reportType: "leave-summary-report-detailed",
    fromMonth: f.fromMonth,
    toMonth: f.toMonth,
    filters: f.filters,
    groupBy: f.groupBy,
    exportTitle: "Leave Summary Report(Detailed)",
    exportColumns: COLUMNS,
  });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Leave Summary Report(Detailed)"
        reportType="leave-summary-report-detailed"
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
      <ReportTable
        columns={COLUMNS}
        rows={d.rows}
        loading={d.loading}
        emptyMessage="No records found"
      />
      <Pagination page={d.page} pageSize={d.pageSize} totalCount={d.totalCount} onPageChange={d.setPage} onPageSizeChange={d.setPageSize} />
    </div>
  );
}