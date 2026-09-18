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
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  variant?: Variant;
}

interface TextFilterDropdownProps {
  type: "text";
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  onChange: (next: string) => void;
  variant?: Variant;
}

type FilterDropdownProps = CheckboxFilterDropdownProps | TextFilterDropdownProps;

export default function FilterDropdown(props: FilterDropdownProps) {
  const { label, icon: Icon, variant = "chip" } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCount = props.type === "text" ? (props.value ? 1 : 0) : props.selected.length;

  const clear = () => {
    if (props.type === "text") {
      props.onChange("");
    } else {
      props.onChange([]);
    }
  };

  const triggerClass =
    variant === "chip"
      ? `flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm transition-colors ${
          activeCount > 0
            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
            : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`
      : `flex items-center gap-1 text-sm transition-colors ${
          activeCount > 0 ? "text-indigo-600 font-medium" : "text-slate-600 hover:text-slate-800"
        }`;

  return (
    <div className="relative shrink-0" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={triggerClass}>
        {Icon && (
          <Icon
            size={14}
            className={activeCount > 0 ? "text-indigo-500" : variant === "chip" ? "text-slate-400" : "text-slate-500"}
          />
        )}
        {label}
        {activeCount > 0 && (
          <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-semibold">
            {activeCount}
          </span>
        )}
        <ChevronDown size={13} className={activeCount > 0 ? "text-indigo-400" : "text-slate-400"} />
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-20">
          {props.type === "text" ? (
            <TextPanel value={props.value} onChange={props.onChange} />
          ) : (
            <CheckboxPanel label={label} options={props.options} selected={props.selected} onChange={props.onChange} />
          )}

          <button
            type="button"
            onClick={clear}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 bg-slate-50 border-t border-slate-100 transition-colors"
          >
            <X size={12} />
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
  const allSelected = options.length > 0 && selected.length === options.length;

  const toggleAll = () => {
    onChange(allSelected ? [] : options.map((o) => o.value));
  };

  const toggleOne = (value: string) => {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
    );
  };

  return (
    <>
      <label className="flex items-center gap-2 px-3 py-2.5 bg-rose-50 cursor-pointer">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="rounded border-slate-300 text-indigo-600"
        />
        <span className="text-sm font-semibold text-slate-800">{label}</span>
      </label>

      <div className="max-h-72 overflow-y-auto">
        {options.length === 0 ? (
          <p className="px-3 py-4 text-xs text-slate-400 text-center">No options available.</p>
        ) : (
          options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggleOne(opt.value)}
                className="rounded border-slate-300 text-indigo-600"
              />
              <span className="text-sm text-slate-700">{opt.label}</span>
            </label>
          ))
        )}
      </div>
    </>
  );
}

function TextPanel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="p-3">
      <p className="text-[11px] font-semibold text-slate-400 tracking-wide mb-1.5">QUERY</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter query text..."
        className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
      />
    </div>
  );
}