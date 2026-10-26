










// // ReportFilters.tsx
// import { useEffect, useRef, useState } from "react";
// import { Search, Plus, MoreVertical, X, ChevronDown } from "lucide-react";
// import { FILTER_DROPDOWNS } from "../constants/leaveReport.constants";
// import type { FilterDropdownConfig } from "../constants/leaveReport.constants";
// import type { ReportFilterState } from "../types/filters";

// interface ReportFiltersProps {
//   filters: ReportFilterState;
//   onFiltersChange: (filters: ReportFilterState) => void;
//   onClearAll: () => void;
// }

// export default function ReportFilters({
//   filters,
//   onFiltersChange,
//   onClearAll,
// }: ReportFiltersProps) {
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   // Close any open dropdown when clicking outside the filter bar.
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
//         setOpenDropdown(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onFiltersChange({ ...filters, search: e.target.value });
//   };

//   const getSelected = (key: FilterDropdownConfig["key"]): string[] => {
//     if (key === "query") return [];
//     return (filters[key] as string[]) ?? [];
//   };

//   const toggleOption = (key: FilterDropdownConfig["key"], value: string) => {
//     const current = getSelected(key);
//     const next = current.includes(value)
//       ? current.filter((v) => v !== value)
//       : [...current, value];
//     onFiltersChange({ ...filters, [key]: next });
//   };

//   const toggleSelectAll = (dropdown: FilterDropdownConfig) => {
//     const allValues = (dropdown.options ?? []).map((o) => o.value);
//     const current = getSelected(dropdown.key);
//     const allSelected = allValues.length > 0 && allValues.every((v) => current.includes(v));
//     onFiltersChange({ ...filters, [dropdown.key]: allSelected ? [] : allValues });
//   };

//   const clearDropdown = (dropdown: FilterDropdownConfig) => {
//     if (dropdown.type === "search") {
//       onFiltersChange({ ...filters, query: "" });
//     } else {
//       onFiltersChange({ ...filters, [dropdown.key]: [] });
//     }
//   };

//   const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onFiltersChange({ ...filters, query: e.target.value });
//   };

//   return (
//     <div
//       ref={wrapperRef}
//       className="font-[Urbanist] bg-white rounded-lg shadow-sm border border-[#8B5A2B] px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3 flex-wrap w-full min-w-0 max-w-full"
//     >
//       {/* Search */}
//       <div className="font-[Urbanist] flex items-center gap-2 flex-1 min-w-0 w-full sm:min-w-[160px]">
//         <Search size={16} className="font-[Urbanist] text-gray-400 shrink-0" />
//         <input
//           type="text"
//           value={filters.search}
//           onChange={handleSearchChange}
//           placeholder="Start Typing..."
//           className="font-[Urbanist] w-full text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
//         />
//       </div>

//       {/* Add Filter */}
//       <button
//         type="button"
//         className="font-[Urbanist] flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-800 text-white text-sm font-medium hover:bg-orange-900 transition-colors whitespace-nowrap shrink-0"
//       >
//         <Plus size={14} />
//         Add Filter
//       </button>

//       {/* Dropdown filters */}
//       {FILTER_DROPDOWNS.map((dropdown) => {
//         const selected = getSelected(dropdown.key);
//         const hasSelection =
//           dropdown.type === "search" ? !!filters.query : selected.length > 0;
//         const allValues = (dropdown.options ?? []).map((o) => o.value);
//         const allSelected =
//           allValues.length > 0 && allValues.every((v) => selected.includes(v));

//         return (
//           <div key={dropdown.key} className="font-[Urbanist] relative min-w-0">
//             <button
//               type="button"
//               onClick={() =>
//                 setOpenDropdown((p) => (p === dropdown.key ? null : dropdown.key))
//               }
//               className={`font-[Urbanist] flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
//                 hasSelection ? "text-orange-800" : "text-gray-700 hover:text-orange-800"
//               }`}
//             >
//               {dropdown.label}
//               {hasSelection && dropdown.type === "checkbox" && (
//                 <span className="font-[Urbanist] text-xs bg-orange-100 text-orange-800 rounded-full px-1.5">
//                   {selected.length}
//                 </span>
//               )}
//               <ChevronDown size={14} className="font-[Urbanist] text-gray-500" />
//             </button>

