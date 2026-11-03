import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type {
  ApplyForEmployeeSelectorProps,
} from "../types/appliedLeave.types";

export default function ApplyForEmployeeSelector({
  id,
  employees,
  value,
  onChange,
  loading = false,
  error,
  placeholder = "Search employee...",
}: ApplyForEmployeeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selected = employees.find((employee) => employee.EmployeeID === value);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredEmployees = employees.filter((employee) => {
    const name = employee.EmployeeName ?? employee.FullName ?? "";
    return (
      name.toLowerCase().includes(normalizedSearch) ||
      employee.EmployeeID.toLowerCase().includes(normalizedSearch)
    );
  });

  useEffect(() => {
    if (open) searchRef.current?.focus();
    else setSearch("");
  }, [open]);

  return (
    <div ref={dropdownRef} id={id} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 text-sm"
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected
            ? `${selected.EmployeeName ?? selected.FullName ?? "Employee"} (${
                selected.EmployeeID
              })`
            : placeholder}
        </span>

        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee name or ID..."
            aria-label="Search employees by name or ID"
            className="mb-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/15"
          />

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <p className="px-3 py-3 text-sm text-slate-500">
                Loading employees...
              </p>
            ) : error ? (
              <p className="px-3 py-3 text-sm text-rose-600">{error}</p>
            ) : employees.length === 0 ? (
              <p className="px-3 py-3 text-sm text-slate-500">
                No employees found
              </p>
            ) : filteredEmployees.length === 0 ? (
              <p className="px-3 py-3 text-sm text-slate-500">
                No matching employees
              </p>
            ) : (
              filteredEmployees.map((employee) => {
                const name =
                  employee.EmployeeName ??
                  employee.FullName ??
                  employee.EmployeeID;

                return (
                  <button
                    type="button"
                    key={employee.EmployeeID}
                    onClick={() => {
                      onChange(employee.EmployeeID);
                      setOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    <div className="font-medium text-slate-800">{name}</div>

                    <div className="text-xs text-slate-500">
                      {employee.EmployeeID}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
