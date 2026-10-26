// import { useState } from "react";
// import type { Dispatch, SetStateAction } from "react";

// import {
//   ChevronDown,
//   ChevronUp,
//   Clock3,
//   Filter,
//   Mail,
//   MoreVertical,
//   Plus,
//   Search,
//   X,
// } from "lucide-react";


// type DropdownKey =
//   | "Query"
//   | "Branch"
//   | "Salary Structure"
//   | "Leave"
//   | "Attendance"
//   | "Designation"
//   | "Emp Status";

// const DROPDOWN_OPTIONS: Record<DropdownKey, string[]> = {
//   Query: [],
//   Branch: [
//     "Koundinyasa Technology Services Pvt. Ltd.",
//   ],
//   "Salary Structure": [
//     "Salary Structure",
//     "CTC Salary Structure",
//     "New Salary Structure",
//     "Salary structure",
//     "Test Structure",
//     "Test Structure 2",
//     "TEST3",
//   ],
//   Leave: [
//     "Employee Leave Policy",
//     "Intern Leave Policy",
//   ],
//   Attendance: [
//     "Daily",
//   ],
//   Designation: [
//     "ASSOCIATE SOFTWARE ENGINEER",
//     "BUSINESS DEVELOPMENT EXECUTIVE",
//     "BUSINESS DEVELOPMENT MANAGER",
//     "Cloud DevOps Engineer",
//     "Data Analyst",
//     "Devops Engineer",
//     "Flutter Developer",
//     "HR EXECUTIVE",
//     "HR MANAGER",
//     "HR RECRUITER",
//     "OFFICE BOY",
//     "PROJECT LEAD",
//     "PROJECT MANAGER",
//     "Quality Analyst",
//     "React Developer",
//   ],
//   "Emp Status": [
//     "Current Employees",
//     "Left Employees",
//   ],
// };

// export interface MailMergeStateProps {
//   document?: string;
//   setDocument?: Dispatch<SetStateAction<string>>;
//   month?: string;
//   setMonth?: Dispatch<SetStateAction<string>>;
//   filters?: string[];
//   setFilters?: Dispatch<SetStateAction<string[]>>;
// }

// interface MailMergeToolbarProps {
//   document: string;
//   setDocument: Dispatch<SetStateAction<string>>;
//   month: string;
//   setMonth: Dispatch<SetStateAction<string>>;
// }

// export function MailMergeToolbar({
//   document,
//   setDocument,
//   month,
//   setMonth,
// }: MailMergeToolbarProps) {
//   return (
//     <div
//       className="
//         flex
//         w-full
//         min-h-[58px]
//         flex-wrap
//         items-center
//         justify-end
//         gap-3
//         border-b
//         border-[#e5e7eb]
//         bg-white
//         px-4
//         py-2
//       "
//     >
//       {/* SELECT DOCUMENT */}
//       <div className="relative hidden sm:block">
//         <select
//           value={document}
//           onChange={(event) =>
//             setDocument(event.target.value)
//           }
//           className="
//             h-[48px]
//             w-[220px]
//             appearance-none
//             rounded-[6px]
//             border
//             border-[#e1e4e8]
//             bg-white
//             px-4
//             pr-10
//             text-[15px]
//             font-medium
//             text-[#555]
//             outline-none
//             focus:border-[#2196df]
//           "
//         >
//           <option value="">
//             Select Document
//           </option>
//           <option value="employee">
//             Employee Document
//           </option>
//           <option value="salary">
//             Salary Document
//           </option>
//           <option value="leave">
//             Leave Document
//           </option>
//         </select>

//         <ChevronDown
//           size={17}
//           className="
//             pointer-events-none
//             absolute
//             right-3
//             top-1/2
//             -translate-y-1/2
//             text-[#777]
//           "
//         />
//       </div>

//       {/* MONTH */}
//       <div className="relative hidden md:block">
//         <select
//           value={month}
//           onChange={(event) =>
//             setMonth(event.target.value)
//           }
//           className="
//             h-[48px]
//             w-[190px]
//             appearance-none
//             rounded-[6px]
//             border
//             border-[#e1e4e8]
//             bg-white
//             px-4
//             pr-10
//             text-[15px]
//             font-medium
//             text-[#555]
//             outline-none
//             focus:border-[#2196df]
//           "
//         >
//           <option value="Sep/2026">
//             Sep/2026
//           </option>
//           <option value="Aug/2026">
//             Aug/2026
//           </option>
//           <option value="Jul/2026">
//             Jul/2026
//           </option>
//         </select>

//         <ChevronDown
//           size={17}
//           className="
//             pointer-events-none
//             absolute
//             right-3
//             top-1/2
//             -translate-y-1/2
//             text-[#777]
//           "
//         />
//       </div>

//       {/* ATTACH DOCUMENT */}
//       <button
//         type="button"
//         disabled
//         className="
//           hidden
//           h-[48px]
//           w-[190px]
//           items-center
//           justify-center
//           rounded-[6px]
//           bg-[#d8d8d8]
//           px-4
//           text-[15px]
//           font-medium
//           text-[#999]
//           lg:flex
//         "
//       >
//         Attach Document To
//         <br />
//         ESS
//       </button>

