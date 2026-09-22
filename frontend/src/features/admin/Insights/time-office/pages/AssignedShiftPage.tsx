import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";

interface AssignedShiftRow {
  empId: string;
  empName: string;
  shiftDate: string;
  shiftName: string;
  shiftCode: string;
  shiftTime: string;
  endTime: string;
}

/* =========================================================
   DATA
========================================================= */

const ASSIGNED_SHIFT_DATA: AssignedShiftRow[] = [];

const ASSIGNED_SHIFT_COLUMNS = [
  {
    header: "Emp ID",
    key: "empId",
  },
  {
    header: "Emp Name",
    key: "empName",
  },
  {
    header: "Shift Date",
    key: "shiftDate",
  },
  {
    header: "Shift Name",
    key: "shiftName",
  },
  {
    header: "Shift Code",
    key: "shiftCode",
  },
  {
    header: "Shift Time",
    key: "shiftTime",
  },
  {
    header: "End Time",
    key: "endTime",
  },
];

/* =========================================================
   DATE
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
   COMPONENT
========================================================= */

export default function AssignedShiftPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const [fromDate, setFromDate] =
    useState(today);

  const [toDate, setToDate] =
    useState(today);

  const [searchText, setSearchText] =
    useState("");

  const [showFilterBar, setShowFilterBar] =
    useState(true);

  const { filters, updateFilter, resetFilters } =
    useTimeOfficeFilters();

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 10;

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredData = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    if (!search) {
      return ASSIGNED_SHIFT_DATA;
    }

    return ASSIGNED_SHIFT_DATA.filter(
      (row) =>
        row.empId
          .toLowerCase()
          .includes(search) ||
        row.empName
          .toLowerCase()
          .includes(search) ||
        row.shiftName
          .toLowerCase()
          .includes(search) ||
        row.shiftCode
          .toLowerCase()
          .includes(search)
    );
  }, [searchText]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length /
        rowsPerPage
    )
  );

  const paginatedData =
    filteredData.slice(
      (currentPage - 1) *
        rowsPerPage,
      currentPage *
        rowsPerPage
    );

  /* =======================================================
     HANDLERS
  ======================================================= */

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchText("");
    setCurrentPage(1);
    resetFilters();
    setShowFilterBar(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  /* =======================================================
     EXPORT
  ======================================================= */

  return (
    <div className="relative z-0 min-h-screen bg-[#f3f6fa] p-2 font-[Urbanist]">

      {/* =====================================================
          TIME OFFICE + ASSIGNED SHIFT HEADER
          ===================================================== */}

      <TimeOfficeReportHeader
        title="Assigned Shift"

        fromDate={fromDate}
        toDate={toDate}

        onFromDateChange={
          setFromDate
        }

        onToDateChange={
          setToDate
        }

        onBack={handleBack}

        /*
         * TOP HEADER:
         * Time Office + Vessel + ClockFading
         */
        showTimeOfficeBanner

        /*
         * REPORT HEADER
         */
        showDateRange

        /*
         * Assigned Shift has no Categories
         */
        showCategories={false}

        /*
         * PDF + Excel + ClockFading
         */
        showPdfExport
        showExcelExport
        showRefresh

        showGraceTypes={false}
        showMonthDropdown={false}

        /*
         * Existing export data
         */
        columns={ASSIGNED_SHIFT_COLUMNS.map(
          (column) =>
            column.header
        )}

        rows={filteredData.map(
          (row) =>
            row as unknown as Record<
              string,
              unknown
            >
        )}
      />

      <TimeOfficeFilters
        fromDate={fromDate}
        toDate={toDate}
        employeeId={filters.employeeId}
        employeeName={filters.employeeName}
        onFromDateChange={(value) => {
          updateFilter("fromDate", value);
          setFromDate(value);
        }}
        onToDateChange={(value) => {
          updateFilter("toDate", value);
          setToDate(value);
        }}
        onEmployeeIdChange={(value) =>
          updateFilter("employeeId", value)
        }
        onEmployeeNameChange={(value) =>
          updateFilter("employeeName", value)
        }
        onSearch={handleSearch}
        onReset={handleClear}
        onHideFilters={() => setShowFilterBar(false)}
        showFilters={showFilterBar}
      />

      {/* =====================================================
          TABLE
          ===================================================== */}

      <div className="overflow-hidden rounded-[14px] border border-[#d5d9df] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.18)]">

        <div className="w-full overflow-hidden">

          <table className="w-full table-fixed border-collapse">

            <thead>
              <tr className="bg-[#cfe6f5]">

                {ASSIGNED_SHIFT_COLUMNS.map(
                  (column) => (
                    <th
                      key={column.key}
                      className="
                        border-r
                        border-[#d3e5f2]
                        px-3
                        py-3
                        text-left
                        font-[Urbanist]
                        text-[13px]
                        font-semibold
                        leading-[18px]
                        text-[#7f4b3d]
                      "
                    >
                      {column.header}
                    </th>
                  )
                )}

              </tr>
            </thead>

            <tbody>

              {paginatedData.length > 0 ? (
                paginatedData.map(
                  (row, index) => (
                    <tr
                      key={`${row.empId}-${index}`}
                      className="border-b border-[#edf0f3] bg-white"
                    >

                      <td className="px-3 py-3 font-[Urbanist] text-[13px] font-medium leading-[18px] text-[#249bd7]">
                        {row.empId}
                      </td>

                      <td className="px-3 py-3 font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054]">
                        {row.empName}
                      </td>

                      <td className="px-3 py-3 font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054]">
                        {row.shiftDate}
                      </td>

                      <td className="px-3 py-3 font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054]">
                        {row.shiftName}
                      </td>

                      <td className="px-3 py-3 font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054]">
                        {row.shiftCode}
                      </td>

                      <td className="px-3 py-3 font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054]">
                        {row.shiftTime}
                      </td>

                      <td className="px-3 py-3 font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054]">
                        {row.endTime}
                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      ASSIGNED_SHIFT_COLUMNS.length
                    }
                    className="p-0"
                  >
                    <TimeOfficeEmptyState message="No assigned shift records found." />
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div className="flex min-h-[52px] items-center justify-end gap-3 px-3">

        <span className="font-[Urbanist] text-[12px] font-medium leading-[16px] text-[#667085]">
          Rows per page
        </span>

        <Button
          variant="ghost"
          type="button"
          className="
            flex
            h-[32px]
            items-center
            gap-1
            rounded-[6px]
            px-2
            font-[Urbanist]
            text-[12px]
            font-medium
            text-[#475467]
            shadow-none
            hover:bg-[#f8fafc]
          "
        >
          10

          <ChevronDown size={14} />
        </Button>

        <span className="font-[Urbanist] text-[12px] font-medium leading-[16px] text-[#667085]">
          {filteredData.length === 0
            ? "0 to 0 of 0"
            : `${
                (currentPage - 1) *
                  rowsPerPage +
                1
              } to ${Math.min(
                currentPage *
                  rowsPerPage,
                filteredData.length
              )} of ${
                filteredData.length
              }`}
        </span>

        {/* FIRST */}

        <Button
          variant="ghost"
          type="button"
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(1)
          }
          className="
            h-[32px]
            w-[32px]
            rounded-[6px]
            p-0
            text-[#8b95a3]
            shadow-none
            hover:bg-[#f8fafc]
            disabled:opacity-40
          "
        >
          <ChevronsLeft size={17} />
        </Button>

        {/* PREVIOUS */}

        <Button
          variant="ghost"
          type="button"
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(
              (page) =>
                Math.max(
                  1,
                  page - 1
                )
            )
          }
          className="
            h-[32px]
            w-[32px]
            rounded-[6px]
            p-0
            text-[#8b95a3]
            shadow-none
            hover:bg-[#f8fafc]
            disabled:opacity-40
          "
        >
          <ChevronLeft size={17} />
        </Button>

        {/* CURRENT PAGE */}

        <Button
          variant="ghost"
          type="button"
          className="
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
            rounded-full
            bg-[#edf0f5]
            p-0
            font-[Urbanist]
            text-[12px]
            font-medium
            text-[#26364a]
            shadow-none
          "
        >
          {currentPage}
        </Button>

        {/* NEXT */}

        <Button
          variant="ghost"
          type="button"
          disabled={
            currentPage >=
            totalPages
          }
          onClick={() =>
            setCurrentPage(
              (page) =>
                Math.min(
                  totalPages,
                  page + 1
                )
            )
          }
          className="
            h-[32px]
            w-[32px]
            rounded-[6px]
            p-0
            text-[#8b95a3]
            shadow-none
            hover:bg-[#f8fafc]
            disabled:opacity-40
          "
        >
          <ChevronRight size={17} />
        </Button>

        {/* LAST */}

        <Button
          variant="ghost"
          type="button"
          disabled={
            currentPage >=
            totalPages
          }
          onClick={() =>
            setCurrentPage(
              totalPages
            )
          }
          className="
            h-[32px]
            w-[32px]
            rounded-[6px]
            p-0
            text-[#8b95a3]
            shadow-none
            hover:bg-[#f8fafc]
            disabled:opacity-40
          "
        >
          <ChevronsRight size={17} />
        </Button>

      </div>

    </div>
  );
}