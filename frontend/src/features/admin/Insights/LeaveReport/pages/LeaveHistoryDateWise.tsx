






// LeaveHistoryDateWise.tsx
import { useState } from "react";
import { ClipboardList } from "lucide-react";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import StatusBadge from "../components/common/StatusBadge";
import { PdfIcon, ExcelIcon, ClockIcon } from "../components/common/ReportIcons";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";
import { useDatePickerField } from "../hooks/useDatePickerField";
import { DatePicker } from "@/components/ui/datepicker";
import type { LeaveReportRow } from "../types/leaveReport";

const COLUMNS = [
  { key: "slNo", label: "Sl. No." },
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "type", label: "Type" },
  { key: "date", label: "Date" },
  { key: "q1", label: "Q1", align: "center" as const },
  { key: "q2", label: "Q2", align: "center" as const },
  { key: "q3", label: "Q3", align: "center" as const },
  { key: "q4", label: "Q4", align: "center" as const },
  { key: "fh", label: "FH", align: "center" as const },
  { key: "sh", label: "SH", align: "center" as const },
  { key: "totalDays", label: "Total Days", align: "right" as const },
  { key: "appliedDate", label: "Applied Date" },
  { key: "leaveReason", label: "Leave Reason" },
  {
    key: "status",
    label: "Status",
    align: "center" as const,
    render: (row: LeaveReportRow) => (
      <StatusBadge status={(row as unknown as { status?: string }).status ?? ""} />
    ),
  },
];

export default function LeaveHistoryDateWise() {
  const f = useReportFilters();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fromPicker = useDatePickerField({
    value: fromDate,
    onChange: setFromDate,
    maxDate: toDate || undefined,
  });
  const toPicker = useDatePickerField({
    value: toDate,
    onChange: setToDate,
    minDate: fromDate || undefined,
  });

  const d = useLeaveReportData({
    reportType: "leave-history-report-date-wise",
    fromMonth: fromDate,
    toMonth: toDate,
    filters: f.filters,
    groupBy: f.groupBy,
    exportTitle: "Leave History Report(Date-Wise)",
    exportColumns: COLUMNS,
  });

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 flex-wrap">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-orange-200 bg-orange-50 text-sm font-semibold text-orange-800 whitespace-nowrap">
          <ClipboardList size={15} />
          Leave History Report(Date-Wise)
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">From Date</span>
          <DatePicker id="fromDate" {...fromPicker.pickerProps} />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">To Date</span>
          <DatePicker id="toDate" {...toPicker.pickerProps} />
        </div>

        <div className="flex items-center gap-3 sm:ml-auto">
          <button type="button" onClick={() => d.handleExport("pdf")} aria-label="Export PDF" className="hover:opacity-75 transition-opacity">
            <PdfIcon />
          </button>
          <button type="button" onClick={() => d.handleExport("excel")} aria-label="Export Excel" className="hover:opacity-75 transition-opacity">
            <ExcelIcon />
          </button>
          <button type="button" aria-label="History" className="hover:opacity-75 transition-opacity">
            <ClockIcon />
          </button>
        </div>
      </div>

      <ReportFilters filters={f.filters} onFiltersChange={f.setFilters} onClearAll={f.clearAll} />
      <ReportTable columns={COLUMNS} rows={d.rows} loading={d.loading} />
    </div>
  );
}