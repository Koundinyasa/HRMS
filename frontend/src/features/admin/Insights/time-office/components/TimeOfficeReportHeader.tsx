// import { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";

// import {
//   ChevronDown,
//   ChevronLeft,
//   ClockFading,
//   FileText,
//   Filter,
//   Funnel,
// } from "lucide-react";

// import { FaFileExcel, FaFilePdf } from "react-icons/fa";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";

// import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

// interface TimeOfficeReportHeaderProps {
//   title: string;

//   fromDate?: string;
//   toDate?: string;

//   onFromDateChange?: (value: string) => void;
//   onToDateChange?: (value: string) => void;

//   onBack: () => void;

//   showTimeOfficeBanner?: boolean;
//   showBannerHistory?: boolean;
//   showDateRange?: boolean;

//   showCategories?: boolean;

//   selectedCategories?: string[];
//   onCategoriesChange?: (categories: string[]) => void;
//   categoryOptions?: string[];

//   showGraceTypes?: boolean;

//   graceType?: string;
//   onGraceTypeChange?: (value: string) => void;
//   graceTypeOptions?: string[];

//   showMonthDropdown?: boolean;
//   selectedMonth?: string;
//   onMonthChange?: (value: string) => void;
//   monthOptions?: string[];

//   showExcelLayout?: boolean;
//   selectedExcelLayout?: string;
//   onExcelLayoutChange?: (value: string) => void;
//   excelLayoutOptions?: string[];

//   showPdfExport?: boolean;
//   showExcelExport?: boolean;
//   showRefresh?: boolean;

//   showAdvanceFilter?: boolean;
//   onAdvanceFilter?: () => void;
//   onShowFilters?: () => void;

//   onExcelExport?: () => void;

//   columns?: string[];
//   rows?: Record<string, unknown>[];
// }

// const CATEGORY_OPTIONS = [
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

// const OTHER_CATEGORY_OPTIONS = [
//   "Attendance Structure",
//   "Cost Center",
//   "Department",
//   "Team",
//   "DOJ",
//   "Day Status",
//   "Reconciled Day Status",
//   "Break Hours",
// ];

// export default function TimeOfficeReportHeader({
//   title,
//   fromDate,
//   toDate,

//   onFromDateChange,
//   onToDateChange,

//   onBack,

//   showTimeOfficeBanner = true,
//   showBannerHistory = false,
//   showDateRange = true,

//   showCategories = false,
//   selectedCategories = CATEGORY_OPTIONS,
//   onCategoriesChange,
//   categoryOptions = [
//     ...CATEGORY_OPTIONS,
//     ...OTHER_CATEGORY_OPTIONS,
//   ],

//   showGraceTypes = false,
//   graceType = "",
//   onGraceTypeChange,
//   graceTypeOptions = [],

//   showMonthDropdown = false,
//   selectedMonth = "",
//   onMonthChange,
//   monthOptions = [],

//   showExcelLayout = false,
//   selectedExcelLayout = "",
//   onExcelLayoutChange,
//   excelLayoutOptions = [],

//   showPdfExport = true,
//   showExcelExport = true,
//   showRefresh = false,

//   showAdvanceFilter = false,
//   onAdvanceFilter,
//   onShowFilters,

//   onExcelExport,

//   columns = [],
//   rows = [],
// }: TimeOfficeReportHeaderProps) {
//   const [isCategoryOpen, setIsCategoryOpen] =
//     useState(false);

//   const [isGraceTypeOpen, setIsGraceTypeOpen] =
//     useState(false);

//   const [isMonthOpen, setIsMonthOpen] =
//     useState(false);

//   const [isExcelLayoutOpen, setIsExcelLayoutOpen] =
//     useState(false);

//   const categoryRef =
//     useRef<HTMLDivElement>(null);

//   const graceTypeRef =
//     useRef<HTMLDivElement>(null);

//   const monthRef =
//     useRef<HTMLDivElement>(null);

//   const excelLayoutRef =
//     useRef<HTMLDivElement>(null);

//   /* =========================================================
//      OUTSIDE CLICK
//   ========================================================= */

//   useEffect(() => {
//     const handleOutsideClick = (
//       event: MouseEvent
//     ) => {
//       const target = event.target as Node;

//       if (
//         categoryRef.current &&
//         !categoryRef.current.contains(target)
//       ) {
//         setIsCategoryOpen(false);
//       }

//       if (
//         graceTypeRef.current &&
//         !graceTypeRef.current.contains(target)
//       ) {
//         setIsGraceTypeOpen(false);
//       }

//       if (
//         monthRef.current &&
//         !monthRef.current.contains(target)
//       ) {
//         setIsMonthOpen(false);
//       }

//       if (
//         excelLayoutRef.current &&
//         !excelLayoutRef.current.contains(target)
//       ) {
//         setIsExcelLayoutOpen(false);
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

//   /* =========================================================
//      CATEGORY LOGIC
//   ========================================================= */

//   const toggleCategory = (
//     category: string
//   ) => {
//     if (!onCategoriesChange) return;

//     const exists =
//       selectedCategories.includes(category);

//     if (exists) {
//       onCategoriesChange(
//         selectedCategories.filter(
//           (item) => item !== category
//         )
//       );
//     } else {
//       onCategoriesChange([
//         ...selectedCategories,
//         category,
//       ]);
//     }
//   };

//   const clearCategories = () => {
//     onCategoriesChange?.([]);
//   };

//   const selectDefaultCategories = () => {
//     onCategoriesChange?.(
//       categoryOptions
//     );
//   };

//   /* =========================================================
//      EXPORT DATA
//   ========================================================= */

//   const exportColumns =
//     columns.length > 0
//       ? columns
//       : Object.keys(rows[0] ?? {});

//   const exportDate = new Date()
//     .toISOString()
//     .slice(0, 10);

