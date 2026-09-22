import React, { useState } from "react";
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

const COLUMNS = ["Emp Id", "Emp Name"];

export default function EmployeeDayWiseOverviewPage() {
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

    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f3f6fa] p-2">
      <TimeOfficeReportHeader
        title="Employee Day-Wise Overview"
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        onFromDateChange={(value) =>
          updateFilter("fromDate", value)
        }
        onToDateChange={(value) =>
          updateFilter("toDate", value)
        }
        onBack={() => navigate(-1)}
        showBannerHistory
        showPdfExport={false}
        showCategories
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
        showDayWiseDropdownOptions
      />

      <TimeOfficeTable
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        emptyMessage="No employee day-wise overview records found."
        actionLabel="Action"
        onView={() => navigate("../day-wise-employee-shift")}
      />

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={16}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
