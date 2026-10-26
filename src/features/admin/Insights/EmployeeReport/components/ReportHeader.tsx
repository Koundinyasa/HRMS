

// ReportHeader.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, Search, X, type LucideIcon } from "lucide-react";
import { Users } from "lucide-react";
import { PdfIcon, ExcelIcon } from "../../LeaveReport/components/common/ReportIcons";

interface ReportHeaderProps {
  title: string;
  icon?: LucideIcon;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  onToggleColumns?: () => void;
  showBack?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onClearSearch?: () => void;
}

export default function ReportHeader({
  title,
  icon: Icon = Users,
  onExportPdf,
  onExportExcel,
  onToggleColumns,
  showBack = false, // changed default: Back is now opt-in, not opt-out
  searchValue,
  onSearchChange,
  onClearSearch,
}: ReportHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^(.*\/employee-report)(\/.+)?$/);
  const landingPath = match ? match[1] : location.pathname;

  const showSearch = onSearchChange !== undefined;

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-3 shadow-sm sm:gap-4 sm:px-6">
      <span
        className="flex min-w-0 max-w-full items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-800 sm:px-4"
        style={{ backgroundColor: "#FDEEE3", borderColor: "#FBD9BC" }}
      >
        <Icon size={15} className="shrink-0" />
        <span className="break-words">{title}</span>
      </span>

      {showSearch && (
        <div className="relative w-full min-w-0 sm:w-64 sm:shrink-0">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search..."
            className="w-full border border-gray-200 rounded-md pl-7 pr-2 py-1.5 text-sm outline-none focus:border-orange-300"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-wrap items-center gap-3 sm:ml-auto sm:gap-4">
        {showSearch && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
            Clear
          </button>
        )}

        {onToggleColumns && (
          <button
            type="button"
            onClick={onToggleColumns}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Columns List
          </button>
        )}

        {(onExportPdf || onExportExcel) && (
          <div className="flex items-center gap-3">
            {onExportPdf && (
              <button
                type="button"
                onClick={onExportPdf}
                aria-label="Export PDF"
                title="Export PDF"
                className="hover:opacity-75 transition-opacity"
              >
                <PdfIcon />
              </button>
            )}
            {onExportExcel && (
              <button
                type="button"
                onClick={onExportExcel}
                aria-label="Export Excel"
                title="Export Excel"
                className="hover:opacity-75 transition-opacity"
              >
                <ExcelIcon />
              </button>
            )}
          </div>
        )}

        {showBack && (
          <button
            type="button"
            onClick={() => navigate(landingPath)}
            className="flex items-center gap-1 px-3.5 py-1.5 text-sm font-medium text-white bg-orange-800 rounded-md hover:bg-orange-900 transition-colors shrink-0"
            style={{ backgroundColor: "#9A3412" }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
      </div>
    </div>
  );
}