// import {
//   ChevronDown,
//   Filter,
//   MoreVertical,
//   Search,
//   X,
// } from "lucide-react";
// import type { ReactNode } from "react";

// /* ==========================================================================
//    TYPES
//    ========================================================================== */

// export interface OpeningBalanceLeaveType {
//   id: string | number;
//   name: string;
//   shortName?: string;
//   icon?: ReactNode;
// }

// export interface OpeningBalanceRow {
//   id: string | number;
//   employeeId: string;
//   employeeName: string;
//   leaveName: string;
//   openingBalance: number;
//   adjustedBalance?: number;
//   remarks?: string;
// }

// interface OpeningBalancePanelProps {
//   /* ---------------------------------------------------------------------- */
//   /* BACKEND DATA                                                           */
//   /* ---------------------------------------------------------------------- */

//   rows?: OpeningBalanceRow[];

//   leaveTypeOptions?: Array<
//     OpeningBalanceLeaveType | string
//   >;

//   /* ---------------------------------------------------------------------- */
//   /* SELECTED ROWS                                                          */
//   /* ---------------------------------------------------------------------- */

//   selectedRowIds?: string[];

//   onSelectedRowsChange?: (
//     ids: string[],
//   ) => void;

//   /* ---------------------------------------------------------------------- */
//   /* SEARCH                                                                 */
//   /* ---------------------------------------------------------------------- */

//   search?: string;

//   onSearchChange?: (
//     value: string,
//   ) => void;

//   /* ---------------------------------------------------------------------- */
//   /* LEAVE TYPE                                                              */
//   /* ---------------------------------------------------------------------- */

//   leaveType?: string;

//   onLeaveTypeChange?: (
//     value: string,
//   ) => void;

//   /* ---------------------------------------------------------------------- */
//   /* YEAR                                                                    */
//   /* ---------------------------------------------------------------------- */

//   year?: string;

//   yearOptions?: string[];

//   onYearChange?: (
//     value: string,
//   ) => void;

//   /* ---------------------------------------------------------------------- */
//   /* BALANCE                                                                 */
//   /* ---------------------------------------------------------------------- */

//   onBalanceChange?: (
//     id: string,
//     value: number | "",
//   ) => void;

//   onRemarksChange?: (
//     id: string,
//     value: string,
//   ) => void;

//   /* ---------------------------------------------------------------------- */
//   /* ACTIONS                                                                 */
//   /* ---------------------------------------------------------------------- */

//   onSave?: () => void;

//   saving?: boolean;

//   onExcelExport?: () => void;

//   onFilterClick?: () => void;

//   onHistory?: () => void;

//   /* ---------------------------------------------------------------------- */
//   /* FILTERS                                                                 */
//   /* ---------------------------------------------------------------------- */

//   branch?: string;

//   branchOptions?: string[];

//   onBranchChange?: (
//     value: string,
//   ) => void;

//   salaryStructure?: string;

//   salaryStructureOptions?: string[];

//   onSalaryStructureChange?: (
//     value: string,
//   ) => void;

//   attendance?: string;

//   attendanceOptions?: string[];

//   onAttendanceChange?: (
//     value: string,
//   ) => void;

//   designation?: string;

//   designationOptions?: string[];

//   onDesignationChange?: (
//     value: string,
//   ) => void;

//   empStatus?: string;

//   empStatusOptions?: string[];

//   onEmpStatusChange?: (
//     value: string,
//   ) => void;

//   /* ---------------------------------------------------------------------- */
//   /* FILTER VISIBILITY                                                       */
//   /* ---------------------------------------------------------------------- */

//   showFilters?: boolean;

//   onHideFilters?: () => void;

//   /* ---------------------------------------------------------------------- */
//   /* LOADING                                                                 */
//   /* ---------------------------------------------------------------------- */

//   loading?: boolean;
// }

// /* ==========================================================================
//    SELECT FIELD
//    ========================================================================== */

// function SelectField({
//   value,
//   options,
//   onChange,
//   placeholder,
//   disabled = false,
// }: {
//   value: string;
//   options: string[];
//   onChange: (
//     value: string,
//   ) => void;
//   placeholder: string;
//   disabled?: boolean;
// }) {
//   return (
//     <div
//       className="
//         relative
//         min-w-0
//         flex-1
//       "
//     >
//       <select
//         value={value}
//         onChange={(event) =>
//           onChange(
//             event.target.value,
//           )
//         }
//         disabled={disabled}
//         className="
//           h-[38px]
//           w-full
//           min-w-0
//           appearance-none
//           border-0
//           bg-transparent
//           px-0
//           pr-5
//           font-[Urbanist]
//           text-[14px]
//           font-medium
//           text-[#697384]
//           outline-none
//           disabled:cursor-not-allowed
//           disabled:opacity-60
//         "
//       >
//         <option value="">
//           {placeholder}
//         </option>

//         {options.map((option) => (
//           <option
//             key={option}
//             value={option}
//           >
//             {option}
//           </option>
//         ))}
//       </select>

//       <ChevronDown
//         size={15}
//         strokeWidth={1.8}
//         className="
//           pointer-events-none
//           absolute
//           right-0
//           top-1/2
//           -translate-y-1/2
//           text-[#687487]
//         "
//       />
//     </div>
//   );
// }

// /* ==========================================================================
//    COMPONENT
//    ========================================================================== */

// export default function OpeningBalancePanel({
//   rows = [],

//   selectedRowIds = [],
//   onSelectedRowsChange,

//   search = "",
//   onSearchChange,

//   leaveTypeOptions = [],
//   leaveType = "",
//   onLeaveTypeChange,

//   year = "",
//   yearOptions = [],
//   onYearChange,

//   onBalanceChange,
//   onRemarksChange,

//   onSave,
//   saving = false,

