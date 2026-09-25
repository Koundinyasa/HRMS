// import {
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";
// import { createPortal } from "react-dom";
// import { ChevronDown, Search, X } from "lucide-react";

// export type FilterOption = {
//   label: string;
//   value: string;
// };

// type CheckboxDropdownFilterProps = {
//   label: string;
//   options: FilterOption[];
//   selected: string[];
//   onChange: (values: string[]) => void;
//   showSearch?: boolean;
// };

// const PANEL_WIDTH = 190;
// const VIEWPORT_MARGIN = 8;
// const PANEL_GAP = 4;

// export default function CheckboxDropdownFilter({
//   label,
//   options,
//   selected,
//   onChange,
//   showSearch = false,
// }: CheckboxDropdownFilterProps) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");

//   const containerRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const panelRef = useRef<HTMLDivElement>(null);

//   const [coords, setCoords] = useState({
//     top: 0,
//     left: 0,
//   });

//   const reposition = () => {
//     const button = buttonRef.current;

//     if (!button) {
//       return;
//     }

//     const buttonRect = button.getBoundingClientRect();
//     const panel = panelRef.current;

//     const panelHeight =
//       panel?.getBoundingClientRect().height ?? 320;

//     const maxLeft =
//       window.innerWidth - VIEWPORT_MARGIN - PANEL_WIDTH;

//     let left = buttonRect.left;

//     if (left < VIEWPORT_MARGIN) {
//       left = VIEWPORT_MARGIN;
//     }

//     if (left > maxLeft) {
//       left = Math.max(VIEWPORT_MARGIN, maxLeft);
//     }

//     const spaceBelow =
//       window.innerHeight -
//       buttonRect.bottom -
//       VIEWPORT_MARGIN;

//     const spaceAbove =
//       buttonRect.top - VIEWPORT_MARGIN;

//     let top: number;

//     if (
//       spaceBelow >= panelHeight ||
//       spaceBelow >= spaceAbove
//     ) {
//       top = buttonRect.bottom + PANEL_GAP;
//     } else {
//       top =
//         buttonRect.top -
//         panelHeight -
//         PANEL_GAP;
//     }

//     top = Math.max(
//       VIEWPORT_MARGIN,
//       Math.min(
//         top,
//         window.innerHeight -
//           panelHeight -
//           VIEWPORT_MARGIN,
//       ),
//     );

//     setCoords({
//       top,
//       left,
//     });
//   };

//   useLayoutEffect(() => {
//     if (!open) {
//       return;
//     }

//     reposition();
//   }, [open, selected, query]);

//   useEffect(() => {
//     if (!open) {
//       return;
//     }

//     const handleReposition = () => {
//       reposition();
//     };

//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node;

//       const clickedInsideButton =
//         containerRef.current?.contains(target);

//       const clickedInsidePanel =
//         panelRef.current?.contains(target);

//       if (
//         !clickedInsideButton &&
//         !clickedInsidePanel
//       ) {
//         setOpen(false);
//       }
//     };

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setOpen(false);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside,
//     );

//     document.addEventListener(
//       "keydown",
//       handleEscape,
//     );

//     window.addEventListener(
//       "resize",
//       handleReposition,
//     );

//     window.addEventListener(
//       "scroll",
//       handleReposition,
//       true,
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside,
//       );

//       document.removeEventListener(
//         "keydown",
//         handleEscape,
//       );

//       window.removeEventListener(
//         "resize",
//         handleReposition,
//       );

//       window.removeEventListener(
//         "scroll",
//         handleReposition,
//         true,
//       );
//     };
//   }, [open]);

//   const visibleOptions = options.filter((option) =>
//     option.label
//       .toLowerCase()
//       .includes(query.toLowerCase().trim()),
//   );

//   const toggleValue = (value: string) => {
//     const nextValues = selected.includes(value)
//       ? selected.filter((item) => item !== value)
//       : [...selected, value];

//     onChange(nextValues);
//   };

//   const handleClear = () => {
//     onChange([]);
//     setQuery("");
//   };

//   const allSelected =
//     options.length > 0 &&
//     options.every((option) =>
//       selected.includes(option.value),
//     );

//   const toggleAll = () => {
//     if (allSelected) {
//       onChange([]);
//     } else {
//       onChange(
//         options.map((option) => option.value),
//       );
//     }
//   };

