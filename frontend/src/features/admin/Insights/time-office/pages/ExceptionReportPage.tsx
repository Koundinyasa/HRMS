// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ClockFading,
//   FileText,
//   Funnel,
// } from "lucide-react";
// import { FaFileExcel } from "react-icons/fa";

// import TimeOfficeFilters from "../components/TimeOfficeFilters";
// import TimeOfficeTable from "../components/TimeOfficeTable";
// import TimeOfficePagination from "../components/TimeOfficePagination";

// import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
// import { validateDateRange } from "../validations/timeOffice.validation";

// import { exportTimeOfficeExcel } from "../utils/timeOfficeExport";

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
//    CATEGORY OPTIONS
// ========================================================= */

// const CATEGORY_OPTIONS = [
//   "Branch",
//   "Designation",
//   "Salary Structure",
//   "Leave Policy",
//   "Attendance Structure",
//   "Department",
//   "Team",
// ];

// /* =========================================================
//    GRACE TYPE OPTIONS
// ========================================================= */

// const GRACE_TYPE_OPTIONS = [
//   "Late In",
//   "Early In",
//   "Early Out",
//   "Late Out",
// ];

// /* =========================================================
//    MAIN PAGE
// ========================================================= */

// export default function ExceptionReportPage() {
//   const navigate = useNavigate();
//   const today = getTodayDate();

//   const {
//     filters,
//     updateFilter,
//     resetFilters,
//   } = useTimeOfficeFilters();

//   const [rows] = useState<
//     Record<string, unknown>[]
//   >([]);

//   const [loading] = useState(false);

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   /* =======================================================
//      HEADER DROPDOWNS
//   ======================================================= */

//   const [selectedCategories, setSelectedCategories] =
//     useState<string[]>([
//       "Branch",
//       "Designation",
//     ]);

//   const [graceType, setGraceType] =
//     useState("Late In");

//   const [isCategoriesOpen, setIsCategoriesOpen] =
//     useState(false);

//   const [isGraceOpen, setIsGraceOpen] =
//     useState(false);

//   const categoriesRef =
//     useRef<HTMLDivElement>(null);

//   const graceRef =
//     useRef<HTMLDivElement>(null);

//   /* =======================================================
//      OUTSIDE CLICK
//   ======================================================= */

//   useEffect(() => {
//     const handleOutsideClick = (
//       event: MouseEvent
//     ) => {
//       const target =
//         event.target as Node;

//       if (
//         categoriesRef.current &&
//         !categoriesRef.current.contains(target)
//       ) {
//         setIsCategoriesOpen(false);
//       }

//       if (
//         graceRef.current &&
//         !graceRef.current.contains(target)
//       ) {
//         setIsGraceOpen(false);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleOutsideClick
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleOutsideClick
//       );
//     };
//   }, []);

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

//     // API integration will be added after
//     // confirming the Exception Report API response.
//   };

//   /* =======================================================
//      RESET
//   ======================================================= */

//   const handleReset = () => {
//     resetFilters();

//     setSelectedCategories([
//       "Branch",
//       "Designation",
//     ]);

//     setGraceType("Late In");

//     setCurrentPage(1);
//   };

//   /* =======================================================
//      CATEGORY HELPERS
//   ======================================================= */

//   const toggleCategory = (
//     category: string
//   ) => {
//     setSelectedCategories(
//       (previous) =>
//         previous.includes(category)
//           ? previous.filter(
//               (item) =>
//                 item !== category
//             )
//           : [
//               ...previous,
//               category,
//             ]
//     );
//   };

//   const selectAllCategories = () => {
//     setSelectedCategories(
//       [...CATEGORY_OPTIONS]
//     );
//   };

//   const clearCategories = () => {
//     setSelectedCategories([]);
//   };

//   /* =======================================================
//      EXCEL
//   ======================================================= */

//   const handleExcelExport = () => {
//     exportTimeOfficeExcel({
//       title: "Exception Report",
//       columns: [],
//       rows,
//       fromDate:
//         filters.fromDate || today,
//       toDate:
//         filters.toDate || today,
//     });
//   };

//   return (
//     <div
//       className="
//         min-h-full
//         w-full
//         bg-[#f5f6fa]
//         p-4
//         font-[Urbanist]
//       "
//     >
//       {/* =====================================================
//           TIME OFFICE HEADER
//       ===================================================== */}

//       <div
//         className="
//           relative
//           z-[40]
//           mb-3
//           w-full
//           overflow-hidden
//           rounded-[14px]
//           border
//           border-[#df8f7b]
//           bg-[#fff8f6]
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
//           <div
//             className="
//               flex
//               h-[46px]
//               shrink-0
//               items-center
//               rounded-[10px]
//               border
//               border-[#df8f7b]
//               bg-white
//               px-6
//             "
//           >
//             <h1
//               className="
//                 whitespace-nowrap
//                 font-[Urbanist]
//                 text-[22px]
//                 font-extrabold
//                 leading-none
//                 text-[#9a5547]
//               "
//             >
//               Time Office
//             </h1>
//           </div>