//       {/* GENERATE */}
//       <button
//         type="button"
//         disabled
//         className="
//           hidden
//           h-[48px]
//           min-w-[125px]
//           items-center
//           justify-center
//           rounded-[6px]
//           bg-[#d8d8d8]
//           px-5
//           text-[15px]
//           font-medium
//           text-[#999]
//           xl:flex
//         "
//       >
//         Generate
//       </button>

//       {/* SEND MAIL */}
//       <button
//         type="button"
//         disabled
//         className="
//           hidden
//           h-[48px]
//           min-w-[125px]
//           items-center
//           justify-center
//           rounded-[6px]
//           bg-[#d8d8d8]
//           px-5
//           text-[15px]
//           font-medium
//           text-[#999]
//           xl:flex
//         "
//       >
//         <Mail
//           size={17}
//           className="mr-2"
//         />
//         Send
//         <br />
//         Mail
//       </button>

//       {/* FILTER */}
//       <button
//         type="button"
//         className="
//           flex
//           h-[42px]
//           w-[42px]
//           items-center
//           justify-center
//           text-[#667085]
//         "
//       >
//         <Filter size={20} />
//       </button>

//       {/* CLOCK */}
//       <button
//         type="button"
//         className="
//           flex
//           h-[42px]
//           w-[42px]
//           items-center
//           justify-center
//           text-[#667085]
//         "
//       >
//         <Clock3 size={20} />
//       </button>
//     </div>
//   );
// }

// export default function MailMergePage({
//   document: documentProp,
//   setDocument: setDocumentProp,
//   month: monthProp,
//   setMonth: setMonthProp,
//   filters: filtersProp,
//   setFilters: setFiltersProp,
// }: MailMergeStateProps = {}) {
//   const [localDocument, setLocalDocument] =
//     useState("");
//   const [localMonth, setLocalMonth] =
//     useState("Sep/2026");
//   const [localFilters, setLocalFilters] =
//     useState<string[]>([]);

//   const [openDropdown, setOpenDropdown] =
//     useState<DropdownKey | null>(null);

//   const [dropdownSelections, setDropdownSelections] =
//     useState<Record<DropdownKey, string[]>>({
//       Query: [],
//       Branch: [],
//       "Salary Structure": [],
//       Leave: [],
//       Attendance: [],
//       Designation: [],
//       "Emp Status": [],
//     });

//   const document =
//     documentProp ?? localDocument;
//   const setDocument =
//     setDocumentProp ?? setLocalDocument;

//   const month =
//     monthProp ?? localMonth;
//   const setMonth =
//     setMonthProp ?? setLocalMonth;

//   const filters =
//     filtersProp ?? localFilters;
//   const setFilters =
//     setFiltersProp ?? setLocalFilters;

//   const addFilter = () => {
//     setFilters((previous) => [
//       ...previous,
//       `Filter ${previous.length + 1}`,
//     ]);
//   };

//   const toggleDropdown = (name: DropdownKey) => {
//     setOpenDropdown((previous) =>
//       previous === name ? null : name,
//     );
//   };

//   const toggleDropdownOption = (
//     name: DropdownKey,
//     option: string,
//   ) => {
//     setDropdownSelections((previous) => {
//       const current = previous[name];

//       return {
//         ...previous,
//         [name]: current.includes(option)
//           ? current.filter((item) => item !== option)
//           : [...current, option],
//       };
//     });
//   };

//   const clearDropdown = (name: DropdownKey) => {
//     setDropdownSelections((previous) => ({
//       ...previous,
//       [name]: [],
//     }));
//   };

//   const renderDropdown = (name: DropdownKey) => {
//     const options = DROPDOWN_OPTIONS[name];
//     const selected = dropdownSelections[name];

//     return (
//       <div
//         className="
//           absolute
//           left-1/2
//           top-[calc(100%+4px)]
//           z-[9999]
//           w-[230px]
//           -translate-x-1/2
//           overflow-hidden
//           rounded-md
//           border
//           border-[#e5e7eb]
//           bg-white
//           shadow-[0_4px_12px_rgba(0,0,0,0.12)]
//         "
//       >
//         <div
//           className="
//             border-b
//             border-[#edf0f2]
//             px-3
//             py-2
//             text-left
//             text-[15px]
//             font-semibold
//             text-[#333]
//           "
//         >
//           {name}
//         </div>

//         <div
//           className={`
//             ${name === "Designation"
//               ? "max-h-[360px] overflow-y-auto"
//               : "max-h-[150px] overflow-y-auto"
//             }
//           `}
//         >
//           {options.map((option) => (
//             <label
//               key={option}
//               className="
//                 flex
//                 min-h-[48px]
//                 cursor-pointer
//                 items-center
//                 gap-3
//                 border-b
//                 border-[#f0f1f3]
//                 px-3
//                 text-left
//                 text-[14px]
//                 text-[#475467]
//                 hover:bg-[#fafafa]
//               "
//             >
//               <input
//                 type="checkbox"
//                 checked={selected.includes(option)}
//                 onChange={() =>
//                   toggleDropdownOption(name, option)
//                 }
//                 className="
//                   h-[19px]
//                   w-[19px]
//                   shrink-0
//                   accent-[#7e4031]
//                 "
//               />
//               <span className="leading-5">
//                 {option}
//               </span>
//             </label>
//           ))}

