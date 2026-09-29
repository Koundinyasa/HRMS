import type { ReactNode } from "react";

import TimeOfficeTabs from "./TimeOfficeTabs";

interface TimeOfficeNavbarProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export default function TimeOfficeNavbar({
  children,
  className = "",
  compact = false,
}: TimeOfficeNavbarProps) {
  return (
    <div
      className={`punch-horizontal-scroll min-w-0 overflow-x-auto border border-[#e0e5ec] bg-white shadow-sm ${
        compact
          ? "rounded-lg p-1.5"
          : "rounded-xl p-2 sm:p-3"
      } ${className}`}
    >
      <div
        className={`flex w-max min-w-full items-center justify-between ${
          compact ? "gap-2" : "gap-3"
        }`}
      >
        <TimeOfficeTabs
          compact={compact}
          className={`w-auto shrink-0 ${compact ? "px-0.5" : "px-1"}`}
        />
        <div className={`flex shrink-0 items-center ${compact ? "gap-1" : "gap-2"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
