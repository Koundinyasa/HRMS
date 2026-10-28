import type { ReactNode } from "react";
 
import TimeOfficeTabs from "./TimeOfficeTabs";
 
interface TimeOfficeNavbarProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  allowVerticalOverflow?: boolean;
}
 
export default function TimeOfficeNavbar({
  children,
  className = "",
  compact = false,
  allowVerticalOverflow = false,
}: TimeOfficeNavbarProps) {
  return (
    <div
      className={`punch-horizontal-scroll w-full min-w-0 ${
        allowVerticalOverflow ? "overflow-visible" : "overflow-x-auto"
      } border border-[#e0e5ec] bg-white shadow-sm ${
        compact
          ? "rounded-lg p-1.5"
          : "rounded-xl px-3 py-1"
      } ${className}`}
    >
      <div
        className={`flex ${
          allowVerticalOverflow
            ? "w-full flex-wrap"
            : "w-max min-w-full"
        } items-center justify-between ${
          compact ? "gap-2" : "gap-3"
        }`}
      >
        <TimeOfficeTabs
          compact={compact}
          className={`w-auto shrink-0 ${compact ? "px-0.5" : "px-1"}`}
        />
        <div
          className={`ml-auto flex shrink-0 items-center ${
                        allowVerticalOverflow ? "flex-wrap justify-end lg:flex-nowrap" : ""
          } ${compact ? "gap-1" : "gap-2"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
 
 