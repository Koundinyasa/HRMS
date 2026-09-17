




// components/LeaveTypeSelector.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface LeaveTypeOption {
  value: string;
  label: string;
  /** Short code shown in the report's group header, e.g. "Casual Leave-(CL)". */
  code: string;
}

export const LEAVE_TYPE_OPTIONS: LeaveTypeOption[] = [
  { value: "compensatory_off", label: "Compensatory Off", code: "CO" },
  { value: "compensatory_work", label: "Compensatory Work", code: "CW" },
  { value: "loss_of_pay", label: "Loss of Pay", code: "LOP" },
  { value: "on_official_duty", label: "On Official Duty", code: "OD" },
  { value: "casual_leave", label: "Casual Leave", code: "CL" },
  { value: "sick_leave", label: "Sick Leave", code: "SL" },
  { value: "restricted_holiday", label: "Restricted Holiday", code: "RH" },
  { value: "medical_wellness_leave", label: "Medical Wellness Leave", code: "MWL" },
];

interface LeaveTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LeaveTypeSelector({ value, onChange }: LeaveTypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel =
    LEAVE_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? "Select Leave Type";

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:min-w-[160px] justify-between"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={14} className="text-gray-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-56 max-w-[90vw] bg-white border border-gray-200 rounded-md shadow-lg p-3 space-y-2">
          {LEAVE_TYPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="radio"
                name="leave-type"
                checked={value === opt.value}
                onChange={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="w-4 h-4 text-orange-800 focus:ring-orange-400"
              />
              {opt.label}
            </label>
          ))}
          <button
            type="button"
            onClick={() => onChange("")}
            className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}