//             {openDropdown === dropdown.key && (
//               <div className="font-[Urbanist] absolute z-20 mt-2 left-0 translate-x-0 sm:left-0 sm:translate-x-0 w-[min(16rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] bg-white border border-[#8B5A2B] rounded-md shadow-lg py-2 text-sm max-h-80 overflow-y-auto">
//                 {dropdown.type === "search" ? (
//                   <div className="font-[Urbanist] px-3">
//                     <input
//                       type="text"
//                       autoFocus
//                       value={filters.query}
//                       onChange={handleQueryChange}
//                       placeholder="Enter query..."
//                       className="font-[Urbanist] w-full border border-[#8B5A2B] rounded px-2 py-1.5 text-sm outline-none focus:border-[#8B5A2B]"
//                     />
//                   </div>
//                 ) : (
//                   <>
//                     {dropdown.showSelectAllHeader && (
//                       <label className="font-[Urbanist] flex items-center gap-2 px-3 py-2 font-semibold text-gray-800 cursor-pointer hover:bg-gray-50">
//                         <input
//                           type="checkbox"
//                           checked={allSelected}
//                           onChange={() => toggleSelectAll(dropdown)}
//                           className="font-[Urbanist] w-4 h-4 rounded border-[#8B5A2B] text-orange-800 focus:ring-orange-400"
//                         />
//                         {dropdown.label}
//                       </label>
//                     )}
//                     {dropdown.showHeaderLabel && (
//                       <div className="font-[Urbanist] px-3 py-2 font-semibold text-gray-800">
//                         {dropdown.label}
//                       </div>
//                     )}
//                     {(dropdown.options ?? []).map((option) => (
//                       <label
//                         key={option.value}
//                         className="font-[Urbanist] flex items-center gap-2 px-3 py-2 text-gray-700 cursor-pointer hover:bg-gray-50 min-w-0 break-words"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selected.includes(option.value)}
//                           onChange={() => toggleOption(dropdown.key, option.value)}
//                           className="font-[Urbanist] w-4 h-4 rounded border-[#8B5A2B] text-orange-800 focus:ring-orange-400"
//                         />
//                         {option.label}
//                       </label>
//                     ))}
//                   </>
//                 )}

//                 <div className="font-[Urbanist] border-t border-[#8B5A2B] mt-2 pt-2 px-3">
//                   <button
//                     type="button"
//                     onClick={() => clearDropdown(dropdown)}
//                     disabled={!hasSelection}
//                     className={`font-[Urbanist] flex items-center gap-1 text-sm ${
//                       hasSelection
//                         ? "text-red-500 hover:text-red-600"
//                         : "text-gray-300 cursor-not-allowed"
//                     }`}
//                   >
//                     <X size={14} />
//                     Clear
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {/* Kebab menu */}
//       <button
//         type="button"
//         aria-label="More filter options"
//         className="font-[Urbanist] text-gray-400 hover:text-gray-600 transition-colors"
//       >
//         <MoreVertical size={18} />
//       </button>

//       {/* Clear all */}
//       <button
//         type="button"
//         onClick={onClearAll}
//         aria-label="Clear all filters"
//         className="font-[Urbanist] text-red-500 hover:text-red-600 transition-colors"
//       >
//         <X size={18} />
//       </button>
//     </div>
//   );
// }



// ReportFilters.tsx

import { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  X,
  ChevronDown,
} from "lucide-react";

import { FILTER_DROPDOWNS } from "../constants/leaveReport.constants";
import type { FilterDropdownConfig } from "../constants/leaveReport.constants";
import type { ReportFilterState } from "../types/filters";

interface ReportFiltersProps {
  filters: ReportFilterState;
  onFiltersChange: (filters: ReportFilterState) => void;
  onClearAll: () => void;
}

interface DropdownPosition {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
}

