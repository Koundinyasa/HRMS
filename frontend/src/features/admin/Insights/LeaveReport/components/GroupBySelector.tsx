


// GroupBySelector.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, List } from "lucide-react";
import type { GroupByLeavePolicyState } from "../types/filters";

interface GroupBySelectorProps {
  value: GroupByLeavePolicyState;
  onChange: (state: GroupByLeavePolicyState) => void;
  /** Button label, e.g. "Groupby Leave Policy" or "Groupby Attendance". */
  label?: string;
  /** Labels for the two checkboxes. Underlying state keys stay the same. */
  optionLabels?: { option1: string; option2: string };
  /** Set true to hide the two checkboxes and show only the Clear button (matches Figma for Groupby Attendance). */
  hideOptions?: boolean;
}

export default function GroupBySelector({
  value,
  onChange,
  label = "Groupby Leave Policy",
  optionLabels = { option1: "Employee Leave Policy", option2: "Intern Leave Policy" },
  hideOptions = false,
}: GroupBySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange({ employeeLeavePolicy: false, internLeavePolicy: false });
  };

  return (
    <div ref={ref} className="font-[Urbanist] relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="font-[Urbanist] flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-800 border border-[#8B5A2B] rounded-md hover:bg-gray-50 transition-colors w-full sm:min-w-[170px] justify-between"
      >
        {label}
        {open ? (
          <ChevronUp size={14} className="font-[Urbanist] text-gray-500 shrink-0" />
        ) : (
          <ChevronDown size={14} className="font-[Urbanist] text-gray-500 shrink-0" />
        )}
      </button>

      {open && (
        <div className="font-[Urbanist] absolute z-20 mt-1 left-0 translate-x-0 sm:left-0 sm:translate-x-0 w-[min(14rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] bg-white border border-[#8B5A2B] rounded-md shadow-lg p-3 space-y-2">
          {!hideOptions && (
            <>
              <label className="font-[Urbanist] flex items-center gap-2 text-sm text-gray-700 cursor-pointer min-w-0 break-words">
                <input
                  type="checkbox"
                  checked={value.employeeLeavePolicy}
                  onChange={(e) =>
                    onChange({ ...value, employeeLeavePolicy: e.target.checked })
                  }
                  className="font-[Urbanist] w-4 h-4 rounded border-[#8B5A2B] text-orange-800 focus:ring-orange-400"
                />
                {optionLabels.option1}
              </label>
              <label className="font-[Urbanist] flex items-center gap-2 text-sm text-gray-700 cursor-pointer min-w-0 break-words">
                <input
                  type="checkbox"
                  checked={value.internLeavePolicy}
                  onChange={(e) =>
                    onChange({ ...value, internLeavePolicy: e.target.checked })
                  }
                  className="font-[Urbanist] w-4 h-4 rounded border-[#8B5A2B] text-orange-800 focus:ring-orange-400"
                />
                {optionLabels.option2}
              </label>
            </>
          )}

          <button
            type="button"
            onClick={handleClear}
            className="font-[Urbanist] w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 text-sm text-gray-600 border border-[#8B5A2B] rounded-md hover:bg-gray-50 transition-colors"
          >
            <List size={14} />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}