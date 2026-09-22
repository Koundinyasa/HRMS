// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ChevronLeft, SlidersHorizontal, FileSpreadsheet, FileText, Clock3 } from "lucide-react";
// import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
// import TimeOfficeFilters from "../components/TimeOfficeFilters";
// import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

// import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
// import { validateDateRange } from "../validations/timeOffice.validation";
// import { exportTimeOfficeExcel, exportTimeOfficePdf } from "../utils/timeOfficeExport";

// const EMPLOYEE_CW_COLUMNS = [
//   { header: "Emp ID", key: "empId" }, { header: "Emp Name", key: "empName" },
//   { header: "CW Date", key: "cwDate" }, { header: "CW Hours", key: "cwHours" },
// ];

// const getTodayDate = (): string => {
//   const today = new Date();

//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// export default function EmployeeCWDetailsPage() {
//   const navigate = useNavigate();

//   const today = getTodayDate();

//   const { filters, updateFilter, resetFilters } =
//     useTimeOfficeFilters();

//   const handleSearch = () => {
//     const validation = validateDateRange(
//       filters.fromDate || today,
//       filters.toDate || today
//     );

//     if (!validation.isValid) {
//       alert(validation.message);
//       return;
//     }
//   };

//   const handleReset = () => {
//     resetFilters();
//   };
//   const exportOptions = { title: "Employee CW Details", columns: EMPLOYEE_CW_COLUMNS, rows: [], fromDate: filters.fromDate || today, toDate: filters.toDate || today };

//   return (
//     <div className="min-h-screen bg-[#f3f6fa] p-2">
//       {/* Report Header */}
//       <div className="mb-1 rounded-md border border-[#e1e4e8] bg-white shadow-sm">
//         <div className="flex min-h-[105px] items-center px-5">
//           {/* Title */}
//           <div className="relative self-stretch flex w-[230px] items-end pb-4">
//             <h2 className="text-[18px] font-semibold text-[#2fa4dc]">
//               Employee CW Details
//             </h2>

//             <div className="absolute bottom-2 left-0 h-[3px] w-[195px] bg-[#3ba5d6]" />
//           </div>

//           {/* Controls */}
//           <div className="ml-auto flex items-center gap-3">
//             {/* Back */}
//             <Button variant="ghost"
//               type="button"
//               onClick={() => navigate(-1)}
//               className="flex h-[46px] items-center gap-2 rounded-md border border-[#cfd3d8] bg-white px-5 text-[16px] font-medium text-[#4b5563] hover:bg-[#f8fafc]"
//             >
//               <ChevronLeft size={22} />
//               Back
//             </Button>

//             <DateField label="From Date" value={filters.fromDate || today} onChange={(value) => updateFilter("fromDate", value)} className="flex items-center gap-2 text-[16px] text-[#17283a] [&_input]:h-[46px] [&_input]:w-[250px] [&_input]:rounded-md [&_input]:border-[#e1e5ea] [&_input]:px-4 [&_input]:text-[15px]" />
//             <DateField label="To Date" value={filters.toDate || today} onChange={(value) => updateFilter("toDate", value)} className="ml-2 flex items-center gap-2 text-[16px] text-[#17283a] [&_input]:h-[46px] [&_input]:w-[250px] [&_input]:rounded-md [&_input]:border-[#e1e5ea] [&_input]:px-4 [&_input]:text-[15px]" />

//             {/* PDF */}
//             <Button variant="ghost"
//               type="button"
//               className="ml-1 text-[#ef4444]"
//               title="Export PDF"
//               onClick={() => exportTimeOfficePdf(exportOptions)}
//             >
//               <FileText size={25} />
//             </Button>

//             {/* Excel */}
//             <Button variant="ghost"
//               type="button"
//               className="text-[#16a34a]"
//               title="Export Excel"
//               onClick={() => exportTimeOfficeExcel(exportOptions)}
//             >
//               <FileSpreadsheet size={26} />
//             </Button>

//             {/* Loading / history */}
//             <Clock3
//               size={25}
//               className="ml-1 text-[#9aa6b7]"
//             />
//           </div>
//         </div>
//       </div>

//       <TimeOfficeFilters
//         fromDate={filters.fromDate || today}
//         toDate={filters.toDate || today}
//         employeeId={filters.employeeId}
//         employeeName={filters.employeeName}
//         onFromDateChange={(value) => updateFilter("fromDate", value)}
//         onToDateChange={(value) => updateFilter("toDate", value)}
//         onEmployeeIdChange={(value) => updateFilter("employeeId", value)}
//         onEmployeeNameChange={(value) => updateFilter("employeeName", value)}
//         onSearch={handleSearch}
//         onReset={handleReset}
//         showDayWiseDropdownOptions
//       />

