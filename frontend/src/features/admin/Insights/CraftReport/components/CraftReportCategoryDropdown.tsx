import { X } from "lucide-react";

interface CraftReportCategoryDropdownProps {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  onClear: () => void;
}

export default function CraftReportCategoryDropdown({
  options,
  selected,
  onChange,
  onClear,
}: CraftReportCategoryDropdownProps) {
  const allChecked = options.length > 0 && selected.length === options.length;

  const toggleAll = () => {
    onChange(allChecked ? [] : [...options]);
  };

  const toggleOne = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    onChange(next);
  };

  return (
    <div className="absolute right-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      <label className="flex cursor-pointer items-center gap-2 border-b border-slate-100 bg-[#FFF3F0] px-3 py-2.5">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={toggleAll}
          className="h-3.5 w-3.5 accent-[#814A3C]"
        />
        <span className="text-sm font-semibold text-[#814A3C]">
          Select State
        </span>
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

      <button
        type="button"
        onClick={onClear}
        className="flex w-full items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <X size={13} />
        Clear
      </button>
    </div>
  );
}