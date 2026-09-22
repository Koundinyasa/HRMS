// import { Button } from "@/components/ui/button";
// import { ClockFading, Funnel } from "lucide-react";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
// import TimeOfficeFilters from "../components/TimeOfficeFilters";
// import TimeOfficeTable from "../components/TimeOfficeTable";
// import TimeOfficePagination from "../components/TimeOfficePagination";

// import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
// import { validateDateRange } from "../validations/timeOffice.validation";

// const getTodayDate = (): string => {
//   const today = new Date();

//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// /* =========================================================
//    FIXED COLUMNS
// ========================================================= */

// const FIXED_COLUMNS = [
//   "Employee ID",
//   "Employee Name",
//   "Date",
// ];

// /* =========================================================
//    14 CATEGORY COLUMNS
// ========================================================= */

// const CATEGORY_COLUMNS = [
//   "Shift Worked",
//   "Shift Start",
//   "Shift End",
//   "Check IN Time",
//   "Check OUT Time",
//   "Late IN",
//   "Early OUT",
//   "OT Hrs",
//   "Extra Worked Hrs",
//   "Total WorkHrs",
//   "FH Status",
//   "Reconciled FH Status",
//   "SH Status",
//   "Reconciled SH Status",
// ];

// export default function DayWiseDetailedPage() {
//   const navigate = useNavigate();

//   const today = getTodayDate();

//   /* =========================================================
//      TIME OFFICE FILTERS
//   ========================================================= */

//   const {
//     filters,
//     updateFilter,
//     resetFilters,
//   } = useTimeOfficeFilters();

//   /* =========================================================
//      SELECTED CATEGORIES
//   ========================================================= */

//   const [selectedCategories, setSelectedCategories] =
//     useState<string[]>(CATEGORY_COLUMNS);

//   /* =========================================================
//      TABLE ROWS
//   ========================================================= */

//   const [rows] =
//     useState<Record<string, unknown>[]>([]);

//   /* =========================================================
//      PAGINATION
//   ========================================================= */

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   /* =========================================================
//      BUILD TABLE COLUMNS
//   ========================================================= */

//   const columns = [
//     ...FIXED_COLUMNS,
//     ...CATEGORY_COLUMNS.filter((column) =>
//       selectedCategories.includes(column)
//     ),
//   ];

//   /* =========================================================
//      SEARCH
//   ========================================================= */

//   const handleSearch = () => {
//     const validation = validateDateRange(
//       filters.fromDate || today,
//       filters.toDate || today
//     );

//     if (!validation.isValid) {
//       alert(validation.message);
//       return;
//     }

//     /*
//      * API integration can be added here later.
//      */

//     setCurrentPage(1);
//   };

//   /* =========================================================
//      RESET
//   ========================================================= */

//   const handleReset = () => {
//     resetFilters();

//     setSelectedCategories(
//       CATEGORY_COLUMNS
//     );

//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-full bg-[#f3f6fa] p-2 font-[Urbanist]">

//       {/* =====================================================
//           TIME OFFICE MODULE HEADER
//       ===================================================== */}

//       <div className="mb-3 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">

//         <div className="flex min-h-[72px] items-center justify-between px-5">

//           {/* =================================================
//               TIME OFFICE TITLE
//           ================================================= */}

//           <div className="flex h-[40px] shrink-0 items-center rounded-[8px] border border-[#df8f7b] bg-white px-5">
//             <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
//               Time Office
//             </h1>
//           </div>

//           {/* =================================================
//               TOP HEADER FILTER ICON
//           ================================================= */}

//           <Button
//             type="button"
//             variant="ghost"
//             title="Filter"
//             className="flex h-[32px] w-[32px] items-center justify-center rounded-md p-0 text-[#3f3f3f] shadow-none hover:bg-[#fff0eb]"
//           >
//             <Funnel
//               size={19}
//               strokeWidth={2}
//             />
//           </Button>

//         </div>
//       </div>

//       {/* =====================================================
//           DAY-WISE DETAILED REPORT HEADER
//       ===================================================== */}

//       <TimeOfficeReportHeader
//         title="Day-Wise Detailed"

//         fromDate={
//           filters.fromDate || today
//         }

//         toDate={
//           filters.toDate || today
//         }

//         onFromDateChange={(value) =>
//           updateFilter(
//             "fromDate",
//             value
//           )
//         }

//         onToDateChange={(value) =>
//           updateFilter(
//             "toDate",
//             value
//           )
//         }

//         onBack={() => navigate("..")}

//         /*
//          * Time Office module header is already
//          * rendered above.
//          */
//         showTimeOfficeBanner={false}

//         /* =================================================
//            DATE RANGE
//         ================================================= */

//         showDateRange

//         /* =================================================
//            CATEGORIES
//         ================================================= */

//         showCategories

//         selectedCategories={
//           selectedCategories
//         }

//         onCategoriesChange={
//           setSelectedCategories
//         }

//         /* =================================================
//            EXPORTS
//         ================================================= */

//         showPdfExport
//         showExcelExport

//         /*
//          * Keep this enabled because the report header
//          * needs the right-most ClockFading action.
//          */
//         showRefresh

//         /* =================================================
//            NO MONTH / GRACE DROPDOWNS
//         ================================================= */

//         showMonthDropdown={false}
//         showGraceTypes={false}

//         /* =================================================
//            TABLE DATA FOR EXPORT
//         ================================================= */

