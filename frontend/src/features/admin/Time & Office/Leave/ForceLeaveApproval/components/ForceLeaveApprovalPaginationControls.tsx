import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { ForceLeaveApprovalPaginationControlsProps } from "../types/forceapproval.types";
import type { LeaveApprovalRow } from "../types/forceapproval.types";

export function useForceLeaveApprovalPagination(rows: LeaveApprovalRow[], initialPageSize = 5) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [rows, currentPage, pageSize],
  );

  return { page, setPage, pageSize, setPageSize, currentPage, totalPages, paginatedRows };
}

const getPageNumbers = (totalPages: number, currentPage: number) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 2) return [1, 2, "…", totalPages] as const;
  if (currentPage >= totalPages - 1) return [1, "…", totalPages - 1, totalPages] as const;
  return [1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages] as const;
};

export default function ForceLeaveApprovalPaginationControls({
  itemCount,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: ForceLeaveApprovalPaginationControlsProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-slate-200 px-2 pt-3 font-[Urbanist] text-[12px] text-slate-500">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1">Rows per page</span>
        {[5, 10, 25, 50, 100].map((size) => (
          <Button variant="ghost"
            key={size}
            type="button"
            onClick={() => onPageSizeChange(size)}
            aria-pressed={pageSize === size}
            className={`min-w-8 rounded-md px-2 py-1 font-semibold transition-colors ${pageSize === size ? "bg-[#914f3f] text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {size}
          </Button>
        ))}
        <span className="ml-2 whitespace-nowrap">
          {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, itemCount)} of {itemCount}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" type="button" onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="First page" className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronsLeft size={15} />
        </Button>
        <Button variant="ghost" type="button" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Previous page" className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronLeft size={15} />
        </Button>
        {getPageNumbers(totalPages, currentPage).map((pageNumber, index) =>
          typeof pageNumber === "number" ? (
            <Button variant="ghost"
              key={`${pageNumber}-${index}`}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={currentPage === pageNumber ? "page" : undefined}
              className={`h-7 min-w-7 rounded px-2 font-semibold ${currentPage === pageNumber ? "bg-[#914f3f] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {pageNumber}
            </Button>
          ) : <span key={`ellipsis-${index}`} className="px-1 text-slate-400">{pageNumber}</span>,
        )}
        <Button variant="ghost" type="button" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Next page" className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronRight size={15} />
        </Button>
        <Button variant="ghost" type="button" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Last page" className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
          <ChevronsRight size={15} />
        </Button>
      </div>
    </div>
  );
}