// import {
//   useEffect,
//   useRef,
//   useState,
//   type ReactNode,
// } from "react";

// import {
//   Check,
//   ChevronDown,
//   X,
// } from "lucide-react";

// export type FilterOption =
//   | string
//   | {
//       id?: string | number;
//       label?: string;
//       name?: string;
//       value?: string;
//     };

// type FilterDropdownProps = {
//   label: string;
//   options: FilterOption[];
//   selected: string[];
//   onChange: (values: string[]) => void;
//   isLoading?: boolean;
//   /** "checkbox" (default) = multi-select list. "text" = free-text query box (Figma "Query" filter). */
//   variant?: "checkbox" | "text";
//   /** Renders the trigger as a bordered pill with an icon (used by the Audit Log modal). */
//   boxed?: boolean;
//   icon?: ReactNode;
// };

// function getOptionValue(option: FilterOption): string {
//   if (typeof option === "string") {
//     return option;
//   }

//   return String(
//     option.value ??
//       option.id ??
//       option.label ??
//       option.name ??
//       ""
//   );
// }

// function getOptionLabel(option: FilterOption): string {
//   if (typeof option === "string") {
//     return option;
//   }

//   return String(
//     option.label ??
//       option.name ??
//       option.value ??
//       option.id ??
//       ""
//   );
// }

// export default function FilterDropdown({
//   label,
//   options,
//   selected,
//   onChange,
//   isLoading = false,
//   variant = "checkbox",
//   boxed = false,
//   icon,
// }: FilterDropdownProps) {
//   const [open, setOpen] = useState(false);

//   const [dropdownPosition, setDropdownPosition] =
//     useState({
//       top: 0,
//       left: 0,
//       right: "auto" as number | "auto",
//     });

//   const wrapperRef =
//     useRef<HTMLDivElement>(null);

//   const buttonRef =
//     useRef<HTMLButtonElement>(null);

//   // --------------------------------------------------
//   // OPTIONS
//   // --------------------------------------------------

//   const normalizedOptions = options
//     .map((option) => ({
//       value: getOptionValue(option),
//       label: getOptionLabel(option),
//     }))
//     .filter(
//       (option) => option.label.trim() !== ""
//     );

//   const dropdownWidth =
//     variant === "text" ? 260 : label === "Designation" ? 390 : 290;

//   // --------------------------------------------------
//   // OPEN DROPDOWN
//   // --------------------------------------------------

//   const openDropdown = () => {
//     if (!buttonRef.current) {
//       return;
//     }

//     const rect =
//       buttonRef.current.getBoundingClientRect();

//     const dropdownTop =
//       rect.bottom + 4;

//     let dropdownLeft = rect.left;

//     /*
//      * Keep dropdown inside viewport.
//      */
//     if (
//       dropdownLeft + dropdownWidth >
//       window.innerWidth - 8
//     ) {
//       dropdownLeft =
//         window.innerWidth -
//         dropdownWidth -
//         8;
//     }

//     if (dropdownLeft < 8) {
//       dropdownLeft = 8;
//     }

//     setDropdownPosition({
//       top: dropdownTop,
//       left: dropdownLeft,
//       right: "auto",
//     });

//     setOpen(true);
//   };

//   // --------------------------------------------------
//   // CLOSE WHEN CLICKING OUTSIDE
//   // --------------------------------------------------

//   useEffect(() => {
//     const handleOutsideClick = (
//       event: MouseEvent
//     ) => {
//       const target =
//         event.target as Node;

//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(target)
//       ) {
//         setOpen(false);
//       }
//     };

//     if (open) {
//       document.addEventListener(
//         "mousedown",
//         handleOutsideClick
//       );
//     }

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleOutsideClick
//       );
//     };
//   }, [open]);

//   // --------------------------------------------------
//   // CLOSE / UPDATE WHEN WINDOW CHANGES
//   // --------------------------------------------------

//   useEffect(() => {
//     if (!open) {
//       return;
//     }

//     const updatePosition = () => {
//       if (!buttonRef.current) {
//         return;
//       }

//       const rect =
//         buttonRef.current.getBoundingClientRect();

//       let dropdownLeft = rect.left;

//       if (
//         dropdownLeft + dropdownWidth >
//         window.innerWidth - 8
//       ) {
//         dropdownLeft =
//           window.innerWidth -
//           dropdownWidth -
//           8;
//       }

