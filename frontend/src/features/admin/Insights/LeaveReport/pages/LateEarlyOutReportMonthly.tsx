




// LateEarlyOutReportMonthly.tsx
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";

const COLUMNS = [
  { key: "slNo", label: "Sl. No." },
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "hours", label: "Hours", align: "right" as const },
  { key: "minutes", label: "Minutes", align: "right" as const },
  { key: "seconds", label: "Seconds", align: "right" as const },
];

export default function LateEarlyOutReportMonthly() {
  const f = useReportFilters();
  const d = useLeaveReportData({
    reportType: "late-in-early-out-report-monthly",
    fromMonth: f.fromMonth,
    toMonth: f.toMonth,
    filters: f.filters,
    groupBy: f.groupBy,
    exportTitle: "Late In Early Out Report (Monthly)",
    exportColumns: COLUMNS,
  });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Late In Early Out Report (Monthly)"
        reportType="late-in-early-out-report-monthly"
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