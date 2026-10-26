import { useState } from "react";
import { X } from "lucide-react";

interface OnboardFilterDropdownProps {
  label: string;
  filterKey: string;
  options: string[];
  isQuery?: boolean;
  selected: string[];
  onChange: (filterKey: string, values: string[]) => void;
  onClear: (filterKey: string) => void;
  onClose: () => void;
}

export default function OnboardFilterDropdown({
  label,
  filterKey,
  options,
  isQuery = false,
  selected,
  onChange,
  onClear,
  onClose,
}: OnboardFilterDropdownProps) {
  const [queryText, setQueryText] = useState("");

  const allChecked = options.length > 0 && selected.length === options.length;

  const toggleAll = () => {
    onChange(filterKey, allChecked ? [] : [...options]);
  };

  const toggleOne = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    onChange(filterKey, next);
  };

  return (
    <div className="absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      {isQuery ? (
        <div className="p-3">
          <span className="text-xs font-semibold uppercase text-slate-500">{label}</span>
          <input
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChange(filterKey, queryText ? [queryText] : []);
                onClose();
              }
            }}
            placeholder="Enter query text..."
            className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-400"
          />
        </div>
      ) : (
        <>
          <label className="flex cursor-pointer items-center gap-2 border-b border-slate-100 bg-[#FFF3F0] px-3 py-2.5">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={toggleAll}
              className="h-3.5 w-3.5 accent-[#814A3C]"
            />
            <span className="text-sm font-semibold text-[#814A3C]">{label}</span>
          </label>

          <div className="max-h-72 overflow-y-auto py-1">
            {options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleOne(option)}
                  className="h-3.5 w-3.5 accent-[#814A3C]"
                />
                {option}
              </label>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          onClear(filterKey);
          setQueryText("");
        }}
        className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <X size={13} />
        Clear
      </button>
    </div>
  );
}