//       if (dropdownLeft < 8) {
//         dropdownLeft = 8;
//       }

//       setDropdownPosition({
//         top: rect.bottom + 4,
//         left: dropdownLeft,
//         right: "auto",
//       });
//     };

//     window.addEventListener(
//       "resize",
//       updatePosition
//     );

//     window.addEventListener(
//       "scroll",
//       updatePosition,
//       true
//     );

//     return () => {
//       window.removeEventListener(
//         "resize",
//         updatePosition
//       );

//       window.removeEventListener(
//         "scroll",
//         updatePosition,
//         true
//       );
//     };
//   }, [open, dropdownWidth]);

//   // --------------------------------------------------
//   // SELECT / UNSELECT
//   // --------------------------------------------------

//   const toggleOption = (
//     value: string
//   ) => {
//     if (selected.includes(value)) {
//       onChange(
//         selected.filter(
//           (item) => item !== value
//         )
//       );
//     } else {
//       onChange([
//         ...selected,
//         value,
//       ]);
//     }
//   };

//   // --------------------------------------------------
//   // CLEAR
//   // --------------------------------------------------

//   const clearSelected = () => {
//     onChange([]);
//   };

//   // --------------------------------------------------
//   // SELECT ALL
//   // --------------------------------------------------

//   const allValues =
//     normalizedOptions.map(
//       (option) => option.value
//     );

//   const allSelected =
//     allValues.length > 0 &&
//     allValues.every((value) =>
//       selected.includes(value)
//     );

//   const toggleAll = () => {
//     if (allSelected) {
//       onChange([]);
//     } else {
//       onChange(allValues);
//     }
//   };

//   // --------------------------------------------------
//   // UI
//   // --------------------------------------------------

//   return (
//     <div
//       ref={wrapperRef}
//       className="relative shrink-0 whitespace-nowrap"
//     >
//       {/* FILTER BUTTON */}

//       <button
//         ref={buttonRef}
//         type="button"
//         onClick={() => {
//           if (open) {
//             setOpen(false);
//           } else {
//             openDropdown();
//           }
//         }}
//         className={
//           boxed
//             ? `flex h-10 items-center gap-2 rounded-lg border bg-white px-3 text-sm font-medium transition-colors ${
//                 open || selected.length > 0
//                   ? "border-[#C7AFA9] text-[#8B4A3C]"
//                   : "border-gray-200 text-[#26344D] hover:border-[#C7AFA9] hover:text-[#8B4A3C]"
//               }`
//             : `flex h-10 items-center gap-1.5 rounded-md px-1.5 text-sm font-medium transition-colors ${
//                 open || selected.length > 0
//                   ? "text-[#8B4A3C]"
//                   : "text-[#26344D]"
//               } hover:text-[#8B4A3C]`
//         }
//       >
//         {icon}
//         <span>{label}</span>

//         <ChevronDown
//           size={15}
//           strokeWidth={2}
//           className={`transition-transform ${open ? "rotate-180" : ""}`}
//         />

//         {selected.length > 0 && (
//           <span
//             className="
//               ml-0.5
//               flex
//               h-5
//               min-w-5
//               items-center
//               justify-center
//               rounded-full
//               bg-[#8B4A3C]
//               px-1
//               text-[10px]
//               font-semibold
//               text-white
//             "
//           >
//             {selected.length}
//           </span>
//         )}
//       </button>

//       {/* ==================================================
//           DROPDOWN

//           IMPORTANT:
//           fixed = dropdown will NOT be clipped by
//           overflow-x-auto / overflow-y-hidden
//          ================================================== */}

//       {open && (
//         <div
//           className="fixed z-[99999] overflow-hidden rounded-md border border-gray-200 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.15)]"
//           style={{
//             top: dropdownPosition.top,
//             left: dropdownPosition.left,
//             width: dropdownWidth,
//           }}
//         >
//           {variant === "text" ? (
//             <>
//               {/* QUERY (free-text) */}
//               <div className="px-4 py-3">
//                 <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
//                   {label}
//                 </p>

//                 <input
//                   type="text"
//                   autoFocus
//                   value={selected[0] ?? ""}
//                   onChange={(event) => {
//                     const value = event.target.value;
//                     onChange(value ? [value] : []);
//                   }}
//                   placeholder="Enter query text..."
//                   className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#C7AFA9] focus:bg-white"
//                 />
//               </div>