//   const dropdownPanel = open
//     ? createPortal(
//         <div
//           ref={panelRef}
//           style={{
//             position: "fixed",
//             top: `${coords.top}px`,
//             left: `${coords.left}px`,
//             width: `${PANEL_WIDTH}px`,
//             maxWidth: "calc(100vw - 16px)",
//           }}
//           className="z-[99999] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
//         >
//           {/* Header */}
//           <div className="bg-rose-50 px-3 py-3">
//             <span className="text-sm font-semibold text-gray-800">
//               {label}
//             </span>
//           </div>

//           {/* Search */}
//           {showSearch && (
//             <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
//               <Search
//                 size={15}
//                 className="shrink-0 text-gray-400"
//               />

//               <input
//                 autoFocus
//                 type="text"
//                 value={query}
//                 onChange={(event) =>
//                   setQuery(event.target.value)
//                 }
//                 placeholder="Start Typing"
//                 className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
//               />
//             </div>
//           )}

//           {/* Options */}
//           <div className="max-h-56 overflow-y-auto py-1">
//             {options.length > 0 && (
//               <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
//                 <input
//                   type="checkbox"
//                   checked={allSelected}
//                   onChange={toggleAll}
//                   className="h-4 w-4 shrink-0 rounded border-gray-300 accent-rose-500"
//                 />

//                 <span className="font-medium">
//                   Select All
//                 </span>
//               </label>
//             )}

//             {visibleOptions.length === 0 && (
//               <p className="px-3 py-3 text-sm text-gray-400">
//                 No options
//               </p>
//             )}

//             {visibleOptions.map((option) => (
//               <label
//                 key={option.value}
//                 className="flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(
//                     option.value,
//                   )}
//                   onChange={() =>
//                     toggleValue(option.value)
//                   }
//                   className="h-4 w-4 shrink-0 rounded border-gray-300 accent-rose-500"
//                 />

//                 <span className="min-w-0 truncate">
//                   {option.label}
//                 </span>
//               </label>
//             ))}
//           </div>

//           {/* Footer */}
//           <button
//             type="button"
//             onClick={handleClear}
//             className="flex w-full items-center justify-center gap-2 border-t border-gray-100 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50"
//           >
//             <X size={14} />
//             Clear
//           </button>
//         </div>,
//         document.body,
//       )
//     : null;

//   return (
//     <>
//       <div
//         ref={containerRef}
//         className="relative z-50 shrink-0"
//       >
//         <button
//           ref={buttonRef}
//           type="button"
//           onClick={() => setOpen((value) => !value)}
//           className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-3 text-sm font-medium hover:bg-gray-100 ${
//             selected.length > 0
//               ? "text-blue-600"
//               : "text-gray-600"
//           }`}
//         >
//           {label}

//           {selected.length > 0 && (
//             <span className="rounded-full bg-blue-100 px-1.5 text-xs text-blue-700">
//               {selected.length}
//             </span>
//           )}

//           <ChevronDown size={17} />
//         </button>
//       </div>

//       {dropdownPanel}
//     </>
//   );
// }


// import {
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";
// import { createPortal } from "react-dom";
// import { ChevronDown, Search, X } from "lucide-react";

// export type FilterOption = {
//   label: string;
//   value: string;
// };

// type CheckboxDropdownFilterProps = {
//   label: string;
//   options: FilterOption[];
//   selected: string[];
//   onChange: (values: string[]) => void;
//   showSearch?: boolean;
// };

// const PANEL_WIDTH = 190;
// const VIEWPORT_MARGIN = 8;
// const PANEL_GAP = 4;

// export default function CheckboxDropdownFilter({
//   label,
//   options,
//   selected,
//   onChange,
//   showSearch = false,
// }: CheckboxDropdownFilterProps) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [coords, setCoords] = useState({ top: 0, left: 0 });

//   const containerRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const panelRef = useRef<HTMLDivElement>(null);

//   const reposition = () => {
//     const button = buttonRef.current;
//     if (!button) return;

//     const buttonRect = button.getBoundingClientRect();
//     const panelHeight = panelRef.current?.offsetHeight ?? 320;
//     const panelWidth = Math.min(
//       PANEL_WIDTH,
//       window.innerWidth - VIEWPORT_MARGIN * 2,
//     );