//   onExcelExport,
//   onFilterClick,
//   onHistory,

//   branch = "",
//   branchOptions = [],
//   onBranchChange,

//   salaryStructure = "",
//   salaryStructureOptions = [],
//   onSalaryStructureChange,

//   attendance = "",
//   attendanceOptions = [],
//   onAttendanceChange,

//   designation = "",
//   designationOptions = [],
//   onDesignationChange,

//   empStatus = "",
//   empStatusOptions = [],
//   onEmpStatusChange,

//   showFilters = true,
//   onHideFilters,

//   loading = false,
// }: OpeningBalancePanelProps) {
//   /* ====================================================================== */
//   /* NORMALIZE BACKEND LEAVE TYPES                                          */
//   /* ====================================================================== */

//   const leaveTypes: OpeningBalanceLeaveType[] =
//     leaveTypeOptions.map((item) => {
//       if (
//         typeof item ===
//         "string"
//       ) {
//         return {
//           id: item,
//           name: item,
//           shortName: item,
//         };
//       }

//       return item;
//     });

//   /* ====================================================================== */
//   /* SEARCH                                                                  */
//   /* ====================================================================== */

//   const filteredRows =
//     rows.filter((row) => {
//       const query =
//         search
//           .trim()
//           .toLowerCase();

//       if (!query) {
//         return true;
//       }

//       return (
//         row.employeeId
//           .toLowerCase()
//           .includes(query) ||
//         row.employeeName
//           .toLowerCase()
//           .includes(query) ||
//         row.leaveName
//           .toLowerCase()
//           .includes(query)
//       );
//     });

//   /* ====================================================================== */
//   /* SELECT ALL                                                              */
//   /* ====================================================================== */

//   const allSelected =
//     filteredRows.length > 0 &&
//     filteredRows.every(
//       (row) =>
//         selectedRowIds.includes(
//           String(row.id),
//         ),
//     );

//   const toggleRow = (
//     id: string,
//   ) => {
//     if (
//       !onSelectedRowsChange
//     ) {
//       return;
//     }

//     if (
//       selectedRowIds.includes(
//         id,
//       )
//     ) {
//       onSelectedRowsChange(
//         selectedRowIds.filter(
//           (item) =>
//             item !== id,
//         ),
//       );

//       return;
//     }

//     onSelectedRowsChange([
//       ...selectedRowIds,
//       id,
//     ]);
//   };

//   const toggleAll = () => {
//     if (
//       !onSelectedRowsChange
//     ) {
//       return;
//     }

//     const visibleIds =
//       filteredRows.map(
//         (row) =>
//           String(row.id),
//       );

//     if (allSelected) {
//       onSelectedRowsChange(
//         selectedRowIds.filter(
//           (id) =>
//             !visibleIds.includes(
//               id,
//             ),
//         ),
//       );
//     } else {
//       onSelectedRowsChange(
//         Array.from(
//           new Set([
//             ...selectedRowIds,
//             ...visibleIds,
//           ]),
//         ),
//       );
//     }
//   };

//   /* ====================================================================== */
//   /* LEAVE CLICK                                                             */
//   /* ====================================================================== */

//   const handleLeaveClick = (
//     leave: OpeningBalanceLeaveType,
//   ) => {
//     onLeaveTypeChange?.(
//       String(leave.id),
//     );
//   };

//   /* ====================================================================== */
//   /* SKELETON                                                                */
//   /* ====================================================================== */

//   const skeletonRows =
//     Array.from(
//       { length: 5 },
//       (_, index) =>
//         index,
//     );

//   /* ====================================================================== */
//   /* RENDER                                                                  */
//   /* ====================================================================== */

//   return (
//     <section
//       className="
//         flex
//         min-h-0
//         w-full
//         min-w-0
//         flex-1
//         flex-col
//         overflow-visible
//         bg-transparent
//       "
//     >
//       {/* ================================================================== */}
//       {/* NOTE BAR                                                            */}
//       {/* ================================================================== */}

//       <div
//         className="
//           mb-3
//           flex
//           min-h-[47px]
//           shrink-0
//           items-center
//           justify-center
//           rounded-[7px]
//           border
//           border-[#D8E7F2]
//           bg-[#F0F8FD]
//           px-4
//           text-center
//         "
//       >
//         <span
//           className="
//             font-[Urbanist]
//             text-[15px]
//             font-medium
//             tracking-[0.1px]
//             text-[#24465B]
//           "
//         >
//           Note: Listed Employees Whose DOJ is Before
//           Payment Start Date
//         </span>
//       </div>

//       {/* ================================================================== */}
//       {/* SPACED LEAVE LIST AND EMPLOYEE CARDS                                */}
//       {/* ================================================================== */}

//       <div
//         className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-visible lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-5"
//       >
//         {/* ================================================================ */}
//         {/* LEFT LEAVE TYPES                                                  */}
//         {/* ================================================================ */}

//         <aside
//           className="max-h-[620px] min-h-[560px] overflow-y-auto overflow-x-hidden rounded-[8px] border border-[#E2E7ED] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.05)]"
//         >
//           {leaveTypes.length ===
//           0 ? (
//             <div
//               className="
//                 flex
//                 min-h-[300px]
//                 items-center
//                 justify-center
//                 px-6
//                 text-center
//               "
//             >
//               <div>
//                 <p
//                   className="
//                     font-[Urbanist]
//                     text-[15px]
//                     font-semibold
//                     text-[#596273]
//                   "
//                 >
//                   No leave types found
//                 </p>

//                 <p
//                   className="
//                     mt-1
//                     font-[Urbanist]
//                     text-[12px]
//                     text-[#929BA8]
//                   "
//                 >
//                   Leave types will appear here
//                   from the backend.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             leaveTypes.map(
//               (leave) => {
//                 const selected =
//                   String(
//                     leaveType,
//                   ) ===
//                   String(
//                     leave.id,
//                   );