//         columns={columns}
//         rows={rows}
//       />

//       {/* =====================================================
//           FILTER TOOLBAR
//       ===================================================== */}

//       <div className="mb-3">

//         <TimeOfficeFilters
//           fromDate={
//             filters.fromDate || today
//           }

//           toDate={
//             filters.toDate || today
//           }

//           employeeId={
//             filters.employeeId
//           }

//           employeeName={
//             filters.employeeName
//           }

//           onFromDateChange={(value) =>
//             updateFilter(
//               "fromDate",
//               value
//             )
//           }

//           onToDateChange={(value) =>
//             updateFilter(
//               "toDate",
//               value
//             )
//           }

//           onEmployeeIdChange={(value) =>
//             updateFilter(
//               "employeeId",
//               value
//             )
//           }

//           onEmployeeNameChange={(value) =>
//             updateFilter(
//               "employeeName",
//               value
//             )
//           }

//           onSearch={handleSearch}

//           onReset={handleReset}
//         />

//       </div>

//       {/* =====================================================
//           REPORT TABLE
//       ===================================================== */}

//       <TimeOfficeTable
//         columns={columns}
//         rows={rows}
//         emptyMessage="No attendance records found."
//       />

//       {/* =====================================================
//           PAGINATION
//       ===================================================== */}

//       <TimeOfficePagination
//         currentPage={currentPage}
//         totalPages={20}
//         onPageChange={setCurrentPage}
//       />

//     </div>
//   );
// }
import { Button } from "@/components/ui/button";
import { Funnel } from "lucide-react";
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

/* =========================================================
   FIXED COLUMNS
========================================================= */

const FIXED_COLUMNS = [
  "Employee ID",
  "Employee Name",
  "Date",
];

/* =========================================================
   14 CATEGORY COLUMNS
========================================================= */

const CATEGORY_COLUMNS = [
  "Shift Worked",
  "Shift Start",
  "Shift End",
  "Check IN Time",
  "Check OUT Time",
  "Late IN",
  "Early OUT",
  "OT Hrs",
  "Extra Worked Hrs",
  "Total WorkHrs",
  "FH Status",
  "Reconciled FH Status",
  "SH Status",
  "Reconciled SH Status",
];

export default function DayWiseDetailedPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  /* =========================================================
     TIME OFFICE FILTERS
  ========================================================= */

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  /* =========================================================
     SELECTED CATEGORIES
  ========================================================= */

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  /* =========================================================
     TABLE ROWS
  ========================================================= */

  const [rows] =
    useState<Record<string, unknown>[]>([]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  /* =========================================================
     BUILD TABLE COLUMNS
  ========================================================= */

  const columns = [
    ...FIXED_COLUMNS,
    ...CATEGORY_COLUMNS.filter((column) =>
      selectedCategories.includes(column)
    ),
  ];

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
     * API integration can be added here later.
     */

    setCurrentPage(1);
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    resetFilters();

    setSelectedCategories([]);

    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f3f6fa] p-2 font-[Urbanist]">

      {/* =====================================================
          TIME OFFICE MODULE HEADER
      ===================================================== */}

      <div className="mb-3 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">

        <div className="flex min-h-[72px] items-center justify-between px-5">

          {/* =================================================
              TIME OFFICE TITLE
          ================================================= */}

          <div className="flex h-[40px] shrink-0 items-center rounded-[8px] border border-[#df8f7b] bg-white px-5">

            <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
              Time Office
            </h1>

          </div>

          {/* =================================================
              TOP HEADER FILTER ICON
          ================================================= */}

          <Button
            type="button"
            variant="ghost"
            title="Filter"
            className="flex h-[32px] w-[32px] items-center justify-center rounded-md p-0 text-[#3f3f3f] shadow-none hover:bg-[#fff0eb]"
          >
            <Funnel
              size={19}
              strokeWidth={2}
            />
          </Button>

        </div>
      </div>

      {/* =====================================================
          DAY-WISE DETAILED REPORT HEADER
      ===================================================== */}

      <TimeOfficeReportHeader
        title="Day-Wise Detailed"

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

        onBack={() => navigate("..")}

        showTimeOfficeBanner={false}

        /* =================================================
           DATE RANGE
        ================================================= */

        showDateRange

        /* =================================================
           CATEGORIES
        ================================================= */

        showCategories

        selectedCategories={
          selectedCategories
        }

        onCategoriesChange={
          setSelectedCategories
        }

        categoryOptions={
          CATEGORY_COLUMNS
        }

        /* =================================================
           EXPORTS
        ================================================= */

        showPdfExport
        showExcelExport
        showRefresh

        /* =================================================
           NO MONTH / GRACE DROPDOWNS
        ================================================= */

        showMonthDropdown={false}
        showGraceTypes={false}

        /* =================================================
           EXPORT DATA
        ================================================= */

        columns={columns}
        rows={rows}
      />

      {/* =====================================================
          FILTER TOOLBAR
      ===================================================== */}

      <div className="mb-3">

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

          onSearch={handleSearch}

          onReset={handleReset}
        />

      </div>

      {/* =====================================================
          REPORT TABLE
      ===================================================== */}

      <TimeOfficeTable
        columns={columns}
        rows={rows}
        emptyMessage="No attendance records found."
      />

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={20}
        onPageChange={setCurrentPage}
      />

    </div>
  );
}