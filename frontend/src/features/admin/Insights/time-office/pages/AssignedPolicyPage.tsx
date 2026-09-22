// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ClockFading,
//   MoreVertical,
//   Search,
//   Settings,
//   X,
// } from "lucide-react";
// import {
//   FaFileExcel,
//   FaFilePdf,
// } from "react-icons/fa";

// import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
// import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";
// import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
// import { validateDateRange } from "../validations/timeOffice.validation";
// import {
//   exportTimeOfficeExcel,
//   exportTimeOfficePdf,
// } from "../utils/timeOfficeExport";

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
//    POLICY DATA
// ========================================================= */

// interface PolicyRow {
//   id: number;
//   empId: string;
//   empName: string;
//   effectiveFrom: string;
//   policyName: string;
// }

// const POLICY_ROWS: PolicyRow[] = [];

// const POLICY_COLUMNS = [
//   {
//     header: "Sl. No.",
//     key: "id",
//   },
//   {
//     header: "Emp ID",
//     key: "empId",
//   },
//   {
//     header: "Emp Name",
//     key: "empName",
//   },
//   {
//     header: "Effective From",
//     key: "effectiveFrom",
//   },
//   {
//     header: "Policy Name",
//     key: "policyName",
//   },
// ];

// /* =========================================================
//    FILTER DROPDOWN
// ========================================================= */

// interface FilterDropdownProps {
//   label: string;
//   options: string[];
// }

// function FilterDropdown({
//   label,
//   options,
// }: FilterDropdownProps) {
//   const [open, setOpen] =
//     useState(false);

//   const [selected, setSelected] =
//     useState<string[]>([]);

//   const toggleOption = (
//     option: string
//   ) => {
//     setSelected((previous) =>
//       previous.includes(option)
//         ? previous.filter(
//             (item) =>
//               item !== option
//           )
//         : [...previous, option]
//     );
//   };

//   const clearSelection = () => {
//     setSelected([]);
//     setOpen(false);
//   };

//   return (
//     <div className="relative shrink-0">

//       {/* FILTER BUTTON */}

//       <Button
//         variant="ghost"
//         type="button"
//         onClick={() =>
//           setOpen(
//             (previous) => !previous
//           )
//         }
//         className="
//           flex
//           h-[40px]
//           items-center
//           gap-1
//           whitespace-nowrap
//           rounded-[8px]
//           border
//           border-[#dfe3e8]
//           bg-white
//           px-3
//           font-[Urbanist]
//           text-[13px]
//           font-medium
//           leading-[18px]
//           text-[#202124]
//           shadow-none
//           hover:bg-[#f8fafc]
//         "
//       >
//         <span>
//           {label}
//         </span>

//         <ChevronDown
//           size={14}
//           strokeWidth={1.8}
//           className={`
//             transition-transform
//             ${
//               open
//                 ? "rotate-180"
//                 : ""
//             }
//           `}
//         />
//       </Button>

//       {/* DROPDOWN */}

