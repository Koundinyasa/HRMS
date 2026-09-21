import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ClockFading,
  SendHorizontal,
  FileSpreadsheet,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface TDSReportHeaderProps {
  title: string;
  onBack?: () => void;
  showDate?: boolean;
  date?: string;
  showFinancialYear?: boolean;
  financialYear?: string;
  financialYearOptions?: string[];
  showVerificationControls?: boolean;
  showStatusIcon?: boolean;
  showExcel?: boolean;
  onExcel?: () => void;
  showMoreOptions?: boolean;
  backFirst?: boolean;
  variant?: "peach" | "blue";
}

export default function TDSReportHeader({
  title,
  onBack,
  showDate = false,
  date = "02-09-2026",
  showFinancialYear = false,
  financialYear = "2026-2027",
  financialYearOptions = [],
  showVerificationControls = false,
  showStatusIcon = false,
  showExcel = false,
  onExcel,
  showMoreOptions = false,
  backFirst = false,
  variant = "peach",
}: TDSReportHeaderProps) {
  const isBlue = variant === "blue";
  const [auditLogOpen, setAuditLogOpen] = useState(false);
  const [financialYearOpen, setFinancialYearOpen] = useState(false);
  const [selectedFinancialYear, setSelectedFinancialYear] =
    useState(financialYear);

  const availableFinancialYears = financialYearOptions;

  const displayedFinancialYears = availableFinancialYears.length
    ? availableFinancialYears
    : ["2026-2027", "2025-2026"];

  const backButton = onBack ? (
    <Button
      type="button"
      onClick={onBack}
      variant="default"
      size="sm"
      className="gap-1.5 bg-[#8b4f40] px-5 font-[Urbanist] text-[13px] font-medium text-white hover:bg-[#754033]"
    >
      <ChevronLeft size={17} />

      {/* Subheading/SM — Urbanist Semi Bold — 12px */}
      <span className="font-[Urbanist] text-[12px] font-semibold">
        Back
      </span>
    </Button>
  ) : null;

  return (
    <section className="flex min-h-[68px] w-full items-center justify-between rounded-xl border border-[#d7d7d7] bg-white px-4 py-3 shadow-sm">
      <div
        className={
          isBlue
            ? "border-b-[3px] border-[#2196e5] pb-2 font-[Urbanist] text-[22px] font-extrabold text-[#2196e5]"
            : "flex min-h-10 items-center gap-2 rounded-lg border border-[#c98f82] px-4 font-[Urbanist] text-[22px] font-extrabold text-[#9d6155]"
        }
      >
        {/* Display/SM — Urbanist ExtraBold — 22px */}
        <span className="font-[Urbanist] text-[22px] font-extrabold">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {backFirst && backButton}

        {showFinancialYear && (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-haspopup="listbox"
              aria-expanded={financialYearOpen}
              onClick={() => setFinancialYearOpen((open) => !open)}
              className="min-w-[185px] justify-between border-[#d8dee8] bg-[#f4f6fa] font-[Urbanist] text-[13px] font-medium text-[#333]"
            >
              {/* Label/SM — Urbanist Medium — 13px */}
              <span className="font-[Urbanist] text-[13px] font-medium">
                {selectedFinancialYear}
              </span>

              <ChevronDown size={15} className="text-[#7d8796]" />
            </Button>

            {financialYearOpen && (
              <div
                role="listbox"
                className="absolute right-0 z-40 mt-1 w-full min-w-[185px] overflow-hidden rounded-md border border-[#e1e5eb] bg-white py-1 shadow-lg"
              >
                {[
                  "Select Month",
                  ...displayedFinancialYears,
                ]
                  .filter(
                    (option, index, options) =>
                      options.indexOf(option) === index,
                  )
                  .map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={selectedFinancialYear === option}
                      onClick={() => {
                        setSelectedFinancialYear(option);
                        setFinancialYearOpen(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left font-[Urbanist] text-[13px] ${
                        selectedFinancialYear === option
                          ? "bg-[#e5f3ff] font-bold text-[#1f2937]"
                          : "font-medium text-[#4b5563] hover:bg-[#f5f7f9]"
                      }`}
                    >
                      {/* Label/SM — Urbanist Medium — 13px */}
                      {option}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {showDate && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 border-[#d8dee8] bg-white font-[Urbanist] text-[13px] font-medium text-[#4d5665]"
          >
            {/* Label/SM — Urbanist Medium — 13px */}
            <span className="font-[Urbanist] text-[13px] font-medium">
              {date}
            </span>

            <CalendarDays size={16} />
          </Button>
        )}

        {showVerificationControls && (
          <div className="flex items-center gap-3 text-[#4d4d4d]">
            <SendHorizontal size={22} />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-auto px-0 font-[Urbanist] text-[12px] font-semibold underline underline-offset-2 hover:bg-transparent ${
                isBlue
                  ? "text-[#2196e5] hover:text-[#167ac0]"
                  : "text-[#8b4f40] hover:text-[#754033]"
              }`}
            >
              {/* Subheading/SM — Urbanist Semi Bold — 12px */}
              Verify Valid Email?
            </Button>
          </div>
        )}

        {showExcel && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Download Excel report"
            title="Download Excel report"
            onClick={onExcel}
            className="h-8 w-8 text-[#27854b] hover:bg-transparent hover:text-[#1f6f3d]"
          >
            <FileSpreadsheet size={27} />
          </Button>
        )}

        {showMoreOptions && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="More report options"
            className="h-8 w-6 text-[#777] hover:bg-transparent"
          >
            <MoreVertical size={21} />
          </Button>
        )}

        {showStatusIcon && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open audit log"
            title="Audit log"
            onClick={() => setAuditLogOpen(true)}
            className={`h-8 w-8 hover:bg-transparent ${
              isBlue
                ? "text-[#92a1c1] hover:text-[#7184ae]"
                : "text-[#9d6155] hover:text-[#754033]"
            }`}
          >
            <ClockFading size={24} />
          </Button>
        )}

        {!backFirst && backButton}
      </div>

      {auditLogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
          onClick={() => setAuditLogOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="tds-audit-log-title"
            className="w-full max-w-md rounded-xl border border-[#d7d7d7] bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              {/* Heading/LG — Urbanist Bold — 18px */}
              <h2
                id="tds-audit-log-title"
                className="font-[Urbanist] text-[18px] font-bold text-[#333]"
              >
                Audit Log
              </h2>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAuditLogOpen(false)}
                className="font-[Urbanist] text-[12px] font-medium text-[#777]"
              >
                {/* Utility/UI — 12px */}
                Close
              </Button>
            </div>

            {/* Body/SM — Urbanist Regular — 13px */}
            <p className="mt-6 text-center font-[Urbanist] text-[13px] font-normal text-[#777]">
              No audit log data found.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}