//                 const firstLetter =
//                   leave.shortName?.charAt(
//                     0,
//                   ) ||
//                   leave.name.charAt(
//                     0,
//                   ) ||
//                   "L";

//                 return (
//                   <button
//                     key={String(
//                       leave.id,
//                     )}
//                     type="button"
//                     onClick={() =>
//                       handleLeaveClick(
//                         leave,
//                       )
//                     }
//                     className={`
//                       relative
//                       flex
//                       min-h-[70px]
//                       w-full
//                       items-center
//                       gap-4
//                       border-b
//                       border-[#E1E5E9]
//                       px-3
//                       text-left
//                       transition
//                       ${
//                         selected
//                           ? "bg-[#D8EBF7]"
//                           : "bg-white hover:bg-[#F7FAFC]"
//                       }
//                     `}
//                   >
//                     {/* Active blue line */}

//                     {selected && (
//                       <span
//                         className="
//                           absolute
//                           right-0
//                           top-0
//                           h-full
//                           w-[5px]
//                           rounded-l-[3px]
//                           bg-[#269BD7]
//                         "
//                       />
//                     )}

//                     {/* Leave icon */}

//                     <span
//                       className={`
//                         flex
//                         h-[34px]
//                         w-[34px]
//                         shrink-0
//                         items-center
//                         justify-center
//                         rounded-[8px]
//                         font-[Urbanist]
//                         text-[18px]
//                         font-medium
//                         ${
//                           selected
//                             ? "bg-[#EAF7FD] text-[#269BD7]"
//                             : "bg-[#E5E7E9] text-[#687180]"
//                         }
//                       `}
//                     >
//                       {leave.icon ||
//                         firstLetter}
//                     </span>

//                     {/* Leave name */}

//                     <span className="min-w-0">
//                       <span
//                         className={`
//                           block
//                           truncate
//                           font-[Urbanist]
//                           text-[16px]
//                           font-medium
//                           leading-[20px]
//                           ${
//                             selected
//                               ? "text-[#269BD7]"
//                               : "text-[#596273]"
//                           }
//                         `}
//                       >
//                         {
//                           leave.name
//                         }
//                       </span>

//                       {leave.shortName && (
//                         <span
//                           className="
//                             mt-1
//                             inline-flex
//                             rounded-[3px]
//                             bg-[#E7EBF0]
//                             px-1.5
//                             py-[2px]
//                             font-[Urbanist]
//                             text-[12px]
//                             font-medium
//                             leading-[14px]
//                             text-[#607080]
//                           "
//                         >
//                           {
//                             leave.shortName
//                           }
//                         </span>
//                       )}
//                     </span>
//                   </button>
//                 );
//               },
//             )
//           )}
//         </aside>

//         {/* ================================================================ */}
//         {/* RIGHT EMPLOYEE CARD                                               */}
//         {/* ================================================================ */}

//         <main
//           className="flex min-h-[560px] min-w-0 flex-col overflow-hidden rounded-[8px] border border-[#E2E7ED] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.05)]"
//         >
//           {/* ============================================================== */}
//           {/* FILTER BAR                                                      */}
//           {/* ============================================================== */}

//           {showFilters && (
//             <div
//               className="
//                 shrink-0
//                 border-b
//                 border-[#E1E6EB]
//                 bg-white
//                 px-4
//                 py-2
//                 m-0
//               "
//             >
//               {/* ========================================================== */}
//               {/* TOP FILTER ROW                                              */}
//               {/* ========================================================== */}

//               <div
//                 className="
//                   flex
//                   h-[38px]
//                   w-full
//                   min-w-0
//                   items-center
//                   gap-4
//                   overflow-hidden
//                   whitespace-nowrap
//                 "
//               >
//                 <SelectField
//                   value={branch}
//                   options={
//                     branchOptions
//                   }
//                   onChange={(value) =>
//                     onBranchChange?.(
//                       value,
//                     )
//                   }
//                   placeholder="Branch"
//                   disabled={loading}
//                 />

//                 <SelectField
//                   value={
//                     salaryStructure
//                   }
//                   options={
//                     salaryStructureOptions
//                   }
//                   onChange={(value) =>
//                     onSalaryStructureChange?.(
//                       value,
//                     )
//                   }
//                   placeholder="Salary Structure"
//                   disabled={loading}
//                 />

//                 <SelectField
//                   value={leaveType}
//                   options={leaveTypes.map(
//                     (leave) =>
//                       String(
//                         leave.id,
//                       ),
//                   )}
//                   onChange={(value) =>
//                     onLeaveTypeChange?.(
//                       value,
//                     )
//                   }
//                   placeholder="Leave"
//                   disabled={loading}
//                 />

//                 <SelectField
//                   value={
//                     attendance
//                   }
//                   options={
//                     attendanceOptions
//                   }
//                   onChange={(value) =>
//                     onAttendanceChange?.(
//                       value,
//                     )
//                   }
//                   placeholder="Attendance"
//                   disabled={loading}
//                 />

//                 <SelectField
//                   value={
//                     designation
//                   }
//                   options={
//                     designationOptions
//                   }
//                   onChange={(value) =>
//                     onDesignationChange?.(
//                       value,
//                     )
//                   }
//                   placeholder="Designation"
//                   disabled={loading}
//                 />

//                 <SelectField
//                   value={
//                     empStatus
//                   }
//                   options={
//                     empStatusOptions
//                   }
//                   onChange={(value) =>
//                     onEmpStatusChange?.(
//                       value,
//                     )
//                   }
//                   placeholder="Emp Status"
//                   disabled={loading}
//                 />

//                 {/* More */}

