


// AttendanceIntegrationReport.tsx
import { useState } from "react";
import { ClipboardList } from "lucide-react";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import { PdfIcon, ExcelIcon, ClockIcon } from "../components/common/ReportIcons";
import { useReportFilters } from "../hooks/useReportFilters";
import { useLeaveReportData } from "../hooks/useLeaveReportData";
import { useDatePickerField } from "../hooks/useDatePickerField";
import { DatePicker } from "@/components/ui/datepicker";

const COLUMNS = [
  { key: "slNo", label: "Sl. No." },
  { key: "employeeId", label: "Employee ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "hours", label: "Hours", align: "right" as const },
  { key: "minutes", label: "Minutes", align: "right" as const },
  { key: "seconds", label: "Seconds", align: "right" as const },
];

export default function AttendanceIntegrationReport() {
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
    reportType: "attendance-integration-report",
    fromMonth: fromDate,
    toMonth: toDate,
    filters: f.filters,
    groupBy: f.groupBy,
    exportTitle: "Attendance Integration Report",
    exportColumns: COLUMNS,
  });

  return (
    <div className="font-[Urbanist] space-y-3">
      <div className="font-[Urbanist] bg-white rounded-lg shadow-sm border border-[#8B5A2B] px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 flex-wrap">
        <span className="font-[Urbanist] flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#8B5A2B] bg-orange-50 text-sm font-semibold text-orange-800 whitespace-nowrap">
          <ClipboardList size={15} />
          Attendance Integration Report
        </span>

        <div className="font-[Urbanist] flex items-center gap-2 w-full sm:w-auto">
          <span className="font-[Urbanist] text-sm font-medium text-gray-700 whitespace-nowrap">From Date</span>
          <DatePicker id="fromDate" {...fromPicker.pickerProps} />
        </div>

        <div className="font-[Urbanist] flex items-center gap-2 w-full sm:w-auto">
          <span className="font-[Urbanist] text-sm font-medium text-gray-700 whitespace-nowrap">To Date</span>
          <DatePicker id="toDate" {...toPicker.pickerProps} />
        </div>

        <div className="font-[Urbanist] flex items-center gap-3 sm:ml-auto">
          <button type="button" onClick={() => d.handleExport("pdf")} aria-label="Export PDF" className="font-[Urbanist] hover:opacity-75 transition-opacity">
            <PdfIcon />
          </button>
          <button type="button" onClick={() => d.handleExport("excel")} aria-label="Export Excel" className="font-[Urbanist] hover:opacity-75 transition-opacity">
            <ExcelIcon />
          </button>
          <button type="button" aria-label="History" className="font-[Urbanist] hover:opacity-75 transition-opacity">
            <ClockIcon />
          </button>
        </div>
      </div>

      <ReportFilters filters={f.filters} onFiltersChange={f.setFilters} onClearAll={f.clearAll} />
      <ReportTable columns={COLUMNS} rows={d.rows} loading={d.loading} />
      <Pagination page={d.page} pageSize={d.pageSize} totalCount={d.totalCount} onPageChange={d.setPage} onPageSizeChange={d.setPageSize} />
    </div>
  );
}