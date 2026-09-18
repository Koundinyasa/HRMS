



// ReportHeader.tsx
import { useState } from "react";
import { FileText } from "lucide-react";
import MonthSelector from "./MonthSelector";
import GroupBySelector from "./GroupBySelector";
import AuditLogModal from "./AuditLogModal";
import { PdfIcon, ExcelIcon, ClockIcon } from "./common/ReportIcons";
import type { MonthOption } from "../types/filters";
import type { GroupByLeavePolicyState } from "../types/filters";

interface ReportHeaderProps {
  title: string;
  reportType?: string;
  fromMonth: string;
  toMonth: string;
  monthOptions: MonthOption[];
  onFromMonthChange: (value: string) => void;
  onToMonthChange: (value: string) => void;
  groupBy: GroupByLeavePolicyState;
  onGroupByChange: (state: GroupByLeavePolicyState) => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  onHistoryClick?: () => void;
  /** Set false for a single "Month" dropdown instead of From Month / To Month. Default true. */
  showToMonth?: boolean;
  /** Set false to hide the Groupby dropdown entirely. Default true. */
  showGroupBy?: boolean;
  /** Custom label for the Groupby dropdown button, e.g. "Groupby Attendance". */
  groupByLabel?: string;
  /** Custom labels for the Groupby dropdown's two checkboxes. */
  groupByOptionLabels?: { option1: string; option2: string };
  /** Set true to hide the Groupby dropdown's checkboxes, showing only Clear (matches Figma for Groupby Attendance). */
  groupByHideOptions?: boolean;
}

export default function ReportHeader({
  title,
  reportType,
  fromMonth,
  toMonth,
  monthOptions,
  onFromMonthChange,
  onToMonthChange,
  groupBy,
  onGroupByChange,
  onExportPdf,
  onExportExcel,
  onHistoryClick,
  showToMonth = true,
  showGroupBy = true,
  groupByLabel,
  groupByOptionLabels,
  groupByHideOptions,
}: ReportHeaderProps) {
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

  const handleHistoryClick = () => {
    onHistoryClick?.();
    if (reportType) setIsAuditLogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-4 flex-wrap">
      {/* Title — left */}
      {title && (
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-orange-200 bg-orange-50 text-sm font-semibold text-orange-800 whitespace-nowrap">
          <FileText size={15} />
          {title}
        </span>
      )}

      {/* Month(s) + Groupby + Export icons — all pushed to the right */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:ml-auto">
        {showToMonth ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">From Month</span>
              <MonthSelector
                value={fromMonth}
                options={monthOptions}
                onChange={onFromMonthChange}
                placeholder="Select From Month"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">To Month</span>
              <MonthSelector
                value={toMonth}
                options={monthOptions}
                onChange={onToMonthChange}
                placeholder="Select To Month"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <MonthSelector
              value={fromMonth}
              options={monthOptions}
              onChange={onFromMonthChange}
              placeholder="Select Month"
            />
          </div>
        )}

        {showGroupBy && (
          <GroupBySelector
            value={groupBy}
            onChange={onGroupByChange}
            label={groupByLabel}
            optionLabels={groupByOptionLabels}
            hideOptions={groupByHideOptions}
          />
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExportPdf}
            aria-label="Export PDF"
            className="hover:opacity-75 transition-opacity"
            title="Export PDF"
          >
            <PdfIcon />
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            aria-label="Export Excel"
            className="hover:opacity-75 transition-opacity"
            title="Export Excel"
          >
            <ExcelIcon />
          </button>
          <button
            type="button"
            onClick={handleHistoryClick}
            aria-label="View audit log"
            disabled={!reportType && !onHistoryClick}
            className="hover:opacity-75 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            title="History"
          >
            <ClockIcon />
          </button>
        </div>
      </div>

      {isAuditLogOpen && reportType && (
        <AuditLogModal
          reportType={reportType}
          title={title}
          onClose={() => setIsAuditLogOpen(false)}
        />
      )}
    </div>
  );
}