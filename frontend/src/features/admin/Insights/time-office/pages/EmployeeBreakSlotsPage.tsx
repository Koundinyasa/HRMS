import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";
import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const BREAK_SLOT_CATEGORY_OPTIONS = [
  "Branch",
  "Designation",
  "Salary Structure",
  "Leave Policy",
  "Attendance Structure",
  "Department",
  "Team",
];

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function EmployeeBreakSlotsPage() {
  const navigate = useNavigate();
  const today = getTodayDate();

  const { filters, updateFilter, resetFilters } =
    useTimeOfficeFilters();

  const [rows] = useState<Record<string, unknown>[]>([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([
    "Branch",
    "Designation",
  ]);

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
    // the Employee Break Slots API response structure.
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">
      <TimeOfficeReportHeader
        title="Employee Break Slots"
        onBack={() => navigate(-1)}
        showBannerHistory
        showPdfExport={false}
        showCategories
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        categoryOptions={BREAK_SLOT_CATEGORY_OPTIONS}
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
        columns={[]}
        rows={rows}
        loading={loading}
        emptyMessage="No employee break slot records found."
      />

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}