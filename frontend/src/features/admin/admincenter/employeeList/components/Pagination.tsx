import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { ROWS_PER_PAGE_OPTIONS } from "../constants/employeeList.constants";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  firstShown: number;
  lastShown: number;
  rowsPerPage: number;
  onPage: (page: number) => void;
  onRowsPerPage: (rows: number) => void;
}

/** 1 … 4 5 6 … 20: the first, last and the pages around the current one. */
function pageList(page: number, totalPages: number): (number | "gap")[] {
  const items: (number | "gap")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) items.push(i);
    else if (items[items.length - 1] !== "gap") items.push("gap");
  }
  return items;
}

const arrow =
  "flex h-8 w-8 items-center justify-center rounded-md text-[#626262] hover:bg-[#FFF5EE] hover:text-[#FF6200] disabled:pointer-events-none disabled:opacity-35";

export default function Pagination({
  page,
  totalPages,
  total,
  firstShown,
  lastShown,
  rowsPerPage,
  onPage,
  onRowsPerPage,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDEDED] px-4 py-3 text-[13px] text-[#626262]">
      <label className="flex items-center gap-2">
        Rows per page
        <select
          value={rowsPerPage}
          onChange={(event) => onRowsPerPage(Number(event.target.value))}
          className="h-8 rounded-md border border-[#E2E2E2] bg-white px-2 text-[13px] text-[#131313] outline-none focus:border-[#FF6200]"
        >
          {ROWS_PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-4">
        <span>
          {firstShown}–{lastShown} of {total}
        </span>

        <nav aria-label="Pagination" className="flex items-center gap-0.5">
          <button type="button" aria-label="First page" disabled={page === 1} onClick={() => onPage(1)} className={arrow}>
            <ChevronsLeft size={16} />
          </button>
          <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPage(page - 1)} className={arrow}>
            <ChevronLeft size={16} />
          </button>

          {pageList(page, totalPages).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} className="px-1.5 text-[#8A8A8A]">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPage(item)}
                className={[
                  "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] font-medium",
                  item === page ? "bg-[#FF6200] text-white" : "text-[#131313] hover:bg-[#FFF5EE]",
                ].join(" ")}
              >
                {item}
              </button>
            ),
          )}

          <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => onPage(page + 1)} className={arrow}>
            <ChevronRight size={16} />
          </button>
          <button type="button" aria-label="Last page" disabled={page === totalPages} onClick={() => onPage(totalPages)} className={arrow}>
            <ChevronsRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
}
