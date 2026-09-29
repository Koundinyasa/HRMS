import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ChevronDown, Clock3, ClockFading, FileSpreadsheet, FileText, Funnel, Percent } from "lucide-react";
import DateField from "../../../TimeOffice/components/DateField";

interface ReportHeaderProps {
  title: string;
  fromMonth?: string;
  toMonth?: string;
  dateRange?: boolean;
  singleMonth?: boolean;
  onFromMonthChange?: (value: string) => void;
  onToMonthChange?: (value: string) => void;
  groupBy?: string;
  onGroupByChange?: (value: string) => void;
  groupByOptions?: string[];
  groupByMultiSelect?: boolean;
  groupByRadioSelect?: boolean;
  groupByPlaceholder?: string;
  onBack: () => void;
  onShowFilters?: () => void;
  onAdvanceFilter?: () => void;
  onPdfExport?: () => void;
  onExcelExport?: () => void;
  onRefresh?: () => void;
  showFilterButton?: boolean;
  showAdvanceFilter?: boolean;
  showGroupBy?: boolean;
  showPdfExport?: boolean;
  showExcelExport?: boolean;
  showRefresh?: boolean;
  showTopRefresh?: boolean;
  showSubHeader?: boolean;
  responsiveHorizontalScroll?: boolean;
}

const MONTHS = ["Jan/2026","Feb/2026","Mar/2026","Apr/2026","May/2026","Jun/2026","Jul/2026","Aug/2026","Sep/2026","Oct/2026","Nov/2026","Dec/2026"];

