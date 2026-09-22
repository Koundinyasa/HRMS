import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficePagination from "../components/TimeOfficePagination";
import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeTable from "../components/TimeOfficeTable";
import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getMonthLabel = (date: Date): string =>
  `${date.toLocaleString("en-US", { month: "short" })}/${date.getFullYear()}`;

export default function OTToCWConvertedPage() {
  const navigate = useNavigate();
  const today = getTodayDate();
  const { filters, updateFilter, resetFilters } = useTimeOfficeFilters();
  const [selectedMonth, setSelectedMonth] = useState(() =>
    getMonthLabel(new Date())
  );
  const [rows] = useState<Record<string, unknown>[]>([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const monthOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 12 }, (_, month) =>
      getMonthLabel(new Date(currentYear, month, 1))
    );
  }, []);

  const handleSearch = () => {
    const validation = validateDateRange(
      filters.fromDate || today,
      filters.toDate || today
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">
      <TimeOfficeReportHeader
        title="OT To CW Converted"
        onBack={() => navigate(-1)}
        showDateRange={false}
        showMonthDropdown
        selectedMonth={selectedMonth}
        monthOptions={monthOptions}
        onMonthChange={(month) => {
          setSelectedMonth(month);
          setCurrentPage(1);
        }}
        showPdfExport={false}
        showExcelExport
        showRefresh={false}
      />

      <TimeOfficeFilters
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        employeeId={filters.employeeId}
        employeeName={filters.employeeName}
        onFromDateChange={(value) => updateFilter("fromDate", value)}
        onToDateChange={(value) => updateFilter("toDate", value)}
        onEmployeeIdChange={(value) => updateFilter("employeeId", value)}
        onEmployeeNameChange={(value) => updateFilter("employeeName", value)}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <TimeOfficeTable
        columns={[]}
        rows={rows}
        loading={loading}
        emptyMessage="No OT to CW converted records found."
      />

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