export default function ReportFilters({
  filters,
  onFiltersChange,
  onClearAll,
}: ReportFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition>({
      left: 0,
      top: 0,
      width: 220,
      maxHeight: 280,
    });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<
    Record<string, HTMLButtonElement | null>
  >({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
     ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        wrapperRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      setOpenDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     UPDATE DROPDOWN POSITION
     ========================================================= */

  const updateDropdownPosition = (key: string) => {
    const button = buttonRefs.current[key];
    const wrapper = wrapperRef.current;

    if (!button || !wrapper) {
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    /*
     * Keep dropdown responsive.
     */
    const availableWrapperWidth = Math.max(
      180,
      wrapperRect.width - 24
    );

    const dropdownWidth = Math.min(
      240,
      availableWrapperWidth,
      viewportWidth - 24
    );

    /*
     * Button position relative to wrapper.
     */
    const buttonLeft =
      buttonRect.left - wrapperRect.left;

    /*
     * Keep dropdown inside wrapper.
     */
    const maxLeft = Math.max(
      12,
      wrapperRect.width - dropdownWidth - 12
    );

    let left = buttonLeft;

    if (left > maxLeft) {
      left = maxLeft;
    }

    if (left < 12) {
      left = 12;
    }

    /*
     * Vertical position.
     */
    const buttonBottom =
      buttonRect.bottom - wrapperRect.top;

    const buttonTop =
      buttonRect.top - wrapperRect.top;

    const spaceBelow =
      viewportHeight - buttonRect.bottom - 16;

    const spaceAbove =
      buttonRect.top - 16;

    const preferredHeight = 280;

    let maxHeight: number;
    let top: number;

    /*
     * Open upward if there is not enough space below.
     */
    if (
      spaceBelow < 180 &&
      spaceAbove > spaceBelow
    ) {
      maxHeight = Math.min(
        preferredHeight,
        Math.max(150, spaceAbove - 10)
      );

      top = buttonTop - maxHeight - 8;
    } else {
      maxHeight = Math.min(
        preferredHeight,
        Math.max(150, spaceBelow - 10)
      );

      top = buttonBottom + 8;
    }

    if (top < 0) {
      top = 8;
    }

    setDropdownPosition({
      left,
      top,
      width: dropdownWidth,
      maxHeight,
    });
  };

  /* =========================================================
     UPDATE POSITION ON RESIZE / SCROLL
     ========================================================= */

  useEffect(() => {
    if (!openDropdown) {
      return;
    }

    const update = () => {
      updateDropdownPosition(openDropdown);
    };

    requestAnimationFrame(update);

    window.addEventListener("resize", update);

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
  }, [openDropdown]);

  /* =========================================================
     SEARCH
     ========================================================= */

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  /* =========================================================
     GET SELECTED VALUES
     ========================================================= */

  const getSelected = (
    key: FilterDropdownConfig["key"]
  ): string[] => {
    if (key === "query") {
      return [];
    }

    return (filters[key] as string[]) ?? [];
  };

  /* =========================================================
     TOGGLE OPTION
     ========================================================= */

  const toggleOption = (
    key: FilterDropdownConfig["key"],
    value: string
  ) => {
    const current = getSelected(key);

    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onFiltersChange({
      ...filters,
      [key]: next,
    });
  };

  /* =========================================================
     SELECT ALL
     ========================================================= */

  const toggleSelectAll = (
    dropdown: FilterDropdownConfig
  ) => {
    const allValues = (
      dropdown.options ?? []
    ).map((option) => option.value);

    const current = getSelected(dropdown.key);

    const allSelected =
      allValues.length > 0 &&
      allValues.every((value) =>
        current.includes(value)
      );

    onFiltersChange({
      ...filters,
      [dropdown.key]: allSelected
        ? []
        : allValues,
    });
  };

  /* =========================================================
     CLEAR DROPDOWN
     ========================================================= */

  const clearDropdown = (
    dropdown: FilterDropdownConfig
  ) => {
    if (dropdown.type === "search") {
      onFiltersChange({
        ...filters,
        query: "",
      });
    } else {
      onFiltersChange({
        ...filters,
        [dropdown.key]: [],
      });
    }
  };

  /* =========================================================
     QUERY CHANGE
     ========================================================= */

  const handleQueryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      query: e.target.value,
    });
  };

  /* =========================================================
     DROPDOWN CLICK
     ========================================================= */

  const handleDropdownClick = (key: string) => {
    if (openDropdown === key) {
      setOpenDropdown(null);
      return;
    }

    setOpenDropdown(key);

    requestAnimationFrame(() => {
      updateDropdownPosition(key);
    });
  };

  /* =========================================================
     ACTIVE DROPDOWN
     ========================================================= */

  const activeDropdown =
    FILTER_DROPDOWNS.find(
      (dropdown) =>
        dropdown.key === openDropdown
    );

  const activeSelected = activeDropdown
    ? getSelected(activeDropdown.key)
    : [];

  const activeHasSelection = activeDropdown
    ? activeDropdown.type === "search"
      ? !!filters.query
      : activeSelected.length > 0
    : false;

  const activeAllValues =
    activeDropdown?.options?.map(
      (option) => option.value
    ) ?? [];

  const activeAllSelected =
    activeAllValues.length > 0 &&
    activeAllValues.every((value) =>
      activeSelected.includes(value)
    );

  return (
    <div
      ref={wrapperRef}
      className="
        font-[Urbanist]
        relative
        w-full
        min-w-0
        max-w-full
        overflow-visible
      "
    >
      {/* =====================================================
          FILTER BOX
          ===================================================== */}

      <div
        className="
          font-[Urbanist]
          w-full
          min-w-0
          max-w-full
          bg-white
          rounded-lg
          shadow-sm
          border
          border-[#8B5A2B]
          overflow-visible
        "
      >
        {/* =====================================================
            HORIZONTAL SCROLL AREA
            ===================================================== */}

        <div
          className="
            w-full
            min-w-0
            max-w-full
            overflow-x-auto
            overflow-y-visible
          "
        >
          <div
            className="
              font-[Urbanist]
              flex
              items-center
              gap-2
              sm:gap-3
              flex-nowrap
              w-max
              min-w-full
              px-3
              sm:px-4
              py-2.5
              whitespace-nowrap
            "
          >
            {/* =================================================
                SEARCH
                ================================================= */}

            <div
              className="
                font-[Urbanist]
                flex
                items-center
                gap-2
                shrink-0
                w-[180px]
                sm:w-[200px]
              "
            >
              <Search
                size={16}
                className="
                  text-gray-400
                  shrink-0
                "
              />

              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Start Typing..."
                className="
                  font-[Urbanist]
                  w-full
                  min-w-0
                  text-sm
                  text-gray-700
                  placeholder:text-gray-400
                  outline-none
                  bg-transparent
                "
              />
            </div>

            {/* =================================================
                ADD FILTER
                ================================================= */}

            <button
              type="button"
              className="
                font-[Urbanist]
                flex
                items-center
                gap-1.5
                px-3
                py-1.5
                rounded-md
                bg-orange-800
                text-white
                text-sm
                font-medium
                hover:bg-orange-900
                transition-colors
                whitespace-nowrap
                shrink-0
              "
            >
              <Plus size={14} />
              Add Filter
            </button>

            {/* =================================================
                DROPDOWN FILTERS
                ================================================= */}

            {FILTER_DROPDOWNS.map((dropdown) => {
              const selected = getSelected(
                dropdown.key
              );

              const hasSelection =
                dropdown.type === "search"
                  ? !!filters.query
                  : selected.length > 0;

              return (
                <div
                  key={dropdown.key}
                  className="
                    font-[Urbanist]
                    shrink-0
                    whitespace-nowrap
                  "
                >
                  <button
                    type="button"
                    ref={(element) => {
                      buttonRefs.current[
                        dropdown.key
                      ] = element;
                    }}
                    onClick={() =>
                      handleDropdownClick(
                        dropdown.key
                      )
                    }
                    className={`
                      font-[Urbanist]
                      flex
                      items-center
                      gap-1
                      text-sm
                      font-medium
                      transition-colors
                      whitespace-nowrap
                      shrink-0
                      ${
                        hasSelection
                          ? "text-orange-800"
                          : "text-gray-700 hover:text-orange-800"
                      }
                    `}
                  >
                    {dropdown.label}

                    {hasSelection &&
                      dropdown.type ===
                        "checkbox" && (
                        <span
                          className="
                            font-[Urbanist]
                            text-xs
                            bg-orange-100
                            text-orange-800
                            rounded-full
                            px-1.5
                          "
                        >
                          {selected.length}
                        </span>
                      )}

                    <ChevronDown
                      size={14}
                      className="
                        text-gray-500
                        shrink-0
                      "
                    />
                  </button>
                </div>
              );
            })}

            {/* =================================================
                MORE
                ================================================= */}

            <button
              type="button"
              aria-label="More filter options"
              className="
                font-[Urbanist]
                text-gray-400
                hover:text-gray-600
                transition-colors
                shrink-0
              "
            >
              <MoreVertical size={18} />
            </button>

            {/* =================================================
                CLEAR ALL
                ================================================= */}

            <button
              type="button"
              onClick={onClearAll}
              aria-label="Clear all filters"
              className="
                font-[Urbanist]
                text-red-500
                hover:text-red-600
                transition-colors
                shrink-0
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          DROPDOWN OVERLAY
          ===================================================== */}

      {openDropdown && activeDropdown && (
        <div
          ref={dropdownRef}
          className="
            font-[Urbanist]
            absolute
            z-[9999]
            bg-white
            border
            border-[#8B5A2B]
            rounded-md
            shadow-2xl
            py-2
            text-sm
            overflow-x-hidden
            overflow-y-auto
            box-border
          "
          style={{
            left: `${dropdownPosition.left}px`,
            top: `${dropdownPosition.top}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: `${dropdownPosition.maxHeight}px`,
          }}
        >
          {/* =================================================
              SEARCH DROPDOWN
              ================================================= */}

          {activeDropdown.type === "search" ? (
            <div
              className="
                font-[Urbanist]
                px-3
                w-full
                box-border
              "
            >
              <input
                type="text"
                autoFocus
                value={filters.query}
                onChange={handleQueryChange}
                placeholder="Enter query..."
                className="
                  font-[Urbanist]
                  w-full
                  max-w-full
                  box-border
                  border
                  border-[#8B5A2B]
                  rounded
                  px-2
                  py-1.5
                  text-sm
                  outline-none
                  focus:border-[#8B5A2B]
                "
              />
            </div>
          ) : (
            <>
              {/* =================================================
                  SELECT ALL
                  ================================================= */}

              {activeDropdown.showSelectAllHeader && (
                <label
                  className="
                    font-[Urbanist]
                    flex
                    items-start
                    gap-2
                    px-3
                    py-2
                    font-semibold
                    text-gray-800
                    cursor-pointer
                    hover:bg-gray-50
                    w-full
                    min-w-0
                    box-border
                  "
                >
                  <input
                    type="checkbox"
                    checked={activeAllSelected}
                    onChange={() =>
                      toggleSelectAll(
                        activeDropdown
                      )
                    }
                    className="
                      w-4
                      h-4
                      rounded
                      border-[#8B5A2B]
                      text-orange-800
                      focus:ring-orange-400
                      shrink-0
                      mt-0.5
                    "
                  />

                  <span
                    className="
                      min-w-0
                      max-w-full
                      break-words
                      whitespace-normal
                    "
                  >
                    {activeDropdown.label}
                  </span>
                </label>
              )}

              {/* =================================================
                  HEADER LABEL
                  ================================================= */}

              {activeDropdown.showHeaderLabel && (
                <div
                  className="
                    font-[Urbanist]
                    px-3
                    py-2
                    font-semibold
                    text-gray-800
                    break-words
                    whitespace-normal
                  "
                >
                  {activeDropdown.label}
                </div>
              )}

              {/* =================================================
                  OPTIONS
                  ================================================= */}

              {(activeDropdown.options ?? []).map(
                (option) => (
                  <label
                    key={option.value}
                    className="
                      font-[Urbanist]
                      flex
                      items-start
                      gap-2
                      px-3
                      py-2
                      text-gray-700
                      cursor-pointer
                      hover:bg-gray-50
                      w-full
                      min-w-0
                      box-border
                    "
                  >
                    <input
                      type="checkbox"
                      checked={activeSelected.includes(
                        option.value
                      )}
                      onChange={() =>
                        toggleOption(
                          activeDropdown.key,
                          option.value
                        )
                      }
                      className="
                        w-4
                        h-4
                        rounded
                        border-[#8B5A2B]
                        text-orange-800
                        focus:ring-orange-400
                        shrink-0
                        mt-0.5
                      "
                    />

                    <span
                      className="
                        min-w-0
                        max-w-full
                        break-words
                        whitespace-normal
                        leading-5
                      "
                    >
                      {option.label}
                    </span>
                  </label>
                )
              )}
            </>
          )}

          {/* =================================================
              CLEAR CURRENT DROPDOWN
              ================================================= */}

          <div
            className="
              font-[Urbanist]
              border-t
              border-[#8B5A2B]
              mt-2
              pt-2
              px-3
            "
          >
            <button
              type="button"
              onClick={() =>
                clearDropdown(activeDropdown)
              }
              disabled={!activeHasSelection}
              className={`
                font-[Urbanist]
                flex
                items-center
                gap-1
                text-sm
                ${
                  activeHasSelection
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-300 cursor-not-allowed"
                }
              `}
            >
              <X size={14} />
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}