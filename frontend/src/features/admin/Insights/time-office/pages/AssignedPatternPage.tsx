import { Button } from "@/components/ui/button";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClockFading,
  FileText,
  Funnel,
  Search,
  ChevronDown,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListChecks,
} from "lucide-react";

import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";

import {
  exportTimeOfficePdf,
  exportTimeOfficeExcel,
} from "../utils/timeOfficeExport";

interface AssignedPatternRow {
  slNo: number;
  empId: string;
  empName: string;
  effectiveFrom: string;
  patternName: string;
}

const ASSIGNED_PATTERN_DATA: AssignedPatternRow[] = [];

const ASSIGNED_PATTERN_COLUMNS = [
  {
    header: "Sl. No.",
    key: "slNo",
  },
  {
    header: "Emp ID",
    key: "empId",
  },
  {
    header: "Emp Name",
    key: "empName",
  },
  {
    header: "Eff. From",
    key: "effectiveFrom",
  },
  {
    header: "Pattern Name",
    key: "patternName",
  },
];

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

export default function AssignedPatternPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const [fromDate, setFromDate] =
    useState(today);

  const [toDate, setToDate] =
    useState(today);

  const [searchText, setSearchText] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [showFilterBar, setShowFilterBar] =
    useState(true);

  const { filters, updateFilter, resetFilters } =
    useTimeOfficeFilters();

  const [selectedPattern, setSelectedPattern] =
    useState<AssignedPatternRow | null>(
      null
    );

  const rowsPerPage = 10;

  /* =========================================================
     FILTER DATA
  ========================================================= */

  const filteredData = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    if (!search) {
      return ASSIGNED_PATTERN_DATA;
    }

    return ASSIGNED_PATTERN_DATA.filter(
      (row) =>
        row.empId
          .toLowerCase()
          .includes(search) ||
        row.empName
          .toLowerCase()
          .includes(search) ||
        row.patternName
          .toLowerCase()
          .includes(search)
    );
  }, [searchText]);

  /* =========================================================
     PAGINATION
  ========================================================= */

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
      currentPage * rowsPerPage
    );

  /* =========================================================
     HANDLERS
  ========================================================= */

  const handleBack = () => {
    navigate(-1);
  };

  const handleClear = () => {
    setSearchText("");
    setCurrentPage(1);
    resetFilters();
    setShowFilterBar(true);
  };

  const openPatternDetails = (
    row: AssignedPatternRow
  ) => {
    setSelectedPattern(row);
  };

  const closePatternDetails = () => {
    setSelectedPattern(null);
  };

  /* =========================================================
     EXPORT
  ========================================================= */

  const exportOptions = {
    title: "Assigned Pattern",
    columns: ASSIGNED_PATTERN_COLUMNS,
    rows: filteredData,
    fromDate,
    toDate,
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f3f6fa] p-2 font-[Urbanist]">

      {/* =====================================================
          TIME OFFICE MODULE BANNER
      ===================================================== */}

      <div className="mb-3 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">

        <div className="flex min-h-[72px] items-center justify-between px-5">

          <div className="flex h-[46px] shrink-0 items-center rounded-[10px] border border-[#df8f7b] bg-white px-6">

            <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
              Time Office
            </h1>

          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              title="Filter"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-md p-0 text-[#3f3f3f] shadow-none hover:bg-[#fff0eb]"
            >
              <Funnel
                size={20}
                strokeWidth={1.8}
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              title="History"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-md p-0 text-[#3f3f3f] shadow-none hover:bg-[#fff0eb]"
            >
              <ClockFading
                size={20}
                strokeWidth={1.8}
              />
            </Button>
          </div>

        </div>
      </div>

      {/* =====================================================
          ASSIGNED PATTERN REPORT HEADER
      ===================================================== */}

      <div className="mb-3 w-full overflow-visible rounded-[14px] border border-[#dfe3e8] bg-white shadow-[0_2px_4px_rgba(15,23,42,0.06)]">

        <div className="flex min-h-[72px] w-full items-center gap-3 px-5">

          {/* =================================================
              REPORT TITLE
          ================================================= */}

          <div className="flex h-[50px] shrink-0 items-center gap-2 rounded-[10px] border border-[#df8f7b] bg-[#fff8f6] px-5">

            <FileText
              size={20}
              strokeWidth={1.8}
              className="shrink-0 text-[#9a5547]"
            />

            <h2 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
              Assigned Pattern
            </h2>

          </div>

          {/* =================================================
              RIGHT CONTROLS
          ================================================= */}

          <div className="ml-auto flex shrink-0 items-center gap-2">

            {/* BACK */}

            <Button
              variant="ghost"
              type="button"
              onClick={handleBack}
              className="
                flex
                h-[42px]
                shrink-0
                items-center
                gap-2
                rounded-[8px]
                bg-[#8d4d3c]
                px-4
                font-[Urbanist]
                text-[12px]
                font-semibold
                leading-[16px]
                text-white
                shadow-none
                hover:bg-[#744037]
              "
            >
              <ChevronLeft
                size={18}
                strokeWidth={2}
              />

              <span className="font-[Urbanist] text-[12px] font-semibold">
                Back
              </span>
            </Button>

            {/* FROM DATE */}

            <DateField
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
              className="
                flex
                shrink-0
                items-center
                gap-2

                [&_label]:whitespace-nowrap
                [&_label]:font-[Urbanist]
                [&_label]:text-[13px]
                [&_label]:font-medium
                [&_label]:leading-[18px]
                [&_label]:text-[#344054]

                [&_input]:h-[42px]
                [&_input]:w-[165px]
                [&_input]:rounded-[8px]
                [&_input]:border-[#dfe3e8]
                [&_input]:bg-white
                [&_input]:px-3
                [&_input]:font-[Urbanist]
                [&_input]:text-[13px]
                [&_input]:font-normal
                [&_input]:leading-[18px]
                [&_input]:text-[#344054]
              "
            />

            {/* TO DATE */}

            <DateField
              label="To Date"
              value={toDate}
              onChange={setToDate}
              className="
                flex
                shrink-0
                items-center
                gap-2

                [&_label]:whitespace-nowrap
                [&_label]:font-[Urbanist]
                [&_label]:text-[13px]
                [&_label]:font-medium
                [&_label]:leading-[18px]
                [&_label]:text-[#344054]

                [&_input]:h-[42px]
                [&_input]:w-[165px]
                [&_input]:rounded-[8px]
                [&_input]:border-[#dfe3e8]
                [&_input]:bg-white
                [&_input]:px-3
                [&_input]:font-[Urbanist]
                [&_input]:text-[13px]
                [&_input]:font-normal
                [&_input]:leading-[18px]
                [&_input]:text-[#344054]
              "
            />

            {/* PDF */}

            <Button
              variant="ghost"
              type="button"
              title="Export PDF"
              onClick={() =>
                exportTimeOfficePdf(
                  exportOptions
                )
              }
              className="
                flex
                h-[42px]
                w-[34px]
                shrink-0
                items-center
                justify-center
                rounded-[8px]
                bg-white
                p-0
                text-[#ef5350]
                shadow-none
                hover:bg-[#fff3f3]
              "
            >
              <FaFilePdf className="h-[21px] w-[21px]" />
            </Button>

            {/* EXCEL */}

            <Button
              variant="ghost"
              type="button"
              title="Export Excel"
              onClick={() =>
                exportTimeOfficeExcel(
                  exportOptions
                )
              }
              className="
                flex
                h-[42px]
                w-[34px]
                shrink-0
                items-center
                justify-center
                rounded-[8px]
                bg-white
                p-0
                text-[#35a853]
                shadow-none
                hover:bg-[#f1faf3]
              "
            >
              <FaFileExcel className="h-[21px] w-[21px]" />
            </Button>

          </div>
        </div>
      </div>

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
        onSearch={() => setCurrentPage(1)}
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

                <th className="
                  border-r
                  border-[#d3e5f2]
                  px-4
                  py-3
                  text-left
                  font-[Urbanist]
                  text-[13px]
                  font-semibold
                  leading-[18px]
                  text-[#7f4b3d]
                ">
                  Sl. No.
                </th>

                <th className="
                  border-r
                  border-[#d3e5f2]
                  px-4
                  py-3
                  text-left
                  font-[Urbanist]
                  text-[13px]
                  font-semibold
                  leading-[18px]
                  text-[#7f4b3d]
                ">
                  Emp ID
                </th>

                <th className="
                  border-r
                  border-[#d3e5f2]
                  px-4
                  py-3
                  text-left
                  font-[Urbanist]
                  text-[13px]
                  font-semibold
                  leading-[18px]
                  text-[#7f4b3d]
                ">
                  Emp Name
                </th>

                <th className="
                  border-r
                  border-[#d3e5f2]
                  px-4
                  py-3
                  text-left
                  font-[Urbanist]
                  text-[13px]
                  font-semibold
                  leading-[18px]
                  text-[#7f4b3d]
                ">
                  Eff. From
                </th>

                <th className="
                  border-r
                  border-[#d3e5f2]
                  px-4
                  py-3
                  text-left
                  font-[Urbanist]
                  text-[13px]
                  font-semibold
                  leading-[18px]
                  text-[#7f4b3d]
                ">
                  Pattern Name
                </th>

                <th className="
                  px-4
                  py-3
                  text-center
                  font-[Urbanist]
                  text-[13px]
                  font-semibold
                  leading-[18px]
                  text-[#7f4b3d]
                ">
                  View Pattern Details
                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedData.length > 0 ? (
                paginatedData.map(
                  (row) => (
                    <tr
                      key={row.slNo}
                      className="border-b border-[#edf0f3] bg-white"
                    >

                      <td className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      ">
                        {row.slNo}
                      </td>

                      <td className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-medium
                        leading-[18px]
                        text-[#159bd7]
                      ">
                        {row.empId}
                      </td>

                      <td className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      ">
                        {row.empName}
                      </td>

                      <td className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      ">
                        {row.effectiveFrom}
                      </td>

                      <td className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      ">
                        {row.patternName}
                      </td>

                      <td className="px-4 py-3 text-center">

                        <Button
                          variant="ghost"
                          type="button"
                          title="View Pattern Details"
                          onClick={() =>
                            openPatternDetails(
                              row
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-[6px]
                            p-1
                            text-[#159bd7]
                            shadow-none
                            hover:bg-[#f0f9fd]
                          "
                        >
                          <ListChecks
                            size={20}
                            strokeWidth={2}
                          />
                        </Button>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>

                  <td
                    colSpan={6}
                    className="p-0"
                  >
                    <TimeOfficeEmptyState message="No assigned pattern records found." />
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

        <span className="
          font-[Urbanist]
          text-[12px]
          font-medium
          leading-[16px]
          text-[#667085]
        ">
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

        <span className="
          ml-2
          font-[Urbanist]
          text-[12px]
          font-medium
          leading-[16px]
          text-[#667085]
        ">
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

        {/* First */}

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

        {/* Previous */}

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

        {/* Current Page */}

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

        {/* Next */}

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

        {/* Last */}

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

      {/* =====================================================
          PATTERN DETAILS MODAL
      ===================================================== */}

      {selectedPattern && (
        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/50
          px-4
        ">

          <div className="
            w-full
            max-w-[1090px]
            overflow-hidden
            rounded-[12px]
            bg-white
            shadow-2xl
            font-[Urbanist]
          ">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="
              flex
              min-h-[64px]
              items-center
              justify-between
              border-b
              border-[#e1e4ea]
              bg-[#f8f9fc]
              px-5
            ">

              <h3 className="
                font-[Urbanist]
                text-[18px]
                font-bold
                leading-[24px]
                text-[#344054]
              ">
                Shift Pattern Details
              </h3>

              <Button
                variant="ghost"
                type="button"
                onClick={
                  closePatternDetails
                }
                className="
                  flex
                  h-[32px]
                  w-[32px]
                  items-center
                  justify-center
                  rounded-[6px]
                  p-0
                  text-[#98a2b3]
                  shadow-none
                  hover:bg-[#eef1f4]
                "
              >
                <X size={18} />
              </Button>

            </div>

            {/* =================================================
                MODAL BODY
            ================================================= */}

            <div className="px-5 py-5">

              {/* Pattern Name */}

              <div className="mb-5">

                <h4 className="
                  font-[Urbanist]
                  text-[18px]
                  font-bold
                  leading-[24px]
                  text-[#3ba5d6]
                ">
                  {
                    selectedPattern.patternName
                  }
                </h4>

              </div>

              {/* Pattern Card */}

              <div className="
                rounded-[12px]
                border
                border-[#e1e4ea]
                bg-white
                shadow-sm
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#edf0f3]
                  px-4
                  py-4
                ">

                  <span className="
                    font-[Urbanist]
                    text-[15px]
                    font-medium
                    leading-[20px]
                    text-[#344054]
                  ">
                    1- Day Cycle Scheduled
                  </span>

                  <span className="
                    font-[Urbanist]
                    text-[13px]
                    font-normal
                    leading-[18px]
                    text-[#667085]
                  ">
                    Effective from:
                    {" "}
                    01/Jun/2026
                  </span>

                </div>

                {/* Pattern Details */}

                <div className="px-4 pb-5 pt-4">

                  <div className="
                    w-[150px]
                    overflow-hidden
                    rounded-[8px]
                    border
                    border-[#e1e4ea]
                  ">

                    <div className="
                      bg-[#d4e9f7]
                      px-4
                      py-3
                      text-center
                      font-[Urbanist]
                      text-[13px]
                      font-semibold
                      leading-[18px]
                      text-[#344054]
                    ">
                      All Days
                    </div>

                    <div className="
                      bg-[#fffbdc]
                      px-4
                      py-3
                      text-center
                      font-[Urbanist]
                      text-[13px]
                      font-medium
                      leading-[18px]
                      text-[#344054]
                    ">
                      General Shift
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="
              flex
              justify-end
              border-t
              border-[#e1e4ea]
              bg-[#f8f9fc]
              px-5
              py-4
            ">

              <Button
                variant="ghost"
                type="button"
                onClick={
                  closePatternDetails
                }
                className="
                  flex
                  h-[40px]
                  items-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#cfd4dc]
                  bg-white
                  px-4
                  font-[Urbanist]
                  text-[12px]
                  font-semibold
                  leading-[16px]
                  text-[#475467]
                  shadow-none
                  hover:bg-[#f3f4f6]
                "
              >
                <X size={16} />

                <span>
                  Cancel
                </span>
              </Button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}