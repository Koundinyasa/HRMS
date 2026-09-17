import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function FilterDropdown({ label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isDefault = value === options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-xs
          transition-colors
          ${
            isDefault
              ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              : "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-medium"
          }
        `}
      >
        {isDefault ? label : value}
        <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-1 max-h-56 w-44 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`
                block w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50
                ${opt === value ? "font-semibold text-[#2563EB]" : "text-slate-600"}
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}