//   const dateRangeLabel =
//     fromDate && toDate
//       ? `${fromDate}_${toDate}`
//       : exportDate;

//   /* =========================================================
//      PDF EXPORT
//   ========================================================= */

//   const handleExportPDF = () => {
//     const doc = new jsPDF({
//       orientation:
//         exportColumns.length > 7
//           ? "landscape"
//           : "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     doc.setFontSize(16);
//     doc.text(title, 14, 15);

//     const hasDateRange = Boolean(
//       fromDate && toDate
//     );

//     const tableStartY =
//       hasDateRange ? 34 : 22;

//     if (hasDateRange) {
//       doc.setFontSize(10);

//       doc.text(
//         `From Date: ${fromDate}`,
//         14,
//         22
//       );

//       doc.text(
//         `To Date: ${toDate}`,
//         14,
//         28
//       );
//     }

//     const tableRows = rows.map((row) =>
//       exportColumns.map((column) => {
//         const value = row[column];

//         if (
//           value === null ||
//           value === undefined ||
//           value === ""
//         ) {
//           return "0";
//         }

//         return String(value);
//       })
//     );

//     if (exportColumns.length > 0) {
//       autoTable(doc, {
//         head: [exportColumns],
//         body: tableRows,
//         startY: tableStartY,
//         styles: {
//           fontSize: 7,
//           cellPadding: 2,
//         },
//         headStyles: {
//           fontSize: 7,
//         },
//       });
//     } else {
//       doc.setFontSize(10);

//       doc.text(
//         "No data available.",
//         14,
//         tableStartY
//       );
//     }

//     doc.save(
//       `${title.replace(
//         /\s+/g,
//         "_"
//       )}_${dateRangeLabel}.pdf`
//     );
//   };

//   /* =========================================================
//      EXCEL EXPORT
//   ========================================================= */

//   const handleExportExcel = () => {
//     const excelRows = rows.map((row) => {
//       const formattedRow: Record<
//         string,
//         unknown
//       > = {};

//       exportColumns.forEach((column) => {
//         const value = row[column];

//         formattedRow[column] =
//           value === null ||
//           value === undefined ||
//           value === ""
//             ? "0"
//             : value;
//       });

//       return formattedRow;
//     });

//     const worksheet =
//       exportColumns.length > 0
//         ? XLSX.utils.json_to_sheet(
//             excelRows,
//             {
//               header: exportColumns,
//             }
//           )
//         : XLSX.utils.aoa_to_sheet([
//             ["No data available"],
//           ]);

//     worksheet["!cols"] =
//       exportColumns.map((column) => ({
//         wch: Math.max(
//           column.length + 2,
//           15
//         ),
//       }));

//     const workbook =
//       XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(
//       workbook,
//       worksheet,
//       "Time Office"
//     );

//     XLSX.writeFile(
//       workbook,
//       `${title.replace(
//         /\s+/g,
//         "_"
//       )}_${dateRangeLabel}.xlsx`
//     );
//   };

//   return (
//     <div
//       className="relative z-30 w-full font-[Urbanist]"
//     >

//       {/* =====================================================
//           TIME OFFICE MAIN HEADER
//           ===================================================== */}

//       {showTimeOfficeBanner && (
//         <div className="mb-3 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">
//           <div className="flex min-h-[72px] items-center justify-between px-5">

//             {/* TIME OFFICE TITLE */}

//             <div className="flex h-[46px] shrink-0 items-center rounded-[10px] border border-[#df8f7b] bg-white px-6">
//               <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
//                 Time Office
//               </h1>
//             </div>

//             {/* FILTER */}

//             <div className="flex shrink-0 items-center gap-2">

//               <Button
//                 type="button"
//                 variant="ghost"
//                 title="Filter"
//                 onClick={onShowFilters}
//                 className="
//                   flex
//                   h-[34px]
//                   w-[34px]
//                   items-center
//                   justify-center
//                   rounded-md
//                   p-0
//                   text-[#3f3f3f]
//                   shadow-none
//                   hover:bg-[#fff0eb]
//                 "
//               >
//                 <Funnel
//                   size={20}
//                   strokeWidth={1.8}
//                 />
//               </Button>

//               {showBannerHistory && (
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   title="History"
//                   className="
//                     flex
//                     h-[34px]
//                     w-[34px]
//                     items-center
//                     justify-center
//                     rounded-md
//                     p-0
//                     text-[#3f3f3f]
//                     shadow-none
//                     hover:bg-[#fff0eb]
//                   "
//                 >
//                   <ClockFading
//                     size={20}
//                     strokeWidth={1.8}
//                   />
//                 </Button>
//               )}

//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           REPORT HEADER
//           ===================================================== */}

//       <div className="mb-3 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-white shadow-[0_2px_4px_rgba(15,23,42,0.06)]">

//         <div className="flex min-h-[72px] w-full min-w-0 items-center gap-4 overflow-hidden px-5">

//           {/* REPORT TITLE */}

//           <div className="flex h-[46px] shrink-0 items-center gap-2 rounded-[10px] border border-[#df8f7b] bg-[#fff8f6] px-4">

//             <FileText
//               size={18}
//               strokeWidth={1.8}
//               className="shrink-0 text-[#9a5547]"
//             />

//             <h2 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-[28px] tracking-[-0.02em] text-[#9a5547]">
//               {title}
//             </h2>

//           </div>

//           {/* REPORT CONTROLS */}

//           <div className="ml-auto flex min-w-0 shrink-0 items-center justify-end gap-1.5 whitespace-nowrap">

//             {/* BACK */}

//             <Button
//               type="button"
//               variant="ghost"
//               onClick={onBack}
//               className="
//                 flex
//                 h-[42px]
//                 shrink-0
//                 items-center
//                 gap-2
//                 rounded-[8px]
//                 bg-[#9a5547]
//                 px-4
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
//             </Button>

