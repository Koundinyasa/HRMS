


import { useState } from "react";
import { Tags, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ReportFilters from "../components/ReportFilters";
import ReportTable from "../components/ReportTable";
import Pagination from "../components/common/Pagination";
import MultiSelectDropdown, {
  type MultiSelectOption,
} from "../components/common/MultiSelectDropdown";
import { PdfExportIcon, ExcelExportIcon } from "../components/common/ReportExportIcons";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";

const CLASSIFICATION_OPTIONS: MultiSelectOption[] = [
  { key: "team", label: "Team" },
  { key: "department", label: "Department" },
  { key: "branch", label: "Branch" },
  { key: "designation", label: "Designation" },
  { key: "salaryStructure", label: "Salary Structure" },
  { key: "leavePolicy", label: "Leave Policy" },
  { key: "attendanceStructure", label: "Attendence Structure" },
  { key: "bank", label: "Bank" },
  { key: "acNo", label: "A/c No." },
  { key: "ifscCode", label: "IFSC Code" },
  { key: "costCenter", label: "Cost Center" },
];

const COLUMNS = [
  { key: "employeeId", label: "Emp ID" },
  { key: "employeeName", label: "Employee Name" },
  { key: "effectiveFrom", label: "Effective From" },
  { key: "classification", label: "Classification" },
];

export default function ClassificationReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.pathname.match(/^(.*\/employee-report)(\/.+)?$/);
  const landingPath = match ? match[1] : location.pathname;

  const [selectedClassifications, setSelectedClassifications] = useState<string[]>(
    CLASSIFICATION_OPTIONS.map((o) => o.key)
  );
  const { filters, setFilters, clearAll } = useReportFilters();

  const { rows, totalCount, page, setPage, pageSize, setPageSize, loading, handleExport } =
    useEmployeeReportData({
      reportType: "classification-report",
      filters,
      exportTitle: "Classification Report",
      exportColumns: COLUMNS,
    });

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
        {/* <span className="flex items-center gap-2 px-4 py-2 rounded-md border border-brand-200 bg-brand-50 text-sm font-semibold text-brand-800">
          <Tags size={15} />
          Classification Report
        </span> */}

<span className="flex items-center gap-2 px-4 py-2 rounded-md border border-orange-200 bg-orange-50 text-sm font-semibold text-orange-700">
  <Tags size={15} />
  Classification Report
</span>
        <button
          type="button"
          onClick={() => navigate(landingPath)}
          className="flex items-center gap-1 px-3.5 py-1.5 text-sm font-medium text-white bg-brand-800 rounded-md hover:bg-brand-900"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">From Date</span>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">To Date</span>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-brand-300"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <MultiSelectDropdown
            label="Classification"
            options={CLASSIFICATION_OPTIONS}
            selected={selectedClassifications}
            onChange={setSelectedClassifications}
          />
          <button type="button" onClick={() => handleExport("pdf")} aria-label="Export PDF">
            <PdfExportIcon />
          </button>
          <button type="button" onClick={() => handleExport("excel")} aria-label="Export Excel">
            <ExcelExportIcon />
          </button>
        </div>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} onClearAll={clearAll} />

      <ReportTable columns={COLUMNS} rows={rows} loading={loading} />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        variant="compact"
      />
    </div>
  );
}