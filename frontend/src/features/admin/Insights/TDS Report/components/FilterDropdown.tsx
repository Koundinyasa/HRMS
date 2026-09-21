// import { useEffect, useRef, useState } from "react";
// import { ChevronDown, X } from "lucide-react";

// export interface FilterOption {
//   value: string;
//   label: string;
// }

// type Variant = "chip" | "plain";

// interface CheckboxFilterDropdownProps {
//   type?: "checkbox";
//   label: string;
//   icon?: React.ComponentType<{
//     size?: number;
//     className?: string;
//   }>;
//   options: FilterOption[];
//   selected: string[];
//   onChange: (next: string[]) => void;
//   variant?: Variant;
// }

// interface TextFilterDropdownProps {
//   type: "text";
//   label: string;
//   icon?: React.ComponentType<{
//     size?: number;
//     className?: string;
//   }>;
//   value: string;
//   onChange: (next: string) => void;
//   variant?: Variant;
// }

// type FilterDropdownProps =
//   | CheckboxFilterDropdownProps
//   | TextFilterDropdownProps;

// export default function FilterDropdown(
//   props: FilterDropdownProps
// ) {
//   const {
//     label,
//     icon: Icon,
//     variant = "chip",
//   } = props;

//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         ref.current &&
//         !ref.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);

//   const activeCount =
//     props.type === "text"
//       ? props.value
//         ? 1
//         : 0
//       : props.selected.length;

//   const clear = () => {
//     if (props.type === "text") {
//       props.onChange("");
//     } else {
//       props.onChange([]);
//     }
//   };

//   const triggerClass =
//     variant === "chip"
//       ? `flex h-9 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-[13px] transition-colors whitespace-nowrap ${
//           activeCount > 0
//             ? "border-[#d7d7d7] bg-[#f3f8ff] text-[#374151]"
//             : "border-[#d7d7d7] bg-white text-[#374151] hover:bg-slate-50"
//         }`
//       : `flex h-9 shrink-0 items-center gap-1 text-[13px] transition-colors whitespace-nowrap ${
//           activeCount > 0
//             ? "font-medium text-[#374151]"
//             : "text-slate-600 hover:text-slate-800"
//         }`;

//   return (
//     <div
//       className="relative shrink-0"
//       ref={ref}
//     >
//       {/* Filter Button */}
//       <button
//         type="button"
//         onClick={() =>
//           setOpen((value) => !value)
//         }
//         className={triggerClass}
//       >
//         {Icon && (
//           <Icon
//             size={13}
//             className={
//               activeCount > 0
//                 ? "text-indigo-500"
//                 : variant === "chip"
//                   ? "text-slate-400"
//                   : "text-slate-500"
//             }
//           />
//         )}

//         <span className="whitespace-nowrap">
//           {label}
//         </span>

//         {activeCount > 0 && (
//           <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
//             {activeCount}
//           </span>
//         )}

//         <ChevronDown
//           size={12}
//           className={
//             activeCount > 0
//               ? "text-indigo-400"
//               : "text-slate-400"
//           }
//         />
//       </button>

//       {/* Dropdown Panel */}
//       {open && (
//         <div className="absolute left-0 z-20 mt-1.5 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
//           {props.type === "text" ? (
//             <TextPanel
//               value={props.value}
//               onChange={props.onChange}
//             />
//           ) : (
//             <CheckboxPanel
//               label={label}
//               options={props.options}
//               selected={props.selected}
//               onChange={props.onChange}
//             />
//           )}

