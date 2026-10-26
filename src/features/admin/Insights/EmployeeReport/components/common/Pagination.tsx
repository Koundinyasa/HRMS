





import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ROWS_PER_PAGE_OPTIONS } from "../../constants/employeeReport.constants";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  variant?: "compact" | "entries";
}

export default function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  variant = "compact",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);

  if (variant === "entries") {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6);
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm text-sm text-gray-600">
        <span>
          Showing {startRow} to {endRow} of {totalCount} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                n === page
                  ? "bg-brand-800 text-white"
                  : "text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2 px-4 py-3 bg-white border-t border-gray-100 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm outline-none"
        >
          {ROWS_PER_PAGE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <span>
        {startRow} to {endRow} of {totalCount}
      </span>

      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onPageChange(1)} disabled={page === 1} className="p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors">
          <ChevronsLeft size={16} />
        </button>
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={`w-7 h-7 rounded-md text-sm font-medium transition-colors ${
              n === page ? "bg-brand-800 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors">
          <ChevronRight size={16} />
        </button>
        <button type="button" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className="p-1 rounded disabled:opacity-30 hover:bg-gray-100 transition-colors">
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}