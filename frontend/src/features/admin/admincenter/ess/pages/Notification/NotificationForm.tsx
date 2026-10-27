import { X, Save, CloudUpload } from "lucide-react";
import DatePicker from "@/components/ui/datepicker";
import { useCompactCalendar } from "../../hooks/useCompactCalendar";
import type { useNotification } from "../../hooks/useNotification";
import EssDropdownField from "../../components/Essdropdownfield";
import NotificationRichTextEditor from "./Notificationrichtexteditor";

type Props = ReturnType<typeof useNotification>;

export default function NotificationForm(p: Props) {
  useCompactCalendar(p.openDatePicker !== null);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-3 font-[Urbanist]">
      <div
        className={`w-full ${p.isBanner ? "max-w-[465px]" : "max-w-[555px]"} max-h-[calc(100vh-24px)] bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex flex-col border border-[#E2E8F0]`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-[21px] h-[52px] border-b border-[#E2E8F0] shrink-0 rounded-t-2xl bg-[#F9FAFB]">
          <h2 className="text-[22px] font-bold leading-normal text-[#131313]">
            {p.editingId !== null ? "Edit Notification" : "Notification"}
          </h2>
          <button type="button" onClick={p.handleCloseModal} className="text-[#131313] hover:text-[#626262]">
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-[21px] pt-[22px] pb-2 overflow-visible flex-1 min-h-0">
          {!p.isBanner && (
            <div className="[&_.notification-editor]:!min-h-[96px]">
              <NotificationRichTextEditor
                value={p.notificationText}
                onChange={p.handleNotificationChange}
                hasError={Boolean(p.errors.notification)}
              />
              {p.errors.notification && (
                <p className="mt-1 text-xs font-normal leading-4 text-[#DD3232]">{p.errors.notification}</p>
              )}
            </div>
          )}

          {!p.isBanner && (
            <div className="mt-3 flex items-center gap-3">
              <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[#E2E8F0] px-3 text-xs font-medium text-[#7A5BED] transition-colors hover:bg-[#F6F3FF]">
                <CloudUpload size={16} strokeWidth={1.75} />
                Add attachment
                <input
                  type="file"
                  className="hidden"
                  onChange={p.handleAttachmentChange}
                />
              </label>
              {p.attachmentName && (
                <span className="max-w-[250px] truncate text-xs text-[#475569]" title={p.attachmentName}>
                  {p.attachmentName}
                </span>
              )}
            </div>
          )}

          {p.isBanner && (
            <div>
              <label className="block w-full h-[146px] border-[1.5px] border-dashed border-[#8B6CF6] rounded-lg cursor-pointer hover:bg-[#F6F3FF]/50">
                <input type="file" className="hidden" onChange={p.handleAttachmentChange} />
                <div className="h-full flex flex-col items-center justify-center">
                  <CloudUpload size={26} strokeWidth={1.75} className="text-[#7A5BED] mb-2" />
                  <p className="text-xs font-medium leading-4 text-[#131313]">Drag and drop</p>
                  <p className="text-[10px] font-normal text-gray-400 my-0.5">or</p>
                  <span className="text-xs font-medium leading-4 text-[#7A5BED]">Browse</span>
                  {p.attachmentName && (
                    <p className="mt-1 max-w-full truncate px-2 text-[10px] font-normal text-green-600" title={p.attachmentName}>
                      {p.attachmentName}
                    </p>
                  )}
                </div>
              </label>
            </div>
          )}

          {p.isBanner && (
            <div className="mt-4">
              <label className="block text-[13px] font-semibold text-[#131313] mb-2">
                Event Name <span className="text-[#DD3232] ml-1">*</span>
              </label>
              <input
                type="text"
                value={p.eventName}
                onChange={p.handleEventNameChange}
                placeholder="Enter event name"
                className={`w-full h-9 px-3.5 rounded-md border text-sm font-normal outline-none placeholder:text-gray-400 focus:border-[#7A5BED] ${
                  p.errors.eventName ? "border-[#FCA5A5] bg-[#FEF2F2]" : "border-[#E2E8F0]"
                }`}
              />
              {p.errors.eventName && (
                <p className="mt-1 text-xs font-normal leading-4 text-[#DD3232]">{p.errors.eventName}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-[14px] mt-4">
            <div className="relative z-[80]">
              <label className="block text-[13px] font-semibold text-[#131313] mb-2">
                From Date <span className="text-[#DD3232] ml-1">*</span>
              </label>
              <DatePicker
                text={p.fromDate}
                onTextChange={p.handleFromDateTextChange}
                onBlur={() => {}}
                isInvalid={Boolean(p.errors.fromDate)}
                placeholder="DD-MM-YYYY"
                inputClassName="h-9 rounded-md border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:border-[#7A5BED]"
                open={p.openDatePicker === "from"}
                onOpenChange={(open) => (open ? p.handleOpenDatePicker("from") : p.setOpenDatePicker(null))}
                monthLabel={p.fromCalendar.monthLabel}
                weekdayLabels={p.fromCalendar.weekdayLabels}
                cells={p.fromCalendar.cells}
                onSelectDay={p.handleFromDateSelect}
                onPrevMonth={p.fromCalendar.goPrevMonth}
                onNextMonth={p.fromCalendar.goNextMonth}
                onClear={p.handleClearFromDate}
                onToday={p.handleTodayFrom}
              />
              {p.errors.fromDate && (
                <p className="mt-1 text-xs font-normal leading-4 text-[#DD3232]">{p.errors.fromDate}</p>
              )}
            </div>

            <div className="relative z-[80]">
              <label className="block text-[13px] font-semibold text-[#131313] mb-2">To Date</label>
              <DatePicker
                text={p.toDate}
                onTextChange={p.handleToDateTextChange}
                onBlur={() => {}}
                placeholder="DD-MM-YYYY"
                inputClassName="h-9 rounded-md border-[#FDE68A] bg-[#FEFCE8] px-3.5 pr-10 text-sm text-[#131313] placeholder:text-gray-400 focus:border-[#7A5BED]"
                open={p.openDatePicker === "to"}
                onOpenChange={(open) => (open ? p.handleOpenDatePicker("to") : p.setOpenDatePicker(null))}
                monthLabel={p.toCalendar.monthLabel}
                weekdayLabels={p.toCalendar.weekdayLabels}
                cells={p.toCalendar.cells}
                onSelectDay={p.handleToDateSelect}
                onPrevMonth={p.toCalendar.goPrevMonth}
                onNextMonth={p.toCalendar.goNextMonth}
                onClear={p.handleClearToDate}
                onToday={p.handleTodayTo}
              />
            </div>
          </div>

          {!p.isBanner && (
            <div className="mt-4 grid grid-cols-1 gap-x-[14px] gap-y-4 sm:grid-cols-2">
              <EssDropdownField
                label="Applicable Type"
                value={p.filter}
                options={p.filterOptions}
                isOpen={p.openDropdown === "filter"}
                onToggle={() => p.setOpenDropdown(p.openDropdown === "filter" ? null : "filter")}
                onSelect={p.handleFilterSelect}
              />
              {(p.needsDepartment || p.needsDesignation) && (
                <EssDropdownField
                  label="Applicable For"
                  value={p.subFilter}
                  options={p.subFilterOptions}
                  isOpen={p.openDropdown === "subFilter"}
                  onToggle={() => p.setOpenDropdown(p.openDropdown === "subFilter" ? null : "subFilter")}
                  onSelect={p.handleSubFilterSelect}
                />
              )}
            </div>
          )}

          {p.saveError && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {p.saveError}
            </div>
          )}

          <div className="h-5 shrink-0" />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-[21px] py-3.5 border-t border-[#E2E8F0] bg-[#F9FAFB] rounded-b-2xl shrink-0">
          <button
            type="button"
            onClick={p.handleCloseModal}
            className="flex items-center gap-1.5 h-[33px] px-4 rounded-lg border border-gray-300 bg-white text-[#131313] text-sm font-normal hover:bg-gray-100"
          >
            <X size={13} strokeWidth={2.75} />
            Close
          </button>
          <button
            type="button"
            onClick={p.handleSave}
            disabled={p.isSaving}
            className="flex items-center gap-1.5 h-[33px] px-4 rounded-lg bg-[#7A5BED] hover:bg-[#5932E9] text-white text-sm font-normal disabled:opacity-60"
          >
            <Save size={13} strokeWidth={2.25} />
            {p.isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}