import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { createPortal } from "react-dom";

interface LeaveQueryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LeaveQueryFilter({ value, onChange }: LeaveQueryFilterProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 8 });
  const inputId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: Math.min(rect.bottom + 8, Math.max(8, window.innerHeight - 215)),
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 340)),
    });
    setOpen(true);
  };

  return (
    <div className="shrink-0">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors ${
          value ? "border-[#b7c9e6] bg-[#f7faff] text-[#27364f]" : "border-slate-200 bg-white text-[#27364f] hover:bg-slate-50"
        }`}
      >
        <Search size={14} className="text-[#8fa0c2]" />
        Query
        <ChevronDown size={13} className="text-slate-400" />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ top: position.top, left: position.left }}
          className="fixed z-[120] w-[324px] max-w-[calc(100vw-16px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.16)]"
        >
          <div className="p-3">
            <label htmlFor={inputId} className="mb-2 block text-[11px] font-semibold tracking-wide text-[#8998b7]">
              QUERY
            </label>
            <input
              id={inputId}
              autoFocus
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Enter query text..."
              className="h-10 w-full rounded-lg border border-[#cbd5e1] bg-white px-3 text-sm text-[#344054] outline-none placeholder:text-[#8291ad] focus:border-[#9bb6da] focus:ring-1 focus:ring-[#d7e4f4]"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex h-11 w-full items-center justify-center gap-2 border-t border-slate-100 bg-[#f8f9fb] text-sm text-[#71809c] transition hover:bg-slate-100"
          >
            Clear
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}
