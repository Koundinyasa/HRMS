





// LeaveSummaryBetweenMonths.tsx
import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import GroupedReportTable from "../components/GroupedReportTable";
import LeaveTypeSelector, { LEAVE_TYPE_OPTIONS } from "../components/LeaveTypeSelector";
import Pagination from "../components/common/Pagination";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";

// Same 7 sub-columns for every leave type, matching the reference report.
const SUB_COLUMNS = [
  { key: "opBal", label: "Op.Bal." },
  { key: "allotted", label: "Allotted" },
  { key: "availed", label: "Availed" },
  { key: "encashed", label: "Encashed" },
  { key: "adjusted", label: "Adjusted" },
  { key: "lapsed", label: "Lapsed" },
  { key: "clBal", label: "Cl.Bal." },
];

export default function LeaveSummaryBetweenMonths() {
  const f = useReportFilters();
  const [leaveType, setLeaveType] = useState("compensatory_off");

  const selectedOption = LEAVE_TYPE_OPTIONS.find((o) => o.value === leaveType);
  const groupLabel = selectedOption
    ? `${selectedOption.label}-(${selectedOption.code})`
    : "Leave";

  // Single dynamic group — swaps to whichever leave type is selected.
  const GROUPS = useMemo(
    () => [{ groupLabel, columns: SUB_COLUMNS }],
    [groupLabel]
  );

  // Flattened column list for PDF/Excel export.
  const EXPORT_COLUMNS = useMemo(
    () => [
      { key: "slNo", label: "Sl. No." },
      { key: "empId", label: "Emp. ID" },
      { key: "employeeName", label: "Employee Name" },
      ...SUB_COLUMNS.map((c) => ({ key: c.key, label: `${groupLabel} - ${c.label}` })),
    ],
    [groupLabel]
  );

  const d = useLeaveReportData({
    reportType: "leave-summary-report-between-months",
    fromMonth: f.fromMonth,
    toMonth: f.toMonth,
    filters: f.filters,
    groupBy: f.groupBy,
    exportTitle: "Leave Summary Report Between Months",
    exportColumns: EXPORT_COLUMNS,
  });

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 flex-wrap">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-orange-200 bg-orange-50 text-sm font-semibold text-orange-800 whitespace-nowrap">
          <FileText size={15} />
          Leave Summary Report Between Months
        </span>
        <ReportHeader
          title=""
          reportType="leave-summary-report-between-months"
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
        <LeaveTypeSelector value={leaveType} onChange={setLeaveType} />
      </div>
      <ReportFilters filters={f.filters} onFiltersChange={f.setFilters} onClearAll={f.clearAll} />
      <GroupedReportTable
        groups={GROUPS}
        rows={d.rows as unknown as { slNo: number; empId: string; employeeName: string; [key: string]: unknown }[]}
        loading={d.loading}
        emptyMessage="No Record Found"
      />
      <Pagination page={d.page} pageSize={d.pageSize} totalCount={d.totalCount} onPageChange={d.setPage} onPageSizeChange={d.setPageSize} />
    </div>
  );
}