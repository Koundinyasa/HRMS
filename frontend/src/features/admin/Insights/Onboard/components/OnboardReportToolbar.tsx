






import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Clock3,
  Download,
  Loader2,
  Check,
  FileBarChart2,
  CalendarDays,
} from "lucide-react";

interface OnboardReportToolbarProps {
  label: string;
  isDateWise: boolean;
  month: string;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onBack: () => void;
  onExportPdf: () => void;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toDisplayDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
}

export default function OnboardReportToolbar({
  label,
  isDateWise,
  month,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onMonthChange,
  onBack,
  onExportPdf,
}: OnboardReportToolbarProps) {
  const [openMonth, setOpenMonth] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  const [pdfState, setPdfState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(e.target as Node)) {
        setOpenMonth(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const [monthPart, yearPart] = (month || "Sep/2026").split("/");

  const handlePickMonth = (m: string) => {
    onMonthChange(`${m}/${yearPart || new Date().getFullYear()}`);
    setOpenMonth(false);
  };

  const handleYearChange = (dir: -1 | 1) => {
    const y = Number(yearPart || new Date().getFullYear()) + dir;
    onMonthChange(`${monthPart || "Sep"}/${y}`);
  };

  const handleExportClick = () => {
    if (pdfState !== "idle") return;
    setPdfState("loading");
    setTimeout(() => {
      onExportPdf();
      setPdfState("done");
      setTimeout(() => setPdfState("idle"), 1200);
    }, 900);
  };

  const openNativePicker = (ref: React.RefObject<HTMLInputElement>) => {
    const el = ref.current;
    if (!el) return;
    // showPicker() is the reliable way to force-open the native date UI
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      el.click();
    }
  };

  return (
    <div className="flex h-[54px] items-center justify-between border-b border-[#E5E7EB] px-5">
      <div className="flex items-center gap-2 rounded-full border border-[#F3D9C9] bg-[#FDF1E9] px-3.5 py-1.5">
        <FileBarChart2 size={14} className="shrink-0 text-[#D97B3F]" />
        <span className="text-[13px] font-semibold text-[#3F3F46]">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={13} />
          Back
        </button>

        {!isDateWise && (
          <div className="relative" ref={monthRef}>
            <button
              type="button"
              onClick={() => setOpenMonth((p) => !p)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <span>{month || "Sep/2026"}</span>
              <CalendarDays size={13} className="text-slate-400" />
              <Clock3 size={13} className="text-slate-400" />
            </button>

            {openMonth && (
              <div className="absolute right-0 top-9 z-50 w-[200px] rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <button type="button" onClick={() => handleYearChange(-1)} className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100">‹</button>
                  <span className="text-sm font-medium text-slate-700">{yearPart || new Date().getFullYear()}</span>
                  <button type="button" onClick={() => handleYearChange(1)} className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-100">›</button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handlePickMonth(m)}
                      className={[
                        "rounded px-2 py-1.5 text-xs",
                        m === monthPart ? "bg-[#D97B3F] text-white" : "text-slate-600 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isDateWise && (
          <>
            <span className="text-xs text-slate-500">From Date</span>
            <div
              className="relative inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 text-xs text-slate-700 hover:bg-slate-50"
              onClick={() => openNativePicker(fromInputRef)}
            >
              <span>{toDisplayDate(fromDate) || "01-09-2026"}</span>
              <CalendarDays size={13} className="text-slate-400" />
              <input
                ref={fromInputRef}
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
              />
            </div>

            <span className="text-xs text-slate-500">To Date</span>
            <div
              className="relative inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 text-xs text-slate-700 hover:bg-slate-50"
              onClick={() => openNativePicker(toInputRef)}
            >
              <span>{toDisplayDate(toDate) || "30-09-2026"}</span>
              <CalendarDays size={13} className="text-slate-400" />
              <input
                ref={toInputRef}
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
              />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleExportClick}
          disabled={pdfState !== "idle"}
          title="Download PDF"
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            pdfState === "done"
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-[#FDF1E9] text-[#D97B3F] hover:bg-[#F3D9C9]",
          ].join(" ")}
        >
          {pdfState === "loading" && <Loader2 size={15} className="animate-spin" />}
          {pdfState === "done" && <Check size={15} />}
          {pdfState === "idle" && <Download size={15} />}
        </button>
      </div>
    </div>
  );
}