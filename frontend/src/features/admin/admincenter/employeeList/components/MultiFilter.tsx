import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import ListPopover from "./ListPopover";

interface MultiFilterProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

/** A filter chip that opens a list of options with check boxes. */
export default function MultiFilter({ label, options, selected, onChange }: MultiFilterProps) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const active = selected.length > 0;

  const toggle = (option: string) =>
    onChange(
      selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option],
    );

  return (
    <>
      <button
        ref={setAnchor}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={[
          "flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[13.5px] font-medium transition-colors",
          active
            ? "border-[#FFC9A3] bg-[#FFF5EE] text-[#FF6200]"
            : "border-[#E2E2E2] bg-white text-[#131313] hover:bg-[#F7F7F7]",
        ].join(" ")}
      >
        {label}
        {active && (
          <span className="rounded-full bg-[#FF6200] px-1.5 text-[11px] font-semibold leading-[18px] text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} strokeWidth={2.2} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <ListPopover anchor={anchor} width={248} onClose={() => setOpen(false)}>
          <ul role="listbox" aria-multiselectable="true" className="max-h-[280px] overflow-y-auto py-1.5">
            {options.map((option) => {
              const checked = selected.includes(option);
              return (
                <li key={option} role="option" aria-selected={checked}>
                  <button
                    type="button"
                    onClick={() => toggle(option)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13.5px] text-[#131313] hover:bg-[#FFF5EE]"
                  >
                    <span
                      className={[
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border",
                        checked ? "border-[#FF6200] bg-[#FF6200]" : "border-[#BFBFBF] bg-white",
                      ].join(" ")}
                    >
                      {checked && <Check size={11} strokeWidth={3.2} className="text-white" />}
                    </span>
                    <span className="truncate">{option}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {active && (
            <button
              type="button"
              onClick={() => {
                onChange([]);
                setOpen(false);
              }}
              className="flex h-10 w-full items-center justify-center gap-1.5 border-t border-[#EDEDED] text-[13px] font-medium text-[#626262] hover:bg-[#F7F7F7]"
            >
              <X size={13} /> Clear
            </button>
          )}
        </ListPopover>
      )}
    </>
  );
}
