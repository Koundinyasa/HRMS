import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";
import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const COLUMNS = [
  "Sl.No.",
  "Employee ID",
  "Employee Name",
  "Date",
  "Shift Worked",
  "Shift Start Time",
  "Checked IN Time",
  "Early IN By Mins",
];

export default function EarlyInPage() {
  const navigate = useNavigate();
  const today = getTodayDate();

  const { filters, updateFilter, resetFilters } =
    useTimeOfficeFilters();

  const [rows] = useState<Record<string, unknown>[]>([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    const validation = validateDateRange(
      filters.fromDate || today,
      filters.toDate || today
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // API integration will be added after confirming
    // the Day-Wise Early In API response structure.
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">
      <TimeOfficeReportHeader
        title="Early In"
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        onFromDateChange={(value) => updateFilter("fromDate", value)}
        onToDateChange={(value) => updateFilter("toDate", value)}
        onBack={() => navigate(-1)}
        showRefresh
        showExportControls
        exportColumns={COLUMNS}
        exportRows={rows}
      />

      <TimeOfficeFilters
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        employeeId={filters.employeeId}
        employeeName={filters.employeeName}
        onFromDateChange={(value) =>
          updateFilter("fromDate", value)
        }
        onToDateChange={(value) =>
          updateFilter("toDate", value)
        }
        onEmployeeIdChange={(value) =>
          updateFilter("employeeId", value)
        }
        onEmployeeNameChange={(value) =>
          updateFilter("employeeName", value)
        }
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <TimeOfficeTable
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        emptyMessage="No early-in records found."
      />

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}