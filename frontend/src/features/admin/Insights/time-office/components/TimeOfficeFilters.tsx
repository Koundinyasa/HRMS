// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import {
//   ChevronDown,
//   MoreVertical,
//   Plus,
//   Search,
//   X,
// } from "lucide-react";

// interface TimeOfficeFiltersProps {
//   fromDate: string;
//   toDate: string;
//   employeeId: string;
//   employeeName: string;

//   onFromDateChange: (value: string) => void;
//   onToDateChange: (value: string) => void;
//   onEmployeeIdChange: (value: string) => void;
//   onEmployeeNameChange: (value: string) => void;

//   onSearch: () => void;
//   onReset: () => void;
//   onHideFilters?: () => void;
//   showFilters?: boolean;
//   showDayWiseDropdownOptions?: boolean;
// }

// type DropdownType =
//   | "query"
//   | "policy"
//   | "pattern"
//   | "supervisor"
//   | "attendance"
//   | "leave"
//   | null;

// export default function TimeOfficeFilters({
//   showDayWiseDropdownOptions = false,
//   onHideFilters,
//   showFilters = true,
// }: TimeOfficeFiltersProps) {
//   const [openDropdown, setOpenDropdown] =
//     useState<DropdownType>(null);

//   const [searchText, setSearchText] = useState("");

//   const [selectedOptions, setSelectedOptions] = useState<
//     Record<string, string[]>
//   >({});

//   /* =========================================================
//      DROPDOWN TOGGLE
//   ========================================================= */

//   const toggleDropdown = (dropdown: DropdownType) => {
//     setOpenDropdown((current) =>
//       current === dropdown ? null : dropdown
//     );
//   };

//   /* =========================================================
//      CLOSE DROPDOWN
//   ========================================================= */

//   const closeDropdown = () => {
//     setOpenDropdown(null);
//   };

//   /* =========================================================
//      OPTION TOGGLE
//   ========================================================= */

//   const toggleOption = (
//     dropdown: Exclude<DropdownType, null>,
//     option: string
//   ) => {
//     setSelectedOptions((current) => {
//       const selected = current[dropdown] ?? [];

//       const next = selected.includes(option)
//         ? selected.filter((value) => value !== option)
//         : [...selected, option];

//       return {
//         ...current,
//         [dropdown]: next,
//       };
//     });
//   };

//   /* =========================================================
//      CLEAR DROPDOWN
//   ========================================================= */

//   const clearDropdown = (
//     dropdown: Exclude<DropdownType, null>
//   ) => {
//     setSelectedOptions((current) => ({
//       ...current,
//       [dropdown]: [],
//     }));

//     closeDropdown();
//   };

//   /* =========================================================
//      COMMON STYLES
//   ========================================================= */

//   const dropdownButtonClass =
//     "flex h-[40px] items-center gap-1 whitespace-nowrap rounded-[8px] border border-[#dfe3e8] bg-white px-3 font-[Urbanist] text-[13px] font-medium leading-[18px] text-[#202124] shadow-none transition-colors hover:bg-[#f8fafc] hover:text-[#202124]";

//   // Left / normal dropdowns
//   const dropdownMenuClass =
//     "absolute left-0 top-[45px] z-[100] w-[205px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]";

//   // Right-side dropdowns open toward the left
//   const rightDropdownMenuClass =
//     "absolute right-0 top-[45px] z-[100] w-[205px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]";

//   const optionClass =
//     "flex min-h-[48px] cursor-pointer items-center gap-3 border-b border-[#e8ebef] px-4 transition-colors hover:bg-[#f8fafc]";

//   const optionTextClass =
//     "font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#475467]";

//   const clearButtonClass =
//     "flex h-[42px] w-full items-center justify-center gap-2 font-[Urbanist] text-[12px] font-medium leading-[16px] text-[#98a2b3] shadow-none hover:bg-[#f8fafc]";

//   return (
//     <div
//       className={`mb-3 w-full font-[Urbanist] ${
//         showFilters ? "" : "hidden"
//       }`}
//     >
//       {/* =====================================================
//           FILTER BAR
//           ===================================================== */}

//       <div className="relative z-20 flex min-h-[58px] w-full flex-wrap items-center gap-2 rounded-[12px] border border-[#dfe3e8] bg-white px-3 py-2 shadow-[0_2px_4px_rgba(15,23,42,0.06)] sm:flex-nowrap sm:px-4 sm:py-2">

//         {/* ===================================================
//             SEARCH
//         =================================================== */}