//     const maxLeft = window.innerWidth - panelWidth - VIEWPORT_MARGIN;
//     const left = Math.max(
//       VIEWPORT_MARGIN,
//       Math.min(buttonRect.left, maxLeft),
//     );

//     const spaceBelow =
//       window.innerHeight - buttonRect.bottom - VIEWPORT_MARGIN;
//     const spaceAbove = buttonRect.top - VIEWPORT_MARGIN;

//     let top = buttonRect.bottom + PANEL_GAP;

//     if (spaceBelow < panelHeight && spaceAbove > spaceBelow) {
//       top = buttonRect.top - panelHeight - PANEL_GAP;
//     }

//     const maxTop = Math.max(
//       VIEWPORT_MARGIN,
//       window.innerHeight - panelHeight - VIEWPORT_MARGIN,
//     );

//     setCoords({
//       top: Math.max(VIEWPORT_MARGIN, Math.min(top, maxTop)),
//       left,
//     });
//   };

//   useLayoutEffect(() => {
//     if (open) reposition();
//   }, [open, selected, query]);

//   useEffect(() => {
//     if (!open) return;

//     const handleReposition = () => reposition();

//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Node;

//       if (
//         !containerRef.current?.contains(target) &&
//         !panelRef.current?.contains(target)
//       ) {
//         setOpen(false);
//       }
//     };

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") setOpen(false);
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);
//     window.addEventListener("resize", handleReposition);
//     window.addEventListener("scroll", handleReposition, true);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//       window.removeEventListener("resize", handleReposition);
//       window.removeEventListener("scroll", handleReposition, true);
//     };
//   }, [open]);

//   const visibleOptions = options.filter((option) =>
//     option.label.toLowerCase().includes(query.trim().toLowerCase()),
//   );

//   const allSelected =
//     options.length > 0 &&
//     options.every((option) => selected.includes(option.value));

//   const toggleValue = (value: string) => {
//     onChange(
//       selected.includes(value)
//         ? selected.filter((item) => item !== value)
//         : [...selected, value],
//     );
//   };

//   const toggleAll = () => {
//     onChange(
//       allSelected ? [] : options.map((option) => option.value),
//     );
//   };

//   const handleClear = () => {
//     onChange([]);
//     setQuery("");
//   };

//   const dropdownPanel = open
//     ? createPortal(
//         <div
//           ref={panelRef}
//           style={{
//             position: "fixed",
//             top: `${coords.top}px`,
//             left: `${coords.left}px`,
//             width: `${PANEL_WIDTH}px`,
//             maxWidth: "calc(100vw - 16px)",
//           }}
//           className="z-[99999] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
//         >
//           <div className="bg-rose-50 px-3 py-3">
//             <span className="block truncate text-sm font-semibold text-gray-800">
//               {label}
//             </span>
//           </div>

//           {showSearch && (
//             <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
//               <Search size={15} className="shrink-0 text-gray-400" />
//               <input
//                 autoFocus
//                 type="text"
//                 value={query}
//                 onChange={(event) => setQuery(event.target.value)}
//                 placeholder="Start Typing..."
//                 className="min-w-0 w-full text-sm text-gray-700 outline-none placeholder:text-gray-400"
//               />
//             </div>
//           )}

//           <div className="max-h-56 overflow-y-auto py-1">
//             {options.length > 0 && (
//               <label className="flex min-w-0 cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
//                 <input
//                   type="checkbox"
//                   checked={allSelected}
//                   onChange={toggleAll}
//                   className="h-4 w-4 shrink-0 rounded border-gray-300 accent-rose-500"
//                 />
//                 <span className="min-w-0 flex-1 truncate font-medium">
//                   Select All
//                 </span>
//               </label>
//             )}

//             {visibleOptions.length === 0 && (
//               <p className="px-3 py-3 text-sm text-gray-400">
//                 No options
//               </p>
//             )}

//             {visibleOptions.map((option) => (
//               <label
//                 key={option.value}
//                 className="flex min-w-0 cursor-pointer items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(option.value)}
//                   onChange={() => toggleValue(option.value)}
//                   className="h-4 w-4 shrink-0 rounded border-gray-300 accent-rose-500"
//                 />
//                 <span className="min-w-0 flex-1 truncate">
//                   {option.label}
//                 </span>
//               </label>
//             ))}
//           </div>

