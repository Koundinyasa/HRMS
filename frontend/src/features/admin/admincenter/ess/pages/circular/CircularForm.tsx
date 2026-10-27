import React from "react";
import { X, CloudUpload, Check } from "lucide-react";
import DatePicker from "@/components/ui/datepicker";
import { useCompactCalendar } from "../../hooks/useCompactCalendar";
import EssDropdownField from "../../components/Essdropdownfield";
import type { CircularFormData } from "../../hooks/useCircular";

type CalendarState = {
  monthLabel: string;
  weekdayLabels: string[];
  cells: import("@/components/ui/datepicker").DatePickerCell[];
  goPrevMonth: () => void;
  goNextMonth: () => void;
};

type Option = { id: string; label: string };

interface Props {
  isEditing: boolean;
  formData: CircularFormData;
  errors: { circularName?: string; date?: string };
  saveError: string | null;
  isSaving: boolean;
  openDropdown: "filter" | "subFilter" | "acknowledgement" | null;
  setOpenDropdown: (v: "filter" | "subFilter" | "acknowledgement" | null) => void;
  datePickerOpen: "from" | "to" | null;
  setDatePickerOpen: (v: "from" | "to" | null) => void;
  calendar: CalendarState;
  toCalendar: CalendarState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateTextChange: (value: string) => void;
  onToDateTextChange: (value: string) => void;
  onDateSelect: (iso: string) => void;
  onToDateSelect: (iso: string) => void;
  onClearDate: () => void;
  onClearToDate: () => void;
  onTodayDate: () => void;
  onTodayToDate: () => void;
  onSave: () => void;
  onClose: () => void;
  ackTypeOptions: Option[];
  filterOptions: Option[];
  subFilterOptions: Option[];
  needsDepartment: boolean;
  needsDesignation: boolean;
  onFilterSelect: (value: string) => void;
  onSubFilterSelect: (value: string) => void;
  isDropdownsLoading: boolean;
}

const dateInputClass =
  "h-9 rounded-md border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:border-[#7A5BED]";

