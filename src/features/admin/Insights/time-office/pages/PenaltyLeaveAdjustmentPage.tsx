import { useMemo, useState } from "react";
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

/* =========================================================
   MONTH OPTIONS
========================================================= */

const getMonthOptions = (): string[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();

  return months.map(
    (month) => `${month}/${currentYear}`
  );
};

/* =========================================================
   CURRENT MONTH
========================================================= */

const getCurrentMonth = (): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const today = new Date();

  return `${months[today.getMonth()]}/${today.getFullYear()}`;
};

export default function PenaltyLeaveAdjustmentPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  const [rows] = useState<Record<string, unknown>[]>([]);
  const [loading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     FILTER BAR VISIBILITY

     Initial:
     Filter bar visible

     Funnel:
     Show filter bar

     X:
     Hide filter bar

     X does NOT reset filter values.
  ========================================================= */

  const [showFilterBar, setShowFilterBar] =
    useState(true);

  /* =========================================================
     MONTH
  ========================================================= */

  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth());

  const monthOptions = useMemo(
    () => getMonthOptions(),
    []
  );

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = () => {
    const validation = validateDateRange(
      filters.fromDate || today,
      filters.toDate || today
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    /*
     * API integration can be added here
     * once the response structure is available.
     */
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] p-2 font-[Urbanist]">

      {/* =====================================================
          MAIN TIME OFFICE + REPORT HEADER
      ===================================================== */}

      <TimeOfficeReportHeader
        title="Penalty Leave Adjustment"

        onBack={() => navigate(-1)}

        showTimeOfficeBanner={true}
        showBannerHistory={false}

        showDateRange={false}

        showMonthDropdown={true}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        monthOptions={monthOptions}

        showPdfExport={true}
        showExcelExport={true}
        showRefresh={true}
        showAdvanceFilter={false}

        onShowFilters={() =>
          setShowFilterBar(true)
        }
      />

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

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

        onHideFilters={() =>
          setShowFilterBar(false)
        }

        showFilters={showFilterBar}

        filterVariant="penaltyLeaveAdjustment"
      />

      {/* =====================================================
          TABLE
      ===================================================== */}

      <TimeOfficeTable
        columns={[]}
        rows={rows}
        loading={loading}
        emptyMessage="No penalty leave adjustment records found."
      />

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />

    </div>
  );
}