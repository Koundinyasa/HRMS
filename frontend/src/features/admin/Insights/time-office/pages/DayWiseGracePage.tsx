import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

/* =========================================================
   GRACE TYPES
   ========================================================= */

const GRACE_TYPE_OPTIONS = [
  "All",
  "Late In",
  "Early Out",
];

/* =========================================================
   TABLE COLUMNS
   ========================================================= */

const FIXED_COLUMNS = [
  "Emp ID",
  "Emp Name",
  "DOJ",
  "Department",
  "Designation",
  "Date",
];

const LATE_IN_COLUMNS = [
  "Defined Late In Grace",
  "Employee Late In Grace",
];

const EARLY_OUT_COLUMNS = [
  "Defined Early Out Grace",
  "Employee Early Out Grace",
];

/* =========================================================
   TODAY
   ========================================================= */

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================================================
   PAGE
   ========================================================= */

export default function DayWiseGracePage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  /* =======================================================
     STATE
     ======================================================= */

  const [graceType, setGraceType] =
    useState("All");

  const [rows] = useState<
    Record<string, unknown>[]
  >([]);

  const [loading] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  /* =======================================================
     DYNAMIC TABLE COLUMNS
     ======================================================= */

  const columns =
    graceType === "Late In"
      ? [
          ...FIXED_COLUMNS,
          ...LATE_IN_COLUMNS,
        ]
      : graceType === "Early Out"
        ? [
            ...FIXED_COLUMNS,
            ...EARLY_OUT_COLUMNS,
          ]
        : [
            ...FIXED_COLUMNS,
            ...LATE_IN_COLUMNS,
            ...EARLY_OUT_COLUMNS,
          ];

  /* =======================================================
     SEARCH
     ======================================================= */

  const handleSearch = () => {
    const validation =
      validateDateRange(
        filters.fromDate || today,
        filters.toDate || today
      );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setCurrentPage(1);

    /*
     * API WILL BE CONNECTED HERE LATER.
     *
     * Example:
     *
     * fetchDayWiseGrace({
     *   fromDate: filters.fromDate,
     *   toDate: filters.toDate,
     *   graceType,
     *   employeeId: filters.employeeId,
     *   employeeName: filters.employeeName,
     * });
     */
  };

  /* =======================================================
     RESET
     ======================================================= */

  const handleReset = () => {
    resetFilters();

    setGraceType("All");

    setCurrentPage(1);
  };

  /* =======================================================
     GRACE TYPE CHANGE
     ======================================================= */

  const handleGraceTypeChange = (
    value: string
  ) => {
    setGraceType(value);

    setCurrentPage(1);
  };

  /* =======================================================
     EXCEL EXPORT
     ======================================================= */

  const handleExcelExport = () => {
    const excelRows = rows.map(
      (row) => {
        const excelRow: Record<
          string,
          unknown
        > = {};

        columns.forEach(
          (column) => {
            excelRow[column] =
              row[column] ?? "";
          }
        );

        return excelRow;
      }
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelRows,
        {
          header: columns,
        }
      );

    worksheet["!cols"] =
      columns.map(
        (column) => ({
          wch: Math.max(
            column.length + 2,
            15
          ),
        })
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Day Wise Grace"
    );

    XLSX.writeFile(
      workbook,
      "Day_Wise_Grace.xlsx"
    );
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">

      {/* ===================================================
          SHARED HEADER
          
          This creates BOTH:
          1. Time Office header
          2. Day Wise Grace header
          =================================================== */}

      <TimeOfficeReportHeader
        title="Day Wise Grace"

        fromDate={
          filters.fromDate || today
        }

        toDate={
          filters.toDate || today
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

        showTimeOfficeBanner={true}
        showBannerHistory={true}

        showGraceTypes={true}

        graceType={graceType}

        onGraceTypeChange={
          handleGraceTypeChange
        }

        graceTypeOptions={
          GRACE_TYPE_OPTIONS
        }

        showPdfExport={false}

        showExcelExport={true}

        showRefresh={false}

        onExcelExport={
          handleExcelExport
        }

        columns={columns}

        rows={rows}
      />

      {/* ===================================================
          FILTERS
          =================================================== */}

      <div className="rounded-b-[6px] border border-t-0 border-[#e5e7eb] bg-white">

        <TimeOfficeFilters
          fromDate={
            filters.fromDate || today
          }

          toDate={
            filters.toDate || today
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

      </div>

      {/* ===================================================
          TABLE
          =================================================== */}

      <div className="mt-3">

        <TimeOfficeTable
          columns={columns}
          rows={rows}
          loading={loading}
          emptyMessage="No day wise grace records found."
        />

      </div>

      {/* ===================================================
          PAGINATION
          =================================================== */}

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={
          setCurrentPage
        }
      />

    </div>
  );
}
