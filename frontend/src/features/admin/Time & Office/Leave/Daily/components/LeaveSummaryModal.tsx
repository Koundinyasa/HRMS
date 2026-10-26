import { CalendarCheck, CalendarDays, PartyPopper, Sofa, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface LeaveSummaryTarget {
  employeeName: string;
  /** NDP from backend */
  present: string | number;
  /** NOD from backend */
  payDays: string | number;
  holidays: string | number;
  weekOffs: string | number;
}

interface LeaveSummaryModalProps {
  target: LeaveSummaryTarget | null;
  onClose: () => void;
}

const LeaveSummaryModal = ({ target, onClose }: LeaveSummaryModalProps) => {
  useEffect(() => {
    if (!target) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [target, onClose]);

  if (!target) return null;

  const initial = (target.employeeName.trim()[0] ?? "?").toUpperCase();

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 px-4 font-[Urbanist]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="This month summary"
        className="relative w-full max-w-[400px] rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.25)]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#914f3f] text-[18px] font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[17px] font-bold text-[#182237]">
              {target.employeeName}
            </div>
            <div className="text-[13px] font-medium text-[#738096]">This month summary</div>
          </div>
        </div>

        {/* Present / Pay days */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#e7e9ef] px-3 py-3 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-[12.5px] font-bold uppercase text-emerald-500">
              <CalendarCheck size={15} /> Present
            </div>
            <div className="mt-1 text-[26px] font-extrabold text-[#182237]">{target.present}</div>
          </div>
          <div className="rounded-xl border border-[#e7e9ef] px-3 py-3 text-center shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-[12.5px] font-bold uppercase text-sky-500">
              <CalendarDays size={15} /> Pay Days
            </div>
            <div className="mt-1 text-[26px] font-extrabold text-[#182237]">{target.payDays}</div>
          </div>
        </div>

        <div className="my-4 border-t border-[#e7e9ef]" />

        {/* Holidays / Weekly offs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 px-3 py-3">
            <div className="flex items-center gap-2">
              <PartyPopper size={18} className="text-amber-500" />
              <div className="leading-tight">
                <div className="text-[12.5px] font-bold text-amber-500">H</div>
                <div className="text-[13px] font-medium text-[#303746]">Holidays</div>
              </div>
            </div>
            <div className="text-[20px] font-extrabold text-[#182237]">{target.holidays}</div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50/40 px-3 py-3">
            <div className="flex items-center gap-2">
              <Sofa size={18} className="text-violet-500" />
              <div className="leading-tight">
                <div className="text-[12.5px] font-bold text-violet-500">WO</div>
                <div className="text-[13px] font-medium text-[#303746]">Weekly Offs</div>
              </div>
            </div>
            <div className="text-[20px] font-extrabold text-[#182237]">{target.weekOffs}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LeaveSummaryModal;