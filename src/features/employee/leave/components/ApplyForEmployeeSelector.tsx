import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
 
import { Input } from "@/components/ui/input";
 
import type {
  ApplyForEmployeeProps,
  ReportingEmployee,
} from "../types/leave.types";
 
// Search and select a reporting employee for the team-lead leave workflow.
export default function ApplyForEmployeeSelector({
  id,
  employees,
  value,
  onChange,
  loading = false,
  isInvalid,
  placeholder = "Search employee...",
}: ApplyForEmployeeProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
 
  const selected = useMemo(
    () => employees.find((employee) => employee.EmployeeID === value) ?? null,
    [employees, value],
  );
 
  const displayText = open ? query : selected?.EmployeeName ?? "";
 
  useEffect(() => {
    if (!open) return;
 
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
 
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);
 
  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
 
    if (!searchTerm) return employees;
 
    return employees.filter((employee) =>
      employee.EmployeeName.toLowerCase().includes(searchTerm),
    );
  }, [employees, query]);
 
  const handleSelect = (employee: ReportingEmployee) => {
    onChange(employee.EmployeeID);
    setQuery("");
    setOpen(false);
  };
 
  return (
    <div className="relative" ref={wrapperRef}>
      <Input
        id={id}
        type="text"
        value={displayText}
        aria-invalid={isInvalid}
        placeholder={loading ? "Loading employees..." : placeholder}
        disabled={loading}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          if (!open) setOpen(true);
        }}
        className="h-12 rounded-xl border-slate-300 bg-white px-4 pr-10 text-sm"
      />
 
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
 
      {open && (
        <div
          className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border bg-white p-1 shadow-lg"
          style={{ borderColor: "var(--primary-border)" }}
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-slate-500">
              No employees found.
            </p>
          ) : (
            filtered.map((employee) => (
              <button
                type="button"
                key={employee.EmployeeID}
                onClick={() => handleSelect(employee)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  employee.EmployeeID === value
                    ? "font-semibold text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                style={
                  employee.EmployeeID === value
                    ? { background: "var(--primary-color)" }
                    : undefined
                }
              >
                {employee.EmployeeName}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}