//           <div
//             className="
//               flex
//               shrink-0
//               items-center
//               gap-2
//             "
//           >
//             <button
//               type="button"
//               title="Filter"
//               className="
//                 flex
//                 h-[36px]
//                 w-[36px]
//                 items-center
//                 justify-center
//                 rounded-[8px]
//                 border-none
//                 bg-transparent
//                 p-0
//                 text-[#3f3f3f]
//                 shadow-none
//                 hover:bg-[#fff0eb]
//                 hover:text-[#9a5547]
//               "
//             >
//               <Funnel
//                 size={20}
//                 strokeWidth={1.8}
//               />
//             </button>

//             <button
//               type="button"
//               title="History"
//               className="
//                 flex
//                 h-[36px]
//                 w-[36px]
//                 items-center
//                 justify-center
//                 rounded-[8px]
//                 border-none
//                 bg-transparent
//                 p-0
//                 text-[#3f3f3f]
//                 shadow-none
//                 hover:bg-[#fff0eb]
//                 hover:text-[#9a5547]
//               "
//             >
//               <ClockFading
//                 size={20}
//                 strokeWidth={1.8}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           EXCEPTION REPORT HEADER
//       ===================================================== */}

//       <div
//         className="
//           relative
//           z-[100]
//           mb-3
//           w-full
//           overflow-visible
//           rounded-[14px]
//           border
//           border-[#df8f7b]
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
//               min-w-0
//               shrink-0
//               items-center
//               gap-2.5
//               rounded-[10px]
//               border
//               border-[#df8f7b]
//               bg-[#fff8f6]
//               px-4
//             "
//           >
//             <FileText
//               size={20}
//               strokeWidth={1.8}
//               className="
//                 shrink-0
//                 text-[#9a5547]
//               "
//             />

//             <h2
//               className="
//                 whitespace-nowrap
//                 font-[Urbanist]
//                 text-[22px]
//                 font-extrabold
//                 leading-[28px]
//                 tracking-[-0.02em]
//                 text-[#9a5547]
//               "
//             >
//               Exception Report
//             </h2>
//           </div>

//           {/* HEADER ACTIONS */}

//           <div
//             className="
//               ml-auto
//               flex
//               min-w-0
//               shrink
//               items-center
//               justify-end
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
//                 w-[96px]
//                 shrink-0
//                 items-center
//                 justify-center
//                 gap-2
//                 rounded-[8px]
//                 border-none
//                 bg-[#9a5547]
//                 px-3
//                 font-[Urbanist]
//                 text-[12px]
//                 font-semibold
//                 leading-[16px]
//                 text-white
//                 shadow-none
//                 hover:bg-[#7d4438]
//               "
//             >
//               <ChevronLeft
//                 size={18}
//                 strokeWidth={2}
//               />

//               <span>Back</span>
//             </button>

//             {/* FROM DATE */}

//             <div
//               className="
//                 shrink-0
//               "
//             >
//               <label
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                 "
//               >
//                 <span
//                   className="
//                     whitespace-nowrap
//                     font-[Urbanist]
//                     text-[13px]
//                     font-medium
//                     leading-[18px]
//                     text-[#344054]
//                   "
//                 >
//                   From Date
//                 </span>

//                 <input
//                   type="date"
//                   value={
//                     filters.fromDate ||
//                     today
//                   }
//                   onChange={(event) =>
//                     updateFilter(
//                       "fromDate",
//                       event.target.value
//                     )
//                   }
//                   className="
//                     h-[42px]
//                     w-[150px]
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     font-normal
//                     leading-[18px]
//                     text-[#344054]
//                     outline-none
//                     focus:border-[#9a5547]
//                   "
//                 />
//               </label>
//             </div>

//             {/* TO DATE */}

//             <div
//               className="
//                 shrink-0
//               "
//             >
//               <label
//                 className="
//                   flex
//                   items-center
//                   gap-2
//                 "
//               >
//                 <span
//                   className="
//                     whitespace-nowrap
//                     font-[Urbanist]
//                     text-[13px]
//                     font-medium
//                     leading-[18px]
//                     text-[#344054]
//                   "
//                 >
//                   To Date
//                 </span>

//                 <input
//                   type="date"
//                   value={
//                     filters.toDate ||
//                     today
//                   }
//                   onChange={(event) =>
//                     updateFilter(
//                       "toDate",
//                       event.target.value
//                     )
//                   }
//                   className="
//                     h-[42px]
//                     w-[150px]
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     font-normal
//                     leading-[18px]
//                     text-[#344054]
//                     outline-none
//                     focus:border-[#9a5547]
//                   "
//                 />
//               </label>
//             </div>