//           {options.length === 0 && (
//             <div
//               className="
//                 min-h-[58px]
//                 px-3
//                 py-3
//                 text-[13px]
//                 text-[#667085]
//               "
//             />
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={() => clearDropdown(name)}
//           className="
//             flex
//             h-[48px]
//             w-full
//             items-center
//             justify-center
//             gap-2
//             border-t
//             border-[#edf0f2]
//             bg-white
//             text-[15px]
//             text-[#b7b9bd]
//             hover:bg-[#fafafa]
//           "
//         >
//           <X size={17} />
//           Clear
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div
//     className="
//       relative
//       min-h-screen
//       w-full
//       overflow-x-hidden
//       bg-[#f5f7fb]
//     "
//   >
//       <div
//         className="
//           relative
//           w-full
//           overflow-visible
//           rounded-[6px]
//           bg-white
//           shadow-sm
//         "
//       >
//         {/* FILTER / SEARCH BAR */}
//         <div
//           className="
//             relative
//             flex
//             min-h-[58px]
//             w-full
//             items-center
//             gap-4
//             overflow-visible
//             rounded-[12px]
//             border
//             border-[#b17869]
//             bg-[#fff9f7]
//             px-4
//           "
//         >
//           {/* SEARCH */}
//           <div
//             className="
//               relative
//               flex
//               min-w-[230px]
//               shrink-0
//               items-center
//             "
//           >
//             <Search
//               size={20}
//               className="
//                 absolute
//                 left-3
//                 text-[#98a2b3]
//               "
//             />

//             <input
//               type="text"
//               placeholder="Start Typing..."
//               className="
//                 h-[42px]
//                 w-full
//                 rounded-md
//                 border-0
//                 bg-white
//                 pl-10
//                 pr-3
//                 text-[14px]
//                 text-[#555]
//                 outline-none
//                 placeholder:text-[#a5a9b1]
//               "
//             />
//           </div>

//           {/* ADD FILTER */}
//           <button
//             type="button"
//             onClick={addFilter}
//             className="
//               flex
//               shrink-0
//               items-center
//               gap-2
//               text-[15px]
//               font-medium
//               text-[#555]
//               hover:text-[#2196df]
//             "
//           >
//             <Plus size={20} />
//             Add Filter
//           </button>

//           {/* QUERY */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               onClick={() => toggleDropdown("Query")}
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 text-[15px]
//                 font-medium
//                 text-[#555]
//               "
//             >
//               Query
//               {openDropdown === "Query" ? (
//                 <ChevronUp size={15} />
//               ) : (
//                 <ChevronDown size={15} />
//               )}
//             </button>

//             {openDropdown === "Query" &&
//               renderDropdown("Query")}
//           </div>

//           {/* BRANCH */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               onClick={() => toggleDropdown("Branch")}
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 text-[15px]
//                 font-medium
//                 text-[#555]
//               "
//             >
//               Branch
//               {openDropdown === "Branch" ? (
//                 <ChevronUp size={15} />
//               ) : (
//                 <ChevronDown size={15} />
//               )}
//             </button>

//             {openDropdown === "Branch" &&
//               renderDropdown("Branch")}
//           </div>

//           {/* SALARY STRUCTURE */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               onClick={() =>
//                 toggleDropdown("Salary Structure")
//               }
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 text-[15px]
//                 font-medium
//                 text-[#555]
//               "
//             >
//               Salary Structure
//               {openDropdown === "Salary Structure" ? (
//                 <ChevronUp size={15} />
//               ) : (
//                 <ChevronDown size={15} />
//               )}
//             </button>

//             {openDropdown === "Salary Structure" &&
//               renderDropdown("Salary Structure")}
//           </div>

//           {/* LEAVE */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               onClick={() => toggleDropdown("Leave")}
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 text-[15px]
//                 font-medium
//                 text-[#555]
//               "
//             >
//               Leave
//               {openDropdown === "Leave" ? (
//                 <ChevronUp size={15} />
//               ) : (
//                 <ChevronDown size={15} />
//               )}
//             </button>

//             {openDropdown === "Leave" &&
//               renderDropdown("Leave")}
//           </div>

//           {/* ATTENDANCE */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               onClick={() =>
//                 toggleDropdown("Attendance")
//               }
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 text-[15px]
//                 font-medium
//                 text-[#555]
//               "
//             >
//               Attendance
//               {openDropdown === "Attendance" ? (
//                 <ChevronUp size={15} />
//               ) : (
//                 <ChevronDown size={15} />
//               )}
//             </button>

//             {openDropdown === "Attendance" &&
//               renderDropdown("Attendance")}
//           </div>

//           {/* DESIGNATION */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               onClick={() =>
//                 toggleDropdown("Designation")
//               }
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 text-[15px]
//                 font-medium
//                 text-[#555]
//               "
//             >
//               Designation
//               {openDropdown === "Designation" ? (
//                 <ChevronUp size={15} />
//               ) : (
//                 <ChevronDown size={15} />
//               )}
//             </button>

//             {openDropdown === "Designation" &&
//               renderDropdown("Designation")}
//           </div>

//           {/* EMPLOYEE STATUS */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               onClick={() =>
//                 toggleDropdown("Emp Status")
//               }
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-1
//                 text-[15px]
//                 font-medium
//                 text-[#555]
//               "
//             >
//               Emp Status
//               {openDropdown === "Emp Status" ? (
//                 <ChevronUp size={15} />
//               ) : (
//                 <ChevronDown size={15} />
//               )}
//             </button>