//       {/* Empty State */}
//       <div className="min-h-[530px] bg-[#f3f6fa]">
//         <TimeOfficeEmptyState message="No employee CW details found." />
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
import TimeOfficeFilters from "../components/TimeOfficeFilters";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

import {
  exportTimeOfficeExcel,
  exportTimeOfficePdf,
} from "../utils/timeOfficeExport";

/* =========================================================
   TYPOGRAPHY
   =========================================================
   Display  : 22px ExtraBold
   Heading  : 18px Bold
   Subhead  : 12px SemiBold
   Label    : 13px Medium
   Body     : 13px Regular
   Utility  : 12px
========================================================= */

/* =========================================================
   COLUMNS
========================================================= */

const EMPLOYEE_CW_COLUMNS = [
  {
    header: "Emp ID",
    key: "empId",
  },
  {
    header: "Emp Name",
    key: "empName",
  },
  {
    header: "CW Date",
    key: "cwDate",
  },
  {
    header: "CW Hours",
    key: "cwHours",
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
   PAGE
========================================================= */

export default function EmployeeCWDetailsPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  /* =======================================================
     ROWS
  ======================================================= */

  const [rows] =
    useState<Record<string, unknown>[]>([]);

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

    /*
     * Keep existing API/search functionality here.
     * No mock data is added.
     */
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    resetFilters();
  };

  /* =======================================================
     EXPORT OPTIONS
  ======================================================= */

  const exportOptions = {
    title: "Employee CW Details",

    columns:
      EMPLOYEE_CW_COLUMNS,

    rows,

    fromDate:
      filters.fromDate || today,

    toDate:
      filters.toDate || today,
  };

  /* =======================================================
     EXCEL EXPORT
  ======================================================= */

  const handleExcelExport = () => {
    exportTimeOfficeExcel(
      exportOptions
    );
  };

  /* =======================================================
     PDF EXPORT
  ======================================================= */

  const handlePdfExport = () => {
    exportTimeOfficePdf(
      exportOptions
    );
  };

  return (
    <div
      className="
        relative
        z-0
        min-h-screen
        w-full
        bg-[#f3f6fa]
        p-2
        font-[Urbanist]
      "
    >

      {/* =====================================================
          TIME OFFICE + EMPLOYEE CW DETAILS HEADER
          ===================================================== */}

      <TimeOfficeReportHeader
        title="Employee CW Details"

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

        /*
         * TOP HEADER
         *
         * Time Office
         * Vessel
         * ClockFading
         */
        showTimeOfficeBanner

        /*
         * REPORT HEADER
         */
        showDateRange

        /*
         * Employee CW Details
         * does not have Categories.
         */
        showCategories={false}

        /*
         * EXPORTS
         */
        showPdfExport
        showExcelExport

        /*
         * ClockFading in report header
         */
        showRefresh

        /*
         * Not required for this report
         */
        showGraceTypes={false}
        showMonthDropdown={false}

        /*
         * Existing export data
         */
        onExcelExport={
          handleExcelExport
        }

        columns={EMPLOYEE_CW_COLUMNS.map(
          (column) =>
            column.header
        )}

        rows={rows}
      />

      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div
        className="
          relative
          z-10
          mb-3
          w-full
          overflow-x-hidden
          rounded-[12px]
          border
          border-[#dfe3e8]
          bg-white
          shadow-[0_2px_4px_rgba(15,23,42,0.06)]
        "
      >
        <TimeOfficeFilters
          fromDate={
            filters.fromDate ||
            today
          }

          toDate={
            filters.toDate ||
            today
          }

          employeeId={
            filters.employeeId
          }

          employeeName={
            filters.employeeName
          }

          onFromDateChange={(
            value
          ) =>
            updateFilter(
              "fromDate",
              value
            )
          }

          onToDateChange={(
            value
          ) =>
            updateFilter(
              "toDate",
              value
            )
          }

          onEmployeeIdChange={(
            value
          ) =>
            updateFilter(
              "employeeId",
              value
            )
          }

          onEmployeeNameChange={(
            value
          ) =>
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

          showDayWiseDropdownOptions
        />
      </div>

      {/* =====================================================
          EMPTY STATE
          ===================================================== */}

      <div
        className="
          min-h-[530px]
          overflow-hidden
          rounded-[12px]
          border
          border-[#e2e6ea]
          bg-white
        "
      >
        <TimeOfficeEmptyState
          message="No employee CW details found."
        />
      </div>
    </div>
  );
}