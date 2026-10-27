import { X, Filter, List, BarChart3, Check, MessageSquare } from "lucide-react";
import type { DatePickerCell } from "@/components/ui/datepicker";
import { useCompactCalendar } from "../../hooks/useCompactCalendar";
import { DateField, Dropdown, type Option } from "./Pollformfields";

interface Props {
  isEditing: boolean;
  form: { startDate: string; endDate: string; targetFilter: string; subFilter: string; questionTypeId: string; question: string };
  saveError: string | null;
  isSaving: boolean;
  startDatePickerOpen: boolean;
  setStartDatePickerOpen: (v: boolean) => void;
  endDatePickerOpen: boolean;
  setEndDatePickerOpen: (v: boolean) => void;
  openDropdown: "targetFilter" | "subFilter" | "questionType" | null;
  setOpenDropdown: (v: "targetFilter" | "subFilter" | "questionType" | null) => void;
  handleTargetFilterSelect: (v: string) => void;
  handleSubFilterSelect: (v: string) => void;
  handleQuestionTypeSelect: (v: string) => void;
  setQuestion: (v: string) => void;
  targetFilterOptions: Option[];
  subFilterOptions: Option[];
  needsDepartment: boolean;
  needsDesignation: boolean;
  questionTypeOptions: Option[];
  isDropdownsLoading: boolean;
  startCalendar: { monthLabel: string; weekdayLabels: string[]; cells: DatePickerCell[]; goPrevMonth: () => void; goNextMonth: () => void };
  endCalendar: { monthLabel: string; weekdayLabels: string[]; cells: DatePickerCell[]; goPrevMonth: () => void; goNextMonth: () => void };
  handleStartDateText: (v: string) => void;
  handleEndDateText: (v: string) => void;
  handleStartDateSelect: (iso: string) => void;
  handleEndDateSelect: (iso: string) => void;
  handleClearStartDate: () => void;
  handleClearEndDate: () => void;
  handleTodayStartDate: () => void;
  handleTodayEndDate: () => void;
  closeAllPopovers: () => void;
  onSave: () => void;
  onClose: () => void;
}

