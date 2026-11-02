import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import DropdownSelect from "../../../components/DropdownSelect";
import PunchFilterBar from "./PunchFilterBar";
import {
  METRIC_COLUMNS,
  PUNCH_METRIC_ACCENTS,
  PUNCH_METRIC_LABELS,
  ROWS_PER_PAGE_OPTIONS,
} from "../constants/timeoffice.constants";
import type { PunchMetricListProps } from "../types/timeoffice.types";

export default function PunchMetricList({
  metric,
  allRows,
  filteredRows,
  pagedRows,
  filters,
  onFiltersChange,
  onClearFilters,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showFilters = true,
  isLoading = false,
  errorMessage = "",
}: PunchMetricListProps) {
  const [filterBarVisible, setFilterBarVisible] = useState(true);
  const columns = METRIC_COLUMNS[metric];
  const total = filteredRows.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <div className="flex min-h-[62px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <h2 className="text-sm font-semibold text-center" style={{ color: PUNCH_METRIC_ACCENTS[metric] }}>
          {PUNCH_METRIC_LABELS[metric]} Employees
        </h2>
      </div>

      {showFilters && filterBarVisible && (
        <div className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <PunchFilterBar
            rows={allRows}
            filters={filters}
            onChange={onFiltersChange}
            onClear={onClearFilters}
            onDismiss={() => setFilterBarVisible(false)}
            showChipsInitially
            showOverflowControls
            showAddFilter={false}
            scrollable
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-[#EAF1FE]">
            <tr className="text-left">
              {columns.map((column) => (
                <th key={column.key} className="font-semibold text-slate-700 px-4 py-3 whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={row.employeeId} className="border-t border-slate-100 odd:bg-white even:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 whitespace-nowrap text-slate-700">
                    {column.key === "leaveStatus" && row.leaveStatus ? (
                      <span className="rounded-full border border-sky-200 bg-sky-50 text-sky-700 px-2 py-0.5 text-xs">
                        {row.leaveStatus}
                      </span>
                    ) : (
                      (row[column.key] as string | number | undefined) ?? "—"
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {pagedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400">
                  {isLoading ? "Loading..." : errorMessage || "No employees found"}
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-slate-100 px-4 py-2 text-sm text-slate-500">
        <label className="flex items-center gap-2">
          Rows per page
          <DropdownSelect
            options={ROWS_PER_PAGE_OPTIONS.map((size) => ({ label: String(size), value: String(size) }))}
            value={String(pageSize)}
            onChange={(value) => onPageSizeChange(Number(value))}
            align="right"
            menuClassName="w-20"
            className="h-7 rounded-lg border border-slate-200 px-1.5"
          />
        </label>

        <span>
          {firstRow} to {Math.min(page * pageSize, total)} of {total}
        </span>

        <div className="flex items-center gap-1">
          <PagerButton disabled={page === 1} onClick={() => onPageChange(1)}><ChevronsLeft size={15} /></PagerButton>
          <PagerButton disabled={page === 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={15} /></PagerButton>
          <span className="px-2 font-medium text-slate-700">{page} / {lastPage}</span>
          <PagerButton disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}><ChevronRight size={15} /></PagerButton>
          <PagerButton disabled={page >= lastPage} onClick={() => onPageChange(lastPage)}><ChevronsRight size={15} /></PagerButton>
        </div>
        </div>
      </div>
    </div>
  );
}

function PagerButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}