//             {/* DATE RANGE */}

//             {showDateRange && (
//               <>
//                 <DateField
//                   label="From Date"
//                   value={fromDate ?? ""}
//                   onChange={(value) =>
//                     onFromDateChange?.(
//                       value
//                     )
//                   }
//                   className="
//                     flex shrink-0 items-center gap-2
//                     [&_label]:whitespace-nowrap
//                     [&_label]:font-[Urbanist]
//                     [&_label]:text-[13px]
//                     [&_label]:font-medium
//                     [&_label]:leading-[18px]
//                     [&_input]:h-[42px]
//                     [&_input]:w-[165px]
//                     [&_input]:rounded-[8px]
//                     [&_input]:border-[#dfe3e8]
//                     [&_input]:bg-white
//                     [&_input]:px-3
//                     [&_input]:font-[Urbanist]
//                     [&_input]:text-[13px]
//                     [&_input]:font-normal
//                     [&_input]:leading-[18px]
//                     [&_input]:text-[#344054]
//                   "
//                 />

//                 <DateField
//                   label="To Date"
//                   value={toDate ?? ""}
//                   onChange={(value) =>
//                     onToDateChange?.(
//                       value
//                     )
//                   }
//                   className="
//                     flex shrink-0 items-center gap-2
//                     [&_label]:whitespace-nowrap
//                     [&_label]:font-[Urbanist]
//                     [&_label]:text-[13px]
//                     [&_label]:font-medium
//                     [&_label]:leading-[18px]
//                     [&_input]:h-[42px]
//                     [&_input]:w-[165px]
//                     [&_input]:rounded-[8px]
//                     [&_input]:border-[#dfe3e8]
//                     [&_input]:bg-white
//                     [&_input]:px-3
//                     [&_input]:font-[Urbanist]
//                     [&_input]:text-[13px]
//                     [&_input]:font-normal
//                     [&_input]:leading-[18px]
//                     [&_input]:text-[#344054]
//                   "
//                 />
//               </>
//             )}

//             {/* MONTH DROPDOWN */}

//             {showMonthDropdown && (
//               <div
//                 ref={monthRef}
//                 className="relative z-[300] shrink-0"
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsMonthOpen(
//                       (current) =>
//                         !current
//                     );

//                     setIsGraceTypeOpen(
//                       false
//                     );

//                     setIsCategoryOpen(
//                       false
//                     );
//                   }}
//                   className="
//                     flex
//                     h-[42px]
//                     min-w-[165px]
//                     shrink-0
//                     items-center
//                     justify-between
//                     gap-3
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     font-medium
//                     text-[#344054]
//                     hover:bg-[#f8fafc]
//                   "
//                 >
//                   <span>
//                     {selectedMonth}
//                   </span>

//                   <ChevronDown
//                     size={15}
//                     strokeWidth={1.8}
//                   />
//                 </button>

//                 {isMonthOpen && (
//                   <div className="absolute right-0 top-[49px] z-[300] max-h-[260px] w-full overflow-y-auto rounded-[8px] border border-[#dfe3e8] bg-white py-1 shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
//                     {monthOptions.map(
//                       (month) => (
//                         <button
//                           key={month}
//                           type="button"
//                           onClick={() => {
//                             onMonthChange?.(
//                               month
//                             );

//                             setIsMonthOpen(
//                               false
//                             );
//                           }}
//                           className={`
//                             block w-full px-4 py-2
//                             text-left
//                             font-[Urbanist]
//                             text-[13px]
//                             leading-[18px]
//                             hover:bg-[#f8fafc]
//                             ${
//                               selectedMonth ===
//                               month
//                                 ? "bg-[#f8fafc] font-medium text-[#9a5547]"
//                                 : "font-normal text-[#475467]"
//                             }
//                           `}
//                         >
//                           {month}
//                         </button>
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* GRACE TYPE */}

//             {showGraceTypes && (
//               <div
//                 ref={graceTypeRef}
//                 className="relative z-[300] shrink-0"
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsGraceTypeOpen(
//                       (current) =>
//                         !current
//                     );

//                     setIsCategoryOpen(
//                       false
//                     );

//                     setIsMonthOpen(false);
//                   }}
//                   className="
//                     flex
//                     h-[42px]
//                     min-w-[190px]
//                     shrink-0
//                     items-center
//                     justify-between
//                     gap-3
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     font-medium
//                     text-[#344054]
//                     hover:bg-[#f8fafc]
//                   "
//                 >
//                   <span>
//                     {graceType}
//                   </span>

//                   <ChevronDown
//                     size={15}
//                     strokeWidth={1.8}
//                   />
//                 </button>

//                 {isGraceTypeOpen && (
//                   <div className="absolute right-0 top-[49px] z-[300] w-full overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
//                     {graceTypeOptions.map(
//                       (type) => (
//                         <button
//                           key={type}
//                           type="button"
//                           onClick={() => {
//                             onGraceTypeChange?.(
//                               type
//                             );

//                             setIsGraceTypeOpen(
//                               false
//                             );
//                           }}
//                           className={`
//                             block w-full px-4 py-2
//                             text-left
//                             font-[Urbanist]
//                             text-[13px]
//                             leading-[18px]
//                             hover:bg-[#f8fafc]
//                             ${
//                               graceType ===
//                               type
//                                 ? "bg-[#f8fafc] font-medium text-[#9a5547]"
//                                 : "font-normal text-[#475467]"
//                             }
//                           `}
//                         >
//                           {type}
//                         </button>
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* CATEGORIES */}