export default function PollForm(p: Props) {
  useCompactCalendar(p.startDatePickerOpen || p.endDatePickerOpen);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-2 sm:p-4 box-border font-[Urbanist]">
      <div className="w-[502px] max-w-[calc(100vw-16px)] sm:max-w-[92vw] bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col min-w-0 box-border">
        {/* HEADER */}
        <div className="flex items-center justify-between px-[22px] h-[66px] border-b border-[#E2E8F0] rounded-t-2xl shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-[30px] h-[30px] rounded-lg bg-[#ECE7FF] text-[#7A5BED] shrink-0">
              <BarChart3 size={15} strokeWidth={2.25} />
            </div>
            <h2 className="text-[22px] font-bold leading-normal text-[#131313] truncate">
              {p.isEditing ? "Edit Poll" : "Create New Poll"}
            </h2>
          </div>
          <button type="button" onClick={p.onClose} className="text-[#131313] hover:text-[#626262] shrink-0">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-[22px] pt-5 pb-5 overflow-visible flex-1 min-h-0 min-w-0 box-border">
          <div className="relative z-[80] grid grid-cols-1 sm:grid-cols-2 gap-x-[14px] gap-y-4 mb-4 min-w-0">
            <DateField
              id="poll-start-date"
              label="Start Date"
              placeholder="Select start date"
              text={p.form.startDate}
              onTextChange={p.handleStartDateText}
              open={p.startDatePickerOpen}
              onOpenChange={p.setStartDatePickerOpen}
              closeOthers={() => {
                p.setEndDatePickerOpen(false);
                p.setOpenDropdown(null);
              }}
              monthLabel={p.startCalendar.monthLabel}
              weekdayLabels={p.startCalendar.weekdayLabels}
              cells={p.startCalendar.cells}
              onSelectDay={p.handleStartDateSelect}
              onPrevMonth={p.startCalendar.goPrevMonth}
              onNextMonth={p.startCalendar.goNextMonth}
              onClear={p.handleClearStartDate}
              onToday={p.handleTodayStartDate}
            />
            <DateField
              id="poll-end-date"
              label="End Date"
              placeholder="Select end date"
              text={p.form.endDate}
              onTextChange={p.handleEndDateText}
              open={p.endDatePickerOpen}
              onOpenChange={p.setEndDatePickerOpen}
              closeOthers={() => {
                p.setStartDatePickerOpen(false);
                p.setOpenDropdown(null);
              }}
              monthLabel={p.endCalendar.monthLabel}
              weekdayLabels={p.endCalendar.weekdayLabels}
              cells={p.endCalendar.cells}
              onSelectDay={p.handleEndDateSelect}
              onPrevMonth={p.endCalendar.goPrevMonth}
              onNextMonth={p.endCalendar.goNextMonth}
              onClear={p.handleClearEndDate}
              onToday={p.handleTodayEndDate}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[14px] gap-y-4 mb-4 min-w-0">
            <Dropdown
              icon={<Filter size={13} strokeWidth={2} />}
              label="Target Audience Filter"
              value={p.form.targetFilter}
              options={p.targetFilterOptions}
              placeholder={p.isDropdownsLoading ? "Loading…" : "Select target filter"}
              open={p.openDropdown === "targetFilter"}
              onToggle={() => {
                p.setOpenDropdown(p.openDropdown === "targetFilter" ? null : "targetFilter");
                p.setStartDatePickerOpen(false);
                p.setEndDatePickerOpen(false);
              }}
              onSelect={p.handleTargetFilterSelect}
            />
            <Dropdown
              icon={<List size={13} strokeWidth={2} />}
              label="Question Type"
              value={p.form.questionTypeId}
              options={p.questionTypeOptions}
              placeholder={p.isDropdownsLoading ? "Loading…" : "Select option type"}
              open={p.openDropdown === "questionType"}
              onToggle={() => {
                p.setOpenDropdown(p.openDropdown === "questionType" ? null : "questionType");
                p.setStartDatePickerOpen(false);
                p.setEndDatePickerOpen(false);
              }}
              onSelect={p.handleQuestionTypeSelect}
            />
          </div>

          {(p.needsDepartment || p.needsDesignation) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[14px] gap-y-4 mb-4 min-w-0">
              <Dropdown
                icon={<Filter size={13} strokeWidth={2} />}
                label={p.needsDepartment ? "Select Department" : "Select Designation"}
                value={p.form.subFilter}
                options={p.subFilterOptions}
                open={p.openDropdown === "subFilter"}
                onToggle={() => {
                  p.setOpenDropdown(p.openDropdown === "subFilter" ? null : "subFilter");
                  p.setStartDatePickerOpen(false);
                  p.setEndDatePickerOpen(false);
                }}
                onSelect={p.handleSubFilterSelect}
              />
            </div>
          )}

          {/* POLL QUESTION */}
          <div className="w-full min-w-0">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#131313] mb-2">
              <MessageSquare size={13} strokeWidth={2} />
              Poll Question
            </label>
            <textarea
              value={p.form.question}
              onChange={(e) => p.setQuestion(e.target.value)}
              maxLength={250}
              placeholder="What would you like to ask your employees? (e.g., How satisfied are you with our new hybrid work policy?)"
              className="block w-full max-w-full min-w-0 h-[106px] resize-none px-3 py-3 border border-[#E2E8F0] bg-[#F8FAFC] rounded-md text-sm font-normal text-[#2E2E2E] outline-none placeholder:text-gray-400 focus:border-[#7A5BED] box-border"
            />
            <div className="flex items-center justify-between gap-2 mt-1.5 text-xs font-normal leading-4 text-[#2E2E2E] min-w-0">
              <span className="min-w-0">Keep questions clear and neutral for best engagement.</span>
              <span className="shrink-0">{p.form.question.length} / 250 characters</span>
            </div>
          </div>

          {p.saveError && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {p.saveError}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between gap-2 px-[22px] h-[62px] border-t border-[#E2E8F0] bg-white rounded-b-2xl shrink-0 min-w-0 box-border">
          <div className="flex items-center gap-1.5 text-xs font-normal leading-4 text-[#131313] min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7A5BED] shrink-0" />
            <span className="truncate">Ready to publish</span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={p.onClose}
              className="h-[33px] px-4 border border-gray-300 bg-white rounded-lg text-sm font-normal text-[#131313] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={p.onSave}
              disabled={p.isSaving}
              className="flex items-center gap-2 h-[33px] px-4 bg-[#7A5BED] hover:bg-[#5932E9] text-white rounded-lg text-sm font-normal disabled:opacity-60"
            >
              <Check size={14} strokeWidth={2.5} />
              {p.isSaving ? "Saving…" : "Save Poll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}