//                 <button
//                   type="button"
//                   className="
//                     flex
//                     h-[34px]
//                     w-[28px]
//                     shrink-0
//                     items-center
//                     justify-center
//                     text-[#8A98AA]
//                   "
//                   title="More filters"
//                 >
//                   <MoreVertical
//                     size={20}
//                     strokeWidth={1.8}
//                   />
//                 </button>

//                 {/* Close */}

//                 <button
//                   type="button"
//                   onClick={
//                     onHideFilters
//                   }
//                   className="
//                     flex
//                     h-[34px]
//                     w-[28px]
//                     shrink-0
//                     items-center
//                     justify-center
//                     text-[#E15353]
//                   "
//                   title="Hide filters"
//                 >
//                   <X
//                     size={21}
//                     strokeWidth={1.8}
//                   />
//                 </button>
//               </div>

//               {/* ========================================================== */}
//               {/* SEARCH ROW                                                  */}
//               {/* ========================================================== */}

//               <div
//                 className="
//                   flex
//                   h-[42px]
//                   w-full
//                   min-w-0
//                   items-center
//                   justify-between
//                   gap-4
//                   overflow-hidden
//                 "
//               >
//                 {/* Search */}

//                 <div
//                   className="
//                     relative
//                     min-w-0
//                     flex-1
//                   "
//                 >
//                   <Search
//                     size={20}
//                     strokeWidth={1.8}
//                     className="
//                       absolute
//                       left-0
//                       top-1/2
//                       -translate-y-1/2
//                       text-[#8EA3BB]
//                     "
//                   />

//                   <input
//                     value={search}
//                     onChange={(
//                       event,
//                     ) =>
//                       onSearchChange?.(
//                         event.target
//                           .value,
//                       )
//                     }
//                     placeholder="Start Typing..."
//                     className="
//                       h-[38px]
//                       w-full
//                       border-0
//                       bg-transparent
//                       pl-8
//                       pr-2
//                       font-[Urbanist]
//                       text-[14px]
//                       text-[#596273]
//                       outline-none
//                       placeholder:text-[#D2D8E1]
//                     "
//                   />
//                 </div>

//                 {/* Add Filter */}

//                 <button
//                   type="button"
//                   className="
//                     flex
//                     shrink-0
//                     items-center
//                     gap-2
//                     font-[Urbanist]
//                     text-[15px]
//                     font-medium
//                     text-[#687180]
//                   "
//                 >
//                   <span className="text-[23px] leading-none">
//                     +
//                   </span>

//                   Add Filter
//                 </button>

//                 {/* Query */}

//                 <button
//                   type="button"
//                   className="
//                     flex
//                     shrink-0
//                     items-center
//                     gap-1.5
//                     font-[Urbanist]
//                     text-[15px]
//                     font-medium
//                     text-[#687180]
//                   "
//                 >
//                   Query

//                   <ChevronDown
//                     size={16}
//                     strokeWidth={1.8}
//                   />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ============================================================== */}
//           {/* DATA AREA                                                       */}
//           {/* ============================================================== */}

//           <div
//             className="
//               min-h-0
//               flex-1
//               overflow-auto
//               bg-white
//               p-2
//             "
//           >
//             {loading ? (
//               /* ========================================================== */
//               /* LOADING                                                     */
//               /* ========================================================== */

//               <div className="space-y-5">
//                 {skeletonRows.map(
//                   (index) => (
//                     <div
//                       key={index}
//                       className="
//                         h-[68px]
//                         w-full
//                         rounded-[8px]
//                         border
//                         border-[#E5E9EF]
//                         bg-[#EEF1F7]
//                         shadow-[0_1px_3px_rgba(0,0,0,0.04)]
//                       "
//                     >
//                       <div
//                         className="
//                           h-full
//                           w-[42%]
//                           rounded-[7px]
//                           bg-gradient-to-r
//                           from-[#E7EBF2]
//                           via-[#F1F3F7]
//                           to-[#E7EBF2]
//                         "
//                       />
//                     </div>
//                   ),
//                 )}
//               </div>
//             ) : (
//               /* ========================================================== */
//               /* TABLE                                                       */
//               /* ========================================================== */

//               <section
//                 className="
//                   overflow-hidden
//                   rounded-[8px]
//                   border
//                   border-[#DDE4EA]
//                   bg-white
//                 "
//               >
//                 <div className="overflow-x-auto">
//                   <table className="min-w-[900px] w-full border-collapse">
//                     <thead>
//                       <tr className="rounded-[8px] border-b border-[#B9D7E8] bg-[#CFE5F3]">
//                         <th className="w-[45px] px-3 py-3 text-left">
//                           <input
//                             type="checkbox"
//                             checked={
//                               allSelected
//                             }
//                             onChange={
//                               toggleAll
//                             }
//                             disabled={
//                               filteredRows.length ===
//                               0
//                             }
//                             className="h-3.5 w-3.5 accent-[#269BD7]"
//                           />
//                         </th>

//                         <th className="px-3 py-4 text-left font-[Urbanist] text-[14px] font-semibold text-[#172033]">
//                           <span className="inline-flex items-center gap-2">Employee ID <Filter size={15} className="text-[#91A0B5]" /></span>
//                         </th>

//                         <th className="px-3 py-4 text-left font-[Urbanist] text-[14px] font-semibold text-[#172033]">
//                           <span className="inline-flex items-center gap-2">Employee Name <Filter size={15} className="text-[#91A0B5]" /></span>
//                         </th>

//                         <th className="px-3 py-4 text-left font-[Urbanist] text-[14px] font-semibold text-[#172033]">
//                           Leave
//                         </th>

//                         <th className="w-[160px] px-3 py-4 text-right font-[Urbanist] text-[14px] font-semibold text-[#172033]">
//                           Opening Balance
//                         </th>

