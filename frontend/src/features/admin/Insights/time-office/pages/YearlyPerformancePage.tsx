import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const getCurrentMonth = (): string => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}`;
};

export default function YearlyPerformancePage() {
  const navigate = useNavigate();

  const currentMonth = getCurrentMonth();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  const [rows] = useState<
    Record<string, unknown>[]
  >([]);

  const [loading] = useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  /* ==========================================
     Categories
     ========================================== */

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([
      "Department",
      "DOJ",
    ]);

  /* ==========================================
     Search
     ========================================== */

  const handleSearch = () => {
    const validation =
      validateDateRange(
        filters.fromDate ||
          currentMonth,

        filters.toDate ||
          currentMonth
      );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setCurrentPage(1);

    // API integration will be added later.
  };

  /* ==========================================
     Reset
     ========================================== */

  const handleReset = () => {
    resetFilters();

    setSelectedCategories([
      "Department",
      "DOJ",
    ]);

    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">

      {/* ========================================
          HEADER
          ======================================== */}

      <TimeOfficeReportHeader
        title="Yearly Performance"

        fromDate={
          filters.fromDate ||
          currentMonth
        }

        toDate={
          filters.toDate ||
          currentMonth
        }

        onFromDateChange={(value) =>
          updateFilter(
            "fromDate",
            value
          )
        }

        onToDateChange={(value) =>
          updateFilter(
            "toDate",
            value
          )
        }

        onBack={() =>
          navigate(-1)
        }

        /* Figma uses Month */
        dateMode="month"

        /* Categories (2) */
        showCategories={true}

        selectedCategories={
          selectedCategories
        }

        onCategoriesChange={
          setSelectedCategories
        }

        /* Figma has Excel only */
        showPdfExport={false}
        showExcelExport={true}
        showRefresh={false}

        columns={[]}
        rows={rows}
      />

      {/* ========================================
          FILTERS
          ======================================== */}

      <TimeOfficeFilters
        fromDate={
          filters.fromDate ||
          currentMonth
        }

        toDate={
          filters.toDate ||
          currentMonth
        }

        employeeId={
          filters.employeeId
        }

        employeeName={
          filters.employeeName
        }

        onFromDateChange={(value) =>
          updateFilter(
            "fromDate",
            value
          )
        }

        onToDateChange={(value) =>
          updateFilter(
            "toDate",
            value
          )
        }

        onEmployeeIdChange={(value) =>
          updateFilter(
            "employeeId",
            value
          )
        }

        onEmployeeNameChange={(value) =>
          updateFilter(
            "employeeName",
            value
          )
        }

        onSearch={
          handleSearch
        }

        onReset={
          handleReset
        }
      />

      {/* ========================================
          TABLE
          ======================================== */}

      <TimeOfficeTable
        columns={[
          "Emp Id",
          "Emp Name",
          "Action",
        ]}
        rows={rows}
        loading={loading}
        emptyMessage="No yearly performance records found."
      />

      {/* ========================================
          PAGINATION
          ======================================== */}

      <TimeOfficePagination
        currentPage={
          currentPage
        }
        totalPages={1}
        onPageChange={
          setCurrentPage
        }
      />

    </div>
  );
}