// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ChevronDown,
//   ChevronLeft,
// } from "lucide-react";
// import { FaFileExcel } from "react-icons/fa";
// import * as XLSX from "xlsx";

// import TimeOfficeFilters from "../components/TimeOfficeFilters";
// import TimeOfficeTable from "../components/TimeOfficeTable";
// import TimeOfficePagination from "../components/TimeOfficePagination";

// import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
// import { validateDateRange } from "../validations/timeOffice.validation";

// /* =========================================================
//    TYPOGRAPHY
//    =========================================================
//    Display  : 22px ExtraBold
//    Heading  : 18px Bold
//    Subhead  : 12px SemiBold
//    Label    : 13px Medium
//    Body     : 13px Regular
//    Utility  : 12px
// ========================================================= */

// /* =========================================================
//    DATE
// ========================================================= */

// const getTodayDate = (): string => {
//   const today = new Date();

//   const year = today.getFullYear();

//   const month = String(
//     today.getMonth() + 1
//   ).padStart(2, "0");

//   const day = String(
//     today.getDate()
//   ).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// /* =========================================================
//    MONTHLY GRACE COLUMNS
// ========================================================= */

// const FIXED_COLUMNS = [
//   "Emp ID",
//   "Emp Name",
//   "Department",
//   "Designation",
// ];

// const LATE_IN_COLUMNS = [
//   "Grace Usage Late In Count",
//   "Total Late In Grace",
// ];

// const EARLY_OUT_COLUMNS = [
//   "Grace Usage Early Out Count",
//   "Total Early Out Grace",
// ];

// /* =========================================================
//    MONTH OPTIONS
// ========================================================= */

// const MONTH_OPTIONS = [
//   "Jan/2026",
//   "Feb/2026",
//   "Mar/2026",
//   "Apr/2026",
//   "May/2026",
//   "Jun/2026",
//   "Jul/2026",
//   "Aug/2026",
//   "Sep/2026",
//   "Oct/2026",
//   "Nov/2026",
//   "Dec/2026",
// ];

// /* =========================================================
//    GRACE TYPE OPTIONS
// ========================================================= */

// const GRACE_TYPE_OPTIONS = [
//   "All",
//   "Late In",
//   "Early Out",
// ];

// /* =========================================================
//    PAGE
// ========================================================= */

// export default function MonthlyGracePage() {
//   const navigate = useNavigate();

//   const today = getTodayDate();

//   const {
//     filters,
//     updateFilter,
//     resetFilters,
//   } = useTimeOfficeFilters();

//   /*
//    * API / DB data will be connected later.
//    */
//   const [rows] = useState<
//     Record<string, unknown>[]
//   >([]);

//   const [loading] =
//     useState(false);

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   /* =======================================================
//      DEFAULT MONTH
//   ======================================================= */

//   const [selectedMonth, setSelectedMonth] =
//     useState("Sep/2026");

//   /* =======================================================
//      DEFAULT GRACE TYPE
//   ======================================================= */

//   const [
//     selectedGraceType,
//     setSelectedGraceType,
//   ] = useState("All");

//   /* =======================================================
//      DROPDOWN STATES
//   ======================================================= */

//   const [
//     isMonthOpen,
//     setIsMonthOpen,
//   ] = useState(false);

//   const [
//     isGraceTypeOpen,
//     setIsGraceTypeOpen,
//   ] = useState(false);

//   /* =======================================================
//      COLUMNS
//   ======================================================= */