export default function ReportHeader({
  title, fromMonth = "Aug/2026", toMonth = "Sep/2026", dateRange = false, singleMonth = false, onFromMonthChange, onToMonthChange,
  groupBy = "Leave Policy", onGroupByChange, groupByOptions = ["Leave Policy"],
  groupByMultiSelect = false, groupByRadioSelect = false,
  groupByPlaceholder = "Group by Leave Policy", onBack,
  onShowFilters, onPdfExport, onExcelExport, onRefresh, showFilterButton = true,
  showPdfExport = true, showExcelExport = true, showRefresh = true, showSubHeader = true,
  showTopRefresh = false,
  showGroupBy = true,
  responsiveHorizontalScroll = false,
}: ReportHeaderProps) {
  const [groupByOpen, setGroupByOpen] = useState(false);
  const [groupByMenuPosition, setGroupByMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const toggleGroupByMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (groupByOpen) {
      setGroupByOpen(false);
      setGroupByMenuPosition(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setGroupByMenuPosition({
      top: Math.min(rect.bottom + 4, window.innerHeight - Math.min(420, window.innerHeight * 0.6) - 8),
      left: Math.max(8, Math.min(rect.right - 300, window.innerWidth - 308)),
    });
    setGroupByOpen(true);
  };
  const selectedGroupBy = groupBy.split("|").map((value) => value.trim()).filter(Boolean);

  const toggleGroupByOption = (option: string) => {
    const next = selectedGroupBy.includes(option)
      ? selectedGroupBy.filter((value) => value !== option)
      : [...selectedGroupBy, option];
    onGroupByChange?.(next.join(" | "));
  };

  const exportFileName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "leave-report";
  const exportExcel = async () => {
    const table = document.querySelector<HTMLTableElement>("[data-report-export]");
    if (!table) return;
    const XLSX = await import("xlsx");
    const workbook = XLSX.utils.table_to_book(table, { sheet: title.slice(0, 31) || "Report" });
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };
  const exportPdf = async () => {
    const table = document.querySelector<HTMLTableElement>("[data-report-export]");
    if (!table) return;
    const [{ default: JsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const pdf = new JsPDF({ orientation: table.scrollWidth > 900 ? "landscape" : "portrait" });
    pdf.setFontSize(14);
    pdf.text(title, 14, 15);
    autoTable(pdf, { html: table, startY: 21, styles: { fontSize: 8 } });
    pdf.save(`${exportFileName}.pdf`);
  };

  return <div className="font-[Urbanist]">
    <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-2 rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-3 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:px-5">
      <div className="inline-flex h-[46px] items-center gap-2 rounded-[9px] border border-[#df8d7c] bg-white px-4 text-[22px] font-bold leading-7 text-[#9a5547] shadow-sm">
        <Percent size={17} strokeWidth={1.8} />
        <span>Report</span>
      </div>
      {(showFilterButton || showTopRefresh) && <div className="ml-auto flex items-center gap-1">
        {showFilterButton && <button type="button" onClick={onShowFilters} aria-label="Show filters" className="flex h-8 w-8 items-center justify-center text-[#7D8790] hover:text-[#9a5547]"><Funnel size={18} /></button>}
        {showTopRefresh && <button type="button" onClick={onRefresh} title="Recent report history" aria-label="Recent report history" className="flex h-8 w-8 items-center justify-center text-[#a45a4a] hover:text-[#914f3f]"><ClockFading size={20}/></button>}
      </div>}
    </div>
    {showSubHeader && <div className={`mt-2 min-w-0 overflow-x-auto rounded-[10px] border border-[#DCE3EA] bg-white px-3 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:px-4 ${responsiveHorizontalScroll ? "[scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a] xl:overflow-x-visible xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden" : "[scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible"}`}>
      <div className="flex w-max min-w-full flex-nowrap items-center gap-1.5 whitespace-nowrap xl:w-full">
      <h1 className="inline-flex shrink-0 items-center gap-2 rounded-[9px] border border-[#df8d7c] bg-white px-3 py-2 text-base font-bold leading-6 text-[#9a5547] sm:px-3.5 sm:text-[20px] xl:mr-auto"><Clock3 size={18} strokeWidth={1.8} className="shrink-0" />{title}</h1>
      <button type="button" onClick={onBack} className="flex h-10 shrink-0 items-center gap-1.5 rounded-[7px] bg-[#914f3f] px-3 text-[13px] font-semibold text-white hover:bg-[#7f4234]"><ArrowLeft size={17}/>Back</button>
      {!singleMonth && <>
        <span className="ml-1 text-[13px] font-medium text-[#202124]">{dateRange ? "From Date" : "From Month"}</span>
        {dateRange ? (
          <DateField value={fromMonth} onChange={value => onFromMonthChange?.(value)} className="w-[176px] shrink-0" inputClassName="h-10 rounded-[7px] border-[#CBD5E1] bg-[#F4F6FA] px-3 pr-10 text-[13px] font-medium text-[#344054] focus:shadow-none" />
        ) : (
          <select value={fromMonth} onChange={e=>onFromMonthChange?.(e.target.value)} className="h-10 w-[176px] rounded-[7px] border border-[#CBD5E1] bg-[#F4F6FA] px-3 text-[13px] font-medium text-[#344054] outline-none focus:border-[#9a5547]">
            {MONTHS.map(m=><option key={m}>{m}</option>)}
          </select>
        )}
        <span className="text-[13px] font-medium text-[#202124]">{dateRange ? "To Date" : "To Month"}</span>
        {dateRange ? (
          <DateField value={toMonth} onChange={value => onToMonthChange?.(value)} className="w-[176px] shrink-0" inputClassName="h-10 rounded-[7px] border-[#CBD5E1] bg-[#F4F6FA] px-3 pr-10 text-[13px] font-medium text-[#344054] focus:shadow-none" />
        ) : (
          <select value={toMonth} onChange={e=>onToMonthChange?.(e.target.value)} className="h-10 w-[176px] rounded-[7px] border border-[#CBD5E1] bg-[#F4F6FA] px-3 text-[13px] font-medium text-[#344054] outline-none focus:border-[#9a5547]">
            {MONTHS.map(m=><option key={m}>{m}</option>)}
          </select>
        )}
      </>}
      {singleMonth && <select value={fromMonth} onChange={e=>onFromMonthChange?.(e.target.value)} className="h-10 w-[188px] rounded-[7px] border border-[#CBD5E1] bg-[#F4F6FA] px-3 text-[13px] font-medium text-[#344054] outline-none focus:border-[#168fe5]">
        <option value="">Select Month</option>
        {MONTHS.map(m=><option key={m}>{m}</option>)}
      </select>}
      {showGroupBy && (groupByRadioSelect ? (
        <div className="relative min-w-0 flex-1 sm:flex-none">
          <button
            type="button"
            onClick={toggleGroupByMenu}
            className="flex h-10 min-w-[225px] items-center justify-between gap-3 rounded-[7px] border border-[#df8d7c] bg-white px-3 text-[13px] font-medium text-[#344054] outline-none focus:ring-2 focus:ring-[#f4d6ce]"
          >
            <span>{groupBy || groupByPlaceholder}</span>
            <ChevronDown size={15} />
          </button>
          {groupByOpen && groupByMenuPosition && createPortal(
            <div style={{ top: groupByMenuPosition.top, left: groupByMenuPosition.left }} className="fixed z-[100] max-h-[min(60vh,420px)] w-[min(300px,calc(100vw-16px))] overflow-y-auto rounded-[9px] border border-[#ead2cc] bg-white p-3 shadow-[0_8px_25px_rgba(15,23,42,0.14)]">
              <div className="space-y-1">
                {groupByOptions.map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 text-[13px] text-[#344054] hover:bg-[#fff7f5]">
                    <input
                      type="radio"
                      name="report-leave-selection"
                      checked={groupBy === option}
                      onChange={() => onGroupByChange?.(option)}
                      className="h-[17px] w-[17px] accent-[#9a5547]"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onGroupByChange?.("")}
                className="mt-2 flex h-10 w-full items-center justify-center rounded-[7px] border border-[#d5d9df] text-[13px] font-semibold text-[#667085] hover:bg-[#fff7f5] hover:text-[#9a5547]"
              >
                Clear
              </button>
            </div>,
            document.body,
          )}
        </div>
      ) : groupByMultiSelect ? (
        <div className="relative min-w-0 flex-1 sm:flex-none">
          <button
            type="button"
            onClick={toggleGroupByMenu}
            className="flex h-10 min-w-[225px] items-center justify-between gap-3 rounded-[7px] border border-[#df8d7c] bg-white px-3 text-[13px] font-medium text-[#344054] outline-none focus:ring-2 focus:ring-[#f4d6ce]"
          >
            <span>{selectedGroupBy.length ? selectedGroupBy.join(", ") : groupByPlaceholder}</span>
            <ChevronDown size={15} />
          </button>
          {groupByOpen && groupByMenuPosition && createPortal(
            <div style={{ top: groupByMenuPosition.top, left: groupByMenuPosition.left }} className="fixed z-[100] max-h-[min(60vh,420px)] w-[min(290px,calc(100vw-16px))] overflow-y-auto rounded-[9px] border border-[#ead2cc] bg-white p-3 shadow-[0_8px_25px_rgba(15,23,42,0.14)]">
              <div className="space-y-1">
                {groupByOptions.map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 text-[13px] text-[#344054] hover:bg-[#fff7f5]">
                    <input
                      type="checkbox"
                      checked={selectedGroupBy.includes(option)}
                      onChange={() => toggleGroupByOption(option)}
                      className="h-[17px] w-[17px] accent-[#9a5547]"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onGroupByChange?.("")}
                className="mt-2 flex h-10 w-full items-center justify-center rounded-[7px] border border-[#d5d9df] text-[13px] font-semibold text-[#667085] hover:bg-[#fff7f5] hover:text-[#9a5547]"
              >
                Clear
              </button>
            </div>,
            document.body,
          )}
        </div>
      ) : (
        <select value={groupBy} onChange={e=>onGroupByChange?.(e.target.value)} className="h-10 w-[225px] rounded-[7px] border border-[#CBD5E1] bg-white px-3 text-[13px] font-medium text-[#344054] outline-none focus:border-[#9a5547]">
          {groupByPlaceholder && <option value="">{groupByPlaceholder}</option>}
          {groupByOptions.map(g=><option key={g}>{g}</option>)}
        </select>
      ))}
      {(showPdfExport || showExcelExport || showRefresh) && <div className="flex shrink-0 items-center gap-0.5">
        {showPdfExport && <button type="button" onClick={onPdfExport ?? exportPdf} title="Export PDF" aria-label="Export PDF" className="flex h-8 w-8 items-center justify-center text-[#D94B4B]"><FileText size={20}/></button>}
        {showExcelExport && <button type="button" onClick={onExcelExport ?? exportExcel} title="Export Excel" aria-label="Export Excel" className="flex h-8 w-8 items-center justify-center text-[#3C9B38]"><FileSpreadsheet size={21}/></button>}
        {showRefresh && <button type="button" onClick={onRefresh} title="Recent report history" aria-label="Recent report history" className="flex h-8 w-8 items-center justify-center text-[#a45a4a]"><ClockFading size={19}/></button>}
      </div>}
      </div>
    </div>}
  </div>;
}
