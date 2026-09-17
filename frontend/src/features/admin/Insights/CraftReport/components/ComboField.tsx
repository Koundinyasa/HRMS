import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface ComboFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export default function ComboField({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Start typing...",
}: ComboFieldProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative">
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>

      <div
        className="relative"
        onClick={() => setOpen(true)}
      >
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-700 outline-none focus:border-[#D97B3F] focus:ring-1 focus:ring-[#F3D9C9]"
        />
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-44 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-[#FDF1E9] hover:text-[#814A3C]"
              >
                {option}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-slate-400">
              {options.length === 0
                ? "No options available"
                : "No matches found"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}