//             {openDropdown === "Emp Status" &&
//               renderDropdown("Emp Status")}
//           </div>

//           {/* MORE */}
//           <button
//             type="button"
//             className="
//               ml-auto
//               flex
//               shrink-0
//               items-center
//               justify-center
//               text-[#777]
//             "
//           >
//             <MoreVertical size={21} />
//           </button>

//           {/* CLEAR */}
//           <button
//             type="button"
//             onClick={() => setFilters([])}
//             className="
//               flex
//               shrink-0
//               items-center
//               justify-center
//               text-[#d9534f]
//             "
//           >
//             <X size={21} />
//           </button>
//         </div>

//         {/* ACTIVE FILTERS */}
//         {filters.length > 0 && (
//           <div
//             className="
//               flex
//               flex-wrap
//               gap-2
//               border-b
//               border-[#e5e7eb]
//               px-5
//               py-3
//             "
//           >
//             {filters.map((filter) => (
//               <span
//                 key={filter}
//                 className="
//                   rounded-full
//                   bg-[#f1f5f9]
//                   px-3
//                   py-1
//                   text-[12px]
//                   text-[#475467]
//                 "
//               >
//                 {filter}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* EMPTY CONTENT AREA */}
//         <div
//           className="
//             min-h-[calc(100vh-180px)]
//             w-full
//             bg-[#f5f7fb]
//           "
//         />
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Dispatch, SetStateAction, MouseEvent as ReactMouseEvent } from "react";

import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Filter,
  Mail,
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";


type DropdownKey =
  | "Query"
  | "Branch"
  | "Salary Structure"
  | "Leave"
  | "Attendance"
  | "Designation"
  | "Emp Status";

const DROPDOWN_OPTIONS: Record<DropdownKey, string[]> = {
  Query: [],
  Branch: [
    "Koundinyasa Technology Services Pvt. Ltd.",
  ],
  "Salary Structure": [
    "Salary Structure",
    "CTC Salary Structure",
    "New Salary Structure",
    "Salary structure",
    "Test Structure",
    "Test Structure 2",
    "TEST3",
  ],
  Leave: [
    "Employee Leave Policy",
    "Intern Leave Policy",
  ],
  Attendance: [
    "Daily",
  ],
  Designation: [
    "ASSOCIATE SOFTWARE ENGINEER",
    "BUSINESS DEVELOPMENT EXECUTIVE",
    "BUSINESS DEVELOPMENT MANAGER",
    "Cloud DevOps Engineer",
    "Data Analyst",
    "Devops Engineer",
    "Flutter Developer",
    "HR EXECUTIVE",
    "HR MANAGER",
    "HR RECRUITER",
    "OFFICE BOY",
    "PROJECT LEAD",
    "PROJECT MANAGER",
    "Quality Analyst",
    "React Developer",
  ],
  "Emp Status": [
    "Current Employees",
    "Left Employees",
  ],
};

export interface MailMergeStateProps {
  document?: string;
  setDocument?: Dispatch<SetStateAction<string>>;
  month?: string;
  setMonth?: Dispatch<SetStateAction<string>>;
  filters?: string[];
  setFilters?: Dispatch<SetStateAction<string[]>>;
}

interface MailMergeToolbarProps {
  document: string;
  setDocument: Dispatch<SetStateAction<string>>;
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
}

function getDropdownPortalRoot() {
  const rootId = "mail-merge-dropdown-portal";

  let root = globalThis.document.getElementById(rootId);

  if (!root) {
    root = globalThis.document.createElement("div");
    root.id = rootId;

    Object.assign(root.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "2147483647",
      overflow: "visible",
    });

    globalThis.document.body.appendChild(root);
  }

  return root;
}

