import { ChevronDown } from "lucide-react";

export type EssOption = { id: string; label: string };

interface Props {
  label: string;
  placeholder?: string;
  value: string;
  options: EssOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  zIndex?: number;
}

// One dropdown implementation shared by every "Select X" field across ESS
// (Select Filter, Sub-Filter, Acknowledgement Type, Question Type, ...)
// instead of copy-pasting the same button + option-list markup per field.
export default function EssDropdownField(p: Props) {
  const selectedLabel = p.options.find((o) => o.id === p.value)?.label || p.placeholder || p.label;

  return (
    <div className="min-w-0 w-full">
      <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">{p.label}</label>
      <div className="relative w-full">
        <button
          type="button"
          onClick={p.onToggle}
          className="flex h-9 w-full min-w-0 items-center justify-between rounded-md border border-[#E2E8F0] bg-white px-3.5 text-left text-sm font-normal text-[#626262] outline-none focus:border-[#7A5BED]"
        >
          <span className="min-w-0 truncate">{selectedLabel}</span>
          <ChevronDown size={16} strokeWidth={2.25} className="ml-2 shrink-0 text-[#131313]" />
        </button>
        {p.isOpen && (
          <div
            className="absolute left-0 right-0 top-full mt-1 max-h-40 w-full min-w-0 overflow-y-auto overflow-x-hidden rounded-md border border-[#E2E8F0] bg-white text-sm font-normal shadow-lg"
            style={{ zIndex: p.zIndex ?? 90 }}
          >
            {p.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => p.onSelect(opt.id)}
                className="block w-full max-w-full truncate h-[33px] px-3.5 text-left text-sm font-normal text-[#2E2E2E] hover:bg-[#F6F3FF]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}