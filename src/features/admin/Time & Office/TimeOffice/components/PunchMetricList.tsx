import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet } from "lucide-react";
import DropdownSelect from "../../../components/DropdownSelect";
import PunchFilterBar from "./PunchFilterBar";
import {
  METRIC_COLUMNS,
  PUNCH_METRIC_ACCENTS,
  PUNCH_METRIC_LABELS,
  ROWS_PER_PAGE_OPTIONS,
} from "../constants/timeoffice.constants";
import { toCsv } from "../hooks/punchMetrics";
import type { PunchFilters, PunchMetric, PunchRow } from "../types/timeoffice.types";

interface PunchMetricListProps {
  metric: PunchMetric;
  allRows: PunchRow[];
  filteredRows: PunchRow[];
  pagedRows: PunchRow[];
  filters: PunchFilters;
  onFiltersChange: (next: PunchFilters) => void;
  onClearFilters: () => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onBack: () => void;
}

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
  onBack,
}: PunchMetricListProps) {
  const columns = METRIC_COLUMNS[metric];
  const total = filteredRows.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;

  // Exports everything that survived the filters, not just the visible page.
  const handleExport = () => {
    const blob = new Blob([toCsv(columns, filteredRows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${metric}-employees.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3 flex-wrap">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 h-8 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ChevronLeft size={15} /> Back
        </button>

        <h2 className="text-sm font-semibold text-center" style={{ color: PUNCH_METRIC_ACCENTS[metric] }}>
          {PUNCH_METRIC_LABELS[metric]} Employees
        </h2>

        <button
          type="button"
          onClick={handleExport}
          title="Export to CSV"
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600 hover:bg-slate-50"
        >
          <FileSpreadsheet size={16} />
        </button>
      </div>

      <div className="px-4">
        <PunchFilterBar rows={allRows} filters={filters} onChange={onFiltersChange} onClear={onClearFilters} />
      </div>

      <div className="px-4 pt-3 overflow-x-auto">
        <table className="w-full text-sm">
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
              <tr key={row.employeeId} className="border-t border-slate-100">
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
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-4 px-4 py-3 text-sm text-slate-500">
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
