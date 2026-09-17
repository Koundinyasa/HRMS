// LeaveSummaryReport.tsx
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import GroupedReportTable from "../components/GroupedReportTable";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";

const LEAVE_METRIC_COLUMNS = [
  { key: "opBal", label: "Op.Bal." },
  { key: "allotted", label: "Allotted" },
  { key: "availed", label: "Availed" },
  { key: "encashed", label: "Encashed" },
  { key: "adjusted", label: "Adjusted" },
  { key: "lapsed", label: "Lapsed" },
  { key: "clBal", label: "Cl.Bal." },
];

const GROUPS = [
  { groupLabel: "Loss of Pay (LOP)", columns: LEAVE_METRIC_COLUMNS.map((c) => ({ ...c, key: `lop_${c.key}` })) },
  { groupLabel: "Casual Leave (CL)", columns: LEAVE_METRIC_COLUMNS.map((c) => ({ ...c, key: `cl_${c.key}` })) },
];

export default function LeaveSummaryReport() {
  const f = useReportFilters();
  const d = useLeaveReportData({
    reportType: "leave-summary-report",
    fromMonth: f.fromMonth,
    toMonth: f.toMonth,
    filters: f.filters,
    groupBy: f.groupBy,
  });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Leave Summary Report"
        reportType="leave-summary-report"
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
      <GroupedReportTable
        groups={GROUPS}
        rows={d.rows as unknown as Array<{ slNo: number; empId: string; employeeName: string }>}
        loading={d.loading}
      />
      <Pagination page={d.page} pageSize={d.pageSize} totalCount={d.totalCount} onPageChange={d.setPage} onPageSizeChange={d.setPageSize} />
    </div>
  );
}