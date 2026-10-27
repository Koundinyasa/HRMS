import { X, Check } from "lucide-react";
import DatePicker from "@/components/ui/datepicker";
import { useCompactCalendar } from "../../hooks/useCompactCalendar";
import type { FlashNewsFormData } from "../../hooks/useFlashNews";
import type { DatePickerCell } from "@/components/ui/datepicker";

interface CalendarProps {
  monthLabel: string;
  weekdayLabels: string[];
  cells: DatePickerCell[];
  goPrevMonth: () => void;
  goNextMonth: () => void;
}

interface Props {
  isEditing: boolean;
  formData: FlashNewsFormData;
  errors: { content?: string; fromDate?: string };
  saveError: string | null;
  isSaving: boolean;
  fromDatePickerOpen: boolean;
  setFromDatePickerOpen: (v: boolean) => void;
  toDatePickerOpen: boolean;
  setToDatePickerOpen: (v: boolean) => void;
  fromCalendar: CalendarProps;
  toCalendar: CalendarProps;
  onContentChange: (v: string) => void;
  onFromDateText: (v: string) => void;
  onToDateText: (v: string) => void;
  onFromDateSelect: (iso: string) => void;
  onToDateSelect: (iso: string) => void;
  onClearFromDate: () => void;
  onClearToDate: () => void;
  onTodayFromDate: () => void;
  onTodayToDate: () => void;
  onSave: () => void;
  onClose: () => void;
}

export default function FlashNewsForm(p: Props) {
  useCompactCalendar(p.fromDatePickerOpen || p.toDatePickerOpen);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-3 sm:p-4 font-[Urbanist]">
      <div
        className="relative mx-auto my-auto flex w-full max-w-[520px] flex-col overflow-visible rounded-xl border border-[#E2E8F0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] font-[Urbanist]"
        style={{ maxHeight: "calc(100% - 24px)" }}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] px-6 h-[56px] font-[Urbanist]">
          <h2 className="text-[22px] font-bold leading-normal text-[#131313]">
            {p.isEditing ? "Edit Flash News" : "Flash News"}
          </h2>
          <button type="button" onClick={p.onClose} className="rounded-md p-1 text-[#626262] hover:bg-gray-100 hover:text-[#131313]">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-visible px-6 pt-6 pb-6 font-[Urbanist]">
          <div className="w-full min-w-0">
            <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">
              Flash News <span className="ml-1 text-[#DD3232]">*</span>
            </label>
            <textarea
              value={p.formData.content}
              onChange={(e) => p.onContentChange(e.target.value)}
              placeholder="Write the flash news…"
              rows={4}
              className={`block w-full min-w-0 resize-none rounded-md border px-3.5 py-3 text-sm font-normal outline-none placeholder:text-gray-400 ${
                p.errors.content
                  ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#DD3232]"
                  : "border-[#E2E8F0] bg-white text-[#131313] focus:border-[#7A5BED]"
              }`}
            />
            {p.errors.content && (
              <p className="mt-1.5 text-xs font-normal leading-4 text-[#DD3232]">{p.errors.content}</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-x-[18px] gap-y-4 sm:grid-cols-2">
            <div className="relative z-[80] w-full min-w-0">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">
                From Date <span className="ml-1 text-[#DD3232]">*</span>
              </label>
              <DatePicker
                text={p.formData.fromDate}
                onTextChange={p.onFromDateText}
                onBlur={() => {}}
                isInvalid={Boolean(p.errors.fromDate)}
                placeholder="DD-MM-YYYY"
                inputClassName="h-9 rounded-md border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:border-[#7A5BED]"
                open={p.fromDatePickerOpen}
                onOpenChange={(open) => {
                  p.setFromDatePickerOpen(open);
                  if (open) p.setToDatePickerOpen(false);
                }}
                monthLabel={p.fromCalendar.monthLabel}
                weekdayLabels={p.fromCalendar.weekdayLabels}
                cells={p.fromCalendar.cells}
                onSelectDay={p.onFromDateSelect}
                onPrevMonth={p.fromCalendar.goPrevMonth}
                onNextMonth={p.fromCalendar.goNextMonth}
                onClear={p.onClearFromDate}
                onToday={p.onTodayFromDate}
              />
              {p.errors.fromDate && (
                <p className="mt-1.5 text-xs font-normal leading-4 text-[#DD3232]">{p.errors.fromDate}</p>
              )}
            </div>

            <div className="relative z-[80] w-full min-w-0">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">To Date</label>
              <DatePicker
                text={p.formData.toDate}
                onTextChange={p.onToDateText}
                onBlur={() => {}}
                placeholder="DD-MM-YYYY"
                inputClassName="h-9 rounded-md border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:border-[#7A5BED]"
                open={p.toDatePickerOpen}
                onOpenChange={(open) => {
                  p.setToDatePickerOpen(open);
                  if (open) p.setFromDatePickerOpen(false);
                }}
                monthLabel={p.toCalendar.monthLabel}
                weekdayLabels={p.toCalendar.weekdayLabels}
                cells={p.toCalendar.cells}
                onSelectDay={p.onToDateSelect}
                onPrevMonth={p.toCalendar.goPrevMonth}
                onNextMonth={p.toCalendar.goNextMonth}
                onClear={p.onClearToDate}
                onToday={p.onTodayToDate}
              />
            </div>
          </div>

          {p.saveError && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {p.saveError}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#E2E8F0] px-6 py-[18px] sm:flex-row sm:justify-end font-[Urbanist]">
          <button
            type="button"
            onClick={p.onClose}
            className="flex h-[33px] w-full items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-[18px] text-sm font-normal text-[#131313] hover:bg-gray-50 sm:w-auto"
          >
            <X size={13} strokeWidth={2.75} />
            Close
          </button>
          <button
            type="button"
            onClick={p.onSave}
            disabled={p.isSaving}
            className="flex h-[33px] w-full items-center justify-center gap-1.5 rounded-md bg-[#7A5BED] px-[18px] text-sm font-normal text-white hover:bg-[#5932E9] disabled:opacity-60 sm:w-auto"
          >
            <Check size={13} strokeWidth={2.75} />
            {p.isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}