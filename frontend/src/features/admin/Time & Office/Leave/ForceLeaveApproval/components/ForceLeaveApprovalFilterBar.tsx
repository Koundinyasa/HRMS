import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Search, X as XIcon } from "lucide-react";
import FilterDropdown from "@/features/admin/components/FilterDropdown";
import type { ForceLeaveApprovalFilterBarProps } from "../types/forceapproval.types";

export default function ForceLeaveApprovalFilterBar({
  show,
  searchValue,
  filters,
  options,
  onSearchChange,
  onFilterChange,
  onClear,
  onClose,
}: ForceLeaveApprovalFilterBarProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [moreMenuPosition, setMoreMenuPosition] = useState<{ top: number; left: number } | null>(null);

  return (
    <div className={`relative min-w-0 overflow-visible rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm ${show ? "" : "hidden"}`}>
      <div className="relative flex min-w-0 items-center gap-1 font-[Urbanist]">
        <div className="-mx-1 min-w-0 flex-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-h-[40px] w-max flex-nowrap items-center gap-2">
            <div className="flex h-9 w-[200px] min-w-[150px] shrink-0 items-center rounded-lg border border-transparent bg-slate-100 px-2.5 transition-colors focus-within:border-indigo-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-50">
              <Search size={17} strokeWidth={1.8} className="mr-2 shrink-0 text-[#8FA0C2]" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Start Typing..."
                className="min-w-0 w-full border-0 bg-transparent text-sm font-medium text-[#27364F] outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex w-max flex-nowrap items-center gap-2">
              {([
              ["branch", "Branch"],
              ["salaryStructure", "Salary Structure"],
              ["leave", "Leave"],
              ["attendance", "Attendance"],
              ["designation", "Designation"],
              ["empStatus", "Emp Status"],
            ] as const).map(([key, label]) => (
              <FilterDropdown
                key={key}
                label={label}
                options={options[key]}
                selected={(filters[key] as string[]) ?? []}
                onChange={(value) => onFilterChange(key, value)}
                triggerClassName="!text-slate-700 !border-slate-400 !font-semibold"
                variant="chip"
                portal
                hideScrollbar
              />
              ))}
            </div>

          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
              <div className="relative shrink-0">
                <Button variant="ghost"
                  type="button"
                  aria-label="More"
                  onClick={(event) => {
                    if (showMoreMenu) {
                      setShowMoreMenu(false);
                      setMoreMenuPosition(null);
                      return;
                    }
                    const rect = event.currentTarget.getBoundingClientRect();
                    setMoreMenuPosition({
                      top: Math.min(rect.bottom + 8, Math.max(8, window.innerHeight - 100)),
                      left: Math.max(8, Math.min(rect.right - 168, window.innerWidth - 168)),
                    });
                    setShowMoreMenu(true);
                  }}
                  className="flex h-7 w-7 items-center justify-center bg-transparent p-0 text-slate-700 hover:bg-slate-100"
                >
                  <MoreVertical size={20} strokeWidth={2.5} />
                </Button>
                {showMoreMenu && moreMenuPosition && createPortal(
                  <div style={{ top: moreMenuPosition.top, left: moreMenuPosition.left }} className="fixed z-[100] w-[160px] rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                    <span className="block px-3 py-2 text-[13px] text-slate-400">More filters</span>
                  </div>,
                  document.body,
                )}
              </div>
              <Button variant="ghost"
                type="button"
                aria-label="Close filters"
                title="Close filters"
                onClick={() => {
                  onClear();
                  setShowMoreMenu(false);
                  setMoreMenuPosition(null);
                  onClose();
                }}
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center bg-transparent p-0 text-red-600 hover:bg-slate-100 hover:text-red-700"
              >
                <XIcon size={20} strokeWidth={2.5} />
              </Button>
        </div>
      </div>
    </div>
  );
}