//           <button
//             type="button"
//             onClick={handleClear}
//             className="flex w-full items-center justify-center gap-2 border-t border-gray-100 px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50"
//           >
//             <X size={14} />
//             Clear
//           </button>
//         </div>,
//         document.body,
//       )
//     : null;

//   return (
//     <>
//       <div ref={containerRef} className="relative z-50 shrink-0">
//         <button
//           ref={buttonRef}
//           type="button"
//           onClick={() => setOpen((value) => !value)}
//           className={`flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium hover:bg-gray-100 ${
//             selected.length > 0 ? "text-blue-600" : "text-gray-600"
//           }`}
//         >
//           <span className="whitespace-nowrap">{label}</span>

//           {selected.length > 0 && (
//             <span className="shrink-0 rounded-full bg-blue-100 px-1.5 text-xs text-blue-700">
//               {selected.length}
//             </span>
//           )}

//           <ChevronDown size={17} className="shrink-0" />
//         </button>
//       </div>

//       {dropdownPanel}
//     </>
//   );
// }



import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Plus, Search, X } from "lucide-react";

export type FilterOption = {
  label: string;
  value: string;
};

type CheckboxDropdownFilterProps = {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  showSearch?: boolean;
  allowAdd?: boolean;
  addOptionLabel?: string;
  addInputPlaceholder?: string;
  onAddOption?: (option: FilterOption) => void;
};

type DropdownPosition = { top: number; left: number; width: number };

export default function CheckboxDropdownFilter({
  label,
  options,
  selected,
  onChange,
  showSearch = true,
  allowAdd = false,
  addOptionLabel = "Add Employee",
  addInputPlaceholder = "Enter employee name",
  onAddOption,
}: CheckboxDropdownFilterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [newOptionText, setNewOptionText] = useState("");
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 220,
  });

  const updatePosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 240),
    });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const menu = document.getElementById("checkbox-dropdown-menu");
      if (!wrapperRef.current?.contains(target) && !menu?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );
  const allSelected =
    options.length > 0 && options.every((option) => selected.includes(option.value));

  const toggleOption = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const addOption = () => {
    const name = newOptionText.trim();
    if (!name || !onAddOption) return;
    const value = name.toLowerCase().replace(/\s+/g, "-");
    const exists = options.some(
      (option) =>
        option.label.toLowerCase() === name.toLowerCase() ||
        option.value.toLowerCase() === value,
    );
    if (exists) return;
    const newOption = { label: name, value };
    onAddOption(newOption);
    onChange([...selected, value]);
    setNewOptionText("");
    setSearchText("");
  };

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex min-w-[120px] items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>{label}</span>
        <ChevronDown size={16} />
      </button>

      {open &&
        createPortal(
          <div
            id="checkbox-dropdown-menu"
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="z-[9999] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <div className="border-b border-gray-200 bg-[#fff1f2] px-3 py-3 text-sm font-semibold text-gray-700">
              {label}
            </div>

            {showSearch && (
              <div className="border-b border-gray-200 p-2">
                <div className="relative">
                  <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder={`Search ${label.toLowerCase()}...`}
                    className="w-full rounded-md border border-gray-200 py-2 pl-8 pr-2 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            )}

            <div className="max-h-[260px] overflow-y-auto p-1">
              <label className="flex cursor-pointer items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onChange(allSelected ? [] : options.map((option) => option.value))}
                />
                <span>Select All</span>
              </label>
              {filteredOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                  />
                  <span className="min-w-0 truncate">{option.label}</span>
                </label>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-2 py-3 text-center text-sm text-gray-500">No employees found</div>
              )}
            </div>

            {allowAdd && (
              <div className="border-t border-gray-200 p-2">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Plus size={16} className="text-blue-600" />
                  <span>{addOptionLabel}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={newOptionText}
                    onChange={(event) => setNewOptionText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addOption();
                      }
                    }}
                    placeholder={addInputPlaceholder}
                    className="min-w-0 flex-1 rounded-md border border-gray-200 px-2 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={addOption}
                    disabled={!newOptionText.trim()}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onChange([]);
                setSearchText("");
              }}
              className="flex w-full items-center justify-center gap-2 border-t border-gray-200 px-3 py-3 text-sm text-gray-500 hover:bg-gray-50"
            >
              <X size={16} /> Clear
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