//   const columns =
//     selectedGraceType === "Late In"
//       ? [
//           ...FIXED_COLUMNS,
//           ...LATE_IN_COLUMNS,
//         ]
//       : selectedGraceType ===
//           "Early Out"
//         ? [
//             ...FIXED_COLUMNS,
//             ...EARLY_OUT_COLUMNS,
//           ]
//         : [
//             ...FIXED_COLUMNS,
//             ...LATE_IN_COLUMNS,
//             ...EARLY_OUT_COLUMNS,
//           ];

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   const handleSearch = () => {
//     const validation =
//       validateDateRange(
//         filters.fromDate || today,
//         filters.toDate || today
//       );

//     if (!validation.isValid) {
//       alert(validation.message);
//       return;
//     }

//     setCurrentPage(1);
//   };

//   /* =======================================================
//      RESET
//   ======================================================= */

//   const handleReset = () => {
//     resetFilters();

//     setSelectedGraceType("All");

//     setCurrentPage(1);
//   };

//   /* =======================================================
//      EXCEL EXPORT
//   ======================================================= */

//   const handleExportExcel = () => {
//     /*
//      * Keep Excel columns exactly
//      * the same as the table columns.
//      */
//     const excelRows = rows.map(
//       (row) =>
//         Object.fromEntries(
//           columns.map(
//             (column) => [
//               column,
//               row[column] ?? "",
//             ]
//           )
//         )
//     );

//     /*
//      * Create worksheet.
//      *
//      * Headers are created even when
//      * rows are empty.
//      */
//     const worksheet =
//       XLSX.utils.json_to_sheet(
//         excelRows,
//         {
//           header: columns,
//         }
//       );

//     /*
//      * Create workbook.
//      */
//     const workbook =
//       XLSX.utils.book_new();

//     /*
//      * Add worksheet.
//      */
//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       "Monthly Grace"
//     );

//     /*
//      * Download Excel.
//      */
//     XLSX.writeFile(
//       workbook,
//       `Monthly_Grace_${selectedMonth.replace(
//         "/",
//         "_"
//       )}.xlsx`
//     );
//   };

//   return (
//     <div
//       className="
//         min-h-full
//         w-full
//         bg-[#f3f6fa]
//         p-2
//         font-[Urbanist]
//       "
//     >
//       {/* =====================================================
//           TIME OFFICE MODULE BANNER
//       ===================================================== */}

//       <div
//         className="
//           mb-3
//           w-full
//           overflow-hidden
//           rounded-[14px]
//           border
//           border-[#d88d66]
//           bg-[#f9efe9]
//           shadow-[0_1px_2px_rgba(15,23,42,0.04)]
//         "
//       >
//         <div
//           className="
//             flex
//             min-h-[72px]
//             items-center
//             justify-between
//             px-5
//           "
//         >
//           {/* LEFT */}

//           <div
//             className="
//               flex
//               items-center
//               gap-3
//             "
//           >
//             {/* MODULE ICON */}

//             <div
//               className="
//                 flex
//                 h-[42px]
//                 w-[42px]
//                 items-center
//                 justify-center
//                 rounded-[10px]
//                 border
//                 border-[#d88d66]
//                 bg-[#fdf7f4]
//               "
//             >
//               <div
//                 className="
//                   h-[18px]
//                   w-[18px]
//                   rounded-[4px]
//                   border-[2px]
//                   border-[#d16c45]
//                 "
//               />
//             </div>

//             {/* DISPLAY */}

//             <h1
//               className="
//                 font-[Urbanist]
//                 text-[22px]
//                 font-extrabold
//                 leading-[28px]
//                 tracking-[-0.02em]
//                 text-[#cf6a49]
//               "
//             >
//               Time Office
//             </h1>
//           </div>

//           {/* RIGHT */}

//           <button
//             type="button"
//             title="More"
//             className="
//               flex
//               h-[36px]
//               w-[36px]
//               items-center
//               justify-center
//               rounded-[8px]
//               border
//               border-[#d88d66]
//               bg-[#fdf7f4]
//               p-0
//               text-[#7a4a35]
//               hover:bg-[#f5e7e1]
//             "
//           >
//             <ChevronDown
//               size={18}
//               strokeWidth={2}
//             />
//           </button>
//         </div>
//       </div>

//       {/* =====================================================
//           MONTHLY GRACE REPORT HEADER
//       ===================================================== */}

//       <div
//         className="
//           mb-3
//           w-full
//           overflow-visible
//           rounded-[14px]
//           border
//           border-[#dfe3e8]
//           bg-white
//           shadow-[0_2px_4px_rgba(15,23,42,0.06)]
//         "
//       >
//         <div
//           className="
//             flex
//             min-h-[72px]
//             w-full
//             items-center
//             gap-3
//             px-5
//           "
//         >
//           {/* REPORT TITLE */}

//           <div
//             className="
//               flex
//               h-[44px]
//               shrink-0
//               items-center
//               rounded-[10px]
//               border
//               border-[#e6a28f]
//               bg-[#fffaf8]
//               px-4
//               gap-2.5
//             "
//           >
//             <div
//               className="h-[18px] w-[18px] shrink-0 rounded-[4px] border-[2px] border-[#d16c45]"
//             />

//             <h2
//               className="
//                 whitespace-nowrap
//                 font-[Urbanist]
//                 text-[22px]
//                 font-extrabold
//                 leading-[28px]
//                 tracking-[-0.02em]
//                 text-[#d56b52]
//               "
//             >
//               Monthly Grace
//             </h2>
//           </div>

//           {/* RIGHT SIDE CONTROLS */}

//           <div
//             className="
//               ml-auto
//               flex
//               shrink-0
//               items-center
//               gap-2
//             "
//           >
//             {/* BACK */}

//             <button
//               type="button"
//               onClick={() =>
//                 navigate(-1)
//               }
//               className="
//                 flex
//                 h-[42px]
//                 shrink-0
//                 items-center
//                 gap-2
//                 rounded-[8px]
//                 bg-[#8d4d3c]
//                 px-4
//                 font-[Urbanist]
//                 text-[12px]
//                 font-semibold
//                 leading-[16px]
//                 text-white
//                 shadow-none
//                 hover:bg-[#744037]
//               "
//             >
//               <ChevronLeft
//                 size={18}
//                 strokeWidth={2}
//               />

//               <span>
//                 Back
//               </span>
//             </button>

//             {/* MONTH */}

//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsMonthOpen(
//                     (previous) =>
//                       !previous
//                   );

//                   setIsGraceTypeOpen(
//                     false
//                   );
//                 }}
//                 className="
//                   flex
//                   h-[42px]
//                   min-w-[165px]
//                   items-center
//                   justify-between
//                   gap-3
//                   rounded-[8px]
//                   border
//                   border-[#dfe3e8]
//                   bg-white
//                   px-3
//                   font-[Urbanist]
//                   text-[13px]
//                   font-medium
//                   leading-[18px]
//                   text-[#344054]
//                   hover:bg-[#f8fafc]
//                 "
//               >
//                 <span>
//                   {selectedMonth}
//                 </span>

//                 <ChevronDown
//                   size={15}
//                   strokeWidth={1.8}
//                   className="
//                     text-[#7d8797]
//                   "
//                 />
//               </button>

//               {isMonthOpen && (
//                 <div
//                   className="
//                     absolute
//                     right-0
//                     top-[47px]
//                     z-50
//                     max-h-[260px]
//                     w-full
//                     overflow-y-auto
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     py-1
//                     shadow-[0_8px_24px_rgba(15,23,42,0.12)]
//                   "
//                 >
//                   {MONTH_OPTIONS.map(
//                     (month) => (
//                       <button
//                         key={month}
//                         type="button"
//                         onClick={() => {
//                           setSelectedMonth(
//                             month
//                           );
//                           setIsMonthOpen(
//                             false
//                           );
//                         }}
//                         className={`
//                           block
//                           w-full
//                           px-3
//                           py-2
//                           text-left
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           transition-colors
//                           hover:bg-[#fff5f2]
//                           ${
//                             selectedMonth ===
//                             month
//                               ? "bg-[#fff5f2] text-[#9a5547]"
//                               : "text-[#344054]"
//                           }
//                         `}
//                       >
//                         {month}
//                       </button>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* GRACE TYPE */}

//             <div className="relative">
//               {/* FLOATING LABEL */}

//               <div
//                 className="
//                   absolute
//                   left-[10px]
//                   top-[-8px]
//                   z-10
//                   bg-white
//                   px-1.5
//                   font-[Urbanist]
//                   text-[12px]
//                   font-medium
//                   leading-[16px]
//                   text-[#9a5547]
//                 "
//               >
//                 Grace Types
//               </div>

//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsGraceTypeOpen(
//                     (previous) =>
//                       !previous
//                   );

//                   setIsMonthOpen(
//                     false
//                   );
//                 }}
//                 className="
//                   flex
//                   h-[42px]
//                   min-w-[220px]
//                   items-center
//                   justify-between
//                   gap-3
//                   rounded-[8px]
//                   border
//                   border-[#e6a28f]
//                   bg-white
//                   px-3
//                   text-left
//                   font-[Urbanist]
//                 "
//               >
//                 <span
//                   className="
//                     text-[13px]
//                     font-medium
//                     leading-[18px]
//                     text-[#344054]
//                   "
//                 >
//                   {selectedGraceType}
//                 </span>

//                 <ChevronDown
//                   size={15}
//                   strokeWidth={1.8}
//                   className="
//                     text-[#6b7280]
//                   "
//                 />
//               </button>

//               {isGraceTypeOpen && (
//                 <div
//                   className="
//                     absolute
//                     right-0
//                     top-[47px]
//                     z-50
//                     w-full
//                     overflow-hidden
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     py-1
//                     shadow-[0_8px_24px_rgba(15,23,42,0.12)]
//                   "
//                 >
//                   {GRACE_TYPE_OPTIONS.map(
//                     (type) => (
//                       <button
//                         key={type}
//                         type="button"
//                         onClick={() => {
//                           setSelectedGraceType(
//                             type
//                           );
//                           setIsGraceTypeOpen(
//                             false
//                           );
//                         }}
//                         className={`
//                           block
//                           w-full
//                           px-3
//                           py-2
//                           text-left
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           transition-colors
//                           hover:bg-[#fff5f2]
//                           ${
//                             selectedGraceType ===
//                             type
//                               ? "bg-[#fff5f2] text-[#9a5547]"
//                               : "text-[#344054]"
//                           }
//                         `}
//                       >
//                         {type}
//                       </button>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* EXCEL */}

//             <button
//               type="button"
//               title="Export to Excel"
//               onClick={
//                 handleExportExcel
//               }
//               className="
//                 flex
//                 h-[42px]
//                 w-[38px]
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-[8px]
//                 bg-white
//                 p-0
//                 text-[#35a853]
//                 shadow-none
//                 hover:bg-[#f1faf3]
//               "
//             >
//               <FaFileExcel
//                 size={20}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           FILTERS
//       ===================================================== */}

//       <div
//         className="
//           relative
//           z-10
//           mb-3
//           w-full
//           overflow-x-hidden
//           rounded-[12px]
//           border
//           border-[#dfe3e8]
//           bg-white
//           shadow-[0_2px_4px_rgba(15,23,42,0.06)]
//         "
//       >
//         <TimeOfficeFilters
//           fromDate={
//             filters.fromDate ||
//             today
//           }
//           toDate={
//             filters.toDate ||
//             today
//           }
//           employeeId={
//             filters.employeeId
//           }
//           employeeName={
//             filters.employeeName
//           }
//           onFromDateChange={(
//             value
//           ) =>
//             updateFilter(
//               "fromDate",
//               value
//             )
//           }
//           onToDateChange={(
//             value
//           ) =>
//             updateFilter(
//               "toDate",
//               value
//             )
//           }
//           onEmployeeIdChange={(
//             value
//           ) =>
//             updateFilter(
//               "employeeId",
//               value
//             )
//           }
//           onEmployeeNameChange={(
//             value
//           ) =>
//             updateFilter(
//               "employeeName",
//               value
//             )
//           }
//           onSearch={
//             handleSearch
//           }
//           onReset={
//             handleReset
//           }
//         />
//       </div>

//       {/* =====================================================
//           MONTHLY GRACE TABLE
//       ===================================================== */}

//       <div
//         className="
//           mt-3
//           overflow-hidden
//           rounded-[12px]
//           border
//           border-[#e2e6ea]
//           bg-white
//         "
//       >
//         <TimeOfficeTable
//           columns={columns}
//           rows={rows}
//           loading={loading}
//           emptyMessage="No monthly grace records found."
//         />
//       </div>

//       {/* =====================================================
//           PAGINATION
//       ===================================================== */}

//       <TimeOfficePagination
//         currentPage={currentPage}
//         totalPages={1}
//         onPageChange={
//           setCurrentPage
//         }
//       />
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import * as XLSX from "xlsx";

import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

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
   MONTHLY GRACE COLUMNS
========================================================= */

const FIXED_COLUMNS = [
  "Emp ID",
  "Emp Name",
  "Department",
  "Designation",
];

const LATE_IN_COLUMNS = [
  "Grace Usage Late In Count",
  "Total Late In Grace",
];

const EARLY_OUT_COLUMNS = [
  "Grace Usage Early Out Count",
  "Total Early Out Grace",
];

/* =========================================================
   MONTH OPTIONS
========================================================= */

const MONTH_OPTIONS = [
  "Jan/2026",
  "Feb/2026",
  "Mar/2026",
  "Apr/2026",
  "May/2026",
  "Jun/2026",
  "Jul/2026",
  "Aug/2026",
  "Sep/2026",
  "Oct/2026",
  "Nov/2026",
  "Dec/2026",
];

/* =========================================================
   GRACE TYPE OPTIONS
========================================================= */

const GRACE_TYPE_OPTIONS = [
  "All",
  "Late In",
  "Early Out",
];

/* =========================================================
   PAGE
========================================================= */

export default function MonthlyGracePage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  /*
   * API / DB data will be connected later.
   */
  const [rows] = useState<
    Record<string, unknown>[]
  >([]);

  const [loading] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  /* =======================================================
     DEFAULT MONTH
  ======================================================= */

  const [selectedMonth, setSelectedMonth] =
    useState("Sep/2026");

  /* =======================================================
     DEFAULT GRACE TYPE
  ======================================================= */

  const [
    selectedGraceType,
    setSelectedGraceType,
  ] = useState("All");

  /* =======================================================
     DROPDOWN STATES
  ======================================================= */

  const [
    isMonthOpen,
    setIsMonthOpen,
  ] = useState(false);

  const [
    isGraceTypeOpen,
    setIsGraceTypeOpen,
  ] = useState(false);

  /* =======================================================
     COLUMNS
  ======================================================= */

  const columns =
    selectedGraceType === "Late In"
      ? [
          ...FIXED_COLUMNS,
          ...LATE_IN_COLUMNS,
        ]
      : selectedGraceType ===
          "Early Out"
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
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    resetFilters();

    setSelectedGraceType("All");

    setCurrentPage(1);
  };

  /* =======================================================
     EXCEL EXPORT
  ======================================================= */

  const handleExportExcel = () => {
    /*
     * Keep Excel columns exactly
     * the same as the table columns.
     */
    const excelRows = rows.map(
      (row) =>
        Object.fromEntries(
          columns.map(
            (column) => [
              column,
              row[column] ?? "",
            ]
          )
        )
    );

    /*
     * Create worksheet.
     *
     * Headers are created even when
     * rows are empty.
     */
    const worksheet =
      XLSX.utils.json_to_sheet(
        excelRows,
        {
          header: columns,
        }
      );

    /*
     * Create workbook.
     */
    const workbook =
      XLSX.utils.book_new();

    /*
     * Add worksheet.
     */
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Monthly Grace"
    );

    /*
     * Download Excel.
     */
    XLSX.writeFile(
      workbook,
      `Monthly_Grace_${selectedMonth.replace(
        "/",
        "_"
      )}.xlsx`
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
          SHARED TIME OFFICE + MONTHLY GRACE HEADER
      ===================================================== */}

      <TimeOfficeReportHeader
        title="Monthly Grace"

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

        /* Main Time Office header:
           Funnel + ClockFading */
        showTimeOfficeBanner={true}
        showBannerHistory={true}

        /* Monthly Grace controls */
        showMonthDropdown={true}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        monthOptions={MONTH_OPTIONS}

        showGraceTypes={true}
        graceType={selectedGraceType}
        onGraceTypeChange={
          setSelectedGraceType
        }
        graceTypeOptions={
          GRACE_TYPE_OPTIONS
        }

        /* Excel only */
        showPdfExport={false}
        showExcelExport={true}
        onExcelExport={
          handleExportExcel
        }

        /* No ClockFading after Excel */
        showRefresh={false}
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

      {/* =====================================================
          MONTHLY GRACE TABLE
      ===================================================== */}

      <div
        className="
          mt-3
          overflow-hidden
          rounded-[12px]
          border
          border-[#e2e6ea]
          bg-white
        "
      >
        <TimeOfficeTable
          columns={columns}
          rows={rows}
          loading={loading}
          emptyMessage="No monthly grace records found."
        />
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

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