//                         <th className="w-[120px] px-3 py-4 text-right font-[Urbanist] text-[14px] font-semibold text-[#172033]">
//                           Adjusted
//                         </th>

//                         <th className="w-[220px] px-3 py-4 text-left font-[Urbanist] text-[14px] font-semibold text-[#172033]">
//                           Remarks
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredRows.length ===
//                       0 ? (
//                         <tr>
//                           <td
//                             colSpan={7}
//                             className="px-4 py-16 text-center"
//                           >
//                             <img src="/no-data.png" alt="No records found" className="mx-auto h-[150px] w-[150px] object-contain" />
//                             <p className="mt-2 font-[Urbanist] text-[14px] text-[#667085]">No records found.</p>
//                           </td>
//                         </tr>
//                       ) : (
//                         filteredRows.map(
//                           (row) => {
//                             const id =
//                               String(
//                                 row.id,
//                               );

//                             const selected =
//                               selectedRowIds.includes(
//                                 id,
//                               );

//                             return (
//                               <tr
//                                 key={id}
//                                 className={`
//                                   border-b
//                                   border-[#EEF1F4]
//                                   ${
//                                     selected
//                                       ? "bg-[#F1F9FD]"
//                                       : "bg-white"
//                                   }
//                                 `}
//                               >
//                                 <td className="px-3 py-3">
//                                   <input
//                                     type="checkbox"
//                                     checked={
//                                       selected
//                                     }
//                                     onChange={() =>
//                                       toggleRow(
//                                         id,
//                                       )
//                                     }
//                                     className="h-3.5 w-3.5 accent-[#269BD7]"
//                                   />
//                                 </td>

//                                 <td className="px-3 py-3 font-[Urbanist] text-[12px] text-[#596273]">
//                                   {
//                                     row.employeeId
//                                   }
//                                 </td>

//                                 <td className="px-3 py-3 font-[Urbanist] text-[12px] font-medium text-[#424B59]">
//                                   {
//                                     row.employeeName
//                                   }
//                                 </td>

//                                 <td className="px-3 py-3 font-[Urbanist] text-[12px] text-[#667180]">
//                                   {
//                                     row.leaveName
//                                   }
//                                 </td>

//                                 <td className="px-3 py-2.5">
//                                   <input
//                                     type="number"
//                                     min={0}
//                                     step="0.5"
//                                     value={
//                                       row.openingBalance
//                                     }
//                                     disabled={
//                                       !selected
//                                     }
//                                     onChange={(
//                                       event,
//                                     ) => {
//                                       const value =
//                                         event
//                                           .target
//                                           .value;

//                                       onBalanceChange?.(
//                                         id,
//                                         value ===
//                                           ""
//                                           ? ""
//                                           : Number(
//                                               value,
//                                             ),
//                                       );
//                                     }}
//                                     className="
//                                       h-[34px]
//                                       w-full
//                                       rounded-[6px]
//                                       border
//                                       border-[#D7DFE5]
//                                       bg-white
//                                       px-2.5
//                                       text-right
//                                       font-[Urbanist]
//                                       text-[12px]
//                                       outline-none
//                                       focus:border-[#269BD7]
//                                       disabled:bg-[#F5F7F9]
//                                     "
//                                   />
//                                 </td>

//                                 <td className="px-3 py-3 text-right font-[Urbanist] text-[12px] text-[#657083]">
//                                   {
//                                     row.adjustedBalance ??
//                                     0
//                                   }
//                                 </td>

//                                 <td className="px-3 py-2.5">
//                                   <input
//                                     type="text"
//                                     value={
//                                       row.remarks ??
//                                       ""
//                                     }
//                                     disabled={
//                                       !selected
//                                     }
//                                     onChange={(
//                                       event,
//                                     ) =>
//                                       onRemarksChange?.(
//                                         id,
//                                         event
//                                           .target
//                                           .value,
//                                       )
//                                     }
//                                     placeholder="Add remarks"
//                                     className="
//                                       h-[34px]
//                                       w-full
//                                       rounded-[6px]
//                                       border
//                                       border-[#D7DFE5]
//                                       bg-white
//                                       px-2.5
//                                       font-[Urbanist]
//                                       text-[12px]
//                                       outline-none
//                                       placeholder:text-[#A5AEB9]
//                                       focus:border-[#269BD7]
//                                       disabled:bg-[#F5F7F9]
//                                     "
//                                   />
//                                 </td>
//                               </tr>
//                             );
//                           },
//                         )
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </section>
//             )}
//           </div>
//         </main>
//       </div>
//     </section>
//   );
// }