//       {open && (
//         <div
//           className="
//             absolute
//             right-0
//             top-[45px]
//             z-[100]
//             min-w-[210px]
//             overflow-hidden
//             rounded-[8px]
//             border
//             border-[#dfe3e8]
//             bg-white
//             shadow-[0_8px_24px_rgba(15,23,42,0.12)]
//           "
//         >
//           {options.map(
//             (option) => (
//               <label
//                 key={option}
//                 className="
//                   flex
//                   cursor-pointer
//                   items-center
//                   gap-3
//                   px-4
//                   py-2.5
//                   transition-colors
//                   hover:bg-[#f8fafc]
//                 "
//               >
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(
//                     option
//                   )}
//                   onChange={() =>
//                     toggleOption(
//                       option
//                     )
//                   }
//                   className="
//                     h-[16px]
//                     w-[16px]
//                     accent-[#9a5547]
//                   "
//                 />

//                 <span
//                   className="
//                     font-[Urbanist]
//                     text-[13px]
//                     font-normal
//                     leading-[18px]
//                     text-[#475467]
//                   "
//                 >
//                   {option}
//                 </span>
//               </label>
//             )
//           )}

//           {/* CLEAR */}

//           <div
//             className="
//               border-t
//               border-[#edf0f3]
//               px-3
//               py-2
//             "
//           >
//             <Button
//               variant="ghost"
//               type="button"
//               onClick={
//                 clearSelection
//               }
//               className="
//                 flex
//                 h-[32px]
//                 items-center
//                 gap-2
//                 px-2
//                 font-[Urbanist]
//                 text-[12px]
//                 font-medium
//                 leading-[16px]
//                 text-[#98a2b3]
//                 shadow-none
//                 hover:bg-[#f8fafc]
//               "
//             >
//               <X size={14} />

//               <span>
//                 Clear
//               </span>
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    POLICY SETTINGS
// ========================================================= */

// interface SettingRow {
//   label: string;
//   value: string;
// }

// interface SettingSection {
//   title: string;
//   rows: SettingRow[];
// }

// const POLICY_SETTINGS: SettingSection[] = [
//   {
//     title: "Biometric Settings",
//     rows: [
//       {
//         label: "Anti Track Using",
//         value:
//           "Bio-metric Device, Mobile, Manual Punch, ESS",
//       },
//       {
//         label: "Punch Type",
//         value: "Double Punch",
//       },
//       {
//         label:
//           "Allow Capture Geo Location",
//         value: "No",
//       },
//       {
//         label: "Selfie Required",
//         value: "Yes",
//       },
//       {
//         label:
//           "Face Identification Required",
//         value: "No",
//       },
//       {
//         label: "Location Mandatory",
//         value: "Yes",
//       },
//       {
//         label:
//           "Maximum Punch Correction Days",
//         value: "7",
//       },
//       {
//         label:
//           "Restricted Punch Correction Days",
//         value: "No",
//       },
//       {
//         label:
//           "Restrict Correction If Punch Doesn't Exists",
//         value: "No",
//       },
//       {
//         label:
//           "In Out Consideration",
//         value: "No",
//       },
//     ],
//   },

//   {
//     title: "Work Hours Consideration",
//     rows: [
//       {
//         label:
//           "Maximum Full Day Hours",
//         value: "09:00",
//       },
//       {
//         label:
//           "Maximum Half Day Hours",
//         value: "04:30",
//       },
//       {
//         label:
//           "Minimum Full Day Hours",
//         value: "09:00",
//       },
//       {
//         label:
//           "Minimum Half Day Hours",
//         value: "04:30",
//       },
//       {
//         label:
//           "Maximum Dual Days",
//         value: "09:30",
//       },
//       {
//         label:
//           "Include Early In Minutes For Work Hours",
//         value: "Yes",
//       },
//       {
//         label:
//           "Maximum Early In Minutes",
//         value: "60",
//       },
//       {
//         label:
//           "Include Late Out Minutes For Work Hours",
//         value: "Yes",
//       },
//       {
//         label:
//           "Maximum Late Out Minutes",
//         value: "60",
//       },
//     ],
//   },

//   {
//     title: "Late In Settings",
//     rows: [
//       {
//         label: "Late Minutes",
//         value: "15",
//       },
//       {
//         label:
//           "Restrict Late In Grace Days",
//         value: "5",
//       },
//       {
//         label:
//           "Include Total Late In Minutes",
//         value: "No",
//       },
//       {
//         label: "Late In %",
//         value: "100",
//       },
//       {
//         label:
//           "Combine Late In Early Out",
//         value: "No",
//       },
//       {
//         label:
//           "Late In Penalty Type",
//         value: "Count",
//       },
//       {
//         label:
//           "Late In Count",
//         value: "4",
//       },
//       {
//         label:
//           "Late In Penalty as",
//         value: "Half day",
//       },
//       {
//         label:
//           "Late In Recurrence After",
//         value: "4",
//       },
//       {
//         label:
//           "Late In Before Off",
//         value: "No",
//       },
//     ],
//   },

//   {
//     title: "Overtime Settings",
//     rows: [
//       {
//         label: "Allow OT",
//         value: "No",
//       },
//       {
//         label:
//           "OT Settings based On",
//         value: "General OT",
//       },
//       {
//         label: "OT minimum limit",
//         value: "-",
//       },
//       {
//         label: "OT maximum limit",
//         value: "-",
//       },
//       {
//         label: "Round Off",
//         value: "None",
//       },
//       {
//         label: "Round Off Min",
//         value: "-",
//       },
//       {
//         label:
//           "Stabilise Round Off",
//         value: "No",
//       },
//       {
//         label:
//           "OT Round Off Stable",
//         value: "No",
//       },
//       {
//         label: "OT Stable",
//         value: "No",
//       },
//     ],
//   },

//   {
//     title: "On Duty",
//     rows: [
//       {
//         label: "Allow OD",
//         value: "No",
//       },
//       {
//         label:
//           "Required Approval for OD punches",
//         value: "No",
//       },
//     ],
//   },

//   {
//     title: "Work From Home",
//     rows: [
//       {
//         label: "Allow WFH",
//         value: "Yes",
//       },
//       {
//         label:
//           "Maximum WFH Allowed",
//         value: "1",
//       },
//       {
//         label:
//           "Restrict Past WFH Request Days",
//         value: "0",
//       },
//       {
//         label:
//           "Restrict Employees from raising WFH request on",
//         value: "Both",
//       },
//       {
//         label:
//           "Is WFH Punch Approval Required",
//         value: "No",
//       },
//     ],
//   },

//   {
//     title: "Official Permissions",
//     rows: [
//       {
//         label:
//           "Allow Official Permission",
//         value: "Yes",
//       },
//       {
//         label:
//           "Official Maximum Days Per Month",
//         value: "2",
//       },
//     ],
//   },

//   {
//     title: "Personal Permissions",
//     rows: [
//       {
//         label:
//           "Allow Personal Permission",
//         value: "Yes",
//       },
//       {
//         label:
//           "Personal Maximum Days Per Month",
//         value: "1",
//       },
//       {
//         label:
//           "Personal Maximum Minutes Per Day",
//         value: "60",
//       },
//       {
//         label:
//           "Personal Maximum Minutes Per Day",
//         value: "30",
//       },
//       {
//         label:
//           "Personal Maximum Minutes Per Month",
//         value: "60",
//       },
//       {
//         label:
//           "Personal Work Status",
//         value: "Yes",
//       },
//       {
//         label:
//           "Personal Network Hours",
//         value: "Yes",
//       },
//     ],
//   },

//   {
//     title: "Advanced",
//     rows: [
//       {
//         label:
//           "Sandwich for WO",
//         value: "No",
//       },
//       {
//         label:
//           "WO Sandwich Type",
//         value: "Both",
//       },
//       {
//         label:
//           "Sandwich for CH",
//         value: "No",
//       },
//       {
//         label:
//           "CH Sandwich Type",
//         value: "Both",
//       },
//     ],
//   },
// ];

// /* =========================================================
//    POLICY SETTINGS MODAL
// ========================================================= */

// function PolicySettingsModal({
//   onClose,
// }: {
//   onClose: () => void;
// }) {
//   return (
//     <div
//       className="
//         fixed
//         inset-0
//         z-[100]
//         flex
//         items-center
//         justify-center
//         bg-black/50
//         px-4
//         font-[Urbanist]
//       "
//     >
//       <div
//         className="
//           flex
//           max-h-[82vh]
//           w-full
//           max-w-[900px]
//           flex-col
//           overflow-hidden
//           rounded-[12px]
//           bg-white
//           shadow-2xl
//         "
//       >

//         {/* =================================================
//             MODAL HEADER
//         ================================================= */}

//         <div
//           className="
//             flex
//             min-h-[64px]
//             items-center
//             justify-between
//             border-b
//             border-[#e5e7eb]
//             bg-[#f8f9fc]
//             px-5
//           "
//         >
//           <h2
//             className="
//               font-[Urbanist]
//               text-[18px]
//               font-bold
//               leading-[24px]
//               text-[#344054]
//             "
//           >
//             Policy Settings - General Policy
//           </h2>

//           <Button
//             variant="ghost"
//             type="button"
//             onClick={onClose}
//             className="
//               flex
//               h-[32px]
//               w-[32px]
//               items-center
//               justify-center
//               rounded-[6px]
//               p-0
//               text-[#98a2b3]
//               shadow-none
//               hover:bg-[#eef1f4]
//             "
//           >
//             <X size={18} />
//           </Button>
//         </div>

//         {/* =================================================
//             MODAL BODY
//         ================================================= */}

//         <div
//           className="
//             overflow-y-auto
//             px-5
//             py-4
//           "
//         >
//           {POLICY_SETTINGS.map(
//             (section) => (
//               <div
//                 key={section.title}
//                 className="
//                   mb-4
//                   overflow-hidden
//                   rounded-[8px]
//                   border
//                   border-[#e1e4ea]
//                 "
//               >

//                 {/* Section title */}

//                 <div
//                   className="
//                     bg-[#dcecf7]
//                     px-4
//                     py-2.5
//                   "
//                 >
//                   <h3
//                     className="
//                       font-[Urbanist]
//                       text-[13px]
//                       font-semibold
//                       leading-[18px]
//                       text-[#344054]
//                     "
//                   >
//                     {section.title}
//                   </h3>
//                 </div>

//                 {/* Rows */}

//                 {section.rows.map(
//                   (row, index) => (
//                     <div
//                       key={`${row.label}-${index}`}
//                       className="
//                         grid
//                         grid-cols-[1fr_280px]
//                         border-b
//                         border-[#edf0f3]
//                         last:border-b-0
//                       "
//                     >
//                       <div
//                         className="
//                           px-4
//                           py-2.5
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           text-[#667085]
//                         "
//                       >
//                         {row.label}
//                       </div>

//                       <div
//                         className="
//                           px-4
//                           py-2.5
//                           text-right
//                           font-[Urbanist]
//                           text-[13px]
//                           font-medium
//                           leading-[18px]
//                           text-[#344054]
//                         "
//                       >
//                         {row.value}
//                       </div>
//                     </div>
//                   )
//                 )}
//               </div>
//             )
//           )}
//         </div>

//         {/* =================================================
//             MODAL FOOTER
//         ================================================= */}

//         <div
//           className="
//             flex
//             justify-end
//             border-t
//             border-[#e5e7eb]
//             bg-[#f8f9fc]
//             px-5
//             py-3
//           "
//         >
//           <Button
//             variant="ghost"
//             type="button"
//             onClick={onClose}
//             className="
//               flex
//               h-[40px]
//               items-center
//               gap-2
//               rounded-[8px]
//               border
//               border-[#cfd5dd]
//               bg-white
//               px-4
//               font-[Urbanist]
//               text-[12px]
//               font-semibold
//               leading-[16px]
//               text-[#475467]
//               shadow-none
//               hover:bg-[#f3f4f6]
//             "
//           >
//             <X size={16} />
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN PAGE
// ========================================================= */

// export default function AssignedPolicyPage() {
//   const navigate = useNavigate();

//   const today = getTodayDate();

//   const {
//     filters,
//     updateFilter,
//     resetFilters,
//   } = useTimeOfficeFilters();

//   const [search, setSearch] =
//     useState("");

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   const [selectedPolicy, setSelectedPolicy] =
//     useState<PolicyRow | null>(null);

//   /* =======================================================
//      SEARCH / VALIDATION
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
//     setSearch("");
//     setCurrentPage(1);
//   };

//   /* =======================================================
//      FILTER
//   ======================================================= */

//   const filteredRows =
//     POLICY_ROWS.filter(
//       (row) => {
//         const value =
//           search
//             .trim()
//             .toLowerCase();

//         if (!value) {
//           return true;
//         }

//         return (
//           row.empId
//             .toLowerCase()
//             .includes(value) ||
//           row.empName
//             .toLowerCase()
//             .includes(value) ||
//           row.policyName
//             .toLowerCase()
//             .includes(value)
//         );
//       }
//     );

//   /* =======================================================
//      EXPORT
//   ======================================================= */

//   const exportOptions = {
//     title: "Assigned Policy",
//     columns: POLICY_COLUMNS,
//     rows: filteredRows,
//     fromDate:
//       filters.fromDate || today,
//     toDate:
//       filters.toDate || today,
//   };

//   return (
//     <div
//       className="
//         min-h-full
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
//           <div
//             className="
//               flex
//               items-center
//               gap-3
//             "
//           >
//             {/* ICON */}

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

//           <Button
//             type="button"
//             variant="ghost"
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
//               shadow-none
//               hover:bg-[#f5e7e1]
//             "
//           >
//             <ChevronDown
//               size={18}
//               strokeWidth={2}
//             />
//           </Button>
//         </div>
//       </div>

//       {/* =====================================================
//           REPORT HEADER
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
//             "
//           >
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
//               Assigned Policy
//             </h2>
//           </div>

//           {/* RIGHT SIDE */}

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

//             <Button
//               variant="ghost"
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
//             </Button>

//             {/* FROM DATE */}

//             <DateField
//               label="From Date"
//               value={
//                 filters.fromDate ||
//                 today
//               }
//               onChange={(value) =>
//                 updateFilter(
//                   "fromDate",
//                   value
//                 )
//               }
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-2

//                 [&_label]:whitespace-nowrap
//                 [&_label]:font-[Urbanist]
//                 [&_label]:text-[13px]
//                 [&_label]:font-medium
//                 [&_label]:leading-[18px]
//                 [&_label]:text-[#344054]

//                 [&_input]:h-[42px]
//                 [&_input]:w-[165px]
//                 [&_input]:rounded-[8px]
//                 [&_input]:border-[#dfe3e8]
//                 [&_input]:bg-white
//                 [&_input]:px-3
//                 [&_input]:font-[Urbanist]
//                 [&_input]:text-[13px]
//                 [&_input]:font-normal
//                 [&_input]:leading-[18px]
//                 [&_input]:text-[#344054]
//               "
//             />

//             {/* TO DATE */}

//             <DateField
//               label="To Date"
//               value={
//                 filters.toDate ||
//                 today
//               }
//               onChange={(value) =>
//                 updateFilter(
//                   "toDate",
//                   value
//                 )
//               }
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-2

//                 [&_label]:whitespace-nowrap
//                 [&_label]:font-[Urbanist]
//                 [&_label]:text-[13px]
//                 [&_label]:font-medium
//                 [&_label]:leading-[18px]
//                 [&_label]:text-[#344054]

//                 [&_input]:h-[42px]
//                 [&_input]:w-[165px]
//                 [&_input]:rounded-[8px]
//                 [&_input]:border-[#dfe3e8]
//                 [&_input]:bg-white
//                 [&_input]:px-3
//                 [&_input]:font-[Urbanist]
//                 [&_input]:text-[13px]
//                 [&_input]:font-normal
//                 [&_input]:leading-[18px]
//                 [&_input]:text-[#344054]
//               "
//             />

//             {/* PDF */}

//             <Button
//               variant="ghost"
//               type="button"
//               title="Export PDF"
//               onClick={() =>
//                 exportTimeOfficePdf(
//                   exportOptions
//                 )
//               }
//               className="
//                 flex
//                 h-[42px]
//                 w-[32px]
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-[8px]
//                 bg-white
//                 p-0
//                 text-[#ef5350]
//                 shadow-none
//                 hover:bg-[#fff3f3]
//               "
//             >
//               <FaFilePdf
//                 className="
//                   h-[21px]
//                   w-[21px]
//                 "
//               />
//             </Button>

//             {/* EXCEL */}

//             <Button
//               variant="ghost"
//               type="button"
//               title="Export Excel"
//               onClick={() =>
//                 exportTimeOfficeExcel(
//                   exportOptions
//                 )
//               }
//               className="
//                 flex
//                 h-[42px]
//                 w-[32px]
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
//                 className="
//                   h-[21px]
//                   w-[21px]
//                 "
//               />
//             </Button>

//             {/* HISTORY */}

//             <Button
//               variant="ghost"
//               type="button"
//               title="History"
//               className="
//                 flex
//                 h-[42px]
//                 w-[32px]
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-[8px]
//                 bg-white
//                 p-0
//                 text-[#98a2b3]
//                 shadow-none
//                 hover:bg-[#f8fafc]
//               "
//             >
//               <ClockFading
//                 size={20}
//                 strokeWidth={1.8}
//               />
//             </Button>

//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           FILTER BAR
//       ===================================================== */}

//       <div
//         className="
//           relative
//           z-10
//           mb-3
//           w-full
//           overflow-x-auto
//           rounded-[12px]
//           border
//           border-[#dfe3e8]
//           bg-white
//           shadow-[0_2px_4px_rgba(15,23,42,0.06)]
//         "
//       >
//         <div
//           className="
//             flex
//             min-w-max
//             min-h-[58px]
//             items-center
//             gap-2
//             px-3
//             py-2
//           "
//         >

//           {/* SEARCH */}

//           <div
//             className="
//               flex
//               h-[40px]
//               w-[360px]
//               shrink-0
//               items-center
//               rounded-[8px]
//               border
//               border-[#dfe3e8]
//               bg-white
//               px-3
//             "
//           >
//             <Search
//               size={18}
//               strokeWidth={1.8}
//               className="
//                 mr-2
//                 shrink-0
//                 text-[#8b9ab0]
//               "
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => {
//                 setSearch(
//                   e.target.value
//                 );
//                 setCurrentPage(1);
//               }}
//               onKeyDown={(e) => {
//                 if (
//                   e.key ===
//                   "Enter"
//                 ) {
//                   handleSearch();
//                 }
//               }}
//               placeholder="Search ..."
//               className="
//                 w-full
//                 border-none
//                 bg-transparent
//                 font-[Urbanist]
//                 text-[13px]
//                 font-normal
//                 leading-[18px]
//                 text-[#344054]
//                 outline-none
//                 placeholder:text-[#98a2b3]
//               "
//             />
//           </div>

//           {/* ADD FILTER */}

//           <Button
//             variant="ghost"
//             type="button"
//             onClick={handleSearch}
//             className="
//               flex
//               h-[40px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-[8px]
//               border
//               border-[#12b76a]
//               bg-white
//               px-3
//               font-[Urbanist]
//               text-[13px]
//               font-medium
//               leading-[18px]
//               text-[#344054]
//               shadow-none
//               hover:bg-[#f6fffa]
//             "
//           >
//             <span
//               className="
//                 font-[Urbanist]
//                 text-[18px]
//                 font-normal
//                 leading-none
//                 text-[#12b76a]
//               "
//             >
//               +
//             </span>

//             <span>
//               Add Filter
//             </span>
//           </Button>

//           {/* QUERY */}

//           <FilterDropdown
//             label="Query"
//             options={["Query"]}
//           />

//           {/* BRANCH */}

//           <FilterDropdown
//             label="Branch"
//             options={[
//               "All Branches",
//             ]}
//           />

//           {/* SALARY STRUCTURE */}

//           <FilterDropdown
//             label="Salary Structure"
//             options={[
//               "General",
//             ]}
//           />

//           {/* LEAVE */}

//           <FilterDropdown
//             label="Leave"
//             options={[
//               "All",
//               "Available",
//               "Not Available",
//             ]}
//           />

//           {/* ATTENDANCE */}

//           <FilterDropdown
//             label="Attendance"
//             options={[
//               "Attendance",
//               "Daily",
//             ]}
//           />

//           {/* DESIGNATION */}

//           <FilterDropdown
//             label="Designation"
//             options={[
//               "All Designations",
//             ]}
//           />

//           {/* EMP STATUS */}

//           <FilterDropdown
//             label="Emp Status"
//             options={[
//               "Active",
//               "Inactive",
//             ]}
//           />

//           {/* MORE */}

//           <Button
//             variant="ghost"
//             type="button"
//             title="More"
//             className="
//               flex
//               h-[32px]
//               w-[32px]
//               shrink-0
//               items-center
//               justify-center
//               rounded-[6px]
//               p-0
//               text-[#9ba6b8]
//               shadow-none
//               hover:bg-[#f8fafc]
//             "
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
//             onClick={handleReset}
//             title="Clear"
//             className="
//               flex
//               h-[32px]
//               w-[32px]
//               shrink-0
//               items-center
//               justify-center
//               rounded-[6px]
//               p-0
//               text-[#ff3838]
//               shadow-none
//               hover:bg-[#fff5f5]
//             "
//           >
//             <X
//               size={17}
//               strokeWidth={1.8}
//             />
//           </Button>

//         </div>
//       </div>

//       {/* =====================================================
//           TABLE
//       ===================================================== */}

//       <div
//         className="
//           overflow-hidden
//           rounded-[10px]
//           border
//           border-[#e2e6ea]
//           bg-white
//         "
//       >
//         <div className="overflow-x-auto">

//           <table
//             className="
//               w-full
//               min-w-[900px]
//               border-collapse
//             "
//           >

//             <thead>
//               <tr
//                 className="
//                   bg-[#cfe6f5]
//                 "
//               >

//                 <th
//                   className="
//                     w-[80px]
//                     border-r
//                     border-[#d3e5f2]
//                     px-4
//                     py-3
//                     text-left
//                     font-[Urbanist]
//                     text-[13px]
//                     font-semibold
//                     leading-[18px]
//                     text-[#1f2937]
//                   "
//                 >
//                   Sl. No.
//                 </th>

//                 <th
//                   className="
//                     border-r
//                     border-[#d3e5f2]
//                     px-4
//                     py-3
//                     text-left
//                     font-[Urbanist]
//                     text-[13px]
//                     font-semibold
//                     leading-[18px]
//                     text-[#1f2937]
//                   "
//                 >
//                   Emp ID
//                 </th>

//                 <th
//                   className="
//                     border-r
//                     border-[#d3e5f2]
//                     px-4
//                     py-3
//                     text-left
//                     font-[Urbanist]
//                     text-[13px]
//                     font-semibold
//                     leading-[18px]
//                     text-[#1f2937]
//                   "
//                 >
//                   Emp Name
//                 </th>

//                 <th
//                   className="
//                     border-r
//                     border-[#d3e5f2]
//                     px-4
//                     py-3
//                     text-left
//                     font-[Urbanist]
//                     text-[13px]
//                     font-semibold
//                     leading-[18px]
//                     text-[#1f2937]
//                   "
//                 >
//                   Effective From Date
//                 </th>

//                 <th
//                   className="
//                     border-r
//                     border-[#d3e5f2]
//                     px-4
//                     py-3
//                     text-left
//                     font-[Urbanist]
//                     text-[13px]
//                     font-semibold
//                     leading-[18px]
//                     text-[#1f2937]
//                   "
//                 >
//                   Policy Name
//                 </th>

//                 <th
//                   className="
//                     w-[180px]
//                     px-4
//                     py-3
//                     text-center
//                     font-[Urbanist]
//                     text-[13px]
//                     font-semibold
//                     leading-[18px]
//                     text-[#1f2937]
//                   "
//                 >
//                   View Settings
//                 </th>

//               </tr>
//             </thead>

//             <tbody>

//               {filteredRows.length >
//               0 ? (
//                 filteredRows.map(
//                   (row) => (
//                     <tr
//                       key={row.id}
//                       className="
//                         border-b
//                         border-[#edf0f3]
//                         bg-white
//                         transition-colors
//                         hover:bg-[#f8fafc]
//                       "
//                     >

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           text-[#344054]
//                         "
//                       >
//                         {row.id}
//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           font-[Urbanist]
//                           text-[13px]
//                           font-medium
//                           leading-[18px]
//                           text-[#159bd7]
//                         "
//                       >
//                         {row.empId}
//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           text-[#344054]
//                         "
//                       >
//                         {row.empName}
//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           text-[#344054]
//                         "
//                       >
//                         {row.effectiveFrom}
//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           font-[Urbanist]
//                           text-[13px]
//                           font-normal
//                           leading-[18px]
//                           text-[#344054]
//                         "
//                       >
//                         {row.policyName}
//                       </td>

//                       <td
//                         className="
//                           px-4
//                           py-3
//                           text-center
//                         "
//                       >
//                         <Button
//                           variant="ghost"
//                           type="button"
//                           title="View Settings"
//                           onClick={() =>
//                             setSelectedPolicy(
//                               row
//                             )
//                           }
//                           className="
//                             inline-flex
//                             items-center
//                             justify-center
//                             rounded-[6px]
//                             p-1
//                             text-[#159bd7]
//                             shadow-none
//                             hover:bg-[#f0f9fd]
//                           "
//                         >
//                           <Settings
//                             size={20}
//                             strokeWidth={2}
//                           />
//                         </Button>
//                       </td>

//                     </tr>
//                   )
//                 )
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="p-0"
//                   >
//                     <TimeOfficeEmptyState message="No assigned policy records found." />
//                   </td>
//                 </tr>
//               )}

//             </tbody>
//           </table>

//         </div>
//       </div>

//       {/* =====================================================
//           PAGINATION
//       ===================================================== */}

//       <div
//         className="
//           flex
//           min-h-[52px]
//           items-center
//           justify-end
//           gap-3
//           px-3
//         "
//       >

//         <span
//           className="
//             font-[Urbanist]
//             text-[12px]
//             font-medium
//             leading-[16px]
//             text-[#667085]
//           "
//         >
//           Rows per page
//         </span>

//         <select
//           defaultValue="10"
//           className="
//             h-[32px]
//             rounded-[6px]
//             border
//             border-[#dfe3e8]
//             bg-white
//             px-2
//             font-[Urbanist]
//             text-[12px]
//             font-medium
//             text-[#475467]
//             outline-none
//           "
//         >
//           <option value="10">
//             10
//           </option>

//           <option value="25">
//             25
//           </option>

//           <option value="50">
//             50
//           </option>
//         </select>

//         <span
//           className="
//             font-[Urbanist]
//             text-[12px]
//             font-medium
//             leading-[16px]
//             text-[#667085]
//           "
//         >
//           {filteredRows.length ===
//           0
//             ? "0 to 0 of 0"
//             : `1 to ${filteredRows.length} of ${filteredRows.length}`}
//         </span>

//         <Button
//           variant="ghost"
//           type="button"
//           disabled
//           className="
//             flex
//             h-[32px]
//             w-[32px]
//             items-center
//             justify-center
//             rounded-[6px]
//             p-0
//             text-[#c5cad1]
//             shadow-none
//           "
//         >
//           <ChevronLeft
//             size={17}
//           />
//         </Button>

//         <Button
//           variant="ghost"
//           type="button"
//           className="
//             flex
//             h-[32px]
//             w-[32px]
//             items-center
//             justify-center
//             rounded-full
//             bg-[#edf0f5]
//             p-0
//             font-[Urbanist]
//             text-[12px]
//             font-medium
//             text-[#26364a]
//             shadow-none
//           "
//         >
//           {currentPage}
//         </Button>

//         <Button
//           variant="ghost"
//           type="button"
//           disabled
//           className="
//             flex
//             h-[32px]
//             w-[32px]
//             items-center
//             justify-center
//             rounded-[6px]
//             p-0
//             text-[#c5cad1]
//             shadow-none
//           "
//         >
//           <ChevronRight
//             size={17}
//           />
//         </Button>

//       </div>

//       {/* =====================================================
//           POLICY SETTINGS MODAL
//       ===================================================== */}

//       {selectedPolicy && (
//         <PolicySettingsModal
//           onClose={() =>
//             setSelectedPolicy(
//               null
//             )
//           }
//         />
//       )}

//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ClockFading,
  Funnel,
  FileText,
  Settings,
  X,
} from "lucide-react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

import TimeOfficeEmptyState from "../components/TimeOfficeEmptyState";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";
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
   DATE
========================================================= */

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================================================
   POLICY DATA
========================================================= */

interface PolicyRow {
  id: number;
  empId: string;
  empName: string;
  effectiveFrom: string;
  policyName: string;
}

const POLICY_ROWS: PolicyRow[] = [];

const POLICY_COLUMNS = [
  {
    header: "Sl. No.",
    key: "id",
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
    header: "Effective From",
    key: "effectiveFrom",
  },
  {
    header: "Policy Name",
    key: "policyName",
  },
];

/* =========================================================
   POLICY SETTINGS
========================================================= */

interface SettingRow {
  label: string;
  value: string;
}

interface SettingSection {
  title: string;
  rows: SettingRow[];
}

const POLICY_SETTINGS: SettingSection[] = [
  {
    title: "Biometric Settings",
    rows: [
      {
        label: "Anti Track Using",
        value: "Bio-metric Device, Mobile, Manual Punch, ESS",
      },
      {
        label: "Punch Type",
        value: "Double Punch",
      },
      {
        label: "Allow Capture Geo Location",
        value: "No",
      },
      {
        label: "Selfie Required",
        value: "Yes",
      },
      {
        label: "Face Identification Required",
        value: "No",
      },
      {
        label: "Location Mandatory",
        value: "Yes",
      },
      {
        label: "Maximum Punch Correction Days",
        value: "7",
      },
      {
        label: "Restricted Punch Correction Days",
        value: "No",
      },
      {
        label: "Restrict Correction If Punch Doesn't Exists",
        value: "No",
      },
      {
        label: "In Out Consideration",
        value: "No",
      },
    ],
  },

  {
    title: "Work Hours Consideration",
    rows: [
      {
        label: "Maximum Full Day Hours",
        value: "09:00",
      },
      {
        label: "Maximum Half Day Hours",
        value: "04:30",
      },
      {
        label: "Minimum Full Day Hours",
        value: "09:00",
      },
      {
        label: "Minimum Half Day Hours",
        value: "04:30",
      },
      {
        label: "Maximum Dual Days",
        value: "09:30",
      },
      {
        label: "Include Early In Minutes For Work Hours",
        value: "Yes",
      },
      {
        label: "Maximum Early In Minutes",
        value: "60",
      },
      {
        label: "Include Late Out Minutes For Work Hours",
        value: "Yes",
      },
      {
        label: "Maximum Late Out Minutes",
        value: "60",
      },
    ],
  },

  {
    title: "Late In Settings",
    rows: [
      {
        label: "Late Minutes",
        value: "15",
      },
      {
        label: "Restrict Late In Grace Days",
        value: "5",
      },
      {
        label: "Include Total Late In Minutes",
        value: "No",
      },
      {
        label: "Late In %",
        value: "100",
      },
      {
        label: "Combine Late In Early Out",
        value: "No",
      },
      {
        label: "Late In Penalty Type",
        value: "Count",
      },
      {
        label: "Late In Count",
        value: "4",
      },
      {
        label: "Late In Penalty as",
        value: "Half day",
      },
      {
        label: "Late In Recurrence After",
        value: "4",
      },
      {
        label: "Late In Before Off",
        value: "No",
      },
    ],
  },

  {
    title: "Overtime Settings",
    rows: [
      {
        label: "Allow OT",
        value: "No",
      },
      {
        label: "OT Settings based On",
        value: "General OT",
      },
      {
        label: "OT minimum limit",
        value: "-",
      },
      {
        label: "OT maximum limit",
        value: "-",
      },
      {
        label: "Round Off",
        value: "None",
      },
      {
        label: "Round Off Min",
        value: "-",
      },
      {
        label: "Stabilise Round Off",
        value: "No",
      },
      {
        label: "OT Round Off Stable",
        value: "No",
      },
      {
        label: "OT Stable",
        value: "No",
      },
    ],
  },

  {
    title: "On Duty",
    rows: [
      {
        label: "Allow OD",
        value: "No",
      },
      {
        label: "Required Approval for OD punches",
        value: "No",
      },
    ],
  },

  {
    title: "Work From Home",
    rows: [
      {
        label: "Allow WFH",
        value: "Yes",
      },
      {
        label: "Maximum WFH Allowed",
        value: "1",
      },
      {
        label: "Restrict Past WFH Request Days",
        value: "0",
      },
      {
        label: "Restrict Employees from raising WFH request on",
        value: "Both",
      },
      {
        label: "Is WFH Punch Approval Required",
        value: "No",
      },
    ],
  },

  {
    title: "Official Permissions",
    rows: [
      {
        label: "Allow Official Permission",
        value: "Yes",
      },
      {
        label: "Official Maximum Days Per Month",
        value: "2",
      },
    ],
  },

  {
    title: "Personal Permissions",
    rows: [
      {
        label: "Allow Personal Permission",
        value: "Yes",
      },
      {
        label: "Personal Maximum Days Per Month",
        value: "1",
      },
      {
        label: "Personal Maximum Minutes Per Day",
        value: "60",
      },
      {
        label: "Personal Maximum Minutes Per Day",
        value: "30",
      },
      {
        label: "Personal Maximum Minutes Per Month",
        value: "60",
      },
      {
        label: "Personal Work Status",
        value: "Yes",
      },
      {
        label: "Personal Network Hours",
        value: "Yes",
      },
    ],
  },

  {
    title: "Advanced",
    rows: [
      {
        label: "Sandwich for WO",
        value: "No",
      },
      {
        label: "WO Sandwich Type",
        value: "Both",
      },
      {
        label: "Sandwich for CH",
        value: "No",
      },
      {
        label: "CH Sandwich Type",
        value: "Both",
      },
    ],
  },
];

/* =========================================================
   POLICY SETTINGS MODAL
========================================================= */

function PolicySettingsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        font-[Urbanist]
      "
    >
      <div
        className="
          flex
          max-h-[82vh]
          w-full
          max-w-[900px]
          flex-col
          overflow-hidden
          rounded-[12px]
          bg-white
          shadow-2xl
        "
      >
        {/* MODAL HEADER */}
        <div
          className="
            flex
            min-h-[64px]
            items-center
            justify-between
            border-b
            border-[#e5e7eb]
            bg-[#f8f9fc]
            px-5
          "
        >
          <h2
            className="
              font-[Urbanist]
              text-[18px]
              font-bold
              leading-[24px]
              text-[#344054]
            "
          >
            Policy Settings - General Policy
          </h2>

          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
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

        {/* MODAL BODY */}
        <div className="overflow-y-auto px-5 py-4">
          {POLICY_SETTINGS.map((section) => (
            <div
              key={section.title}
              className="
                mb-4
                overflow-hidden
                rounded-[8px]
                border
                border-[#e1e4ea]
              "
            >
              {/* SECTION TITLE */}
              <div className="bg-[#dcecf7] px-4 py-2.5">
                <h3
                  className="
                    font-[Urbanist]
                    text-[13px]
                    font-semibold
                    leading-[18px]
                    text-[#344054]
                  "
                >
                  {section.title}
                </h3>
              </div>

              {/* ROWS */}
              {section.rows.map((row, index) => (
                <div
                  key={`${row.label}-${index}`}
                  className="
                    grid
                    grid-cols-[1fr_280px]
                    border-b
                    border-[#edf0f3]
                    last:border-b-0
                  "
                >
                  <div
                    className="
                      px-4
                      py-2.5
                      font-[Urbanist]
                      text-[13px]
                      font-normal
                      leading-[18px]
                      text-[#667085]
                    "
                  >
                    {row.label}
                  </div>

                  <div
                    className="
                      px-4
                      py-2.5
                      text-right
                      font-[Urbanist]
                      text-[13px]
                      font-medium
                      leading-[18px]
                      text-[#344054]
                    "
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* MODAL FOOTER */}
        <div
          className="
            flex
            justify-end
            border-t
            border-[#e5e7eb]
            bg-[#f8f9fc]
            px-5
            py-3
          "
        >
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            className="
              flex
              h-[40px]
              items-center
              gap-2
              rounded-[8px]
              border
              border-[#cfd5dd]
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
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AssignedPolicyPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const {
    filters,
    updateFilter,
    resetFilters,
  } = useTimeOfficeFilters();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPolicy, setSelectedPolicy] =
    useState<PolicyRow | null>(null);

  /* =======================================================
     SEARCH / VALIDATION
  ======================================================= */

  const handleSearch = () => {
    const validation = validateDateRange(
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
    setSearch("");
    setCurrentPage(1);
  };

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredRows = POLICY_ROWS.filter((row) => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return true;
    }

    return (
      row.empId.toLowerCase().includes(value) ||
      row.empName.toLowerCase().includes(value) ||
      row.policyName.toLowerCase().includes(value)
    );
  });

  /* =======================================================
     EXPORT
  ======================================================= */

  const exportOptions = {
    title: "Assigned Policy",
    columns: POLICY_COLUMNS,
    rows: filteredRows,
    fromDate: filters.fromDate || today,
    toDate: filters.toDate || today,
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
          TIME OFFICE MODULE BANNER
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
          {/* TIME OFFICE TITLE */}
          <div
            className="
              flex
              h-[52px]
              shrink-0
              items-center
              rounded-[10px]
              border
              border-[#df8f7b]
              bg-white
              px-7
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

          {/* TOP RIGHT ACTIONS */}
          <div className="flex shrink-0 items-center gap-2">
            {/* FILTER */}
            <Button
              type="button"
              variant="ghost"
              title="Filter"
              className="
                flex
                h-[34px]
                w-[34px]
                items-center
                justify-center
                rounded-[6px]
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

            {/* HISTORY */}
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
                rounded-[6px]
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
            min-h-[80px]
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
              h-[52px]
              shrink-0
              items-center
              gap-2.5
              rounded-[10px]
              border
              border-[#df8f7b]
              bg-[#fff8f6]
              px-5
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
              Assigned Policy
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
              onClick={() => navigate(-1)}
              className="
                flex
                h-[48px]
                shrink-0
                items-center
                gap-2
                rounded-[8px]
                bg-[#9a5547]
                px-5
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

            {/* FROM DATE */}
            <DateField
              label="From Date"
              value={filters.fromDate || today}
              onChange={(value) =>
                updateFilter("fromDate", value)
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

                [&_input]:h-[48px]
                [&_input]:w-[185px]
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
              value={filters.toDate || today}
              onChange={(value) =>
                updateFilter("toDate", value)
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

                [&_input]:h-[48px]
                [&_input]:w-[185px]
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
                exportTimeOfficePdf(exportOptions)
              }
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
                exportTimeOfficeExcel(exportOptions)
              }
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
          TABLE
      ===================================================== */}

      <div
        className="
          overflow-hidden
          rounded-[14px]
          border
          border-[#d5d9df]
          bg-white
          shadow-[0_6px_18px_rgba(15,23,42,0.18)]
        "
      >
        <div className="w-full overflow-hidden">
          <table
            className="
              w-full
              table-fixed
              border-collapse
            "
          >
            <thead>
              <tr className="bg-[#cfe6f5]">
                <th
                  className="
                    w-[80px]
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
                  "
                >
                  Sl. No.
                </th>

                <th
                  className="
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
                  "
                >
                  Emp ID
                </th>

                <th
                  className="
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
                  "
                >
                  Emp Name
                </th>

                <th
                  className="
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
                  "
                >
                  Effective From Date
                </th>

                <th
                  className="
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
                  "
                >
                  Policy Name
                </th>

                <th
                  className="
                    w-[180px]
                    px-4
                    py-3
                    text-center
                    font-[Urbanist]
                    text-[13px]
                    font-semibold
                    leading-[18px]
                    text-[#1f2937]
                  "
                >
                  View Settings
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="
                      border-b
                      border-[#edf0f3]
                      bg-white
                      transition-colors
                      hover:bg-[#f8fafc]
                    "
                  >
                    <td
                      className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      "
                    >
                      {row.id}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-medium
                        leading-[18px]
                        text-[#159bd7]
                      "
                    >
                      {row.empId}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      "
                    >
                      {row.empName}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      "
                    >
                      {row.effectiveFrom}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        font-[Urbanist]
                        text-[13px]
                        font-normal
                        leading-[18px]
                        text-[#344054]
                      "
                    >
                      {row.policyName}
                    </td>

                    <td
                      className="
                        px-4
                        py-3
                        text-center
                      "
                    >
                      <Button
                        variant="ghost"
                        type="button"
                        title="View Settings"
                        onClick={() =>
                          setSelectedPolicy(row)
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
                        <Settings
                          size={20}
                          strokeWidth={2}
                        />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-0"
                  >
                    <TimeOfficeEmptyState message="No assigned policy records found." />
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

      <div
        className="
          flex
          min-h-[52px]
          items-center
          justify-end
          gap-3
          px-3
        "
      >
        <span
          className="
            font-[Urbanist]
            text-[12px]
            font-medium
            leading-[16px]
            text-[#667085]
          "
        >
          Rows per page
        </span>

        <select
          defaultValue="10"
          className="
            h-[32px]
            rounded-[6px]
            border
            border-[#dfe3e8]
            bg-white
            px-2
            font-[Urbanist]
            text-[12px]
            font-medium
            text-[#475467]
            outline-none
          "
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>

        <span
          className="
            font-[Urbanist]
            text-[12px]
            font-medium
            leading-[16px]
            text-[#667085]
          "
        >
          {filteredRows.length === 0
            ? "0 to 0 of 0"
            : `1 to ${filteredRows.length} of ${filteredRows.length}`}
        </span>

        <Button
          variant="ghost"
          type="button"
          disabled
          className="
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
            rounded-[6px]
            p-0
            text-[#c5cad1]
            shadow-none
          "
        >
          <ChevronLeft size={17} />
        </Button>

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

        <Button
          variant="ghost"
          type="button"
          disabled
          className="
            flex
            h-[32px]
            w-[32px]
            items-center
            justify-center
            rounded-[6px]
            p-0
            text-[#c5cad1]
            shadow-none
          "
        >
          <ChevronRight size={17} />
        </Button>
      </div>

      {/* =====================================================
          POLICY SETTINGS MODAL
      ===================================================== */}

      {selectedPolicy && (
        <PolicySettingsModal
          onClose={() =>
            setSelectedPolicy(null)
          }
        />
      )}
    </div>
  );
}