import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
 
export interface DropdownOption {
  label: string;
  value: string;
}
 
interface DropdownSelectProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  align?: "left" | "right";
  disabled?: boolean;
}
 
/**
 * Renders the option list as a normal DOM element instead of a native <select>
 * popup, so it can be kept on-screen with plain CSS (a native select's popup
 * paints outside the page and can't be clipped or repositioned).
 */
export default function DropdownSelect({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  menuClassName = "w-40",
  align = "left",
  disabled,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);
 
  const selected = options.find((option) => option.value === value);
 
  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex items-center gap-1 outline-none disabled:opacity-50 ${className}`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown size={14} className="shrink-0" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          role="menu"
          className={`absolute z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          } ${menuClassName}`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitem"
              className={`block w-full truncate px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                option.value === value ? "bg-emerald-50 font-medium text-emerald-700" : "text-slate-700"
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}