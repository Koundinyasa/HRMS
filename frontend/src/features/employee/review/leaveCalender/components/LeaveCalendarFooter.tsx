import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  LEAVE_CALENDAR_CONSTANTS,
  getStatusConfig,
} from "../constants/leaveCalendar.constants";
import { useStatusConfigMap } from "./LeaveStatusConfigContext";
import type { LeaveCalendarFooterProps } from "../types/leavecalendar.types";
const LeaveCalendarFooter = ({
  totalItems,
  currentPage,
  rowsPerPage,
  legendCodes,
  onRowsPerPageChange,
  onPrevPage,
  onNextPage,
}: LeaveCalendarFooterProps) => {
  const configMap = useStatusConfigMap();
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(currentPage * rowsPerPage, totalItems);
  const canGoPrev = currentPage > 1;
  const canGoNext = rangeEnd < totalItems;
  return (
    <>
      {/* Pagination */}
      <div className="flex items-center justify-end gap-4 overflow-x-auto border-t border-gray-200 px-4 py-3 text-sm">
        {/* Rows Per Page */}
        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <span className="text-gray-600">Rows per page</span>

          <div className="relative">
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-1 pr-8 text-sm outline-none"
            >
              {LEAVE_CALENDAR_CONSTANTS.ROWS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>
        {/* Count */}
        <span className="shrink-0 whitespace-nowrap text-gray-600">
          {rangeStart}-{rangeEnd} of {totalItems}
        </span>
        {/* Previous */}
        <button
          type="button"
          onClick={onPrevPage}
          disabled={!canGoPrev}
          className="shrink-0 rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
        {/* Next */}
        <button
          type="button"
          onClick={onNextPage}
          disabled={!canGoNext}
          className="shrink-0 rounded p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto border-t border-gray-200 px-4 py-3 text-sm">
        {legendCodes.length === 0 ? (
          <span className="shrink-0 text-gray-400">No status data yet</span>
        ) : (
          legendCodes.map((code) => {
            const { label, className } = getStatusConfig(code, configMap);
            return (
              <div key={code} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                <span
                  className={`flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${className}`}
                >
                  {code}
                </span>
                <span>{label}</span>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
export default LeaveCalendarFooter;
