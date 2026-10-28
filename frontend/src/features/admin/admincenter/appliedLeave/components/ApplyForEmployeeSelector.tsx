import { useEffect, useMemo, useRef, useState } from "react";
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
  placeholder = "Search employee...",
}: ApplyForEmployeeSelectorProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [search, setSearch] = useState("");

  const selected = employees.find((employee) => employee.EmployeeID === value);

  const filteredEmployees = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return employees;
    }

    return employees.filter((employee) => {
      const name = employee.EmployeeName ?? employee.FullName ?? "";

      return (
        String(employee.EmployeeID).toLowerCase().includes(searchValue) ||
        name.toLowerCase().includes(searchValue)
      );
    });
  }, [employees, search]);

  return (
    <div ref={dropdownRef} id={id} className="relative">
      <div className="flex h-11 w-full items-center rounded-xl border border-slate-300 bg-white px-3 text-sm focus-within:border-blue-400">
        <input
          value={
            open
              ? search
              : selected
                ? `${selected.EmployeeName ?? selected.FullName ?? "Employee"} (${
                    selected.EmployeeID
                  })`
                : ""
          }
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setSearch(event.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          aria-label="Search and select employee"
          aria-expanded={open}
          aria-controls={`${id}-options`}
        />
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close employee list" : "Open employee list"}
          className="ml-2 shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {open && (
        <div
          id={`${id}-options`}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
        >
          {loading ? (
            <p className="px-3 py-3 text-sm text-slate-500">
              Loading employees...
            </p>
          ) : filteredEmployees.length === 0 ? (
            <p className="px-3 py-3 text-sm text-slate-500">
              No employees found
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
                    setSearch("");
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
      )}
    </div>
  );
}
