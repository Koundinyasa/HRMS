import type { ChangeEvent } from "react";
import { X, CloudUpload, Bookmark } from "lucide-react";
import DatePicker, { type DatePickerCell } from "@/components/ui/datepicker";
import { useCompactCalendar } from "../../hooks/useCompactCalendar";
import EssDropdownField, { type EssOption } from "../../components/Essdropdownfield";
import type { PolicyFormData } from "../../hooks/Usepolicy";

interface Props {
  formData: PolicyFormData;
  ackTypeOptions: EssOption[];
  filterOptions: EssOption[];
  subFilterOptions: EssOption[];
  needsDepartment: boolean;
  needsDesignation: boolean;
  onFilterSelect: (value: string) => void;
  onSubFilterSelect: (value: string) => void;
  isDropdownsLoading: boolean;
  openDropdown: "filter" | "subFilter" | "ackTypeId" | null;
  setOpenDropdown: (v: "filter" | "subFilter" | "ackTypeId" | null) => void;
  datePickerOpen: "from" | "to" | null;
  setDatePickerOpen: (v: "from" | "to" | null) => void;
  calendar: {
    monthLabel: string;
    weekdayLabels: string[];
    cells: DatePickerCell[];
    goPrevMonth: () => void;
    goNextMonth: () => void;
  };
  toCalendar: {
    monthLabel: string;
    weekdayLabels: string[];
    cells: DatePickerCell[];
    goPrevMonth: () => void;
    goNextMonth: () => void;
  };
  saveError: string | null;
  isSaving: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDateTextChange: (v: string) => void;
  onToDateTextChange: (v: string) => void;
  onDateSelect: (iso: string) => void;
  onToDateSelect: (iso: string) => void;
  onClearDate: () => void;
  onClearToDate: () => void;
  onTodayDate: () => void;
  onTodayToDate: () => void;
  onIsDownloadRestricted: (checked: boolean) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function PolicyForm(p: Props) {
  useCompactCalendar(p.datePickerOpen !== null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-3 font-[Urbanist]"
      onClick={() => {
        p.setOpenDropdown(null);
        p.setDatePickerOpen(null);
      }}
    >
      <div
        className="w-[572px] max-w-full bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0]">
          <h2 className="text-[22px] font-bold leading-normal text-[#131313]">Policy Form</h2>
        </div>

        <div className="px-5 pt-5 pb-5">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="min-w-0">
              <label className="block text-[13px] font-semibold text-[#131313] mb-1.5">
                Policy Name <span className="text-[#DD3232] ml-1">*</span>
              </label>
              <input
                type="text"
                name="policyName"
                value={p.formData.policyName}
                onChange={p.onChange}
                placeholder="File.pdf"
                className="block w-full min-w-0 h-9 px-3 border border-transparent bg-[#F1F3F7] rounded-md text-sm font-normal text-[#2E2E2E] placeholder:text-gray-400 outline-none focus:bg-white focus:border-[#7A5BED]"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[13px] font-semibold text-[#131313] mb-1.5">Description</label>
              <textarea
                name="description"
                value={p.formData.description}
                onChange={p.onChange}
                placeholder="document file briefing"
                rows={1}
                className="block w-full min-w-0 h-9 px-3 py-2.5 border border-transparent bg-[#F1F3F7] rounded-md text-sm font-normal text-[#2E2E2E] placeholder:text-gray-400 outline-none resize-none overflow-hidden focus:bg-white focus:border-[#7A5BED]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mt-3">
            <EssDropdownField
              label="Applicable Type"
              value={p.formData.filter}
              options={p.filterOptions}
              isOpen={p.openDropdown === "filter"}
              onToggle={() => p.setOpenDropdown(p.openDropdown === "filter" ? null : "filter")}
              onSelect={p.onFilterSelect}
              zIndex={100}
            />
            <EssDropdownField
              label="Acknowledgement Type"
              value={p.formData.ackTypeId}
              options={p.ackTypeOptions}
              isOpen={p.openDropdown === "ackTypeId"}
              onToggle={() => p.setOpenDropdown(p.openDropdown === "ackTypeId" ? null : "ackTypeId")}
              onSelect={(value) => {
                p.onChange({ target: { name: "ackTypeId", value } } as ChangeEvent<HTMLInputElement>);
                p.setOpenDropdown(null);
              }}
              zIndex={100}
            />
          </div>

          {(p.needsDepartment || p.needsDesignation) && (
            <div className="mt-3 w-1/2 pr-[7px]">
              <EssDropdownField
                label="Applicable For"
                value={p.formData.subFilter}
                options={p.subFilterOptions}
                isOpen={p.openDropdown === "subFilter"}
                onToggle={() => p.setOpenDropdown(p.openDropdown === "subFilter" ? null : "subFilter")}
                onSelect={p.onSubFilterSelect}
                zIndex={100}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3.5 mt-3">
            <div className="min-w-0 relative z-[80]">
              <label className="block text-[13px] font-semibold text-[#131313] mb-1.5">Effective Date</label>
              <DatePicker
                id="policy-from-date"
                text={p.formData.date}
                onTextChange={p.onDateTextChange}
                onBlur={() => {}}
                isInvalid={false}
                placeholder="DD-MM-YYYY"
                inputClassName="h-9 rounded-md border-transparent bg-[#F1F3F7] px-3 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:bg-white focus:border-[#7A5BED]"
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
            <div className="min-w-0 relative z-[80]">
              <label className="block text-[13px] font-semibold text-[#131313] mb-1.5">To Date</label>
              <DatePicker
                id="policy-to-date"
                text={p.formData.toDate}
                onTextChange={p.onToDateTextChange}
                onBlur={() => {}}
                isInvalid={false}
                placeholder="DD-MM-YYYY"
                inputClassName="h-9 rounded-md border-transparent bg-[#F1F3F7] px-3 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:bg-white focus:border-[#7A5BED]"
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

          <label className="flex items-center gap-2 mt-4 text-sm font-normal text-[#2E2E2E] cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 accent-[#7A5BED]"
              checked={p.formData.isDownloadRestricted}
              onChange={(e) => p.onIsDownloadRestricted(e.target.checked)}
            />
            Do not allow attachment downloads.
          </label>

          <div className="mt-4">
            <label
              htmlFor="policy-file"
              className="flex flex-col items-center justify-center h-[140px] w-full border border-dashed border-[#CBD2DE] rounded-lg cursor-pointer hover:bg-[#F6F3FF]"
            >
              <CloudUpload size={26} className="text-[#626262] mb-2" strokeWidth={1.5} />
              <span className="text-xs font-medium leading-4 text-[#2E2E2E]">Drag and drop</span>
              <span className="text-[10px] font-normal text-gray-400">- or -</span>
              <span className="text-xs font-medium leading-4 text-[#7A5BED]">Browse</span>
              {p.formData.file && (
                <span className="text-[10px] font-normal text-green-600 mt-1 truncate max-w-[90%]">
                  {p.formData.file.name}
                </span>
              )}
            </label>
            <input id="policy-file" type="file" className="hidden" onChange={p.onFileChange} />
          </div>

          {p.saveError && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {p.saveError}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={p.onClose}
            className="h-[30px] px-3.5 border border-gray-300 bg-white rounded-md text-sm font-normal text-[#2E2E2E] flex items-center gap-1.5 hover:bg-gray-50"
          >
            <X size={13} strokeWidth={2.5} />
            Close
          </button>
          <button
            type="button"
            onClick={p.onSave}
            disabled={p.isSaving}
            className="h-[30px] px-3.5 bg-[#7A5BED] hover:bg-[#5932E9] text-white rounded-md text-sm font-normal flex items-center gap-1.5 disabled:opacity-60"
          >
            <Bookmark size={13} />
            {p.isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}