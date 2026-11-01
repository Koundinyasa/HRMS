import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Filter, X } from "lucide-react";

import type { Column } from "../constants/employeeList.constants";
import type { SortConfig } from "../utils/employeeList.utils";
import ListPopover from "./ListPopover";

interface ColumnHeaderCellProps {
  column: Column;
  sort: SortConfig;
  onSort: (key: string) => void;
  filterValue: string;
  onFilter: (key: string, value: string) => void;
}

const headingClass = "text-[12px] font-semibold uppercase tracking-[0.04em] text-[#626262]";

/** One table heading: click the name to sort, the funnel to filter. */
export default function ColumnHeaderCell({
  column,
  sort,
  onSort,
  filterValue,
  onFilter,
}: ColumnHeaderCellProps) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  if (column.plain) {
    return <div className={`px-4 ${headingClass}`}>{column.label}</div>;
  }

  const sorted = sort.key === column.key;
  const SortIcon = !sorted ? ChevronsUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center gap-1 px-4">
      <button
        type="button"
        onClick={() => onSort(column.key)}
        aria-label={`Sort by ${column.label}`}
        className={`flex items-center gap-1.5 hover:text-[#131313] ${headingClass} ${sorted ? "!text-[#FF6200]" : ""}`}
      >
        {column.label}
        <SortIcon size={13} strokeWidth={2.2} className={sorted ? "" : "opacity-50"} />
      </button>

      <button
        ref={setAnchor}
        type="button"
        aria-label={`Filter ${column.label}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={[
          "flex h-6 w-6 items-center justify-center rounded-md",
          filterValue ? "bg-[#FFF5EE] text-[#FF6200]" : "text-[#8A8A8A] hover:bg-[#EDEDED]",
        ].join(" ")}
      >
        <Filter size={13} strokeWidth={2.2} />
      </button>

      {open && (
        <ListPopover anchor={anchor} width={236} onClose={() => setOpen(false)}>
          <div className="p-3">
            <input
              autoFocus
              value={filterValue}
              onChange={(event) => onFilter(column.key, event.target.value)}
              placeholder={`Filter ${column.label.toLowerCase()}`}
              aria-label={`Filter ${column.label}`}
              className="h-9 w-full rounded-lg border border-[#E2E2E2] px-3 text-[13.5px] text-[#131313] outline-none placeholder:text-[#8A8A8A] focus:border-[#FF6200]"
            />
            {filterValue && (
              <button
                type="button"
                onClick={() => onFilter(column.key, "")}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-[13px] font-medium text-[#DD3232] hover:bg-[#FEF3F2]"
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </ListPopover>
      )}
    </div>
  );
}
