import { ChevronLeft, ChevronRight } from "lucide-react";

interface RecruitmentPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function RecruitmentPagination({
  page,
  pageSize,
  totalCount,
  totalPages: providedTotalPages,
  onPageChange,
  onPageSizeChange,
}: RecruitmentPaginationProps) {
  const totalPages = Math.max(
    1,
    providedTotalPages ?? Math.ceil(totalCount / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const startRow = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#efeee9] px-4 py-3 text-xs text-[#68756d] sm:flex-row sm:px-6">
      <div className="flex items-center gap-2">
        <label htmlFor="recruitment-page-size">Rows per page</label>
        <select
          id="recruitment-page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-lg border border-[#dfe4df] bg-white px-2 py-1.5 text-xs text-[#354239] outline-none focus:border-[#d8a43b]"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>
          Showing {startRow}–{endRow} of {totalCount}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded-lg border border-[#dfe4df] px-3 py-1.5 font-semibold text-[#566258] transition hover:bg-[#f8faf8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <span aria-live="polite">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 rounded-lg border border-[#dfe4df] px-3 py-1.5 font-semibold text-[#566258] transition hover:bg-[#f8faf8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
