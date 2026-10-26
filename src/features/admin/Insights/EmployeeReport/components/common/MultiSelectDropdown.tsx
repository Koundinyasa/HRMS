








import { useEffect, useRef, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface MultiSelectOption {
  key: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = (key: string) => {
    const next = selected.includes(key)
      ? selected.filter((k) => k !== key)
      : [...selected, key];
    onChange(next);
  };

  const countLabel =
    selected.length === 0
      ? label
      : selected.length > 10
      ? `${label} (${selected.length}+)`
      : `${label} (${selected.length})`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 py-2 border border-brand-700 rounded-md text-sm font-medium text-brand-800 bg-white whitespace-nowrap"
      >
        {countLabel}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-56 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-30 py-2"
          style={{ backgroundColor: "#ffffff", opacity: 1 }}
        >
          {options.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.key)}
                onChange={() => toggle(opt.key)}
                className="rounded border-gray-300 text-brand-700 focus:ring-brand-500 w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}