//             {/* LATE IN */}

//             <div
//               ref={graceRef}
//               className="
//                 relative
//                 z-[300]
//                 shrink-0
//               "
//             >
//               <button
//                 type="button"
//                 onClick={() =>
//                   setIsGraceOpen(
//                     (previous) =>
//                       !previous
//                   )
//                 }
//                 className="
//                   flex
//                   h-[42px]
//                   w-[125px]
//                   items-center
//                   justify-between
//                   gap-2
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
//                   shadow-none
//                   hover:bg-[#f8fafc]
//                 "
//               >
//                 <span className="truncate">
//                   {graceType}
//                 </span>

//                 <ChevronDown
//                   size={16}
//                   strokeWidth={1.8}
//                   className={`
//                     shrink-0
//                     transition-transform
//                     ${
//                       isGraceOpen
//                         ? "rotate-180"
//                         : ""
//                     }
//                   `}
//                 />
//               </button>

//               {isGraceOpen && (
//                 <div
//                   className="
//                     absolute
//                     right-0
//                     top-[48px]
//                     z-[9999]
//                     w-[125px]
//                     overflow-hidden
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     shadow-[0_10px_28px_rgba(15,23,42,0.16)]
//                   "
//                 >
//                   {GRACE_TYPE_OPTIONS.map(
//                     (option) => (
//                       <button
//                         key={option}
//                         type="button"
//                         onClick={() => {
//                           setGraceType(
//                             option
//                           );
//                           setIsGraceOpen(
//                             false
//                           );
//                         }}
//                         className="
//                           flex
//                           w-full
//                           items-center
//                           px-4
//                           py-2.5
//                           text-left
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           text-[#344054]
//                           hover:bg-[#f8fafc]
//                         "
//                       >
//                         {option}
//                       </button>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* CATEGORIES */}

//             <div
//               ref={categoriesRef}
//               className="
//                 relative
//                 z-[300]
//                 shrink-0
//               "
//             >
//               <button
//                 type="button"
//                 onClick={() =>
//                   setIsCategoriesOpen(
//                     (previous) =>
//                       !previous
//                   )
//                 }
//                 className="
//                   flex
//                   h-[42px]
//                   w-[145px]
//                   items-center
//                   justify-between
//                   gap-2
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
//                   shadow-none
//                   hover:bg-[#f8fafc]
//                 "
//               >
//                 <span className="truncate">
//                   Categories (
//                   {selectedCategories.length}
//                   )
//                 </span>

//                 <ChevronDown
//                   size={16}
//                   strokeWidth={1.8}
//                   className={`
//                     shrink-0
//                     transition-transform
//                     ${
//                       isCategoriesOpen
//                         ? "rotate-180"
//                         : ""
//                     }
//                   `}
//                 />
//               </button>

//               {isCategoriesOpen && (
//                 <div
//                   className="
//                     absolute
//                     right-0
//                     top-[48px]
//                     z-[9999]
//                     max-h-[360px]
//                     w-[285px]
//                     overflow-y-auto
//                     overflow-x-hidden
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     shadow-[0_10px_28px_rgba(15,23,42,0.16)]
//                   "
//                 >
//                   <div
//                     className="
//                       sticky
//                       top-0
//                       z-10
//                       flex
//                       items-center
//                       justify-between
//                       border-b
//                       border-[#edf0f3]
//                       bg-white
//                       px-4
//                       py-2.5
//                     "
//                   >
//                     <button
//                       type="button"
//                       onClick={
//                         selectAllCategories
//                       }
//                       className="
//                         font-[Urbanist]
//                         text-[13px]
//                         font-medium
//                         text-[#344054]
//                         hover:text-[#159bd7]
//                       "
//                     >
//                       Select All
//                     </button>

//                     <button
//                       type="button"
//                       onClick={
//                         clearCategories
//                       }
//                       className="
//                         font-[Urbanist]
//                         text-[12px]
//                         font-medium
//                         text-[#98a2b3]
//                         hover:text-[#344054]
//                       "
//                     >
//                       Clear
//                     </button>
//                   </div>

//                   {CATEGORY_OPTIONS.map(
//                     (category) => (
//                       <label
//                         key={category}
//                         className="
//                           flex
//                           cursor-pointer
//                           items-center
//                           gap-3
//                           px-4
//                           py-2.5
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           text-[#344054]
//                           hover:bg-[#f8fafc]
//                         "
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedCategories.includes(
//                             category
//                           )}
//                           onChange={() =>
//                             toggleCategory(
//                               category
//                             )
//                           }
//                           className="
//                             h-[16px]
//                             w-[16px]
//                             accent-[#159bd7]
//                           "
//                         />

//                         <span>
//                           {category}
//                         </span>
//                       </label>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* EXCEL */}

//             <button
//               type="button"
//               title="Export Excel"
//               onClick={
//                 handleExcelExport
//               }
//               className="
//                 flex
//                 h-[42px]
//                 w-[34px]
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-[8px]
//                 border-none
//                 bg-white
//                 p-0
//                 text-[#35a853]
//                 shadow-none
//                 hover:bg-[#f1faf3]
//               "
//             >
//               <FaFileExcel
//                 className="
//                   h-[21px]
//                   w-[21px]
//                 "
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           EXISTING FILTER BAR
//       ===================================================== */}

//       <div className="relative z-[20]">
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
//           TABLE
//       ===================================================== */}

//       <TimeOfficeTable
//         columns={[]}
//         rows={rows}
//         loading={loading}
//         emptyMessage="Did Not Find Any Time Office"
//       />

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
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

import { exportTimeOfficeExcel } from "../utils/timeOfficeExport";

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
   EXCEPTION REPORT CATEGORY OPTIONS
   These are passed to the shared header so the same
   Categories dropdown behavior used by Over Time is reused.
========================================================= */

const CATEGORY_OPTIONS = [
  "Branch",
  "Designation",
  "Salary Structure",
  "Leave Policy",
  "Attendance Structure",
  "Department",
  "Team",
];

/* =========================================================
   GRACE TYPE OPTIONS
========================================================= */

const GRACE_TYPE_OPTIONS = [
  "Late In",
  "Early Out",
  "Early In",
  "Late Out",
];

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ExceptionReportPage() {
  const navigate = useNavigate();
  const today = getTodayDate();

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

  /* =======================================================
     CATEGORY STATE
  ======================================================= */

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([
      "Branch",
      "Designation",
    ]);

  /* =======================================================
     GRACE TYPE STATE
  ======================================================= */

  const [graceType, setGraceType] =
    useState("Late In");

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
      API integration will be added after
      confirming the Exception Report API
      response structure.
    */
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    resetFilters();

    setSelectedCategories([
      "Branch",
      "Designation",
    ]);

    setGraceType("Late In");

    setCurrentPage(1);
  };

  /* =======================================================
     EXCEL EXPORT
  ======================================================= */

  const handleExcelExport = () => {
    exportTimeOfficeExcel({
      title: "Exception Report",
      columns: [],
      rows,
      fromDate:
        filters.fromDate || today,
      toDate:
        filters.toDate || today,
    });
  };

  return (
    <div
      className="
        relative
        z-0
        min-h-screen
        w-full
        bg-[#f5f6fa]
        p-4
        font-[Urbanist]
      "
    >
      {/* =====================================================
          SHARED TIME OFFICE + EXCEPTION REPORT HEADER

          Main Time Office header:
          Funnel + ClockFading

          Exception Report header:
          Back + From Date + To Date + Late In +
          Categories + Excel

          No ClockFading after Excel.
      ===================================================== */}

      <TimeOfficeReportHeader
        title="Exception Report"

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

        /* ===================================================
           MAIN TIME OFFICE HEADER
           Funnel + ClockFading
        =================================================== */

        showTimeOfficeBanner={true}
        showBannerHistory={true}

        /* ===================================================
           DATE RANGE
        =================================================== */

        showDateRange={true}

        /* ===================================================
           LATE IN DROPDOWN
        =================================================== */

        showGraceTypes={true}

        graceType={graceType}

        onGraceTypeChange={
          setGraceType
        }

        graceTypeOptions={
          GRACE_TYPE_OPTIONS
        }

        /* ===================================================
           CATEGORIES DROPDOWN

           Uses the same shared dropdown implementation
           as Over Time, but with Exception Report's
           category options.
        =================================================== */

        showCategories={true}

        selectedCategories={
          selectedCategories
        }

        onCategoriesChange={
          setSelectedCategories
        }

        categoryOptions={
          CATEGORY_OPTIONS
        }

        /* ===================================================
           EXPORT
        =================================================== */

        showPdfExport={false}

        showExcelExport={true}

        onExcelExport={
          handleExcelExport
        }

        /* ===================================================
           IMPORTANT:
           No ClockFading after Excel.
        =================================================== */

        showRefresh={false}
      />

      {/* =====================================================
          EXISTING FILTER BAR
      ===================================================== */}

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

      {/* =====================================================
          TABLE
      ===================================================== */}

      <TimeOfficeTable
        columns={[]}
        rows={rows}
        loading={loading}
        emptyMessage="Did Not Find Any Time Office"
      />

      {/* =====================================================
          PAGINATION
      ===================================================== */}

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
