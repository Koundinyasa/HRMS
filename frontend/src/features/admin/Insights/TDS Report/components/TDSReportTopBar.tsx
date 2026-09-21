import { Funnel, Percent, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TDSReportTopBarProps {
  variant?: "peach" | "blue";
  showSearch?: boolean;
  showFilterIcon?: boolean;
}

export default function TDSReportTopBar({
  variant = "peach",
  showSearch = false,
  showFilterIcon = true,
}: TDSReportTopBarProps) {
  const isBlue = variant === "blue";

  return (
    <header
      className={`relative flex h-[62px] items-center justify-between rounded-xl px-5 shadow-sm ${
        isBlue
          ? "border border-[#e2e8f0] bg-white"
          : "border border-[#c98f82] bg-[#fff5f2]"
      }`}
    >
      <div
        className={
          isBlue
            ? "flex h-full items-center border-b-[3px] border-[#2196e5] font-[Urbanist] text-[22px] font-extrabold text-[#2196e5]"
            : "flex h-10 min-w-[204px] items-center justify-center gap-2 rounded-lg border border-[#c98f82] bg-white px-5 font-[Urbanist] text-[22px] font-extrabold text-[#9d6155] shadow-sm"
        }
      >
        {!isBlue && (
          <Percent
            size={17}
            strokeWidth={1.8}
          />
        )}

        {/* Display/SM — Urbanist ExtraBold — 22px */}
        <span className="font-[Urbanist] text-[22px] font-extrabold">
          TDS Report
        </span>
      </div>

      {showSearch && (
        <div className="absolute left-1/2 flex h-11 w-[238px] -translate-x-1/2 items-center gap-3 rounded-lg bg-[#f3f4f6] px-4 text-[#9ca3af]">
          <Search size={20} />

          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-transparent font-[Urbanist] text-[13px] font-normal outline-none placeholder:font-[Urbanist] placeholder:text-[13px] placeholder:font-normal placeholder:text-[#a1a1aa]"
          />
        </div>
      )}

      {showFilterIcon && (
        <div
          className={`flex items-center gap-1 ${
            isBlue
              ? "text-[#92a1c1]"
              : "text-[#4f4f4f]"
          }`}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Filter reports"
            className={`h-8 w-8 ${
              isBlue
                ? "hover:bg-[#eef6ff]"
                : "hover:bg-[#f7e7e2]"
            }`}
          >
            {/* Utility/UI — icon */}
            <Funnel
              size={17}
              strokeWidth={2}
            />
          </Button>
        </div>
      )}
    </header>
  );
}