import { useState, useRef, useEffect } from "react";

import {
  Search,
  ChevronDown,
  Bookmark,
  Plus,
  MoreVertical,
  X,
} from "lucide-react";

import {
  BULK_UPDATE_FILTER_FIELDS,
  STATUTORY_OPTIONS,
  APPLICABLE_OPTIONS,
} from "../constants/bulkUpdate.constants";

import type {
  StatutoryEmployeeRow,
  BulkUpdateFilters,
} from "../types/bulkUpdate.types";

import BulkUpdatePagination from "./BulkUpdatePagination";

interface BulkUpdateStatutoryTableProps {
  employees: StatutoryEmployeeRow[];
  filters: BulkUpdateFilters;
  onFiltersChange: (filters: BulkUpdateFilters) => void;
  selectedIds: string[];
  onToggleId: (employeeId: string) => void;
  onBulkSelectAll: (checked: boolean) => void;
  month: string;
  onMonthChange: (month: string) => void;
  selectedStatutories: string[];
  onStatutoriesChange: (values: string[]) => void;
  applicable: boolean | null;
  onApplicableChange: (value: boolean | null) => void;
  onUpdate: () => void;
  isUpdating?: boolean;
}

// Static month picker options — matches the "Jun/2026" style dropdown
// used on the Authority tab. Value stays in "YYYY-MM" form for the
// existing month state / API contract.
const MONTH_OPTIONS = [
  { value: "2026-06", label: "Jun/2026" },
  { value: "2026-05", label: "May/2026" },
  { value: "2026-04", label: "Apr/2026" },
  { value: "2026-03", label: "Mar/2026" },
];

function useOutsideClick(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutside();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);

  return ref;
}

function StatutoriesDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const label =
    selected.length === 0
      ? "Select Statutories"
      : selected.length === 1
      ? STATUTORY_OPTIONS.find((o) => o.value === selected[0])?.label ??
        "1 Selected"
      : `${selected.length} Selected`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[38px] w-[210px] items-center justify-between rounded-md border border-[#d9e1e8] bg-[#edf3f8] px-3 text-[14px] text-[#475467] outline-none focus:border-[#2196e0]"
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={14} className="shrink-0 text-[#667085]" />
      </button>

      {open && (
        // <div className="absolute z-20 mt-1 w-56 overflow-hidden rounded-md border border-[#edf0f3] bg-white shadow-lg">
        <div className="absolute z-20 mt-1 w-[min(224px,90vw)] overflow-hidden rounded-md border border-[#edf0f3] bg-white shadow-lg">  
          <div className="border-b border-[#edf0f3] bg-[#eaf2fe] px-3 py-2 text-[14px] font-medium text-[#475467]">
            Select Statutories
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {STATUTORY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[14px] text-[#344054] hover:bg-[#f2f5f8]"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="h-[15px] w-[15px] cursor-pointer accent-[#2196e0]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatutoryStatusPill({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        value
          ? "bg-[#12b76a] text-white"
          : "bg-[#eef1f5] text-[#667085]"
      }`}
    >
      {value ? "YES" : "NO"}
    </span>
  );
}

export default function BulkUpdateStatutoryTable({
  employees,
  filters,
  onFiltersChange,
  selectedIds,
  onToggleId,
  onBulkSelectAll,
  month,
  onMonthChange,
  selectedStatutories,
  onStatutoriesChange,
  applicable,
  onApplicableChange,
  onUpdate,
  isUpdating,
}: BulkUpdateStatutoryTableProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [employees.length, pageSize]);

  const allSelected =
    employees.length > 0 && selectedIds.length === employees.length;

  // When exactly one statutory is selected, swap the generic "Statutory" column
  // for a "<Label> Applicability" column with YES/NO pills.
  const selectedStatutory =
    selectedStatutories.length === 1
      ? STATUTORY_OPTIONS.find(
          (o) => o.value === selectedStatutories[0]
        ) ?? null
      : null;

  const statutoryColumnLabel = selectedStatutory
    ? `${selectedStatutory.label} Applicability`
    : "Statutory";

  const totalCount = employees.length;

  const pagedEmployees = employees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    // <div className="flex flex-col gap-2 px-4 pb-4">
    //   {/* CONTROL BAR */}

    //   <div className="mt-2 flex min-h-[52px] items-center justify-end gap-3 rounded-md border border-[#edf0f3] bg-white px-3">
    <div className="flex flex-col gap-2 px-2 pb-4 sm:px-4">
   <div className="mt-2 flex min-h-[52px] flex-wrap items-center justify-end gap-2 rounded-md border border-[#edf0f3] bg-white px-3 py-2 sm:flex-nowrap sm:gap-3 sm:py-0">
        <div className="relative">
          <select
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="h-[38px] w-[140px] appearance-none rounded-md border border-[#d9e1e8] bg-[#edf3f8] px-3 pr-8 text-[14px] text-[#475467] outline-none"
          >
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
          />
        </div>

        <StatutoriesDropdown
          selected={selectedStatutories}
          onChange={onStatutoriesChange}
        />

        <div className="relative">
          <select
            value={applicable === null ? "" : String(applicable)}
            onChange={(e) =>
              onApplicableChange(
                e.target.value === ""
                  ? null
                  : e.target.value === "true"
              )
            }
            className="h-[38px] w-[140px] appearance-none rounded-md border border-[#d9e1e8] bg-[#edf3f8] px-3 pr-8 text-[14px] text-[#475467] outline-none"
          >
            <option value="">Applicable</option>
            {APPLICABLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
          />
        </div>

        <button
          type="button"
          onClick={onUpdate}
          disabled={
            selectedIds.length === 0 ||
            selectedStatutories.length === 0 ||
            isUpdating
          }
          className="flex h-[38px] items-center gap-2 rounded-md bg-[#2196e0] px-5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1688d1] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Bookmark size={14} />
          Update
        </button>
      </div>

      {/* FILTER BAR */}

      {/* <div className="flex h-[52px] items-center gap-4 overflow-x-auto whitespace-nowrap rounded-md border border-[#edf0f3] bg-white px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative flex w-[250px] shrink-0 items-center"> */}
        <div className="flex h-[52px] items-center gap-3 overflow-x-auto whitespace-nowrap rounded-md border border-[#edf0f3] bg-white px-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
   <div className="relative flex w-[200px] shrink-0 items-center sm:w-[250px]">
          <Search
            size={17}
            className="absolute left-1 text-[#98a2b3]"
          />

          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            placeholder="Start Typing..."
            className="h-[36px] w-full border-0 bg-transparent pl-7 text-[14px] outline-none placeholder:text-[#c1c7d0]"
          />
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 text-[14px] text-[#475467]"
        >
          <Plus size={15} />
          Add Filter
        </button>

        {BULK_UPDATE_FILTER_FIELDS.map((field) => (
          <button
            key={field.value}
            type="button"
            onClick={() =>
              setActiveFilter((prev) =>
                prev === field.value ? null : field.value
              )
            }
            className={`flex shrink-0 items-center gap-1.5 text-[14px] ${
              activeFilter === field.value
                ? "font-semibold text-[#2196e0]"
                : "text-[#667085]"
            }`}
          >
            {field.label}
            <ChevronDown size={14} />
          </button>
        ))}

        <div className="ml-auto flex shrink-0 items-center gap-3 text-[#98a2b3]">
          <button
            type="button"
            className="hover:text-[#475467]"
            aria-label="More"
          >
            <MoreVertical size={18} />
          </button>

          <button
            type="button"
            onClick={() => onFiltersChange({})}
            className="text-[#e05a5a]"
            aria-label="Clear filters"
          >
            <X size={19} />
          </button>
        </div>
      </div>
           

        <div className="mt-2 overflow-x-auto [scrollbar-width:thin]">
  <div className="min-w-[810px]">   
      {/* TABLE HEADER */}

      <div
        className="
          mt-2
          grid
          h-[52px]
          grid-cols-[140px_minmax(220px,1fr)_130px_200px_120px]
          items-center
          rounded-md
          bg-[#d7ebfa]
          px-3
          text-[14px]
          font-semibold
          text-[#344054]
          whitespace-nowrap
        "
      >
        <div>Employee ID</div>
        <div>Employee Name</div>
        <div>DOS</div>
        <div>{statutoryColumnLabel}</div>

        <div className="flex justify-end">
          <button
            type="button"
            className="underline underline-offset-2"
            onClick={() => onBulkSelectAll(!allSelected)}
          >
            Bulk Select
          </button>
        </div>
      </div>

      {/* TABLE ROWS */}

      <div className="space-y-2 pt-2">
        {pagedEmployees.map((row, idx) => (
          <div
            key={`${row.employeeId}-${idx}`}
            className="
              grid
              h-[52px]
              min-h-[52px]
              grid-cols-[140px_minmax(220px,1fr)_130px_200px_120px]
              items-center
              rounded-md
              border
              border-[#eef1f5]
              bg-white
              px-3
              text-[14px]
              text-[#344054]
              shadow-[0_1px_2px_rgba(16,24,40,0.03)]
              whitespace-nowrap
            "
          >
            <div className="truncate pr-4">{row.employeeId}</div>
            <div className="truncate pr-4">{row.employeeName}</div>
            <div className="truncate pr-4">{row.dos}</div>

            <div className="truncate pr-4">
              {selectedStatutory ? (
                <StatutoryStatusPill
                  value={
                    row.statutoryApplicability?.[
                      selectedStatutory.value
                    ] ?? false
                  }
                />
              ) : (
                row.statutory ?? ""
              )}
            </div>

            <div className="flex justify-end">
              <input
                type="checkbox"
                checked={selectedIds.includes(row.employeeId)}
                onChange={() => onToggleId(row.employeeId)}
                className="h-[15px] w-[15px] cursor-pointer accent-[#2196e0]"
              />
            </div>
          </div>
        ))}

        {employees.length === 0 && (
          <div className="rounded-md border bg-white py-12 text-center text-sm text-[#98a2b3]">
            No employees found
          </div>
        )}
        </div>
       </div>
      </div>

      {/* PAGINATION */}

      <BulkUpdatePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}