//               <div className="flex h-12 items-center justify-center border-t border-gray-200 bg-gray-50">
//                 <button
//                   type="button"
//                   onClick={clearSelected}
//                   disabled={selected.length === 0}
//                   className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <X size={16} />
//                   <span>Clear</span>
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               {/* HEADER */}

//               <div className="border-b border-[#F7E4DC] bg-[#FFF3F0] px-4 py-3">
//                 <label className="flex cursor-pointer items-center gap-3">
//                   <input
//                     type="checkbox"
//                     checked={allSelected}
//                     onChange={toggleAll}
//                     className="h-[18px] w-[18px] cursor-pointer accent-[#8B4A3C]"
//                   />

//                   <span className="text-sm font-semibold text-[#26344D]">
//                     {label}
//                   </span>
//                 </label>
//               </div>

//               {/* OPTIONS */}

//               <div
//                 className={`overflow-y-auto overflow-x-hidden ${
//                   label === "Designation" ? "max-h-[430px]" : "max-h-[280px]"
//                 }`}
//               >
//                 {isLoading ? (
//                   <div className="px-4 py-6 text-center text-sm text-gray-400">
//                     Loading...
//                   </div>
//                 ) : normalizedOptions.length === 0 ? (
//                   <div className="px-4 py-6 text-center text-sm text-gray-400">
//                     No data found
//                   </div>
//                 ) : (
//                   normalizedOptions.map((option, index) => {
//                     const checked = selected.includes(option.value);

//                     return (
//                       <label
//                         key={`${option.value}-${index}`}
//                         className="flex min-h-[46px] cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-2.5 hover:bg-gray-50"
//                       >
//                         {/* CHECKBOX */}

//                         <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
//                           <input
//                             type="checkbox"
//                             checked={checked}
//                             onChange={() => toggleOption(option.value)}
//                             className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[2px] border border-gray-400 checked:border-[#8B4A3C] checked:bg-[#8B4A3C]"
//                           />

//                           {checked && (
//                             <Check
//                               size={13}
//                               strokeWidth={3}
//                               className="pointer-events-none absolute text-white"
//                             />
//                           )}
//                         </span>

//                         {/* LABEL */}

//                         <span className="min-w-0 flex-1 whitespace-normal break-words text-sm font-normal text-gray-700">
//                           {option.label}
//                         </span>
//                       </label>
//                     );
//                   })
//                 )}
//               </div>

//               {/* CLEAR */}

//               <div className="flex h-12 items-center justify-center border-t border-gray-200 bg-white">
//                 <button
//                   type="button"
//                   onClick={clearSelected}
//                   disabled={selected.length === 0}
//                   className="flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <X size={16} />
//                   <span>Clear</span>
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  X,
} from "lucide-react";

export type FilterOption =
  | string
  | {
      id?: string | number;
      label?: string;
      name?: string;
      value?: string;
    };
    

type FilterDropdownProps = {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  isLoading?: boolean;
};

function getOptionValue(
  option: FilterOption
): string {
  if (typeof option === "string") {
    return option;
  }

  return String(
    option.value ??
      option.id ??
      option.label ??
      option.name ??
      ""
  );
}

function getOptionLabel(
  option: FilterOption
): string {
  if (typeof option === "string") {
    return option;
  }

  return String(
    option.label ??
      option.name ??
      option.value ??
      option.id ??
      ""
  );
}

/*
 * Figma fallback options.
 */
const FIGMA_OPTIONS: Record<
  string,
  FilterOption[]