export function MailMergeToolbar({
  document,
  setDocument,
  month,
  setMonth,
}: MailMergeToolbarProps) {
  const [documentDropdownOpen, setDocumentDropdownOpen] =
    useState(false);

  const [monthDropdownOpen, setMonthDropdownOpen] =
    useState(false);

  const documentButtonRef =
    useRef<HTMLButtonElement | null>(null);

  const monthButtonRef =
    useRef<HTMLButtonElement | null>(null);

  const [documentMenuPosition, setDocumentMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const [monthMenuPosition, setMonthMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const documentOptions = [
    {
      value: "",
      label: "Select Document",
    },
    {
      value: "employee",
      label: "Employee Document",
    },
    {
      value: "salary",
      label: "Salary Document",
    },
    {
      value: "leave",
      label: "Leave Document",
    },
  ];

  const monthOptions = [
    "Sep/2026",
    "Aug/2026",
    "Jul/2026",
  ];

  const updateDocumentPosition = () => {
    const button = documentButtonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    setDocumentMenuPosition({
      top: rect.bottom + 5,
      left: rect.left,
    });
  };

  const updateMonthPosition = () => {
    const button = monthButtonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    setMonthMenuPosition({
      top: rect.bottom + 5,
      left: rect.left,
    });
  };

  useEffect(() => {
    if (
      !documentDropdownOpen &&
      !monthDropdownOpen
    ) {
      return;
    }

    const updatePositions = () => {
      if (documentDropdownOpen) {
        updateDocumentPosition();
      }

      if (monthDropdownOpen) {
        updateMonthPosition();
      }
    };

    updatePositions();

    window.addEventListener(
      "resize",
      updatePositions,
    );

    window.addEventListener(
      "scroll",
      updatePositions,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePositions,
      );

      window.removeEventListener(
        "scroll",
        updatePositions,
        true,
      );
    };
  }, [
    documentDropdownOpen,
    monthDropdownOpen,
  ]);

  return (
    <div
      className="
        relative
        z-[1000]
        w-full
        min-w-0
        max-w-full
        overflow-x-auto
        overflow-y-hidden
        border-b
        border-[#e5e7eb]
        bg-white
        [scrollbar-width:thin]
      "
    >
      <div
        className="
          flex
          min-h-[58px]
          w-max
          min-w-max
          flex-nowrap
          items-center
          gap-3
          whitespace-nowrap
          px-4
          py-2
        "
      >
      {/* SELECT DOCUMENT */}
      <div
        className="
          relative
          z-[1001]
          flex
          shrink-0
          overflow-visible
        "
      >
        <button
          ref={documentButtonRef}
          type="button"
          onClick={() => {
            updateDocumentPosition();

            setDocumentDropdownOpen(
              (previous) => !previous,
            );

            setMonthDropdownOpen(false);
          }}
          className={`
            flex
            h-[48px]
            w-[220px]
            items-center
            justify-between
            gap-2
            rounded-[6px]
            border
            bg-white
            px-4
            text-left
            text-[15px]
            font-medium
            text-[#555]
            outline-none
            transition
            ${
              documentDropdownOpen
                ? "border-[#b17869] ring-1 ring-[#b17869]"
                : "border-[#e1e4e8]"
            }
          `}
          aria-haspopup="listbox"
          aria-expanded={documentDropdownOpen}
        >
          <span className="min-w-0 flex-1 truncate">
            {documentOptions.find(
              (option) =>
                option.value === document,
            )?.label ?? "Select Document"}
          </span>

          {documentDropdownOpen ? (
            <ChevronUp
              size={17}
              className="shrink-0 text-[#777]"
            />
          ) : (
            <ChevronDown
              size={17}
              className="shrink-0 text-[#777]"
            />
          )}
        </button>

        {documentDropdownOpen &&
          createPortal(
            <div
              className="
                fixed
                z-[2147483647]
                w-[220px]
                max-w-[calc(100vw-16px)]
                overflow-hidden
                rounded-[6px]
                border
                border-[#b17869]
                bg-white
                shadow-[0_5px_15px_rgba(0,0,0,0.16)]
                pointer-events-auto
              "
              style={{
                top: `${documentMenuPosition.top}px`,
                left: `${documentMenuPosition.left}px`,
                position: "fixed",
                zIndex: 2147483647,
              }}
              role="listbox"
            >
              {documentOptions.map((option) => (
                <button
                  key={
                    option.value ||
                    "select-document"
                  }
                  type="button"
                  role="option"
                  aria-selected={
                    document === option.value
                  }
                  onClick={() => {
                    setDocument(option.value);
                    setDocumentDropdownOpen(false);
                  }}
                  className={`
                    flex
                    min-h-[44px]
                    w-full
                    items-center
                    px-4
                    text-left
                    text-[14px]
                    transition-colors
                    ${
                      document === option.value
                        ? "bg-[#fff4f0] font-semibold text-[#7e4031]"
                        : "text-[#475467] hover:bg-[#fff9f7] hover:text-[#7e4031]"
                    }
                  `}
                >
                  <span className="min-w-0 truncate">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>,
            getDropdownPortalRoot(),
          )}
      </div>

      {/* MONTH */}
      <div
        className="
          relative
          z-[1001]
          flex
          shrink-0
          overflow-visible
        "
      >
        <button
          ref={monthButtonRef}
          type="button"
          onClick={() => {
            updateMonthPosition();

            setMonthDropdownOpen(
              (previous) => !previous,
            );

            setDocumentDropdownOpen(false);
          }}
          className={`
            flex
            h-[48px]
            w-[190px]
            items-center
            justify-between
            gap-2
            rounded-[6px]
            border
            bg-white
            px-4
            text-left
            text-[15px]
            font-medium
            text-[#555]
            outline-none
            transition
            ${
              monthDropdownOpen
                ? "border-[#b17869] ring-1 ring-[#b17869]"
                : "border-[#e1e4e8]"
            }
          `}
          aria-haspopup="listbox"
          aria-expanded={monthDropdownOpen}
        >
          <span className="min-w-0 flex-1 truncate">
            {month}
          </span>

          {monthDropdownOpen ? (
            <ChevronUp
              size={17}
              className="shrink-0 text-[#777]"
            />
          ) : (
            <ChevronDown
              size={17}
              className="shrink-0 text-[#777]"
            />
          )}
        </button>

        {monthDropdownOpen &&
          createPortal(
            <div
              className="
                fixed
                z-[2147483647]
                w-[190px]
                max-w-[calc(100vw-16px)]
                overflow-hidden
                rounded-[6px]
                border
                border-[#b17869]
                bg-white
                shadow-[0_5px_15px_rgba(0,0,0,0.16)]
                pointer-events-auto
              "
              style={{
                top: `${monthMenuPosition.top}px`,
                left: `${monthMenuPosition.left}px`,
                position: "fixed",
                zIndex: 2147483647,
              }}
              role="listbox"
            >
              {monthOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={
                    month === option
                  }
                  onClick={() => {
                    setMonth(option);
                    setMonthDropdownOpen(false);
                  }}
                  className={`
                    flex
                    min-h-[44px]
                    w-full
                    items-center
                    px-4
                    text-left
                    text-[14px]
                    transition-colors
                    ${
                      month === option
                        ? "bg-[#fff4f0] font-semibold text-[#7e4031]"
                        : "text-[#475467] hover:bg-[#fff9f7] hover:text-[#7e4031]"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>,
            getDropdownPortalRoot(),
          )}
      </div>

      {/* ATTACH DOCUMENT */}
      <button
        type="button"
        disabled
        className="
          flex
          shrink-0
          h-[48px]
          w-[190px]
          items-center
          justify-center
          rounded-[6px]
          bg-[#d8d8d8]
          px-4
          text-[15px]
          font-medium
          text-[#999]
          lg:flex
        "
      >
        Attach Document To
        <br />
        ESS
      </button>

      {/* GENERATE */}
      <button
        type="button"
        disabled
        className="
          flex
          shrink-0
          h-[48px]
          min-w-[125px]
          items-center
          justify-center
          rounded-[6px]
          bg-[#d8d8d8]
          px-5
          text-[15px]
          font-medium
          text-[#999]
        "
      >
        Generate
      </button>

      {/* SEND MAIL */}
      <button
        type="button"
        disabled
        className="
          flex
          shrink-0
          h-[48px]
          min-w-[125px]
          items-center
          justify-center
          rounded-[6px]
          bg-[#d8d8d8]
          px-5
          text-[15px]
          font-medium
          text-[#999]
        "
      >
        <Mail
          size={17}
          className="mr-2"
        />
        Send
        <br />
        Mail
      </button>

      {/* FILTER */}
      <button
        type="button"
        className="
          flex
          h-[42px]
          w-[42px]
          shrink-0
          items-center
          justify-center
          text-[#667085]
        "
      >
        <Filter size={20} />
      </button>

      {/* CLOCK */}
      <button
        type="button"
        className="
          flex
          h-[42px]
          w-[42px]
          shrink-0
          items-center
          justify-center
          text-[#667085]
        "
      >
        <Clock3 size={20} />
      </button>
      </div>
    </div>
  );
}

export default function MailMergePage({
  document: documentProp,
  setDocument: setDocumentProp,
  month: monthProp,
  setMonth: setMonthProp,
  filters: filtersProp,
  setFilters: setFiltersProp,
}: MailMergeStateProps = {}) {
  const [localDocument, setLocalDocument] =
    useState("");
  const [localMonth, setLocalMonth] =
    useState("Sep/2026");
  const [localFilters, setLocalFilters] =
    useState<string[]>([]);

  const [openDropdown, setOpenDropdown] =
    useState<DropdownKey | null>(null);

  const [dropdownSelections, setDropdownSelections] =
    useState<Record<DropdownKey, string[]>>({
      Query: [],
      Branch: [],
      "Salary Structure": [],
      Leave: [],
      Attendance: [],
      Designation: [],
      "Emp Status": [],
    });

  const document =
    documentProp ?? localDocument;
  const setDocument =
    setDocumentProp ?? setLocalDocument;

  const month =
    monthProp ?? localMonth;
  const setMonth =
    setMonthProp ?? setLocalMonth;

  const filters =
    filtersProp ?? localFilters;
  const setFilters =
    setFiltersProp ?? setLocalFilters;

  const addFilter = () => {
    setFilters((previous) => [
      ...previous,
      `Filter ${previous.length + 1}`,
    ]);
  };

  const dropdownAnchorRef =
    useRef<HTMLButtonElement | null>(null);

  const [dropdownMenuPosition, setDropdownMenuPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const updateDropdownMenuPosition = () => {
    const button = dropdownAnchorRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    const menuWidth = 230;
    const viewportPadding = 8;

    const maxLeft = Math.max(
      viewportPadding,
      window.innerWidth -
        menuWidth -
        viewportPadding,
    );

    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      maxLeft,
    );

    setDropdownMenuPosition({
      top: rect.bottom + 4,
      left,
    });
  };

  const toggleDropdown = (
    name: DropdownKey,
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    const isClosing =
      openDropdown === name;

    if (isClosing) {
      dropdownAnchorRef.current = null;
      setOpenDropdown(null);
      return;
    }

    dropdownAnchorRef.current =
      event.currentTarget;

    const rect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 230;
    const viewportPadding = 8;

    const maxLeft = Math.max(
      viewportPadding,
      window.innerWidth -
        menuWidth -
        viewportPadding,
    );

    setDropdownMenuPosition({
      top: rect.bottom + 4,
      left: Math.min(
        Math.max(
          rect.left,
          viewportPadding,
        ),
        maxLeft,
      ),
    });

    setOpenDropdown(name);
  };

  useEffect(() => {
    if (!openDropdown) {
      return;
    }

    const updatePosition = () => {
      updateDropdownMenuPosition();
    };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition,
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition,
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true,
      );
    };
  }, [openDropdown]);

  const toggleDropdownOption = (
    name: DropdownKey,
    option: string,
  ) => {
    setDropdownSelections((previous) => {
      const current = previous[name];

      return {
        ...previous,
        [name]: current.includes(option)
          ? current.filter(
              (item) => item !== option,
            )
          : [...current, option],
      };
    });
  };

  const clearDropdown = (
    name: DropdownKey,
  ) => {
    setDropdownSelections(
      (previous) => ({
        ...previous,
        [name]: [],
      }),
    );
  };

  const renderDropdown = (
    name: DropdownKey,
  ) => {
    const options =
      DROPDOWN_OPTIONS[name];

    const selected =
      dropdownSelections[name];

    return createPortal(
      <div
        className="
          fixed
          z-[2147483647]
          w-[230px]
          max-w-[calc(100vw-16px)]
          overflow-hidden
          rounded-md
          border
          border-[#b17869]
          bg-white
          shadow-[0_6px_18px_rgba(126,64,49,0.22)]
        "
        style={{
          top: `${dropdownMenuPosition.top}px`,
          left: `${dropdownMenuPosition.left}px`,
          pointerEvents: "auto",
        }}
        role="listbox"
      >
        <div
          className="
            border-b
            border-[#d8b4aa]
            bg-[#fff9f7]
            px-3
            py-2
            text-left
            text-[15px]
            font-semibold
            text-[#7e4031]
          "
        >
          {name}
        </div>

        <div
          className={`
            ${
              name === "Designation"
                ? "max-h-[360px]"
                : "max-h-[150px]"
            }
            overflow-y-auto
            overflow-x-hidden
          `}
        >
          {options.map(
            (option) => (
              <label
                key={option}
                className={`
                  flex
                  min-h-[48px]
                  w-full
                  cursor-pointer
                  items-center
                  gap-3
                  border-b
                  border-[#f0f1f3]
                  px-3
                  text-left
                  text-[14px]
                  transition
                  ${
                    selected.includes(
                      option,
                    )
                      ? "bg-[#fff4f0] text-[#7e4031]"
                      : "text-[#475467] hover:bg-[#fff9f7]"
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(
                    option,
                  )}
                  onChange={() =>
                    toggleDropdownOption(
                      name,
                      option,
                    )
                  }
                  className="sr-only"
                />

                <span
                  className={`
                    flex
                    h-[19px]
                    w-[19px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-[4px]
                    border
                    transition
                    ${
                      selected.includes(
                        option,
                      )
                        ? "border-[#7e4031] bg-[#7e4031]"
                        : "border-[#98a2b3] bg-white"
                    }
                  `}
                >
                  {selected.includes(
                    option,
                  ) && (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l4 4L19 8" />
                    </svg>
                  )}
                </span>

                <span className="min-w-0 truncate leading-5">
                  {option}
                </span>
              </label>
            ),
          )}

          {options.length === 0 && (
            <div
              className="
                min-h-[58px]
                px-3
                py-3
                text-[13px]
                text-[#667085]
              "
            />
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            clearDropdown(name)
          }
          className="
            flex
            h-[48px]
            w-full
            items-center
            justify-center
            gap-2
            border-t
            border-[#d8b4aa]
            bg-white
            text-[15px]
            text-[#b7b9bd]
            hover:bg-[#fafafa]
          "
        >
          <X size={17} />
          Clear
        </button>
      </div>,
      getDropdownPortalRoot(),
    );
  };

  return (
    <div
      className="
        relative
        min-h-screen
        h-full
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
        overflow-y-auto
        bg-[#f5f7fb]
      "
    >
      <div
        className="
          relative
          z-[100]
          w-full
          min-w-0
          max-w-full
          overflow-visible
          rounded-[6px]
          bg-white
          shadow-sm
        "
      >
        {/* FILTER / SEARCH BAR */}
        <div
          className="
            relative
            z-[1000]
            w-full
            min-w-0
            max-w-full
            overflow-x-auto
            overflow-y-hidden
            rounded-[12px]
            border
            border-[#b17869]
            bg-[#fff9f7]
            [scrollbar-width:thin]
          "
        >
          <div
            className="
              flex
              min-h-[58px]
              w-max
              min-w-max
              flex-nowrap
              items-center
              gap-4
              whitespace-nowrap
              px-4
            "
          >
          {/* SEARCH */}
          <div
            className="
              relative
              flex
              min-w-[230px]
              shrink-0
              items-center
            "
          >
            <Search
              size={20}
              className="
                absolute
                left-3
                text-[#98a2b3]
              "
            />

            <input
              type="text"
              placeholder="Start Typing..."
              className="
                h-[42px]
                w-full
                rounded-md
                border-0
                bg-white
                pl-10
                pr-3
                text-[14px]
                text-[#555]
                outline-none
                placeholder:text-[#a5a9b1]
              "
            />
          </div>

          {/* ADD FILTER */}
          <button
            type="button"
            onClick={addFilter}
            className="
              flex
              shrink-0
              items-center
              gap-2
              text-[15px]
              font-medium
              text-[#555]
              hover:text-[#7e4031]
            "
          >
            <Plus size={20} />
            Add Filter
          </button>

          {/* QUERY */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => toggleDropdown("Query", event)}
              className={`
                flex
                shrink-0
                items-center
                gap-1
                text-[15px]
                font-medium
                transition-colors
                ${
                  openDropdown === "Query"
                    ? "text-[#7e4031]"
                    : "text-[#555] hover:text-[#7e4031]"
                }
              `}
            >
              Query
              {openDropdown === "Query" ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {openDropdown === "Query" &&
              renderDropdown("Query")}
          </div>

          {/* BRANCH */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => toggleDropdown("Branch", event)}
              className={`
                flex
                shrink-0
                items-center
                gap-1
                text-[15px]
                font-medium
                transition-colors
                ${
                  openDropdown === "Branch"
                    ? "text-[#7e4031]"
                    : "text-[#555] hover:text-[#7e4031]"
                }
              `}
            >
              Branch
              {openDropdown === "Branch" ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {openDropdown === "Branch" &&
              renderDropdown("Branch")}
          </div>

          {/* SALARY STRUCTURE */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => toggleDropdown("Salary Structure", event)}
              className={`
                flex
                shrink-0
                items-center
                gap-1
                text-[15px]
                font-medium
                transition-colors
                ${
                  openDropdown === "Salary Structure"
                    ? "text-[#7e4031]"
                    : "text-[#555] hover:text-[#7e4031]"
                }
              `}
            >
              Salary Structure
              {openDropdown === "Salary Structure" ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {openDropdown === "Salary Structure" &&
              renderDropdown("Salary Structure")}
          </div>

          {/* LEAVE */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => toggleDropdown("Leave", event)}
              className={`
                flex
                shrink-0
                items-center
                gap-1
                text-[15px]
                font-medium
                transition-colors
                ${
                  openDropdown === "Leave"
                    ? "text-[#7e4031]"
                    : "text-[#555] hover:text-[#7e4031]"
                }
              `}
            >
              Leave
              {openDropdown === "Leave" ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {openDropdown === "Leave" &&
              renderDropdown("Leave")}
          </div>

          {/* ATTENDANCE */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => toggleDropdown("Attendance", event)}
              className={`
                flex
                shrink-0
                items-center
                gap-1
                text-[15px]
                font-medium
                transition-colors
                ${
                  openDropdown === "Attendance"
                    ? "text-[#7e4031]"
                    : "text-[#555] hover:text-[#7e4031]"
                }
              `}
            >
              Attendance
              {openDropdown === "Attendance" ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {openDropdown === "Attendance" &&
              renderDropdown("Attendance")}
          </div>

          {/* DESIGNATION */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => toggleDropdown("Designation", event)}
              className={`
                flex
                shrink-0
                items-center
                gap-1
                text-[15px]
                font-medium
                transition-colors
                ${
                  openDropdown === "Designation"
                    ? "text-[#7e4031]"
                    : "text-[#555] hover:text-[#7e4031]"
                }
              `}
            >
              Designation
              {openDropdown === "Designation" ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {openDropdown === "Designation" &&
              renderDropdown("Designation")}
          </div>

          {/* EMPLOYEE STATUS */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(event) => toggleDropdown("Emp Status", event)}
              className={`
                flex
                shrink-0
                items-center
                gap-1
                text-[15px]
                font-medium
                transition-colors
                ${
                  openDropdown === "Emp Status"
                    ? "text-[#7e4031]"
                    : "text-[#555] hover:text-[#7e4031]"
                }
              `}
            >
              Emp Status
              {openDropdown === "Emp Status" ? (
                <ChevronUp size={15} />
              ) : (
                <ChevronDown size={15} />
              )}
            </button>

            {openDropdown === "Emp Status" &&
              renderDropdown("Emp Status")}
          </div>

          {/* MORE */}
          <button
            type="button"
            className="
              ml-auto
              flex
              shrink-0
              items-center
              justify-center
              text-[#777]
            "
          >
            <MoreVertical size={21} />
          </button>

          {/* CLEAR */}
          <button
            type="button"
            onClick={() => setFilters([])}
            className="
              flex
              shrink-0
              items-center
              justify-center
              text-[#d9534f]
            "
          >
            <X size={21} />
          </button>
          </div>
        </div>

        {/* SELECTED DROPDOWN FILTERS */}
        {Object.entries(dropdownSelections).some(
          ([, values]) => values.length > 0,
        ) && (
          <div
            className="
              flex
              flex-wrap
              gap-2
              border-b
              border-[#e5e7eb]
              bg-[#fff9f7]
              px-5
              py-2
            "
          >
            {Object.entries(dropdownSelections).flatMap(
              ([name, values]) =>
                values.map((value) => (
                  <span
                    key={`${name}-${value}`}
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      border
                      border-[#b17869]
                      bg-[#fff4f0]
                      px-3
                      py-1
                      text-[12px]
                      font-medium
                      text-[#7e4031]
                    "
                  >
                    {value}
                  </span>
                )),
            )}
          </div>
        )}

        {/* ACTIVE FILTERS */}
        {filters.length > 0 && (
          <div
            className="
              flex
              flex-wrap
              gap-2
              border-b
              border-[#e5e7eb]
              px-5
              py-3
            "
          >
            {filters.map((filter) => (
              <span
                key={filter}
                className="
                  rounded-full
                  bg-[#f1f5f9]
                  px-3
                  py-1
                  text-[12px]
                  text-[#475467]
                "
              >
                {filter}
              </span>
            ))}
          </div>
        )}

        {/* EMPTY CONTENT AREA */}
        <div
          className="
            min-h-[calc(100vh-180px)]
            w-full
            bg-[#f5f7fb]
          "
        />
      </div>
    </div>
  );
}
