import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROWS_PER_PAGE_OPTIONS } from "../constants/attendance.constants";

export default function TablePaginationFooter({
  rowsPerPage,
  onRowsPerPageChange,
  page,
  totalPages,
  onPageChange,
  rangeStart,
  rangeEnd,
  totalCount,
}: {
  rowsPerPage: number;
  onRowsPerPageChange: (n: number) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rangeStart: number;
  rangeEnd: number;
  totalCount: number;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <span className="text-violet-600 font-medium">Rows per page</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-sm outline-none"
        >
          {ROWS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span>
          {rangeStart} to {rangeEnd} of {totalCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
          className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-medium flex items-center justify-center">
          {page}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