> = {
  "salary structure": [
    {
      id: "ctc-salary-structure",
      label: "CTC Salary Structure",
    },
    {
      id: "new-salary-structure",
      label: "New Salary Structure",
    },
    {
      id: "salary-structure",
      label: "Salary structure",
    },
    {
      id: "test-structure",
      label: "Test Structure",
    },
    {
      id: "test-structure-2",
      label: "Test Structure 2",
    },
    {
      id: "test3",
      label: "TEST3",
    },
  ],

  branch: [
    {
      id: "kts",
      label:
        "Koundinyasa Technology Services Pvt. Ltd.",
    },
  ],

  attendance: [
    {
      id: "daily",
      label: "Daily",
    },
  ],

  leave: [
    {
      id: "employee-leave-policy",
      label:
        "Employee Leave Policy",
    },
    {
      id: "intern-leave-policy",
      label:
        "Intern Leave Policy",
    },
  ],

  "emp status": [
    {
      id: "current",
      label: "Current Employees",
    },
    {
      id: "left",
      label: "Left Employees",
    },
  ],

  designation: [
    {
      id: "associate-software-engineer",
      label:
        "ASSOCIATE SOFTWARE ENGINEER",
    },
    {
      id: "business-development-executive",
      label:
        "BUSINESS DEVELOPMENT EXECUTIVE",
    },
    {
      id: "business-development-manager",
      label:
        "BUSINESS DEVELOPMENT MANAGER",
    },
    {
      id: "cloud-devops-engineer",
      label: "Cloud DevOps Engineer",
    },
    {
      id: "data-analyst",
      label: "Data Analyst",
    },
    {
      id: "devops-engineer",
      label: "Devops Engineer",
    },
    {
      id: "flutter-developer",
      label: "Flutter Developer",
    },
    {
      id: "hr-executive",
      label: "HR EXECUTIVE",
    },
    {
      id: "hr-manager",
      label: "HR MANAGER",
    },
    {
      id: "hr-recruiter",
      label: "HR RECRUITER",
    },
    {
      id: "office-boy",
      label: "OFFICE BOY",
    },
    {
      id: "project-lead",
      label: "PROJECT LEAD",
    },
    {
      id: "project-manager",
      label: "PROJECT MANAGER",
    },
    {
      id: "quality-analyst",
      label: "Quality Analyst",
    },
    {
      id: "react-developer",
      label: "React Developer",
    },
    {
      id: "senior-qa-engineer",
      label: "Senior QA Engineer",
    },
    {
      id: "senior-software-engineer",
      label: "Senior Software Engineer",
    },
    {
      id: "senior-test-engineer",
      label: "Senior Test Engineer",
    },
    {
      id: "software-developer",
      label: "SOFTWARE DEVELOPER",
    },
    {
      id: "software-engineer",
      label: "Software Engineer",
    },
    {
      id: "software-intern",
      label: "SOFTWARE INTERN",
    },
    {
      id: "software-trainee",
      label: "SOFTWARE TRAINEE",
    },
    {
      id: "team-lead",
      label: "TEAM LEAD",
    },
    {
      id: "test-engineer",
      label: "Test Engineer",
    },
    {
      id: "ux-ui-designer",
      label: "UX/UI DESIGNER",
    },
  ],
};