import {
  ChevronDown,
  Filter,
  MoreVertical,
  Search,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

/* ============================================================================
   TYPES
   ========================================================================== */

export interface OpeningBalanceLeaveType {
  id: number | string;
  name: string;
  shortName?: string;
  icon?: ReactNode;
}

export interface OpeningBalanceEmployee {
  id: number | string;
  employeeId: string;
  employeeName: string;
  openingBalance?: number | string | null;
  adjustedBalance?: number | string | null;
  remarks?: string | null;
}

export interface OpeningBalanceFilters {
  branch?: string;
  salaryStructure?: string;
  leave?: string;
  attendance?: string;
  designation?: string;
  empStatus?: string;
}

interface OpeningBalancePanelProps {
  /* ------------------------------------------------------------------------ */
  /* LEAVE TYPES                                                              */
  /* ------------------------------------------------------------------------ */

  leaveTypes?: OpeningBalanceLeaveType[];

  selectedLeaveId?: number | string | null;

  year?: string;

  yearOptions?: string[];

  onYearChange?: (year: string) => void;

  onLeaveChange?: (
    leaveId: number | string,
  ) => void;

  /* ------------------------------------------------------------------------ */
  /* EMPLOYEE DATA                                                            */
  /* ------------------------------------------------------------------------ */

  employees?: OpeningBalanceEmployee[];

  loading?: boolean;

  /* ------------------------------------------------------------------------ */
  /* SEARCH                                                                   */
  /* ------------------------------------------------------------------------ */

  search?: string;

  onSearchChange?: (
    value: string,
  ) => void;

  /* ------------------------------------------------------------------------ */
  /* FILTERS                                                                  */
  /* ------------------------------------------------------------------------ */

  filters?: OpeningBalanceFilters;

  branchOptions?: string[];

  salaryStructureOptions?: string[];

  attendanceOptions?: string[];

  designationOptions?: string[];

  empStatusOptions?: string[];

  onFilterChange?: (
    key: keyof OpeningBalanceFilters,
    value: string,
  ) => void;

  onClearFilters?: () => void;

  /* ------------------------------------------------------------------------ */
  /* DATA ACTIONS                                                             */
  /* ------------------------------------------------------------------------ */

  onBalanceChange?: (
    employeeId: string,
    value: number | "",
  ) => void;

  onRemarksChange?: (
    employeeId: string,
    value: string,
  ) => void;

  /* ------------------------------------------------------------------------ */
  /* FILTER VISIBILITY                                                        */
  /* ------------------------------------------------------------------------ */

  showFilters?: boolean;

  onHideFilters?: () => void;
}

/* ============================================================================
   SELECT FIELD
   ========================================================================== */

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <div
      className="
        relative
        flex
        min-w-0
        flex-1
        items-center
      "
    >
      <select
        value={value ?? ""}
        onChange={(event) =>
          onChange?.(
            event.target.value,
          )
        }
        className="
          h-[42px]
          w-full
          min-w-0
          appearance-none
          border-0
          bg-transparent
          px-0
          pr-5
          font-[Urbanist]
          text-[14px]
          font-medium
          text-[#5E6878]
          outline-none
          focus:outline-none
        "
      >
        <option value="">
          {label}
        </option>

        {(options ?? []).map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ),
        )}
      </select>

      <ChevronDown
        size={15}
        strokeWidth={1.7}
        className="
          pointer-events-none
          absolute
          right-1
          top-1/2
          -translate-y-1/2
          text-[#687487]
        "
      />
    </div>
  );
}

/* ============================================================================
   SKELETON
   ========================================================================== */

function OpeningBalanceSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from(
        { length: 5 },
        (_, index) => (
          <div
            key={index}
            className="
              h-[70px]
              rounded-[8px]
              border
              border-[#E1E6ED]
              bg-white
              p-[6px]
            "
          >
            <div
              className="
                h-full
                w-full
                rounded-[6px]
                bg-[#E7EBF3]
              "
            />
          </div>
        ),
      )}
    </div>
  );
}

/* ============================================================================
   COMPONENT
   ========================================================================== */

