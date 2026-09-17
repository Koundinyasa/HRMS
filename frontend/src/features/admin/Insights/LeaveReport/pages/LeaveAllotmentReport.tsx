// LeaveAllotmentReport.tsx
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

export default function LeaveAllotmentReport() {
  const {
    monthOptions,
    fromMonth,
    toMonth,
    setFromMonth,
    setToMonth,
    filters,
    setFilters,
    groupBy,
    setGroupBy,
    clearAll,
  } = useReportFilters();

  const {
    rows,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    handleExport,
  } = useLeaveReportData({
    reportType: "leave-allotment-report",
    fromMonth,
    toMonth,
    filters,
    groupBy,
    exportTitle: "Leave Allotment Report",
    exportColumns: COLUMNS,
  });

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Leave Allotment Report"
        reportType="leave-allotment-report"
        fromMonth={fromMonth}
        toMonth={toMonth}
        monthOptions={monthOptions}
        onFromMonthChange={setFromMonth}
        onToMonthChange={setToMonth}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
      />

      <ReportFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={clearAll}
      />

      <ReportTable columns={COLUMNS} rows={rows} loading={loading} />

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