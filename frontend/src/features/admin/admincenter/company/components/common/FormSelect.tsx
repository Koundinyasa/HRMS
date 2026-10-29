import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormSelectOption = { label: string; value: string };

type FormSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FormSelectOption[] | string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

type MenuPos = { top: number; left: number; width: number; maxHeight: number };

const GAP = 6;
const EDGE = 12;
const MAX_H = 280;

export function FormSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Select",
  disabled,
  className,
}: FormSelectProps) {
  const items: FormSelectOption[] = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );
  const selectedIndex = items.findIndex((i) => i.value === value);
  const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = `${id ?? "form-select"}-listbox`;

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(r.width, vw - EDGE * 2);
    const left = Math.min(Math.max(r.left, EDGE), vw - width - EDGE);
    const top = r.bottom + GAP; // always BELOW
    const maxHeight = Math.max(120, Math.min(MAX_H, vh - top - EDGE));
    setPos({ top, left, width, maxHeight });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function openMenu() {
    if (disabled) return;
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function choose(i: number) {
    const item = items[i];
    if (!item) return;
    onValueChange(item.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(a + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(items.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(active);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex h-11 w-full min-w-0 items-center justify-between gap-2",
          "rounded-xl border bg-white px-3 text-left text-sm outline-none transition",
          open
            ? "border-[#7A5BED] ring-2 ring-[#7A5BED]/20"
            : "border-[#EDEDED] hover:border-[#C9BEF7]",
          "focus-visible:border-[#7A5BED] focus-visible:ring-2 focus-visible:ring-[#7A5BED]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className={cn("truncate", selected ? "text-[#2E2E2E]" : "text-[#626262]")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#7A5BED] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-labelledby={id}
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              maxHeight: pos.maxHeight,
            }}
            className={cn(
              "fixed z-[9999] overflow-y-auto rounded-xl border border-[#EDEDED] bg-white p-1",
              "shadow-[0_12px_32px_-12px_rgba(46,30,120,0.28)]",
              "font-['Urbanist']"
            )}
          >
            {items.map((item, i) => {
              const isSelected = item.value === value;
              const isActive = i === active;
              return (
                <li
                  key={item.value}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm",
                    isSelected
                      ? "bg-[#ECE7FF] font-medium text-[#7A5BED]"
                      : isActive
                        ? "bg-[#F6F3FF] text-[#5932E9]"
                        : "text-[#2E2E2E] hover:bg-[#F6F3FF]"
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-[#7A5BED]" />}
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </>
  );
}

export default FormSelect;