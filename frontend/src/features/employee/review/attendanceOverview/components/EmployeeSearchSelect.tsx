import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import type { Employee } from "../types/regularization.types";

interface EmployeeSearchSelectProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  onSelect: (employee: Employee | undefined) => void;
}

const MENU_WIDTH = 220;

export default function EmployeeSearchSelect({
  employees,
  selectedEmployee,
  loading,
  onSelect,
}: EmployeeSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(normalizedSearch) ||
        employee.id.toLowerCase().includes(normalizedSearch),
    );
  }, [employees, search]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const margin = 8;
    const left = Math.min(
      Math.max(rect.right - MENU_WIDTH, margin),
      window.innerWidth - MENU_WIDTH - margin,
    );

    setPosition({ top: rect.bottom + 4, left });
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
    else setSearch("");
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Select employee"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        disabled={loading || employees.length === 0}
        className="flex h-9 w-[145px] shrink-0 items-center justify-between gap-2 rounded-lg border border-black bg-white px-2 text-left text-xs text-slate-600 shadow-none disabled:cursor-not-allowed disabled:opacity-60 font-[Urbanist]"
      >
        <span className="min-w-0 truncate">
          {selectedEmployee
            ? `${selectedEmployee.id} ${selectedEmployee.name}`
            : loading
              ? "Loading employees..."
              : "Select employee"}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[10000] w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
            style={{ top: position.top, left: position.left }}
          >
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by employee name or ID..."
              aria-label="Search employees by name or ID"
              className="mb-2 h-9 w-full rounded-lg border border-slate-200 px-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
            />

            <div
              role="listbox"
              aria-label="Employees"
              className="max-h-60 overflow-y-auto"
            >
              <button
                type="button"
                role="option"
                aria-selected={!selectedEmployee}
                onClick={() => {
                  onSelect(undefined);
                  setOpen(false);
                }}
                className="w-full rounded-lg px-2 py-2 text-left text-xs text-slate-500 hover:bg-slate-50"
              >
                Select employee
              </button>

              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected={employee.id === selectedEmployee?.id}
                    key={employee.id}
                    onClick={() => {
                      onSelect(employee);
                      setOpen(false);
                    }}
                    className="w-full rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                  >
                    <span className="block text-xs font-medium text-slate-800">
                      {employee.name}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {employee.id}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-2 py-3 text-xs text-slate-500">
                  No matching employees
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