//           <button
//             type="button"
//             onClick={clear}
//             className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 py-2.5 text-xs text-slate-500 transition-colors hover:text-slate-700"
//           >
//             <X size={12} />
//             Clear
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function CheckboxPanel({
//   label,
//   options,
//   selected,
//   onChange,
// }: {
//   label: string;
//   options: FilterOption[];
//   selected: string[];
//   onChange: (next: string[]) => void;
// }) {
//   const allSelected =
//     options.length > 0 &&
//     selected.length === options.length;

//   const toggleAll = () => {
//     onChange(
//       allSelected
//         ? []
//         : options.map(
//             (option) => option.value
//           )
//     );
//   };

//   const toggleOne = (value: string) => {
//     onChange(
//       selected.includes(value)
//         ? selected.filter(
//             (item) => item !== value
//           )
//         : [...selected, value]
//     );
//   };

//   return (
//     <>
//       <label className="flex cursor-pointer items-center gap-2 bg-rose-50 px-3 py-2.5">
//         <input
//           type="checkbox"
//           checked={allSelected}
//           onChange={toggleAll}
//           className="rounded border-slate-300 text-indigo-600"
//         />

//         <span className="text-sm font-semibold text-slate-800">
//           {label}
//         </span>
//       </label>

//       <div className="max-h-72 overflow-y-auto">
//         {options.length === 0 ? (
//           <p className="px-3 py-4 text-center text-xs text-slate-400">
//             No options available.
//           </p>
//         ) : (
//           options.map((option) => (
//             <label
//               key={option.value}
//               className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-slate-50"
//             >
//               <input
//                 type="checkbox"
//                 checked={selected.includes(
//                   option.value
//                 )}
//                 onChange={() =>
//                   toggleOne(option.value)
//                 }
//                 className="rounded border-slate-300 text-indigo-600"
//               />

//               <span className="text-sm text-slate-700">
//                 {option.label}
//               </span>
//             </label>
//           ))
//         )}
//       </div>
//     </>
//   );
// }

// function TextPanel({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (value: string) => void;
// }) {
//   return (
//     <div className="p-3">
//       <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-400">
//         QUERY
//       </p>

//       <input
//         type="text"
//         value={value}
//         onChange={(e) =>
//           onChange(e.target.value)
//         }
//         placeholder="Enter query text..."
//         className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
//       />
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

type Variant = "chip" | "plain";

interface CheckboxFilterDropdownProps {
  type?: "checkbox";
  label: string;
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  variant?: Variant;
}

interface TextFilterDropdownProps {
  type: "text";
  label: string;
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  value: string;
  onChange: (next: string) => void;
  variant?: Variant;
}

type FilterDropdownProps =
  | CheckboxFilterDropdownProps
  | TextFilterDropdownProps;

export default function FilterDropdown(
  props: FilterDropdownProps
) {
  const {
    label,
    icon: Icon,
    variant = "chip",
  } = props;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const activeCount =
    props.type === "text"
      ? props.value
        ? 1
        : 0
      : props.selected.length;

  const clear = () => {
    if (props.type === "text") {
      props.onChange("");
    } else {
      props.onChange([]);
    }
  };

  const triggerClass =
    variant === "chip"
      ? `flex h-9 shrink-0 items-center gap-1 rounded-lg border px-2.5 font-[Urbanist] text-[13px] transition-colors whitespace-nowrap ${
          activeCount > 0
            ? "border-[#d7d7d7] bg-[#f3f8ff] text-[#374151]"
            : "border-[#d7d7d7] bg-white text-[#374151] hover:bg-slate-50"
        }`
      : `flex h-9 shrink-0 items-center gap-1 font-[Urbanist] text-[13px] transition-colors whitespace-nowrap ${
          activeCount > 0
            ? "font-medium text-[#374151]"
            : "text-slate-600 hover:text-slate-800"
        }`;

  return (
    <div
      className="relative shrink-0"
      ref={ref}
    >
      {/* Filter Button */}
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className={triggerClass}
      >
        {Icon && (
          <Icon
            size={13}
            className={
              activeCount > 0
                ? "text-indigo-500"
                : variant === "chip"
                  ? "text-slate-400"
                  : "text-slate-500"
            }
          />
        )}

        {/* Label */}
        <span className="whitespace-nowrap font-[Urbanist] text-[13px] font-medium">
          {label}
        </span>

        {activeCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 font-[Urbanist] text-[10px] font-semibold text-white">
            {/* Utility/UI */}
            {activeCount}
          </span>
        )}

        <ChevronDown
          size={12}
          className={
            activeCount > 0
              ? "text-indigo-400"
              : "text-slate-400"
          }
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute left-0 z-20 mt-1.5 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {props.type === "text" ? (
            <TextPanel
              value={props.value}
              onChange={props.onChange}
            />
          ) : (
            <CheckboxPanel
              label={label}
              options={props.options}
              selected={props.selected}
              onChange={props.onChange}
            />
          )}

          <button
            type="button"
            onClick={clear}
            className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 py-2.5 font-[Urbanist] text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            <X size={12} />
            {/* Label */}
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

function CheckboxPanel({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const allSelected =
    options.length > 0 &&
    selected.length === options.length;

  const toggleAll = () => {
    onChange(
      allSelected
        ? []
        : options.map(
            (option) => option.value
          )
    );
  };

  const toggleOne = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter(
            (item) => item !== value
          )
        : [...selected, value]
    );
  };

  return (
    <>
      <label className="flex cursor-pointer items-center gap-2 bg-rose-50 px-3 py-2.5">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="rounded border-slate-300 text-indigo-600"
        />

        {/* Label */}
        <span className="font-[Urbanist] text-[13px] font-semibold text-slate-800">
          {label}
        </span>
      </label>

      <div className="max-h-72 overflow-y-auto">
        {options.length === 0 ? (
          /* Body */
          <p className="px-3 py-4 text-center font-[Urbanist] text-[13px] font-normal text-slate-400">
            No options available.
          </p>
        ) : (
          options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(
                  option.value
                )}
                onChange={() =>
                  toggleOne(option.value)
                }
                className="rounded border-slate-300 text-indigo-600"
              />

              {/* Body */}
              <span className="font-[Urbanist] text-[13px] font-normal text-slate-700">
                {option.label}
              </span>
            </label>
          ))
        )}
      </div>
    </>
  );
}

function TextPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="p-3">
      {/* Utility/UI */}
      <p className="mb-1.5 font-[Urbanist] text-[11px] font-semibold tracking-wide text-slate-400">
        QUERY
      </p>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder="Enter query text..."
        /* Body */
        className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 font-[Urbanist] text-[13px] font-normal text-slate-700 outline-none placeholder:font-[Urbanist] placeholder:text-[13px] placeholder:font-normal placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
      />
    </div>
  );
}