export default function CircularForm(p: Props) {
  useCompactCalendar(p.datePickerOpen !== null);

  const select = (name: "ackTypeId", value: string) => {
    p.onChange({ target: { name, value } } as React.ChangeEvent<HTMLSelectElement>);
    p.setOpenDropdown(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-3 sm:p-4 font-[Urbanist]">
      <div
        className="relative mx-auto my-auto flex w-full max-w-[607px] flex-col overflow-visible rounded-xl border border-[#E2E8F0] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] font-[Urbanist]"
        style={{ maxHeight: "calc(100% - 24px)" }}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] px-6 h-[56px] font-[Urbanist]">
          <h2 className="text-[22px] font-bold leading-normal text-[#131313]">
            {p.isEditing ? "Edit Circular" : "Document Form"}
          </h2>
          <button type="button" onClick={p.onClose} className="rounded-md p-1 text-[#626262] hover:bg-gray-100 hover:text-[#131313]">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-visible px-6 pt-6 pb-6 font-[Urbanist]">
          <div className="grid min-w-0 grid-cols-1 gap-x-[18px] gap-y-4 sm:grid-cols-2">
            {/* CIRCULAR NAME */}
            <div className="min-w-0 w-full">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">
                Circular Name <span className="ml-1 text-[#DD3232]">*</span>
              </label>
              <input
                type="text"
                name="circularName"
                value={p.formData.circularName}
                onChange={p.onChange}
                className={`block h-9 w-full min-w-0 rounded-md border px-3.5 text-sm font-normal outline-none placeholder:text-gray-400 ${
                  p.errors.circularName
                    ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#DD3232]"
                    : "border-[#E2E8F0] bg-white text-[#131313] focus:border-[#7A5BED]"
                }`}
              />
              {p.errors.circularName && (
                <p className="mt-1.5 text-xs font-normal leading-4 text-[#DD3232]">
                  {p.errors.circularName}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="min-w-0 w-full">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">
                Description
              </label>
              <textarea
                name="description"
                value={p.formData.description}
                onChange={p.onChange}
                placeholder="Document file briefing"
                className="block h-9 w-full min-w-0 resize-none rounded-md border border-[#E2E8F0] bg-white px-3.5 py-[9px] text-sm font-normal text-[#131313] placeholder:text-gray-400 outline-none focus:border-[#7A5BED]"
              />
            </div>
          </div>

          {/* SELECT FILTER + SUB-FILTER + ACKNOWLEDGEMENT TYPE */}
          <div className="mt-4 grid min-w-0 grid-cols-1 gap-x-[18px] gap-y-4 sm:grid-cols-2">
            <EssDropdownField
              label="Select Filter"
              value={p.formData.filter}
              options={p.filterOptions}
              isOpen={p.openDropdown === "filter"}
              onToggle={() => p.setOpenDropdown(p.openDropdown === "filter" ? null : "filter")}
              onSelect={p.onFilterSelect}
            />

            {(p.needsDepartment || p.needsDesignation) && (
              <EssDropdownField
                label={p.needsDepartment ? "Select Department" : "Select Designation"}
                value={p.formData.subFilter}
                options={p.subFilterOptions}
                isOpen={p.openDropdown === "subFilter"}
                onToggle={() => p.setOpenDropdown(p.openDropdown === "subFilter" ? null : "subFilter")}
                onSelect={p.onSubFilterSelect}
              />
            )}

            <EssDropdownField
              label="Acknowledgement Type"
              value={p.formData.ackTypeId}
              options={p.ackTypeOptions}
              isOpen={p.openDropdown === "acknowledgement"}
              onToggle={() => p.setOpenDropdown(p.openDropdown === "acknowledgement" ? null : "acknowledgement")}
              onSelect={(value) => select("ackTypeId", value)}
            />
          </div>

          <div className="mt-4 grid min-w-0 grid-cols-1 gap-x-[18px] gap-y-4 sm:grid-cols-2">
            <div className="relative z-[80] min-w-0 w-full">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">Effective Date</label>
              <DatePicker
                id="circular-date"
                text={p.formData.date}
                onTextChange={p.onDateTextChange}
                onBlur={() => {}}
                isInvalid={false}
                placeholder="DD-MM-YYYY"
                inputClassName={dateInputClass}
                open={p.datePickerOpen === "from"}
                onOpenChange={(open) => {
                  p.setDatePickerOpen(open ? "from" : null);
                  if (open) p.setOpenDropdown(null);
                }}
                monthLabel={p.calendar.monthLabel}
                weekdayLabels={p.calendar.weekdayLabels}
                cells={p.calendar.cells}
                onSelectDay={p.onDateSelect}
                onPrevMonth={p.calendar.goPrevMonth}
                onNextMonth={p.calendar.goNextMonth}
                onClear={p.onClearDate}
                onToday={p.onTodayDate}
              />
            </div>
            <div className="relative z-[80] min-w-0 w-full">
              <label className="mb-1.5 block text-[13px] font-semibold text-[#131313]">To Date</label>
              <DatePicker
                id="circular-to-date"
                text={p.formData.toDate}
                onTextChange={p.onToDateTextChange}
                onBlur={() => {}}
                isInvalid={false}
                placeholder="DD-MM-YYYY"
                inputClassName={dateInputClass}
                open={p.datePickerOpen === "to"}
                onOpenChange={(open) => {
                  p.setDatePickerOpen(open ? "to" : null);
                  if (open) p.setOpenDropdown(null);
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

          {/* FILE UPLOAD */}
          <div className="mt-5 min-w-0">
            <label
              htmlFor="circular-file"
              className="flex h-[94px] w-full cursor-pointer flex-col items-center justify-center rounded-md border-[1.5px] border-dashed border-[#94A3B8] px-3 text-center hover:bg-[#F6F3FF]"
            >
              <CloudUpload size={26} strokeWidth={1.75} className="mb-1.5 text-[#7A5BED]" />
              <span className="text-xs font-medium leading-4 text-[#131313]">
                Drag and drop
                <span className="mx-1 font-normal text-[#626262]">- or -</span>
                <span className="font-medium text-[#7A5BED] underline underline-offset-2">Browse</span>
              </span>
              {p.formData.file && (
                <span className="mt-1 max-w-full truncate text-[10px] font-normal text-green-600">
                  {p.formData.file.name}
                </span>
              )}
            </label>
            <input id="circular-file" type="file" className="hidden" onChange={p.onFileChange} />
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