export default function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  isLoading = false,
}: FilterDropdownProps) {
  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const buttonRef =
    useRef<HTMLButtonElement>(null);

  const [position, setPosition] =
    useState({
      top: 0,
      left: 0,
    });

  const filterKey =
    label.toLowerCase();

  /*
   * QUERY is a text-input dropdown,
   * not a checkbox dropdown.
   */
  const isQuery =
    filterKey === "query";

  /*
   * API data is used first.
   * Figma fallback values are used
   * only when API data is empty.
   */
  const sourceOptions =
    options.length > 0
      ? options
      : FIGMA_OPTIONS[filterKey] ?? [];

  const normalizedOptions =
    sourceOptions
      .map((option) => ({
        value:
          getOptionValue(option),
        label:
          getOptionLabel(option),
      }))
      .filter(
        (option) =>
          option.value !== "" &&
          option.label !== ""
      );

  const isDesignation =
    filterKey === "designation";

  const dropdownWidth =
    isDesignation ? 290 : 300;

  /*
   * POSITION
   */
  const updatePosition = () => {
    if (!buttonRef.current) {
      return;
    }

    const rect =
      buttonRef.current.getBoundingClientRect();

    let left = rect.left;

    if (
      left + dropdownWidth >
      window.innerWidth - 8
    ) {
      left =
        window.innerWidth -
        dropdownWidth -
        8;
    }

    if (left < 8) {
      left = 8;
    }

    setPosition({
      top: rect.bottom + 4,
      left,
    });
  };

  /*
   * OPEN
   */
  const handleButtonClick = () => {
    if (open) {
      setOpen(false);
      return;
    }

    updatePosition();
    setOpen(true);
  };

  /*
   * OUTSIDE CLICK
   */
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [open]);

  /*
   * POSITION ON SCROLL / RESIZE
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const update = () => {
      updatePosition();
    };

    window.addEventListener(
      "resize",
      update
    );

    window.addEventListener(
      "scroll",
      update,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );

      window.removeEventListener(
        "scroll",
        update,
        true
      );
    };
  }, [open]);

  /*
   * SELECT OPTION
   */
  const toggleOption = (
    value: string
  ) => {
    if (selected.includes(value)) {
      onChange(
        selected.filter(
          (item) =>
            item !== value
        )
      );
    } else {
      onChange([
        ...selected,
        value,
      ]);
    }
  };

  /*
   * SELECT ALL
   */
  const allValues =
    normalizedOptions.map(
      (option) => option.value
    );

  const allSelected =
    allValues.length > 0 &&
    allValues.every(
      (value) =>
        selected.includes(value)
    );

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(allValues);
    }
  };

  /*
   * CLEAR
   */
  const clearSelected = () => {
    onChange([]);
  };

  /*
   * QUERY INPUT
   *
   * Keeps the existing selected/onChange
   * functionality.
   */
  const queryValue =
    selected[0] ?? "";

  const handleQueryChange = (
    value: string
  ) => {
    if (value.trim() === "") {
      onChange([]);
      return;
    }

    onChange([value]);
  };

  return (
    <div
      ref={wrapperRef}
      className="
        relative
        shrink-0
        whitespace-nowrap
      "
    >
      {/* FILTER BUTTON */}

      <button
        ref={buttonRef}
        type="button"
        onClick={
          handleButtonClick
        }
        className={`
          flex
          h-10
          items-center
          gap-1.5
          rounded-md
          px-1.5
          text-sm
          font-medium
          transition-colors
          ${
            open
              ? "text-[#7C24FF]"
              : "text-[#26344D]"
          }
          hover:text-[#7C24FF]
        `}
      >
        <span className="truncate">
          {label}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`
            shrink-0
            transition-transform
            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />

        {selected.length > 0 &&
          !isQuery && (
            <span
              className="
                ml-0.5
                flex
                h-5
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-[#7C24FF]
                px-1
                text-[10px]
                font-semibold
                text-white
              "
            >
              {selected.length}
            </span>
          )}
      </button>

      {/* DROPDOWN */}

      {open && (
        <div
          className={`
            fixed
            z-[99999]
            overflow-hidden
            rounded-[8px]
            border
            border-[#D9DEE7]
            bg-white
            shadow-[0_6px_20px_rgba(15,23,42,0.20)]
            ${
              isDesignation
                ? "w-[min(290px,calc(100vw-24px))]"
                : "w-[min(300px,calc(100vw-24px))]"
            }
          `}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {/* =====================================
              QUERY DROPDOWN
             ===================================== */}

          {isQuery ? (
            <>
              {/* QUERY CONTENT */}

              <div
                className="
                  px-4
                  pb-4
                  pt-3
                "
              >
                <div
                  className="
                    mb-2
                    text-[12px]
                    font-medium
                    uppercase
                    leading-5
                    text-[#26344D]
                  "
                >
                  QUERY
                </div>

                <input
                  type="text"
                  value={queryValue}
                  onChange={(event) =>
                    handleQueryChange(
                      event.target.value
                    )
                  }
                  placeholder="Enter query text..."
                  autoFocus
                  className="
                    h-[37px]
                    w-full
                    rounded-[6px]
                    border
                    border-[#D9DEE7]
                    bg-white
                    px-3
                    text-[13px]
                    font-normal
                    text-[#26344D]
                    outline-none
                    placeholder:text-[#9AA3B2]
                    focus:border-[#B8C2D0]
                    focus:ring-0
                  "
                />
              </div>

              {/* QUERY CLEAR */}

              <div
                className="
                  flex
                  h-[40px]
                  items-center
                  justify-center
                  border-t
                  border-[#DDE2E9]
                  bg-[#F8FAFC]
                "
              >
                <button
                  type="button"
                  onClick={
                    clearSelected
                  }
                  disabled={
                    selected.length === 0
                  }
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[13px]
                    font-medium
                    text-[#374151]
                    transition-colors
                    hover:text-[#111827]
                    disabled:cursor-not-allowed
                    disabled:text-[#9CA3AF]
                  "
                >
                  <X
                    size={15}
                    strokeWidth={2.5}
                  />

                  <span>
                    Clear
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* =================================
                  PEACH HEADER
                 ================================= */}

              <div
                className="
                  flex
                  h-[45px]
                  items-center
                  border-b
                  border-[#E1E5EB]
                  bg-[#FFF4F0]
                  px-4
                "
              >
                <label
                  className="
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      relative
                      flex
                      h-[18px]
                      w-[18px]
                      shrink-0
                      items-center
                      justify-center
                    "
                  >
                    <input
                      type="checkbox"
                      checked={
                        allSelected
                      }
                      onChange={
                        toggleAll
                      }
                      className="
                        h-[18px]
                        w-[18px]
                        cursor-pointer
                        appearance-none
                        rounded-[4px]
                        border
                        border-[#8EA1BA]
                        bg-white
                        checked:border-[#814A3C]
                        checked:bg-[#814A3C]
                      "
                    />

                    {allSelected && (
                      <Check
                        size={13}
                        strokeWidth={3}
                        className="
                          pointer-events-none
                          absolute
                          text-white
                        "
                      />
                    )}
                  </span>

                  <span
                    className="
                      text-[13px]
                      font-semibold
                      leading-none
                      text-[#26344D]
                    "
                  >
                    {label}
                  </span>
                </label>
              </div>

              {/* =================================
                  OPTIONS
                 ================================= */}

              <div
                className={`
                  overflow-x-hidden
                  overflow-y-auto
                  ${
                    isDesignation
                      ? "max-h-[855px]"
                      : "max-h-[280px]"
                  }
                `}
              >
                {isLoading &&
                options.length === 0 ? (
                  <div
                    className="
                      px-4
                      py-6
                      text-center
                      text-sm
                      text-gray-400
                    "
                  >
                    Loading...
                  </div>
                ) : (
                  normalizedOptions.map(
                    (
                      option,
                      index
                    ) => {
                      const checked =
                        selected.includes(
                          option.value
                        );

                      return (
                        <label
                          key={`${option.value}-${index}`}
                          className="
                            flex
                            min-h-[40px]
                            cursor-pointer
                            items-center
                            gap-3
                            border-b
                            border-[#E7EAF0]
                            px-4
                            py-2
                            hover:bg-[#FAFAFA]
                          "
                        >
                          <span
                            className="
                              relative
                              flex
                              h-[18px]
                              w-[18px]
                              shrink-0
                              items-center
                              justify-center
                            "
                          >
                            <input
                              type="checkbox"
                              checked={
                                checked
                              }
                              onChange={() =>
                                toggleOption(
                                  option.value
                                )
                              }
                              className="
                                h-[18px]
                                w-[18px]
                                cursor-pointer
                                appearance-none
                                rounded-[4px]
                                border
                                border-[#8EA1BA]
                                bg-white
                                checked:border-[#814A3C]
                                checked:bg-[#814A3C]
                              "
                            />

                            {checked && (
                              <Check
                                size={13}
                                strokeWidth={3}
                                className="
                                  pointer-events-none
                                  absolute
                                  text-white
                                "
                              />
                            )}
                          </span>

                          <span
                            className="
                              min-w-0
                              flex-1
                              whitespace-normal
                              break-words
                              text-[13px]
                              font-normal
                              leading-5
                              text-[#26344D]
                            "
                          >
                            {
                              option.label
                            }
                          </span>
                        </label>
                      );
                    }
                  )
                )}
              </div>

              {/* =================================
                  CLEAR
                 ================================= */}

              <div
                className="
                  flex
                  h-[39px]
                  items-center
                  justify-center
                  border-t
                  border-[#DDE2E9]
                  bg-[#F8FAFC]
                "
              >
                <button
                  type="button"
                  onClick={
                    clearSelected
                  }
                  disabled={
                    selected.length === 0
                  }
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[13px]
                    font-medium
                    text-[#374151]
                    transition-colors
                    hover:text-[#111827]
                    disabled:cursor-not-allowed
                    disabled:text-[#9CA3AF]
                  "
                >
                  <X
                    size={15}
                    strokeWidth={2.5}
                  />

                  <span>
                    Clear
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}