export default function OpeningBalancePanel({
  leaveTypes = [],

  selectedLeaveId,

  year,
  yearOptions = [],
  onYearChange,

  onLeaveChange,

  employees = [],

  loading = false,

  search = "",

  onSearchChange,

  filters = {},

  branchOptions = [],

  salaryStructureOptions = [],

  attendanceOptions = [],

  designationOptions = [],

  empStatusOptions = [],

  onFilterChange,

  onClearFilters,

  showFilters = true,

  onHideFilters,
}: OpeningBalancePanelProps) {
  /* ------------------------------------------------------------------------ */
  /* SEARCH                                                                   */
  /* ------------------------------------------------------------------------ */

  const filteredEmployees =
    employees.filter(
      (employee) => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return (
          employee.employeeId
            .toLowerCase()
            .includes(query) ||
          employee.employeeName
            .toLowerCase()
            .includes(query)
        );
      },
    );

  /* ------------------------------------------------------------------------ */
  /* SELECTED LEAVE                                                           */
  /* ------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div
      className="
        flex
        min-h-0
        w-full
        min-w-0
        flex-1
        flex-col
        bg-[#F4F8FC]
        font-[Urbanist]
      "
    >
      {/* ================================================================== */}
      {/* NOTE                                                                */}
      {/* ================================================================== */}

      <div
        className="
          mb-3
          flex
          min-h-[48px]
          shrink-0
          items-center
          justify-center
          rounded-[7px]
          border
          border-[#D6E6F1]
          bg-[#EFF8FE]
          px-4
          text-center
        "
      >
        <span
          className="
            font-[Urbanist]
            text-[16px]
            font-medium
            text-[#244A60]
          "
        >
          Note: Listed Employees Whose DOJ is
          Before Payment Start Date
        </span>
      </div>

      {/* ================================================================== */}
      {/* MAIN AREA                                                           */}
      {/* ================================================================== */}

      <div
        className="
          flex
          min-h-0
          flex-1
          gap-3
          overflow-hidden
        "
      >
        {/* ================================================================ */}
        {/* LEFT LEAVE TYPES                                                 */}
        {/* ================================================================ */}

        <aside
          className="
            hidden
            w-[368px]
            shrink-0
            overflow-hidden
            rounded-[8px]
            border
            border-[#DCE4EC]
            bg-white
            lg:block
          "
        >
          <div
            className="
              h-full
              overflow-y-auto
              overflow-x-hidden
            "
          >
            {leaveTypes.length ===
            0 ? (
              <div
                className="
                  flex
                  h-full
                  min-h-[400px]
                  items-center
                  justify-center
                  px-5
                  text-center
                "
              >
                <span
                  className="
                    font-[Urbanist]
                    text-[15px]
                    text-[#667085]
                  "
                >
                  No leave types found.
                </span>
              </div>
            ) : (
              leaveTypes.map(
                (leave) => {
                  const isActive =
                    String(
                      selectedLeaveId,
                    ) ===
                    String(
                      leave.id,
                    );

                  const iconLetter =
                    leave.shortName?.charAt(
                      0,
                    ) ||
                    leave.name.charAt(
                      0,
                    ) ||
                    "L";

                  return (
                    <button
                      key={String(
                        leave.id,
                      )}
                      type="button"
                      onClick={() =>
                        onLeaveChange?.(
                          leave.id,
                        )
                      }
                      className={`
                        relative
                        flex
                        min-h-[70px]
                        w-full
                        items-center
                        gap-4
                        border-b
                        border-[#E0E5EA]
                        px-3
                        text-left
                        transition
                        ${
                          isActive
                            ? "bg-[#D6EBF8]"
                            : "bg-white hover:bg-[#F7FAFC]"
                        }
                      `}
                    >
                      {/* ACTIVE LINE */}

                      {isActive && (
                        <span
                          className="
                            absolute
                            right-0
                            top-0
                            h-full
                            w-[5px]
                            bg-[#269BD7]
                          "
                        />
                      )}

                      {/* ICON */}

                      <span
                        className={`
                          flex
                          h-[34px]
                          w-[34px]
                          shrink-0
                          items-center
                          justify-center
                          rounded-[8px]
                          font-[Urbanist]
                          text-[18px]
                          font-medium
                          ${
                            isActive
                              ? "bg-[#E5F5FD] text-[#269BD7]"
                              : "bg-[#E3E5E7] text-[#657180]"
                          }
                        `}
                      >
                        {leave.icon ??
                          iconLetter}
                      </span>

                      {/* NAME */}

                      <span className="min-w-0">
                        <span
                          className={`
                            block
                            truncate
                            font-[Urbanist]
                            text-[16px]
                            font-medium
                            leading-[20px]
                            ${
                              isActive
                                ? "text-[#269BD7]"
                                : "text-[#536071]"
                            }
                          `}
                        >
                          {
                            leave.name
                          }
                        </span>

                        {leave.shortName && (
                          <span
                            className="
                              mt-1
                              inline-flex
                              rounded-[3px]
                              bg-[#E7EBF0]
                              px-1.5
                              py-[2px]
                              font-[Urbanist]
                              text-[12px]
                              font-medium
                              leading-[14px]
                              text-[#637083]
                            "
                          >
                            {
                              leave.shortName
                            }
                          </span>
                        )}
                      </span>
                    </button>
                  );
                },
              )
            )}
          </div>
        </aside>

        {/* ================================================================ */}
        {/* RIGHT CONTENT                                                    */}
        {/* ================================================================ */}

        <main
          className="
            flex
            min-h-0
            min-w-0
            flex-1
            flex-col
            overflow-hidden
          "
        >
          {/* ============================================================== */}
          {/* FILTER CARD                                                    */}
          {/* ============================================================== */}

          {showFilters && (
            <section
              className="
                mb-3
                shrink-0
                overflow-hidden
                rounded-[8px]
                border
                border-[#DCE4EC]
                bg-white
              "
            >
              {/* TOP FILTERS */}

              <div
                className="
                  flex
                  min-h-[48px]
                  w-full
                  min-w-0
                  flex-wrap
                  items-center
                  gap-4
                  py-1
                  border-b
                  border-[#E2E7EC]
                  px-4
                "
              >
                <FilterSelect
                  label="Branch"
                  value={
                    filters.branch
                  }
                  options={
                    branchOptions
                  }
                  onChange={(value) =>
                    onFilterChange?.(
                      "branch",
                      value,
                    )
                  }
                />

                <FilterSelect
                  label="Salary Structure"
                  value={
                    filters.salaryStructure
                  }
                  options={
                    salaryStructureOptions
                  }
                  onChange={(value) =>
                    onFilterChange?.(
                      "salaryStructure",
                      value,
                    )
                  }
                />

                <FilterSelect
                  label="Leave"
                  value={
                    filters.leave
                  }
                  options={leaveTypes.map(
                    (leave) =>
                      leave.name,
                  )}
                  onChange={(value) =>
                    onFilterChange?.(
                      "leave",
                      value,
                    )
                  }
                />

                <FilterSelect
                  label="Attendance"
                  value={
                    filters.attendance
                  }
                  options={
                    attendanceOptions
                  }
                  onChange={(value) =>
                    onFilterChange?.(
                      "attendance",
                      value,
                    )
                  }
                />

                <FilterSelect
                  label="Designation"
                  value={
                    filters.designation
                  }
                  options={
                    designationOptions
                  }
                  onChange={(value) =>
                    onFilterChange?.(
                      "designation",
                      value,
                    )
                  }
                />

                <FilterSelect
                  label="Emp Status"
                  value={
                    filters.empStatus
                  }
                  options={
                    empStatusOptions
                  }
                  onChange={(value) =>
                    onFilterChange?.(
                      "empStatus",
                      value,
                    )
                  }
                />

                <FilterSelect
                  label="Year"
                  value={year}
                  options={yearOptions}
                  onChange={onYearChange}
                />

                {/* MORE */}

                <button
                  type="button"
                  className="
                    flex
                    h-[34px]
                    w-[28px]
                    shrink-0
                    items-center
                    justify-center
                    text-[#8A98AA]
                  "
                >
                  <MoreVertical
                    size={20}
                    strokeWidth={1.8}
                  />
                </button>

                {/* CLEAR */}

                <button
                  type="button"
                  onClick={() => {
                    onClearFilters?.();
                    onHideFilters?.();
                  }}
                  className="
                    flex
                    h-[34px]
                    w-[28px]
                    shrink-0
                    items-center
                    justify-center
                    text-[#EF5350]
                  "
                  title="Clear filters"
                >
                  <X
                    size={21}
                    strokeWidth={1.8}
                  />
                </button>
              </div>

              {/* SEARCH */}

              <div
                className="
                  flex
                  h-[54px]
                  items-center
                  justify-between
                  gap-4
                  px-4
                "
              >
                <div
                  className="
                    relative
                    min-w-0
                    flex-1
                  "
                >
                  <Search
                    size={21}
                    strokeWidth={1.7}
                    className="
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2
                      text-[#8EA4BC]
                    "
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      onSearchChange?.(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Start Typing..."
                    className="
                      h-[42px]
                      w-full
                      border-0
                      bg-transparent
                      pl-8
                      pr-2
                      font-[Urbanist]
                      text-[14px]
                      text-[#536071]
                      outline-none
                      placeholder:text-[#D0D8E2]
                    "
                  />
                </div>

                {/* ADD FILTER */}

                <button
                  type="button"
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    font-[Urbanist]
                    text-[15px]
                    font-medium
                    text-[#596273]
                  "
                >
                  <span className="text-[23px] leading-none">
                    +
                  </span>

                  Add Filter
                </button>

                {/* QUERY */}

                <button
                  type="button"
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    font-[Urbanist]
                    text-[15px]
                    font-medium
                    text-[#596273]
                  "
                >
                  Query

                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
              </div>
            </section>
          )}

          {/* ============================================================== */}
          {/* DATA / SKELETON CARD                                           */}
          {/* ============================================================== */}

          <section
            className="
              min-h-0
              flex-1
              overflow-auto
            "
          >
            {loading ? (
              <OpeningBalanceSkeleton />
            ) : (
              <div
                className="
                  min-w-0
                  overflow-hidden
                  rounded-[8px]
                  bg-transparent
                "
              >
                {/* ====================================================== */}
                {/* TABLE HEADER                                             */}
                {/* ====================================================== */}

                <div
                  className="
                    grid
                    min-h-[66px]
                    grid-cols-[1.1fr_1.6fr_1fr_1fr_90px]
                    items-center
                    rounded-[8px]
                    bg-[#D1E7F5]
                    px-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      font-[Urbanist]
                      text-[14px]
                      font-semibold
                      text-[#25364A]
                    "
                  >
                    Employee ID

                    <Filter
                      size={16}
                      strokeWidth={1.7}
                      className="text-[#91A6BA]"
                    />
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      font-[Urbanist]
                      text-[14px]
                      font-semibold
                      text-[#25364A]
                    "
                  >
                    Employee Name

                    <Filter
                      size={16}
                      strokeWidth={1.7}
                      className="text-[#91A6BA]"
                    />
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-center
                      font-[Urbanist]
                      text-[14px]
                      font-semibold
                      text-[#25364A]
                    "
                  >
                    Opening Balance

                    <Filter
                      size={16}
                      strokeWidth={1.7}
                      className="text-[#91A6BA]"
                    />
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      text-center
                      font-[Urbanist]
                      text-[14px]
                      font-semibold
                      text-[#25364A]
                    "
                  >
                    Adjusted

                    <Filter
                      size={16}
                      strokeWidth={1.7}
                      className="text-[#91A6BA]"
                    />
                  </div>

                  <div
                    className="
                      text-center
                      font-[Urbanist]
                      text-[14px]
                      font-semibold
                      text-[#25364A]
                    "
                  >
                    Action
                  </div>
                </div>

                {/* ====================================================== */}
                {/* ROWS                                                     */}
                {/* ====================================================== */}

                <div
                  className="
                    mt-2
                    overflow-hidden
                    rounded-[8px]
                    border
                    border-[#EDF0F4]
                    bg-white
                  "
                >
                  {filteredEmployees.length ===
                  0 ? (
                    <div
                      className="
                        flex
                        min-h-[360px]
                        flex-col
                        items-center
                        justify-center
                        bg-white
                      "
                    >
                      <img
                        src="/no-data.png"
                        alt="No records"
                        className="
                          h-[100px]
                          w-[100px]
                          object-contain
                        "
                        onError={(
                          event,
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <p
                        className="
                          mt-4
                          font-[Urbanist]
                          text-[14px]
                          font-medium
                          text-[#667085]
                        "
                      >
                        No records found.
                      </p>
                    </div>
                  ) : (
                    filteredEmployees.map(
                      (employee) => (
                        <div
                          key={String(
                            employee.id,
                          )}
                          className="
                            grid
                            min-h-[62px]
                            grid-cols-[1.1fr_1.6fr_1fr_1fr_90px]
                            items-center
                            border-b
                            border-[#EDF0F3]
                            px-4
                            last:border-b-0
                          "
                        >
                          <span
                            className="
                              truncate
                              font-[Urbanist]
                              text-[13px]
                              text-[#596273]
                            "
                          >
                            {
                              employee.employeeId
                            }
                          </span>

                          <span
                            className="
                              truncate
                              font-[Urbanist]
                              text-[13px]
                              font-medium
                              text-[#424B59]
                            "
                          >
                            {
                              employee.employeeName
                            }
                          </span>

                          <span
                            className="
                              text-center
                              font-[Urbanist]
                              text-[13px]
                              text-[#596273]
                            "
                          >
                            {
                              employee.openingBalance ??
                              0
                            }
                          </span>

                          <span
                            className="
                              text-center
                              font-[Urbanist]
                              text-[13px]
                              text-[#596273]
                            "
                          >
                            {
                              employee.adjustedBalance ??
                              0
                            }
                          </span>

                          <div
                            className="
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <button
                              type="button"
                              className="
                                rounded-[5px]
                                px-2
                                py-1
                                font-[Urbanist]
                                text-[12px]
                                font-medium
                                text-[#269BD7]
                                hover:bg-[#EEF8FD]
                              "
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