//             {showCategories && (
//               <div
//                 ref={categoryRef}
//                 className="relative z-[300] shrink-0"
//               >
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   onClick={() => {
//                     setIsCategoryOpen(
//                       (current) =>
//                         !current
//                     );

//                     setIsGraceTypeOpen(
//                       false
//                     );

//                     setIsMonthOpen(false);
//                   }}
//                   className="
//                     flex
//                     h-[42px]
//                     min-w-[145px]
//                     shrink-0
//                     items-center
//                     justify-between
//                     gap-2
//                     rounded-[8px]
//                     border
//                     border-[#dfe3e8]
//                     bg-white
//                     px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     font-medium
//                     text-[#344054]
//                     shadow-none
//                     hover:bg-[#f8fafc]
//                   "
//                 >
//                   <span>
//                     Categories (
//                     {selectedCategories.length}
//                     )
//                   </span>

//                   <ChevronDown
//                     size={15}
//                     strokeWidth={1.8}
//                   />
//                 </Button>

//                 {isCategoryOpen && (
//                   <div className="absolute right-0 top-[49px] z-[200] w-[300px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_25px_rgba(15,23,42,0.12)]">

//                     <div className="flex items-center justify-between border-b border-[#e8ebef] px-4 py-3">
//                       <span className="font-[Urbanist] text-[18px] font-bold text-[#344054]">
//                         Categories
//                       </span>

//                       <span className="font-[Urbanist] text-[12px] font-medium text-[#98a2b3]">
//                         {
//                           selectedCategories.length
//                         }{" "}
//                         selected
//                       </span>
//                     </div>

//                     <div className="max-h-[390px] overflow-y-auto py-1">

//                       {categoryOptions.map(
//                         (category) => (
//                           <label
//                             key={category}
//                             className="flex cursor-pointer items-center gap-3 px-4 py-[9px] hover:bg-[#f8fafc]"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={selectedCategories.includes(
//                                 category
//                               )}
//                               onChange={() =>
//                                 toggleCategory(
//                                   category
//                                 )
//                               }
//                               className="h-[16px] w-[16px] accent-[#9a5547]"
//                             />

//                             <span className="font-[Urbanist] text-[13px] font-normal text-[#475467]">
//                               {category}
//                             </span>
//                           </label>
//                         )
//                       )}
//                     </div>

//                     <div className="flex items-center justify-between border-t border-[#e8ebef] px-3 py-2">

//                       <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={
//                           clearCategories
//                         }
//                         className="
//                           h-auto
//                           px-2
//                           py-1
//                           font-[Urbanist]
//                           text-[12px]
//                           font-medium
//                           text-[#98a2b3]
//                           shadow-none
//                           hover:bg-transparent
//                           hover:text-[#475467]
//                         "
//                       >
//                         Clear
//                       </Button>

//                       <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={
//                           selectDefaultCategories
//                         }
//                         className="
//                           h-auto
//                           px-2
//                           py-1
//                           font-[Urbanist]
//                           text-[12px]
//                           font-medium
//                           text-[#9a5547]
//                           shadow-none
//                           hover:bg-transparent
//                           hover:text-[#7d4438]
//                         "
//                       >
//                         Reset
//                       </Button>

//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ADVANCE FILTER */}

//             {showAdvanceFilter && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 title="Advance Filter"
//                 onClick={onAdvanceFilter}
//                 className="
//                   flex
//                   h-[42px]
//                   shrink-0
//                   items-center
//                   gap-2
//                   rounded-[8px]
//                   bg-[#2299e8]
//                   px-5
//                   font-[Urbanist]
//                   text-[13px]
//                   font-semibold
//                   leading-[16px]
//                   text-white
//                   shadow-none
//                   hover:bg-[#1687d4]
//                 "
//               >
//                 <Filter
//                   size={18}
//                   strokeWidth={2}
//                 />

//                 <span>Advance Filter</span>
//               </Button>
//             )}

//             {/* PDF */}

//             {showPdfExport && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 title="Export PDF"
//                 onClick={handleExportPDF}
//                 className="
//                   flex
//                   h-[42px]
//                   w-[32px]
//                   shrink-0
//                   items-center
//                   justify-center
//                   rounded-[8px]
//                   bg-white
//                   p-0
//                   text-[#ef5350]
//                   shadow-none
//                   hover:bg-[#fff3f3]
//                 "
//               >
//                 <FaFilePdf className="h-5 w-5" />
//               </Button>
//             )}

//             {/* EXCEL LAYOUT + EXCEL */}

//             <div className="flex shrink-0 items-center gap-1.5">

//             {showExcelLayout && (
//               <div
//                 ref={excelLayoutRef}
//                 className="relative z-[300] shrink-0"
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsExcelLayoutOpen(
//                       (current) => !current
//                     );

//                     setIsCategoryOpen(false);
//                     setIsGraceTypeOpen(false);
//                     setIsMonthOpen(false);
//                   }}
//                   className="
//                     relative
//                     flex
//                     h-[42px]
//                     w-[190px]
//                     shrink-0
//                     items-center
//                     justify-between
//                     rounded-[8px]
//                     border
//                     border-[#2299e8]
//                     bg-white
//                     px-4
//                     pt-1
//                     font-[Urbanist]
//                     text-[13px]
//                     font-medium
//                     text-[#344054]
//                     outline-none
//                     transition-colors
//                     hover:bg-[#f8fafc]
//                   "
//                   aria-haspopup="listbox"
//                   aria-expanded={isExcelLayoutOpen}
//                 >
//                   <span
//                     className="
//                       absolute
//                       left-3
//                       top-[-7px]
//                       bg-white
//                       px-1
//                       font-[Urbanist]
//                       text-[11px]
//                       font-medium
//                       leading-none
//                       text-[#6f7f91]
//                     "
//                   >
//                     Excel Layout
//                   </span>

//                   <span className="truncate">
//                     {selectedExcelLayout}
//                   </span>

//                   <ChevronDown
//                     size={17}
//                     strokeWidth={1.8}
//                     className="shrink-0 text-[#555]"
//                   />
//                 </button>

//                 {isExcelLayoutOpen && (
//                   <div
//                     role="listbox"
//                     className="
//                       absolute
//                       right-0
//                       top-[49px]
//                       z-[500]
//                       w-[190px]
//                       overflow-hidden
//                       rounded-[8px]
//                       border
//                       border-[#dfe3e8]
//                       bg-white
//                       py-1
//                       shadow-[0_8px_25px_rgba(15,23,42,0.12)]
//                     "
//                   >
//                     {excelLayoutOptions.map(
//                       (option) => (
//                         <button
//                           key={option}
//                           type="button"
//                           role="option"
//                           aria-selected={
//                             selectedExcelLayout ===
//                             option
//                           }
//                           onClick={() => {
//                             onExcelLayoutChange?.(
//                               option
//                             );
//                             setIsExcelLayoutOpen(
//                               false
//                             );
//                           }}
//                           className={`
//                             block
//                             w-full
//                             px-4
//                             py-2
//                             text-left
//                             font-[Urbanist]
//                             text-[13px]
//                             leading-[18px]
//                             hover:bg-[#f8fafc]
//                             ${
//                               selectedExcelLayout ===
//                               option
//                                 ? "bg-[#f8fafc] font-medium text-[#9a5547]"
//                                 : "font-normal text-[#475467]"
//                             }
//                           `}
//                         >
//                           {option}
//                         </button>
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* EXCEL */}

//             {showExcelExport && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 title="Export Excel"
//                 onClick={
//                   onExcelExport ??
//                   handleExportExcel
//                 }
//                 className="
//                   flex
//                   h-[42px]
//                   min-w-[42px]
//                   shrink-0
//                   items-center
//                   justify-center
//                   overflow-visible
//                   rounded-[8px]
//                   bg-white
//                   p-0
//                   text-[#35a853]
//                   shadow-none
//                   hover:bg-[#f1faf3]
//                 "
//               >
//                 <FaFileExcel
//                   size={22}
//                   className="block overflow-visible"
//                 />
//               </Button>
//             )}

//             </div>

//             {showRefresh && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 title="History"
//                 className="
//                   flex
//                   h-[42px]
//                   w-[32px]
//                   shrink-0
//                   items-center
//                   justify-center
//                   rounded-[8px]
//                   bg-white
//                   p-0
//                   text-[#98a2b3]
//                   shadow-none
//                   hover:bg-[#f8fafc]
//                 "
//               >
//                 <ClockFading
//                   size={20}
//                   strokeWidth={1.8}
//                 />
//               </Button>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  ChevronDown,
  ChevronLeft,
  Clock3,
  ClockFading,
  Filter,
  Funnel,
} from "lucide-react";

import { FaFileExcel, FaFilePdf } from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

interface TimeOfficeReportHeaderProps {
  title: string;

  fromDate?: string;
  toDate?: string;

  onFromDateChange?: (value: string) => void;
  onToDateChange?: (value: string) => void;

  onBack: () => void;

  showTimeOfficeBanner?: boolean;
  showBannerHistory?: boolean;
  showDateRange?: boolean;

  showCategories?: boolean;

  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
  categoryOptions?: string[];

  showGraceTypes?: boolean;

  graceType?: string;
  onGraceTypeChange?: (value: string) => void;
  graceTypeOptions?: string[];

  showMonthDropdown?: boolean;
  selectedMonth?: string;
  onMonthChange?: (value: string) => void;
  monthOptions?: string[];

  showExcelLayout?: boolean;
  selectedExcelLayout?: string;
  onExcelLayoutChange?: (value: string) => void;
  excelLayoutOptions?: string[];

  showPdfExport?: boolean;
  showExcelExport?: boolean;
  showRefresh?: boolean;

  showAdvanceFilter?: boolean;
  onAdvanceFilter?: () => void;
  onShowFilters?: () => void;

  onExcelExport?: () => void;

  columns?: string[];
  rows?: Record<string, unknown>[];
}

const CATEGORY_OPTIONS = [
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

const OTHER_CATEGORY_OPTIONS = [
  "Attendance Structure",
  "Cost Center",
  "Department",
  "Team",
  "DOJ",
  "Day Status",
  "Reconciled Day Status",
  "Break Hours",
];

export default function TimeOfficeReportHeader({
  title,
  fromDate,
  toDate,

  onFromDateChange,
  onToDateChange,

  onBack,

  showTimeOfficeBanner = true,
  showBannerHistory = false,
  showDateRange = true,

  showCategories = false,
  selectedCategories = CATEGORY_OPTIONS,
  onCategoriesChange,
  categoryOptions = [
    ...CATEGORY_OPTIONS,
    ...OTHER_CATEGORY_OPTIONS,
  ],

  showGraceTypes = false,
  graceType = "",
  onGraceTypeChange,
  graceTypeOptions = [],

  showMonthDropdown = false,
  selectedMonth = "",
  onMonthChange,
  monthOptions = [],

  showExcelLayout = false,
  selectedExcelLayout = "",
  onExcelLayoutChange,
  excelLayoutOptions = [],

  showPdfExport = true,
  showExcelExport = true,
  showRefresh = false,

  showAdvanceFilter = false,
  onAdvanceFilter,
  onShowFilters,

  onExcelExport,

  columns = [],
  rows = [],
}: TimeOfficeReportHeaderProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [isGraceTypeOpen, setIsGraceTypeOpen] = useState(false);

  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const [isExcelLayoutOpen, setIsExcelLayoutOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);

  const graceTypeRef = useRef<HTMLDivElement>(null);

  const monthRef = useRef<HTMLDivElement>(null);

  const excelLayoutRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        categoryRef.current &&
        !categoryRef.current.contains(target)
      ) {
        setIsCategoryOpen(false);
      }

      if (
        graceTypeRef.current &&
        !graceTypeRef.current.contains(target)
      ) {
        setIsGraceTypeOpen(false);
      }

      if (
        monthRef.current &&
        !monthRef.current.contains(target)
      ) {
        setIsMonthOpen(false);
      }

      if (
        excelLayoutRef.current &&
        !excelLayoutRef.current.contains(target)
      ) {
        setIsExcelLayoutOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     CATEGORY LOGIC
  ========================================================= */

  const toggleCategory = (category: string) => {
    if (!onCategoriesChange) return;

    const exists = selectedCategories.includes(category);

    if (exists) {
      onCategoriesChange(
        selectedCategories.filter(
          (item) => item !== category
        )
      );
    } else {
      onCategoriesChange([
        ...selectedCategories,
        category,
      ]);
    }
  };

  const clearCategories = () => {
    onCategoriesChange?.([]);
  };

  const selectDefaultCategories = () => {
    onCategoriesChange?.(categoryOptions);
  };

  /* =========================================================
     EXPORT DATA
  ========================================================= */

  const exportColumns =
    columns.length > 0
      ? columns
      : Object.keys(rows[0] ?? {});

  const exportDate = new Date()
    .toISOString()
    .slice(0, 10);

  const dateRangeLabel =
    fromDate && toDate
      ? `${fromDate}_${toDate}`
      : exportDate;

  /* =========================================================
     PDF EXPORT
  ========================================================= */

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation:
        exportColumns.length > 7
          ? "landscape"
          : "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(16);
    doc.text(title, 14, 15);

    const hasDateRange = Boolean(
      fromDate && toDate
    );

    const tableStartY =
      hasDateRange ? 34 : 22;

    if (hasDateRange) {
      doc.setFontSize(10);

      doc.text(
        `From Date: ${fromDate}`,
        14,
        22
      );

      doc.text(
        `To Date: ${toDate}`,
        14,
        28
      );
    }

    const tableRows = rows.map((row) =>
      exportColumns.map((column) => {
        const value = row[column];

        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          return "0";
        }

        return String(value);
      })
    );

    if (exportColumns.length > 0) {
      autoTable(doc, {
        head: [exportColumns],
        body: tableRows,
        startY: tableStartY,
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        headStyles: {
          fontSize: 7,
        },
      });
    } else {
      doc.setFontSize(10);

      doc.text(
        "No data available.",
        14,
        tableStartY
      );
    }

    doc.save(
      `${title.replace(
        /\s+/g,
        "_"
      )}_${dateRangeLabel}.pdf`
    );
  };

  /* =========================================================
     EXCEL EXPORT
  ========================================================= */

  const handleExportExcel = () => {
    const excelRows = rows.map((row) => {
      const formattedRow: Record<
        string,
        unknown
      > = {};

      exportColumns.forEach((column) => {
        const value = row[column];

        formattedRow[column] =
          value === null ||
          value === undefined ||
          value === ""
            ? "0"
            : value;
      });

      return formattedRow;
    });

    const worksheet =
      exportColumns.length > 0
        ? XLSX.utils.json_to_sheet(
            excelRows,
            {
              header: exportColumns,
            }
          )
        : XLSX.utils.aoa_to_sheet([
            ["No data available"],
          ]);

    worksheet["!cols"] =
      exportColumns.map((column) => ({
        wch: Math.max(
          column.length + 2,
          15
        ),
      }));

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Time Office"
    );

    XLSX.writeFile(
      workbook,
      `${title.replace(
        /\s+/g,
        "_"
      )}_${dateRangeLabel}.xlsx`
    );
  };

  return (
    <div className="relative z-30 w-full font-[Urbanist]">

      {/* =====================================================
          TIME OFFICE MAIN HEADER
          ===================================================== */}

      {showTimeOfficeBanner && (
        <div className="mb-3 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">
          <div className="flex min-h-[72px] items-center justify-between px-5">

            {/* TIME OFFICE TITLE */}

            <div className="flex h-[46px] shrink-0 items-center rounded-[10px] border border-[#df8f7b] bg-white px-6">
              <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
                Time Office
              </h1>
            </div>

            {/* FILTER */}

            <div className="flex shrink-0 items-center gap-2">

              <Button
                type="button"
                variant="ghost"
                title="Filter"
                onClick={onShowFilters}
                className="
                  flex
                  h-[34px]
                  w-[34px]
                  items-center
                  justify-center
                  rounded-md
                  p-0
                  text-[#3f3f3f]
                  shadow-none
                  hover:bg-[#fff0eb]
                "
              >
                <Funnel
                  size={20}
                  strokeWidth={1.8}
                />
              </Button>

              {showBannerHistory && (
                <Button
                  type="button"
                  variant="ghost"
                  title="History"
                  className="
                    flex
                    h-[34px]
                    w-[34px]
                    items-center
                    justify-center
                    rounded-md
                    p-0
                    text-[#3f3f3f]
                    shadow-none
                    hover:bg-[#fff0eb]
                  "
                >
                  <ClockFading
                    size={20}
                    strokeWidth={1.8}
                  />
                </Button>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          REPORT HEADER
          ===================================================== */}

      <div className="relative z-[100] mb-3 w-full overflow-visible rounded-[14px] border border-[#df8f7b] bg-white shadow-[0_2px_4px_rgba(15,23,42,0.06)]">

        <div className="flex min-h-[72px] w-full min-w-0 items-center gap-2 overflow-visible px-3 py-3">

          {/* REPORT TITLE */}

          <div className="flex h-[46px] shrink-0 items-center gap-2 rounded-[10px] border border-[#df8f7b] bg-[#fff8f6] px-4">

            <Clock3
              size={18}
              strokeWidth={1.8}
              className="shrink-0 text-[#9a5547]"
            />

            <h2 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-[28px] tracking-[-0.02em] text-[#9a5547]">
              {title}
            </h2>

          </div>

          {/* REPORT CONTROLS */}

          <div className="ml-auto flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">

            {/* BACK */}

            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="
                flex
                h-[42px]
                shrink-0
                items-center
                gap-2
                rounded-[8px]
                bg-[#9a5547]
                px-4
                font-[Urbanist]
                text-[12px]
                font-semibold
                leading-[16px]
                text-white
                shadow-none
                hover:bg-[#7d4438]
              "
            >
              <ChevronLeft
                size={18}
                strokeWidth={2}
              />

              <span>Back</span>
            </Button>

            {/* DATE RANGE */}

            {showDateRange && (
              <>
                <DateField
                  label="From Date"
                  value={fromDate ?? ""}
                  onChange={(value) =>
                    onFromDateChange?.(value)
                  }
                  className="
                    flex shrink-0 items-center gap-1
                    [&_label]:whitespace-nowrap
                    [&_label]:font-[Urbanist]
                    [&_label]:text-[13px]
                    [&_label]:font-medium
                    [&_label]:leading-[18px]
                    [&_input]:h-[42px]
                    [&_input]:w-[135px]
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

                <DateField
                  label="To Date"
                  value={toDate ?? ""}
                  onChange={(value) =>
                    onToDateChange?.(value)
                  }
                  className="
                    flex shrink-0 items-center gap-1
                    [&_label]:whitespace-nowrap
                    [&_label]:font-[Urbanist]
                    [&_label]:text-[13px]
                    [&_label]:font-medium
                    [&_label]:leading-[18px]
                    [&_label]:leading-[18px]
                    [&_input]:h-[42px]
                    [&_input]:w-[135px]
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
              </>
            )}

            {/* MONTH DROPDOWN */}

            {showMonthDropdown && (
              <div
                ref={monthRef}
                className="relative z-[300] shrink-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsMonthOpen(
                      (current) => !current
                    );

                    setIsGraceTypeOpen(false);
                    setIsCategoryOpen(false);
                  }}
                  className="
                    flex
                    h-[42px]
                    min-w-[165px]
                    shrink-0
                    items-center
                    justify-between
                    gap-3
                    rounded-[8px]
                    border
                    border-[#dfe3e8]
                    bg-white
                    px-3
                    font-[Urbanist]
                    text-[13px]
                    font-medium
                    text-[#344054]
                    hover:bg-[#f8fafc]
                  "
                >
                  <span>{selectedMonth}</span>

                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>

                {isMonthOpen && (
                  <div className="absolute right-0 top-[49px] z-[300] max-h-[260px] w-full overflow-y-auto rounded-[8px] border border-[#dfe3e8] bg-white py-1 shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
                    {monthOptions.map((month) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => {
                          onMonthChange?.(month);
                          setIsMonthOpen(false);
                        }}
                        className={`
                          block w-full px-4 py-2
                          text-left
                          font-[Urbanist]
                          text-[13px]
                          leading-[18px]
                          hover:bg-[#f8fafc]
                          ${
                            selectedMonth === month
                              ? "bg-[#f8fafc] font-medium text-[#9a5547]"
                              : "font-normal text-[#475467]"
                          }
                        `}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* GRACE TYPE */}

            {showGraceTypes && (
              <div
                ref={graceTypeRef}
                className="relative z-[300] shrink-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsGraceTypeOpen(
                      (current) => !current
                    );

                    setIsCategoryOpen(false);
                    setIsMonthOpen(false);
                  }}
                  className="
                    flex
                    h-[42px]
                    min-w-[155px]
                    shrink-0
                    items-center
                    justify-between
                    gap-3
                    rounded-[8px]
                    border
                    border-[#dfe3e8]
                    bg-white
                    px-3
                    font-[Urbanist]
                    text-[13px]
                    font-medium
                    text-[#344054]
                    hover:bg-[#f8fafc]
                  "
                >
                  <span>{graceType}</span>

                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                  />
                </button>

                {isGraceTypeOpen && (
                  <div className="absolute right-0 top-[49px] z-[300] w-full overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_25px_rgba(15,23,42,0.12)]">
                    {graceTypeOptions.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          onGraceTypeChange?.(type);
                          setIsGraceTypeOpen(false);
                        }}
                        className={`
                          block w-full px-4 py-2
                          text-left
                          font-[Urbanist]
                          text-[13px]
                          leading-[18px]
                          hover:bg-[#f8fafc]
                          ${
                            graceType === type
                              ? "bg-[#f8fafc] font-medium text-[#9a5547]"
                              : "font-normal text-[#475467]"
                          }
                        `}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CATEGORIES */}

            {showCategories && (
              <div
                ref={categoryRef}
                className="relative z-[300] shrink-0"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsCategoryOpen(
                      (current) => !current
                    );

                    setIsGraceTypeOpen(false);
                    setIsMonthOpen(false);
                  }}
                  className="
                    flex
                    h-[42px]
                    min-w-[125px]
                    shrink-0
                    items-center
                    justify-between
                    gap-1
                    rounded-[8px]
                    border
                    border-[#dfe3e8]
                    bg-white
                    px-2
                    font-[Urbanist]
                    text-[13px]
                    font-medium
                    text-[#344054]
                    shadow-none
                    hover:bg-[#f8fafc]
                  "
                >
                  <span>
                    Categories (
                    {selectedCategories.length}
                    )
                  </span>

                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                  />
                </Button>

                {isCategoryOpen && (
                  <div className="absolute right-0 top-[49px] z-[500] w-[300px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_25px_rgba(15,23,42,0.12)]">

                    <div className="flex items-center justify-between border-b border-[#e8ebef] px-4 py-3">
                      <span className="font-[Urbanist] text-[18px] font-bold text-[#344054]">
                        Categories
                      </span>

                      <span className="font-[Urbanist] text-[12px] font-medium text-[#98a2b3]">
                        {selectedCategories.length}{" "}
                        selected
                      </span>
                    </div>

                    <div className="max-h-[390px] overflow-y-auto py-1">
                      {categoryOptions.map(
                        (category) => (
                          <label
                            key={category}
                            className="flex cursor-pointer items-center gap-3 px-4 py-[9px] hover:bg-[#f8fafc]"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(
                                category
                              )}
                              onChange={() =>
                                toggleCategory(category)
                              }
                              className="h-[16px] w-[16px] accent-[#9a5547]"
                            />

                            <span className="font-[Urbanist] text-[13px] font-normal text-[#475467]">
                              {category}
                            </span>
                          </label>
                        )
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-[#e8ebef] px-3 py-2">

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={clearCategories}
                        className="
                          h-auto
                          px-2
                          py-1
                          font-[Urbanist]
                          text-[12px]
                          font-medium
                          text-[#98a2b3]
                          shadow-none
                          hover:bg-transparent
                          hover:text-[#475467]
                        "
                      >
                        Clear
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={
                          selectDefaultCategories
                        }
                        className="
                          h-auto
                          px-2
                          py-1
                          font-[Urbanist]
                          text-[12px]
                          font-medium
                          text-[#9a5547]
                          shadow-none
                          hover:bg-transparent
                          hover:text-[#7d4438]
                        "
                      >
                        Reset
                      </Button>

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ADVANCE FILTER */}

            {showAdvanceFilter && (
              <Button
                type="button"
                variant="ghost"
                title="Advance Filter"
                onClick={onAdvanceFilter}
                className="
                  flex
                  h-[42px]
                  shrink-0
                  items-center
                  gap-2
                  rounded-[8px]
                  bg-[#2299e8]
                  px-5
                  font-[Urbanist]
                  text-[13px]
                  font-semibold
                  leading-[16px]
                  text-white
                  shadow-none
                  hover:bg-[#1687d4]
                "
              >
                <Filter
                  size={18}
                  strokeWidth={2}
                />

                <span>Advance Filter</span>
              </Button>
            )}

            {/* PDF */}

            {showPdfExport && (
              <Button
                type="button"
                variant="ghost"
                title="Export PDF"
                onClick={handleExportPDF}
                className="
                  flex
                  h-[42px]
                  w-[32px]
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
                <FaFilePdf className="h-5 w-5" />
              </Button>
            )}

            {/* EXCEL LAYOUT + EXCEL */}

            <div className="flex shrink-0 items-center gap-1.5">

              {showExcelLayout && (
                <div
                  ref={excelLayoutRef}
                  className="relative z-[300] shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsExcelLayoutOpen(
                        (current) => !current
                      );

                      setIsCategoryOpen(false);
                      setIsGraceTypeOpen(false);
                      setIsMonthOpen(false);
                    }}
                    className="
                      relative
                      flex
                      h-[42px]
                      w-[190px]
                      shrink-0
                      items-center
                      justify-between
                      rounded-[8px]
                      border
                      border-[#2299e8]
                      bg-white
                      px-4
                      pt-1
                      font-[Urbanist]
                      text-[13px]
                      font-medium
                      text-[#344054]
                      outline-none
                      transition-colors
                      hover:bg-[#f8fafc]
                    "
                    aria-haspopup="listbox"
                    aria-expanded={isExcelLayoutOpen}
                  >
                    <span
                      className="
                        absolute
                        left-3
                        top-[-7px]
                        bg-white
                        px-1
                        font-[Urbanist]
                        text-[11px]
                        font-medium
                        leading-none
                        text-[#6f7f91]
                      "
                    >
                      Excel Layout
                    </span>

                    <span className="truncate">
                      {selectedExcelLayout}
                    </span>

                    <ChevronDown
                      size={17}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#555]"
                    />
                  </button>

                  {isExcelLayoutOpen && (
                    <div
                      role="listbox"
                      className="
                        absolute
                        right-0
                        top-[49px]
                        z-[500]
                        w-[190px]
                        overflow-hidden
                        rounded-[8px]
                        border
                        border-[#dfe3e8]
                        bg-white
                        py-1
                        shadow-[0_8px_25px_rgba(15,23,42,0.12)]
                      "
                    >
                      {excelLayoutOptions.map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={
                              selectedExcelLayout ===
                              option
                            }
                            onClick={() => {
                              onExcelLayoutChange?.(
                                option
                              );
                              setIsExcelLayoutOpen(
                                false
                              );
                            }}
                            className={`
                              block
                              w-full
                              px-4
                              py-2
                              text-left
                              font-[Urbanist]
                              text-[13px]
                              leading-[18px]
                              hover:bg-[#f8fafc]
                              ${
                                selectedExcelLayout ===
                                option
                                  ? "bg-[#f8fafc] font-medium text-[#9a5547]"
                                  : "font-normal text-[#475467]"
                              }
                            `}
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* EXCEL */}

              {showExcelExport && (
                <Button
                  type="button"
                  variant="ghost"
                  title="Export Excel"
                  onClick={
                    onExcelExport ??
                    handleExportExcel
                  }
                  className="
                    flex
                    h-[42px]
                    min-w-[42px]
                    shrink-0
                    items-center
                    justify-center
                    overflow-visible
                    rounded-[8px]
                    bg-white
                    p-0
                    text-[#35a853]
                    shadow-none
                    hover:bg-[#f1faf3]
                  "
                >
                  <FaFileExcel
                    size={22}
                    className="block overflow-visible"
                  />
                </Button>
              )}

            </div>

            {showRefresh && (
              <Button
                type="button"
                variant="ghost"
                title="History"
                className="
                  flex
                  h-[42px]
                  w-[32px]
                  shrink-0
                  items-center
                  justify-center
                  rounded-[8px]
                  bg-white
                  p-0
                  text-[#98a2b3]
                  shadow-none
                  hover:bg-[#f8fafc]
                "
              >
                <ClockFading
                  size={20}
                  strokeWidth={1.8}
                />
              </Button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}