//         <div className="flex h-[40px] min-w-[180px] flex-1 items-center rounded-[8px] border border-[#dfe3e8] bg-white px-3">
//           <Search
//             size={18}
//             strokeWidth={1.8}
//             className="mr-2 shrink-0 text-[#8b9ab0]"
//           />

//           <input
//             type="text"
//             value={searchText}
//             onChange={(e) =>
//               setSearchText(e.target.value)
//             }
//             placeholder="Search ..."
//             className="w-full border-none bg-transparent font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054] outline-none placeholder:text-[#98a2b3]"
//           />
//         </div>

//         {/* ===================================================
//             ADD FILTER
//         =================================================== */}

//         <Button
//           variant="ghost"
//           type="button"
//           className="flex h-[40px] shrink-0 items-center gap-2 rounded-[8px] border border-[#12b76a] bg-white px-3 font-[Urbanist] text-[13px] font-medium leading-[18px] text-[#344054] shadow-none transition-colors hover:bg-[#f6fffa] hover:text-[#344054]"
//         >
//           <Plus
//             size={16}
//             strokeWidth={1.8}
//             className="text-[#12b76a]"
//           />

//           <span>Add Filter</span>
//         </Button>

//         {/* ===================================================
//             QUERY
//         =================================================== */}

//         <div className="relative shrink-0">
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={() =>
//               toggleDropdown("query")
//             }
//             className={dropdownButtonClass}
//           >
//             <span>Query</span>

//             <ChevronDown
//               size={14}
//               strokeWidth={1.8}
//               className={`transition-transform ${
//                 openDropdown === "query"
//                   ? "rotate-180"
//                   : ""
//               }`}
//             />
//           </Button>

//           {openDropdown === "query" && (
//             <div className={dropdownMenuClass}>
//               <label className={optionClass}>
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions.query?.includes(
//                       "Query"
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(
//                       "query",
//                       "Query"
//                     )
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   Query
//                 </span>
//               </label>

//               <Button
//                 variant="ghost"
//                 type="button"
//                 onClick={() =>
//                   clearDropdown("query")
//                 }
//                 className={clearButtonClass}
//               >
//                 <X size={14} />
//                 Clear
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* ===================================================
//             T&A POLICY
//         =================================================== */}

//         <div className="relative shrink-0">
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={() =>
//               toggleDropdown("policy")
//             }
//             className={dropdownButtonClass}
//           >
//             <span>T&A Policy</span>

//             <ChevronDown
//               size={14}
//               strokeWidth={1.8}
//               className={`transition-transform ${
//                 openDropdown === "policy"
//                   ? "rotate-180"
//                   : ""
//               }`}
//             />
//           </Button>

//           {openDropdown === "policy" && (
//             <div className={dropdownMenuClass}>
//               <label className={optionClass}>
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions.policy?.includes(
//                       "T&A Policy"
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(
//                       "policy",
//                       "T&A Policy"
//                     )
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   T&A Policy
//                 </span>
//               </label>

//               {showDayWiseDropdownOptions && (
//                 <label className={optionClass}>
//                   <input
//                     type="checkbox"
//                     checked={
//                       selectedOptions.policy?.includes(
//                         "General Policy"
//                       ) ?? false
//                     }
//                     onChange={() =>
//                       toggleOption(
//                         "policy",
//                         "General Policy"
//                       )
//                     }
//                     className="h-[16px] w-[16px] accent-[#9a5547]"
//                   />

//                   <span className={optionTextClass}>
//                     General Policy
//                   </span>
//                 </label>
//               )}

//               <Button
//                 variant="ghost"
//                 type="button"
//                 onClick={() =>
//                   clearDropdown("policy")
//                 }
//                 className={clearButtonClass}
//               >
//                 <X size={14} />
//                 Clear
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* ===================================================
//             PATTERN
//         =================================================== */}

//         <div className="relative shrink-0">
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={() =>
//               toggleDropdown("pattern")
//             }
//             className={dropdownButtonClass}
//           >
//             <span>Pattern</span>

//             <ChevronDown
//               size={14}
//               strokeWidth={1.8}
//               className={`transition-transform ${
//                 openDropdown === "pattern"
//                   ? "rotate-180"
//                   : ""
//               }`}
//             />
//           </Button>

//           {openDropdown === "pattern" && (
//             <div className={dropdownMenuClass}>
//               <label className={optionClass}>
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions.pattern?.includes(
//                       "Pattern"
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(
//                       "pattern",
//                       "Pattern"
//                     )
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   Pattern
//                 </span>
//               </label>

//               <Button
//                 variant="ghost"
//                 type="button"
//                 onClick={() =>
//                   clearDropdown("pattern")
//                 }
//                 className={clearButtonClass}
//               >
//                 <X size={14} />
//                 Clear
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* ===================================================
//             TA SUPERVISOR
//         =================================================== */}

//         <div className="relative shrink-0">
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={() =>
//               toggleDropdown("supervisor")
//             }
//             className={dropdownButtonClass}
//           >
//             <span>TA Supervisor</span>

//             <ChevronDown
//               size={14}
//               strokeWidth={1.8}
//               className={`transition-transform ${
//                 openDropdown === "supervisor"
//                   ? "rotate-180"
//                   : ""
//               }`}
//             />
//           </Button>

//           {openDropdown === "supervisor" && (
//             <div className={dropdownMenuClass}>
//               <label className={optionClass}>
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions.supervisor?.includes(
//                       "TA Supervisor"
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(
//                       "supervisor",
//                       "TA Supervisor"
//                     )
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   TA Supervisor
//                 </span>
//               </label>

//               <Button
//                 variant="ghost"
//                 type="button"
//                 onClick={() =>
//                   clearDropdown("supervisor")
//                 }
//                 className={clearButtonClass}
//               >
//                 <X size={14} />
//                 Clear
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* ===================================================
//             ATTENDANCE
//         =================================================== */}

//         <div className="relative shrink-0">
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={() =>
//               toggleDropdown("attendance")
//             }
//             className={dropdownButtonClass}
//           >
//             <span>Attendance</span>

//             <ChevronDown
//               size={14}
//               strokeWidth={1.8}
//               className={`transition-transform ${
//                 openDropdown === "attendance"
//                   ? "rotate-180"
//                   : ""
//               }`}
//             />
//           </Button>

//           {openDropdown === "attendance" && (
//             <div className={rightDropdownMenuClass}>
//               <label className={optionClass}>
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions.attendance?.includes(
//                       "Attendance"
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(
//                       "attendance",
//                       "Attendance"
//                     )
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   Attendance
//                 </span>
//               </label>

//               <label className={optionClass}>
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions.attendance?.includes(
//                       "Daily"
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(
//                       "attendance",
//                       "Daily"
//                     )
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   Daily
//                 </span>
//               </label>

//               <Button
//                 variant="ghost"
//                 type="button"
//                 onClick={() =>
//                   clearDropdown("attendance")
//                 }
//                 className={clearButtonClass}
//               >
//                 <X size={14} />
//                 Clear
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* ===================================================
//             LEAVE
//         =================================================== */}

//         <div className="relative shrink-0">
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={() =>
//               toggleDropdown("leave")
//             }
//             className={dropdownButtonClass}
//           >
//             <span>Leave</span>

//             <ChevronDown
//               size={14}
//               strokeWidth={1.8}
//               className={`transition-transform ${
//                 openDropdown === "leave"
//                   ? "rotate-180"
//                   : ""
//               }`}
//             />
//           </Button>

//           {openDropdown === "leave" && (
//             <div className={rightDropdownMenuClass}>
//               <label className={optionClass}>
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions.leave?.includes(
//                       "Leave"
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(
//                       "leave",
//                       "Leave"
//                     )
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   Leave
//                 </span>
//               </label>

//               {showDayWiseDropdownOptions && (
//                 <>
//                   <label className={optionClass}>
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedOptions.leave?.includes(
//                           "Employee Leave Policy"
//                         ) ?? false
//                       }
//                       onChange={() =>
//                         toggleOption(
//                           "leave",
//                           "Employee Leave Policy"
//                         )
//                       }
//                       className="h-[16px] w-[16px] accent-[#9a5547]"
//                     />

//                     <span className={optionTextClass}>
//                       Employee Leave Policy
//                     </span>
//                   </label>

//                   <label className={optionClass}>
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedOptions.leave?.includes(
//                           "Intern Leave Policy"
//                         ) ?? false
//                       }
//                       onChange={() =>
//                         toggleOption(
//                           "leave",
//                           "Intern Leave Policy"
//                         )
//                       }
//                       className="h-[16px] w-[16px] accent-[#9a5547]"
//                     />

//                     <span className={optionTextClass}>
//                       Intern Leave Policy
//                     </span>
//                   </label>
//                 </>
//               )}

//               <Button
//                 variant="ghost"
//                 type="button"
//                 onClick={() =>
//                   clearDropdown("leave")
//                 }
//                 className={clearButtonClass}
//               >
//                 <X size={14} />
//                 Clear
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* ===================================================
//             RIGHT ACTIONS
//         =================================================== */}

//         <div className="ml-auto flex shrink-0 items-center gap-1">

//           {/* More */}

//           <Button
//             variant="ghost"
//             type="button"
//             className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] p-0 font-[Urbanist] text-[12px] font-medium text-[#9ba6b8] shadow-none hover:bg-[#f8fafc] hover:text-[#667085]"
//             title="More"
//           >
//             <MoreVertical
//               size={18}
//               strokeWidth={1.8}
//             />
//           </Button>

//           {/* Close */}

//           <Button
//             variant="ghost"
//             type="button"
//             onClick={onHideFilters}
//             className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] p-0 font-[Urbanist] text-[12px] font-medium text-[#ff3838] shadow-none hover:bg-[#fff5f5] hover:text-[#ff3838]"
//             title="Close"
//           >
//             <X
//               size={17}
//               strokeWidth={1.8}
//             />
//           </Button>

//         </div>
//       </div>
//     </div>
//   );
// }

// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import {
//   ChevronDown,
//   MoreVertical,
//   Plus,
//   Search,
//   X,
// } from "lucide-react";

// interface TimeOfficeFiltersProps {
//   fromDate: string;
//   toDate: string;
//   employeeId: string;
//   employeeName: string;

//   onFromDateChange: (value: string) => void;
//   onToDateChange: (value: string) => void;
//   onEmployeeIdChange: (value: string) => void;
//   onEmployeeNameChange: (value: string) => void;

//   onSearch: () => void;
//   onReset: () => void;

//   onHideFilters?: () => void;
//   showFilters?: boolean;

//   showDayWiseDropdownOptions?: boolean;

//   /**
//    * default:
//    * Query | T&A Policy | Pattern | TA Supervisor | Attendance | Leave
//    *
//    * penaltyLeaveAdjustment:
//    * Query | Branch | Salary Structure | Leave | Attendance |
//    * Designation | Emp Status
//    */
//   filterVariant?: "default" | "penaltyLeaveAdjustment";
// }

// type DropdownType =
//   | "query"
//   | "policy"
//   | "pattern"
//   | "supervisor"
//   | "attendance"
//   | "leave"
//   | "branch"
//   | "salaryStructure"
//   | "designation"
//   | "empStatus"
//   | null;

// export default function TimeOfficeFilters({
//   showDayWiseDropdownOptions = false,
//   onHideFilters,
//   showFilters = true,
//   filterVariant = "default",
// }: TimeOfficeFiltersProps) {
//   const [openDropdown, setOpenDropdown] =
//     useState<DropdownType>(null);

//   const [searchText, setSearchText] = useState("");

//   const [selectedOptions, setSelectedOptions] = useState<
//     Record<string, string[]>
//   >({});

//   /* =========================================================
//      DROPDOWN TOGGLE
//   ========================================================= */

//   const toggleDropdown = (dropdown: DropdownType) => {
//     setOpenDropdown((current) =>
//       current === dropdown ? null : dropdown
//     );
//   };

//   /* =========================================================
//      CLOSE DROPDOWN
//   ========================================================= */

//   const closeDropdown = () => {
//     setOpenDropdown(null);
//   };

//   /* =========================================================
//      OPTION TOGGLE
//   ========================================================= */

//   const toggleOption = (
//     dropdown: Exclude<DropdownType, null>,
//     option: string
//   ) => {
//     setSelectedOptions((current) => {
//       const selected = current[dropdown] ?? [];

//       const next = selected.includes(option)
//         ? selected.filter((value) => value !== option)
//         : [...selected, option];

//       return {
//         ...current,
//         [dropdown]: next,
//       };
//     });
//   };

//   /* =========================================================
//      CLEAR DROPDOWN
//   ========================================================= */

//   const clearDropdown = (
//     dropdown: Exclude<DropdownType, null>
//   ) => {
//     setSelectedOptions((current) => ({
//       ...current,
//       [dropdown]: [],
//     }));

//     closeDropdown();
//   };

//   /* =========================================================
//      COMMON STYLES
//   ========================================================= */

//   const dropdownButtonClass =
//     "flex h-[40px] items-center gap-1 whitespace-nowrap rounded-[8px] border border-[#dfe3e8] bg-white px-3 font-[Urbanist] text-[13px] font-medium leading-[18px] text-[#202124] shadow-none transition-colors hover:bg-[#f8fafc] hover:text-[#202124]";

//   const dropdownMenuClass =
//     "absolute left-0 top-[45px] z-[100] w-[205px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]";

//   const rightDropdownMenuClass =
//     "absolute right-0 top-[45px] z-[100] w-[205px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]";

//   const optionClass =
//     "flex min-h-[48px] cursor-pointer items-center gap-3 border-b border-[#e8ebef] px-4 transition-colors hover:bg-[#f8fafc]";

//   const optionTextClass =
//     "font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#475467]";

//   const clearButtonClass =
//     "flex h-[42px] w-full items-center justify-center gap-2 font-[Urbanist] text-[12px] font-medium leading-[16px] text-[#98a2b3] shadow-none hover:bg-[#f8fafc]";

//   /* =========================================================
//      GENERIC DROPDOWN
//   ========================================================= */

//   const renderDropdown = (
//     key: Exclude<DropdownType, null>,
//     label: string,
//     options: string[],
//     alignRight = false
//   ) => {
//     const isOpen = openDropdown === key;

//     return (
//       <div
//         key={key}
//         className="relative shrink-0"
//       >
//         <Button
//           variant="ghost"
//           type="button"
//           onClick={() => toggleDropdown(key)}
//           className={dropdownButtonClass}
//         >
//           <span>{label}</span>

//           <ChevronDown
//             size={14}
//             strokeWidth={1.8}
//             className={`transition-transform ${
//               isOpen ? "rotate-180" : ""
//             }`}
//           />
//         </Button>

//         {isOpen && (
//           <div
//             className={
//               alignRight
//                 ? rightDropdownMenuClass
//                 : dropdownMenuClass
//             }
//           >
//             {options.map((option) => (
//               <label
//                 key={option}
//                 className={optionClass}
//               >
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedOptions[key]?.includes(
//                       option
//                     ) ?? false
//                   }
//                   onChange={() =>
//                     toggleOption(key, option)
//                   }
//                   className="h-[16px] w-[16px] accent-[#9a5547]"
//                 />

//                 <span className={optionTextClass}>
//                   {option}
//                 </span>
//               </label>
//             ))}

//             <Button
//               variant="ghost"
//               type="button"
//               onClick={() => clearDropdown(key)}
//               className={clearButtonClass}
//             >
//               <X size={14} />
//               Clear
//             </Button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   /* =========================================================
//      DEFAULT DROPDOWNS
//   ========================================================= */

//   const renderDefaultDropdowns = () => (
//     <>
//       {renderDropdown(
//         "query",
//         "Query",
//         ["Query"]
//       )}

//       {renderDropdown(
//         "policy",
//         "T&A Policy",
//         showDayWiseDropdownOptions
//           ? ["T&A Policy", "General Policy"]
//           : ["T&A Policy"]
//       )}

//       {renderDropdown(
//         "pattern",
//         "Pattern",
//         ["Pattern"]
//       )}

//       {renderDropdown(
//         "supervisor",
//         "TA Supervisor",
//         ["TA Supervisor"]
//       )}

//       {renderDropdown(
//         "attendance",
//         "Attendance",
//         ["Attendance", "Daily"]
//       )}

//       {renderDropdown(
//         "leave",
//         "Leave",
//         showDayWiseDropdownOptions
//           ? [
//               "Leave",
//               "Employee Leave Policy",
//               "Intern Leave Policy",
//             ]
//           : ["Leave"],
//         true
//       )}
//     </>
//   );

//   /* =========================================================
//      PENALTY LEAVE ADJUSTMENT DROPDOWNS
//   ========================================================= */

//   const renderPenaltyLeaveAdjustmentDropdowns = () => (
//     <>
//       {renderDropdown(
//         "query",
//         "Query",
//         ["Query"]
//       )}

//       {renderDropdown(
//         "branch",
//         "Branch",
//         ["Branch"]
//       )}

//       {renderDropdown(
//         "salaryStructure",
//         "Salary Structure",
//         ["Salary Structure"]
//       )}

//       {renderDropdown(
//         "leave",
//         "Leave",
//         ["Leave"]
//       )}

//       {renderDropdown(
//         "attendance",
//         "Attendance",
//         ["Attendance", "Daily"]
//       )}

//       {renderDropdown(
//         "designation",
//         "Designation",
//         ["Designation"]
//       )}

//       {renderDropdown(
//         "empStatus",
//         "Emp Status",
//         ["Emp Status"],
//         true
//       )}
//     </>
//   );

//   return (
//     <div
//       className={`mb-3 w-full font-[Urbanist] ${
//         showFilters ? "" : "hidden"
//       }`}
//     >
//       {/* =====================================================
//           FILTER BAR
//       ===================================================== */}

//       <div className="relative z-20 flex min-h-[58px] w-full flex-wrap items-center gap-2 rounded-[12px] border border-[#dfe3e8] bg-white px-3 py-2 shadow-[0_2px_4px_rgba(15,23,42,0.06)] sm:flex-nowrap sm:px-4 sm:py-2">

//         {/* SEARCH */}

//         <div className="flex h-[40px] min-w-[180px] flex-1 items-center rounded-[8px] border border-[#dfe3e8] bg-white px-3">
//           <Search
//             size={18}
//             strokeWidth={1.8}
//             className="mr-2 shrink-0 text-[#8b9ab0]"
//           />

//           <input
//             type="text"
//             value={searchText}
//             onChange={(e) =>
//               setSearchText(e.target.value)
//             }
//             placeholder="Search ..."
//             className="w-full border-none bg-transparent font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054] outline-none placeholder:text-[#98a2b3]"
//           />
//         </div>

//         {/* ADD FILTER */}

//         <Button
//           variant="ghost"
//           type="button"
//           className="flex h-[40px] shrink-0 items-center gap-2 rounded-[8px] border border-[#12b76a] bg-white px-3 font-[Urbanist] text-[13px] font-medium leading-[18px] text-[#344054] shadow-none transition-colors hover:bg-[#f6fffa] hover:text-[#344054]"
//         >
//           <Plus
//             size={16}
//             strokeWidth={1.8}
//             className="text-[#12b76a]"
//           />

//           <span>Add Filter</span>
//         </Button>

//         {/* ===================================================
//             DROPDOWNS
//         =================================================== */}

//         {filterVariant ===
//         "penaltyLeaveAdjustment"
//           ? renderPenaltyLeaveAdjustmentDropdowns()
//           : renderDefaultDropdowns()}

//         {/* ===================================================
//             RIGHT ACTIONS
//         =================================================== */}

//         <div className="ml-auto flex shrink-0 items-center gap-1">

//           {/* MORE */}

//           <Button
//             variant="ghost"
//             type="button"
//             className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] p-0 font-[Urbanist] text-[12px] font-medium text-[#9ba6b8] shadow-none hover:bg-[#f8fafc] hover:text-[#667085]"
//             title="More"
//           >
//             <MoreVertical
//               size={18}
//               strokeWidth={1.8}
//             />
//           </Button>

//           {/* CLOSE */}

//           <Button
//             variant="ghost"
//             type="button"
//             onClick={onHideFilters}
//             className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] p-0 font-[Urbanist] text-[12px] font-medium text-[#ff3838] shadow-none hover:bg-[#fff5f5] hover:text-[#ff3838]"
//             title="Close"
//           >
//             <X
//               size={17}
//               strokeWidth={1.8}
//             />
//           </Button>

//         </div>
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ChevronDown,
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";

interface TimeOfficeFiltersProps {
  fromDate: string;
  toDate: string;
  employeeId: string;
  employeeName: string;

  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onEmployeeIdChange: (value: string) => void;
  onEmployeeNameChange: (value: string) => void;

  onSearch: () => void;
  onReset: () => void;

  onHideFilters?: () => void;
  showFilters?: boolean;

  showDayWiseDropdownOptions?: boolean;
  showMoreFiltersMenu?: boolean;

  filterVariant?: "default" | "penaltyLeaveAdjustment";
}

type DropdownType =
  | "query"
  | "policy"
  | "pattern"
  | "supervisor"
  | "attendance"
  | "leave"
  | "branch"
  | "salaryStructure"
  | "designation"
  | "empStatus"
  | null;

export default function TimeOfficeFilters({
  showDayWiseDropdownOptions = false,
  onHideFilters,
  showFilters = true,
  filterVariant = "default",
  showMoreFiltersMenu = true,
}: TimeOfficeFiltersProps) {
  const [openDropdown, setOpenDropdown] =
    useState<DropdownType>(null);

  const [internalShowFilters, setInternalShowFilters] =
    useState(showFilters);

  const [isMoreFiltersOpen, setIsMoreFiltersOpen] =
    useState(false);

  const [searchText, setSearchText] = useState("");

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  const isFilterBarVisible = onHideFilters
    ? showFilters
    : internalShowFilters;

  const handleHideFilters = () => {
    if (onHideFilters) {
      onHideFilters();
      return;
    }

    setInternalShowFilters(false);
  };

  /* =========================================================
     DROPDOWN TOGGLE
  ========================================================= */

  const toggleDropdown = (dropdown: DropdownType) => {
    setIsMoreFiltersOpen(false);
    setOpenDropdown((current) =>
      current === dropdown ? null : dropdown
    );
  };

  /* =========================================================
     OPTION TOGGLE
  ========================================================= */

  const toggleOption = (
    dropdown: Exclude<DropdownType, null>,
    option: string
  ) => {
    setSelectedOptions((current) => {
      const selected = current[dropdown] ?? [];

      const next = selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option];

      return {
        ...current,
        [dropdown]: next,
      };
    });
  };

  /* =========================================================
     CLEAR DROPDOWN
  ========================================================= */

  const clearDropdown = (
    dropdown: Exclude<DropdownType, null>
  ) => {
    setSelectedOptions((current) => ({
      ...current,
      [dropdown]: [],
    }));

    setOpenDropdown(null);
  };

  /* =========================================================
     COMMON STYLES
  ========================================================= */

  const dropdownButtonClass =
    "flex h-[40px] items-center gap-1 whitespace-nowrap rounded-[8px] border border-[#dfe3e8] bg-white px-3 font-[Urbanist] text-[13px] font-medium leading-[18px] text-[#202124] shadow-none transition-colors hover:bg-[#f8fafc]";

  const dropdownMenuClass =
    "absolute left-0 top-[45px] z-[100] w-[205px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]";

  const rightDropdownMenuClass =
    "absolute right-0 top-[45px] z-[100] w-[205px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]";

  const optionClass =
    "flex min-h-[48px] cursor-pointer items-center gap-3 border-b border-[#e8ebef] px-4 transition-colors hover:bg-[#f8fafc]";

  const optionTextClass =
    "font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#475467]";

  const clearButtonClass =
    "flex h-[42px] w-full items-center justify-center gap-2 font-[Urbanist] text-[12px] font-medium leading-[16px] text-[#98a2b3] shadow-none hover:bg-[#f8fafc]";

  /* =========================================================
     GENERIC DROPDOWN
  ========================================================= */

  const renderDropdown = (
    key: Exclude<DropdownType, null>,
    label: string,
    options: string[],
    alignRight = false
  ) => {
    const isOpen = openDropdown === key;

    return (
      <div
        key={key}
        className="relative shrink-0"
      >
        <Button
          variant="ghost"
          type="button"
          onClick={() => toggleDropdown(key)}
          className={dropdownButtonClass}
        >
          <span>{label}</span>

          <ChevronDown
            size={14}
            strokeWidth={1.8}
            className={`transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isOpen && (
          <div
            className={
              alignRight
                ? rightDropdownMenuClass
                : dropdownMenuClass
            }
          >
            {options.map((option) => (
              <label
                key={option}
                className={optionClass}
              >
                <input
                  type="checkbox"
                  checked={
                    selectedOptions[key]?.includes(
                      option
                    ) ?? false
                  }
                  onChange={() =>
                    toggleOption(key, option)
                  }
                  className="h-[16px] w-[16px] accent-[#9a5547]"
                />

                <span className={optionTextClass}>
                  {option}
                </span>
              </label>
            ))}

            <Button
              variant="ghost"
              type="button"
              onClick={() => clearDropdown(key)}
              className={clearButtonClass}
            >
              <X size={14} />
              Clear
            </Button>
          </div>
        )}
      </div>
    );
  };

  /* =========================================================
     DEFAULT TIME OFFICE DROPDOWNS
  ========================================================= */

  const renderDefaultDropdowns = () => (
    <>
      {renderDropdown(
        "query",
        "Query",
        ["Query"]
      )}

      {renderDropdown(
        "policy",
        "T&A Policy",
        showDayWiseDropdownOptions
          ? ["T&A Policy", "General Policy"]
          : ["T&A Policy"]
      )}

      {renderDropdown(
        "pattern",
        "Pattern",
        ["Pattern"]
      )}

      {renderDropdown(
        "supervisor",
        "TA Supervisor",
        ["TA Supervisor"]
      )}

      {renderDropdown(
        "attendance",
        "Attendance",
        ["Attendance", "Daily"]
      )}

      {renderDropdown(
        "leave",
        "Leave",
        showDayWiseDropdownOptions
          ? [
              "Leave",
              "Employee Leave Policy",
              "Intern Leave Policy",
            ]
          : ["Leave"],
        true
      )}
    </>
  );

  /* =========================================================
     PENALTY LEAVE ADJUSTMENT DROPDOWNS
  ========================================================= */

  const renderPenaltyLeaveAdjustmentDropdowns = () => (
    <>
      {renderDropdown(
        "query",
        "Query",
        ["Query"]
      )}

      {renderDropdown(
        "branch",
        "Branch",
        ["Branch"]
      )}

      {renderDropdown(
        "salaryStructure",
        "Salary Structure",
        ["Salary Structure"]
      )}

      {renderDropdown(
        "leave",
        "Leave",
        ["Leave"]
      )}

      {renderDropdown(
        "attendance",
        "Attendance",
        ["Attendance", "Daily"]
      )}

      {renderDropdown(
        "designation",
        "Designation",
        ["Designation"]
      )}

      {renderDropdown(
        "empStatus",
        "Emp Status",
        ["Emp Status"],
        true
      )}
    </>
  );

  const moreFilterOptions =
    filterVariant === "penaltyLeaveAdjustment"
      ? [
          ["query", "Query"],
          ["branch", "Branch"],
          ["salaryStructure", "Salary Structure"],
          ["leave", "Leave"],
          ["attendance", "Attendance"],
          ["designation", "Designation"],
          ["empStatus", "Emp Status"],
        ]
      : [
          ["query", "Query"],
          ["policy", "T&A Policy"],
          ["pattern", "Pattern"],
          ["supervisor", "TA Supervisor"],
          ["attendance", "Attendance"],
          ["leave", "Leave"],
        ];

  return (
    <div
      className={`mb-3 w-full font-[Urbanist] ${
        isFilterBarVisible ? "" : "hidden"
      }`}
    >
      <div className="relative z-20 flex min-h-[58px] w-full flex-wrap items-center gap-2 rounded-[12px] border border-[#dfe3e8] bg-white px-3 py-2 shadow-[0_2px_4px_rgba(15,23,42,0.06)] sm:flex-nowrap sm:px-4 sm:py-2">

        {/* SEARCH */}

        <div className="flex h-[40px] min-w-[180px] flex-1 items-center rounded-[8px] border border-[#dfe3e8] bg-white px-3">
          <Search
            size={18}
            strokeWidth={1.8}
            className="mr-2 shrink-0 text-[#8b9ab0]"
          />

          <input
            type="text"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            placeholder="Search ..."
            className="w-full border-none bg-transparent font-[Urbanist] text-[13px] font-normal leading-[18px] text-[#344054] outline-none placeholder:text-[#98a2b3]"
          />
        </div>

        {/* ADD FILTER */}

        <Button
          variant="ghost"
          type="button"
          className="flex h-[40px] shrink-0 items-center gap-2 rounded-[8px] border border-[#12b76a] bg-white px-3 font-[Urbanist] text-[13px] font-medium leading-[18px] text-[#344054] shadow-none hover:bg-[#f6fffa]"
        >
          <Plus
            size={16}
            strokeWidth={1.8}
            className="text-[#12b76a]"
          />

          <span>Add Filter</span>
        </Button>

        {/* DROPDOWNS */}

        {filterVariant ===
        "penaltyLeaveAdjustment"
          ? renderPenaltyLeaveAdjustmentDropdowns()
          : renderDefaultDropdowns()}

        {/* RIGHT ACTIONS */}

        <div className="ml-auto flex shrink-0 items-center gap-1">

          <div className="relative">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setIsMoreFiltersOpen(
                  (current) => !current
                );
                setOpenDropdown(null);
              }}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] p-0 text-[#9ba6b8] shadow-none hover:bg-[#f8fafc]"
              title="More filters"
            >
              <MoreVertical
                size={18}
                strokeWidth={1.8}
              />
            </Button>

            {showMoreFiltersMenu &&
              isMoreFiltersOpen && (
                <div className="absolute right-0 top-[38px] z-[200] w-[225px] overflow-hidden rounded-[8px] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                  {moreFilterOptions.map(([key, label]) => (
                    <label
                      key={key}
                      className="flex min-h-[48px] cursor-pointer items-center gap-3 border-b border-[#e8ebef] px-4 transition-colors last:border-b-0 hover:bg-[#f8fafc]"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedOptions[key]
                            ? selectedOptions[key].includes(
                                label
                              )
                            : true
                        }
                        onChange={() =>
                          toggleOption(
                            key as Exclude<DropdownType, null>,
                            label
                          )
                        }
                        className="h-[16px] w-[16px] accent-[#2299e8]"
                      />

                      <span className={optionTextClass}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
          </div>

          <Button
            variant="ghost"
            type="button"
            onClick={handleHideFilters}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] p-0 text-[#ff3838] shadow-none hover:bg-[#fff5f5]"
            title="Close"
          >
            <X
              size={17}
              strokeWidth={1.8}
            />
          </Button>

        </div>
      </div>
    </div>
  );
}