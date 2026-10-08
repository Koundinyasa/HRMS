import React, { useEffect, useRef } from "react";
import { Filter, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TAInsightsDatePicker from "./TAInsightsDatePicker";
import TimeOfficeNavbar from "../../components/TimeOfficeNavbar";
import type { TAInsightFilters } from "../types/taInsightsTypes";

interface TAInsightsHeaderProps {
  onAddFilter: () => void;
  filters: TAInsightFilters;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onRefresh: () => void;
  onClear: () => void;
}

const TAInsightsHeader: React.FC<TAInsightsHeaderProps> = ({
  onAddFilter,
  filters,
  onFromDateChange,
  onToDateChange,
  onRefresh,
  onClear,
}) => {
  const pickersRef = useRef<HTMLDivElement>(null);

  // Keep the (fixed) calendar fully inside the screen
  useEffect(() => {
    const node = pickersRef.current;
    if (!node) return;

    const keepInView = () => {
      node
        .querySelectorAll<HTMLElement>(".relative > div")
        .forEach((popup) => {
          popup.style.marginLeft = "0px";

          const rect = popup.getBoundingClientRect();
          const overflowRight = rect.right - (window.innerWidth - 8);
          const room = Math.max(rect.left - 8, 0);
          const shift = Math.min(Math.max(overflowRight, 0), room);

          if (shift > 0) {
            popup.style.marginLeft = `-${shift}px`;
          }
        });
    };

    const observer = new MutationObserver(keepInView);
    observer.observe(node, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <TimeOfficeNavbar className="mb-3" allowVerticalOverflow>
      <div className="punch-horizontal-scroll max-w-[calc(100vw-5.5rem)] overflow-x-auto pb-1 sm:max-w-none sm:overflow-visible">
        <div className="flex w-max items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAddFilter}
            className="shrink-0 gap-2 whitespace-nowrap text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <Filter size={16} />
            Add Filter
          </Button>

          {/* The calendar popup becomes position:fixed (below its field)
              so the scroll area can't clip it */}
          <div
            ref={pickersRef}
            className="flex shrink-0 items-center gap-2 [&_.relative>div]:fixed [&_.relative>div]:left-auto [&_.relative>div]:right-auto [&_.relative>div]:top-auto [&_.relative>div]:mt-1"
          >
            <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-[#1f2937]">
              From
              <TAInsightsDatePicker
                value={filters.fromDate ?? ""}
                onChange={onFromDateChange}
              />
            </label>

            <label className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-[#1f2937]">
              To
              <TAInsightsDatePicker
                value={filters.toDate ?? ""}
                onChange={onToDateChange}
              />
            </label>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Refresh"
            onClick={onRefresh}
            className="shrink-0"
          >
            <RefreshCw size={18} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Clear filters"
            onClick={onClear}
            className="shrink-0"
          >
            <X size={18} className="text-red-500" />
          </Button>
        </div>
      </div>
    </TimeOfficeNavbar>
  );
};

export default TAInsightsHeader;