import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [panelPosition, setPanelPosition] = useState({
    left: 8,
    top: 8,
    width: 288,
    maxHeight: undefined as number | undefined,
  });
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentVersion = props.type === "text" ? null : props.options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const positionPanel = () => {
      const trigger = ref.current?.getBoundingClientRect();
      const panelElement = panelRef.current;
      if (!trigger || !panelElement) return;

      const padding = 8;
      const gap = 6;
      const boundary =
        ref.current?.closest<HTMLElement>("[data-dropdown-boundary]") ??
        ref.current?.closest<HTMLElement>("main");
      const content = boundary?.getBoundingClientRect();
      const leftBoundary = Math.max(padding, content?.left ?? padding);
      const rightBoundary = Math.min(
        window.innerWidth - padding,
        content?.right ?? window.innerWidth - padding
      );
      const topBoundary = Math.max(padding, content?.top ?? padding);
      const bottomBoundary = Math.min(
        window.innerHeight - padding,
        content?.bottom ?? window.innerHeight - padding
      );
      const width = Math.max(0, Math.min(288, rightBoundary - leftBoundary - padding * 2));

      panelElement.style.width = `${width}px`;
      panelElement.style.maxHeight = `${Math.max(0, bottomBoundary - topBoundary)}px`;
      const panelHeight = panelElement.getBoundingClientRect().height;
      const left = Math.min(
        Math.max(trigger.left, leftBoundary + padding),
        rightBoundary - width - padding
      );
      const roomBelow = Math.max(0, bottomBoundary - trigger.bottom - gap);
      const roomAbove = Math.max(0, trigger.top - gap - topBoundary);
      const placeBelow = roomBelow >= panelHeight || roomBelow >= roomAbove;
      const maxHeight = placeBelow ? roomBelow : roomAbove;
      const top = placeBelow
        ? trigger.bottom + gap
        : Math.max(topBoundary, trigger.top - Math.min(panelHeight, roomAbove) - gap);

      setPanelPosition({ left, top, width, maxHeight });
    };

    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    return () => {
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [open, panelContentVersion]);

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
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[60] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
            style={{
              left: panelPosition.left,
              top: panelPosition.top,
              width: panelPosition.width,
              maxHeight: panelPosition.maxHeight ?? "calc(100dvh - 1rem)",
            }}
          >
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
          </div>,
          document.body
        )
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