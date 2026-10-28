import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  companies: string[];
  value: string;
  onChange: (value: string) => void;
  variant?: "primary" | "plain";
  label?: string;
};

export default function CompanyDropdown({
  companies,
  value,
  onChange,
  variant = "primary",
  label,
}: Props) {
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

  const extraCount = companies.length - 1;

  const triggerClass =
    variant === "primary"
      ? "border border-[#2563EB] bg-white text-[#2563EB] font-medium px-3"
      : "border border-slate-200 bg-white text-slate-600 font-normal px-3";

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          inline-flex h-9 w-full items-center justify-between gap-2
          rounded-full text-sm ${triggerClass}
        `}
      >
        <span className="truncate">
          {label ?? value}
          {variant === "primary" && extraCount > 0 && ` (+${extraCount})`}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 ${open ? "rotate-180" : ""} transition-transform`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-full min-w-[220px] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {companies.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
              className={`
                block w-full truncate px-3 py-2 text-left text-sm hover:bg-slate-50
                ${name === value ? "font-semibold text-[#2563EB]" : "text-slate-600"}
              `}
              title={name}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}