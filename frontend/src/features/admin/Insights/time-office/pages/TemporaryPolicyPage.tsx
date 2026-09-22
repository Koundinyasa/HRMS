import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ClockFading,
  FileText,
  Funnel,
} from "lucide-react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

import {
  useTimeOfficeFilters,
} from "../hooks/useTimeOfficeFilters";

import {
  validateDateRange,
} from "../validations/timeOffice.validation";

import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

import {
  exportTimeOfficeExcel,
  exportTimeOfficePdf,
} from "../utils/timeOfficeExport";

import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
import TimeOfficeFilters from "../components/TimeOfficeFilters";

/* =========================================================
   TYPOGRAPHY
   =========================================================
   Display    : 22px ExtraBold
   Heading    : 18px Bold
   Subheading : 12px SemiBold
   Label      : 13px Medium
   Body       : 13px Regular
   Utility    : 12px
========================================================= */

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
   EXPORT COLUMNS
========================================================= */

const TEMPORARY_POLICY_COLUMNS = [
  {
    header: "Emp ID",
    key: "empId",
  },
  {
    header: "Emp Name",
    key: "empName",
  },
  {
    header: "Effective From",
    key: "effectiveFrom",
  },
  {
    header: "Policy Name",
    key: "policyName",
  },
];

/* =========================================================
   TEMPORARY POLICY PAGE
========================================================= */

export default function TemporaryPolicyPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

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
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    resetFilters();
  };

  /* =======================================================
     EXPORT
  ======================================================= */

  const exportOptions = {
    title: "Temporary Policy",
    columns:
      TEMPORARY_POLICY_COLUMNS,
    rows: [],
    fromDate:
      filters.fromDate || today,
    toDate:
      filters.toDate || today,
  };

  return (
    <div
      className="
        relative
        z-0
        min-h-screen
        w-full
        bg-[#f3f6fa]
        p-4
        font-[Urbanist]
      "
    >

      {/* =====================================================
          TIME OFFICE MODULE HEADER
      ===================================================== */}

      <div
        className="
          mb-3
          w-full
          overflow-hidden
          rounded-[14px]
          border
          border-[#df8f7b]
          bg-[#fff8f6]
          shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        "
      >
        <div
          className="
            flex
            min-h-[72px]
            items-center
            justify-between
            px-5
          "
        >

          {/* TITLE */}

          <div
            className="
              flex
              h-[44px]
              shrink-0
              items-center
              rounded-[9px]
              border
              border-[#df8f7b]
              bg-white
              px-5
            "
          >
            <h1
              className="
                whitespace-nowrap
                font-[Urbanist]
                text-[22px]
                font-extrabold
                leading-[28px]
                tracking-[-0.02em]
                text-[#9a5547]
              "
            >
              Time Office
            </h1>
          </div>

          {/* RIGHT ACTIONS */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            {/* FILTER */}

            <Button
              variant="ghost"
              type="button"
              title="Filter"
              className="
                flex
                h-[36px]
                w-[36px]
                items-center
                justify-center
                rounded-[8px]
                p-0
                text-[#3f3f3f]
                shadow-none
                hover:bg-[#fff0eb]
                hover:text-[#9a5547]
              "
            >
              <Funnel
                size={20}
                strokeWidth={1.8}
              />
            </Button>

            {/* HISTORY */}

            <Button
              variant="ghost"
              type="button"
              title="History"
              className="
                flex
                h-[36px]
                w-[36px]
                items-center
                justify-center
                rounded-[8px]
                p-0
                text-[#3f3f3f]
                shadow-none
                hover:bg-[#fff0eb]
                hover:text-[#9a5547]
              "
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
          REPORT HEADER
      ===================================================== */}

      <div
        className="
          mb-3
          w-full
          overflow-visible
          rounded-[14px]
          border
          border-[#dfe3e8]
          bg-white
          shadow-[0_2px_4px_rgba(15,23,42,0.06)]
        "
      >
        <div
          className="
            flex
            min-h-[72px]
            w-full
            items-center
            gap-3
            px-5
          "
        >

          {/* REPORT TITLE */}

          <div
            className="
              flex
              h-[44px]
              shrink-0
              items-center
              rounded-[10px]
              border
              border-[#df8f7b]
              bg-[#fff8f6]
              px-4
              gap-2.5
            "
          >
            <FileText
              size={20}
              strokeWidth={1.8}
              className="shrink-0 text-[#9a5547]"
            />

            <h2
              className="
                whitespace-nowrap
                font-[Urbanist]
                text-[22px]
                font-extrabold
                leading-[28px]
                tracking-[-0.02em]
                text-[#9a5547]
              "
            >
              Temporary Policy
            </h2>
          </div>

          {/* RIGHT SIDE */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-2
            "
          >

            {/* BACK */}

            <Button
              variant="ghost"
              type="button"
              onClick={() =>
                navigate(-1)
              }
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

              <span>Back</span>
            </Button>

            {/* FROM DATE */}

            <DateField
              label="From Date"
              value={
                filters.fromDate ||
                today
              }
              onChange={(value) =>
                updateFilter(
                  "fromDate",
                  value
                )
              }
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
              value={
                filters.toDate ||
                today
              }
              onChange={(value) =>
                updateFilter(
                  "toDate",
                  value
                )
              }
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
                p-0
                text-[#e54848]
                shadow-none
                hover:bg-[#fff3f3]
              "
            >
              <FaFilePdf
                className="
                  h-[21px]
                  w-[21px]
                "
              />
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
                p-0
                text-[#35a853]
                shadow-none
                hover:bg-[#f1faf3]
              "
            >
              <FaFileExcel
                className="
                  h-[21px]
                  w-[21px]
                "
              />
            </Button>

          </div>
        </div>
      </div>

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

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-[12px]
          border
          border-[#e1e4ea]
          bg-white
          shadow-[0_1px_2px_rgba(15,23,42,0.03)]
        "
      >
        <TimeOfficeEmptyState
          message="Did Not Find Any Time Office"
        />
      </div>
    </div>
  );
}