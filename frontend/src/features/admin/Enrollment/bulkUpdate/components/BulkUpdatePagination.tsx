import { ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface BulkUpdatePaginationProps {
  page: number; // 1-indexed
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function BulkUpdatePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: BulkUpdatePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  const pageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  };

  return (
    // <div className="flex h-[52px] flex-wrap items-center justify-end gap-4 text-[14px] text-[#667085]">
      <div className="flex min-h-[52px] flex-wrap items-center justify-center gap-2 py-2 text-[13px] text-[#667085] sm:justify-end sm:gap-4 sm:py-0 sm:text-[14px]">
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none rounded-md border border-[#d9e1e8] bg-[#edf3f8] py-1 pl-2 pr-6 text-[14px] text-[#475467] outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[#667085]"
          />
        </div>
      </div>

      <span>
        {start} to {end} of {totalCount}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded p-1 text-[#667085] hover:bg-[#f2f5f8] disabled:opacity-30"
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          type="button"
          className="rounded p-1 text-[#667085] hover:bg-[#f2f5f8] disabled:opacity-30"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers().map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-1">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-7 w-7 rounded-md text-[14px] ${
                p === page
                  ? "bg-[#2196e0] text-white"
                  : "text-[#475467] hover:bg-[#f2f5f8]"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="rounded p-1 text-[#667085] hover:bg-[#f2f5f8] disabled:opacity-30"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          type="button"
          className="rounded p-1 text-[#667085] hover:bg-[#f2f5f8] disabled:opacity-30"
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}