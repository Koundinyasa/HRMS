







// MonthSelector.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import type { MonthOption } from "../types/filters";

interface MonthSelectorProps {
  value: string;
  options: MonthOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MonthSelector({
  value,
  options,
  onChange,
  placeholder = "Select Month",
}: MonthSelectorProps) {
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

  return (
    <div ref={ref} className="font-[Urbanist] relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="font-[Urbanist] flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-800 bg-white border border-[#8B5A2B] rounded-md hover:bg-gray-50 transition-colors w-full sm:min-w-[130px] justify-between"
      >
        <span className="font-[Urbanist] flex items-center gap-2 truncate">
          <Calendar size={14} className="font-[Urbanist] text-gray-400 shrink-0" />
          {value || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`font-[Urbanist] text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="font-[Urbanist] absolute z-20 mt-1 left-0 translate-x-0 sm:left-0 sm:translate-x-0 w-[min(12rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] bg-white border border-[#8B5A2B] rounded-md shadow-lg py-1 max-h-64 overflow-y-auto">
          <div className="font-[Urbanist] px-3 py-2 text-xs font-semibold text-gray-400">
            {placeholder}
          </div>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`font-[Urbanist] w-full text-left px-3 py-2 text-sm transition-colors ${
                opt.value === value
                  ? "bg-orange-50 text-orange-800 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}