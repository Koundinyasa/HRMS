import { Plus, Clock } from "lucide-react";
import { useCircular } from "../../hooks/useCircular";
import CircularList from "./CircularList";
import CircularForm from "./CircularForm";
import EssConfirmDialog from "../../components/EssConfirmDialog";

type CircularTab = "current" | "previous";

export default function Circular() {
  const c = useCircular();

  const activeTab: CircularTab = c.activeListTab;

  return (
    <div className="w-full min-w-0 font-[Urbanist]">
      {/* PAGE HEADER */}
      <div className="mb-5 flex min-h-[54px] flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F3FF] px-4 py-2">
        <button
          type="button"
          className="h-9 rounded-lg bg-[#7A5BED] px-6 text-sm font-semibold leading-[17px] tracking-[0.3px] text-white"
        >
          Circular
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => c.handleOpenForm()}
            className="flex h-[30px] items-center gap-2 rounded-md bg-[#7A5BED] px-3 text-sm font-medium text-white hover:bg-[#5932E9]"
          >
            <Plus size={15} strokeWidth={2.5} />
            Circular
          </button>

          <button
            type="button"
            title="History"
            onClick={() => c.setActiveListTab("previous")}
            className={`rounded-md p-1 ${
              activeTab === "previous"
                ? "text-[#7A5BED]"
                : "text-[#131313] hover:text-[#7A5BED]"
            }`}
          >
            <Clock size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* CURRENT / PREVIOUS TABS */}
      <div className="mb-4 flex items-center gap-6 border-b border-[#E2E8F0] px-2">
        <button
          type="button"
          onClick={() => c.setActiveListTab("current")}
          className={`relative pb-3 text-sm font-semibold transition-colors ${
            activeTab === "current"
              ? "text-[#7A5BED]"
              : "text-[#64748B] hover:text-[#7A5BED]"
          }`}
        >
          Current
          <span className="ml-2 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-xs text-[#7A5BED]">
            {c.currentCount}
          </span>

          {activeTab === "current" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#7A5BED]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => c.setActiveListTab("previous")}
          className={`relative pb-3 text-sm font-semibold transition-colors ${
            activeTab === "previous"
              ? "text-[#7A5BED]"
              : "text-[#64748B] hover:text-[#7A5BED]"
          }`}
        >
          Previous
          <span className="ml-2 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-xs text-[#7A5BED]">
            {c.previousCount}
          </span>

          {activeTab === "previous" && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#7A5BED]" />
          )}
        </button>
      </div>

      {/* LIST + MODAL */}
      <div className="relative">
        <div className="min-h-[650px] rounded-xl bg-white font-[Urbanist]">
          <CircularList
            rows={c.rows}
            isLoading={c.isListLoading}
            isError={c.isListError}
            onRetry={() => c.refetchCirculars()}
            onEdit={c.handleOpenForm}
            onDelete={c.handleDelete}
            statusId={
              activeTab === "current"
                ? 63
                : 62
            }
            dropdowns={c.dropdowns}
          />
        </div>

        {/* CIRCULAR FORM */}
        {c.showForm && (
          <CircularForm
            isEditing={c.editingId !== null}
            formData={c.formData}
            errors={c.errors}
            saveError={c.saveError}
            isSaving={c.isSaving}
            openDropdown={c.openDropdown}
            setOpenDropdown={c.setOpenDropdown}
            datePickerOpen={c.datePickerOpen}
            setDatePickerOpen={c.setDatePickerOpen}
            calendar={c.calendar}
            toCalendar={c.toCalendar}
            onChange={c.handleChange}
            onFileChange={c.handleFileChange}
            onDateTextChange={c.handleDateTextChange}
            onToDateTextChange={c.handleToDateTextChange}
            onDateSelect={c.handleDateSelect}
            onToDateSelect={c.handleToDateSelect}
            onClearDate={c.handleClearDate}
            onClearToDate={c.handleClearToDate}
            onTodayDate={c.handleTodayDate}
            onTodayToDate={c.handleTodayToDate}
            onSave={c.handleSave}
            onClose={c.handleCloseForm}
            ackTypeOptions={c.ackTypeOptions}
            filterOptions={c.filterOptions}
            subFilterOptions={c.subFilterOptions}
            needsDepartment={c.needsDepartment}
            needsDesignation={c.needsDesignation}
            onFilterSelect={c.handleFilterSelect}
            onSubFilterSelect={c.handleSubFilterSelect}
            isDropdownsLoading={c.isDropdownsLoading}
          />
        )}
      </div>


      <EssConfirmDialog
        open={Boolean(c.pendingDelete)}
        title="Confirm delete"
        message={
          c.pendingDelete
            ? `Are you sure you want to delete "${c.pendingDelete.label}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={c.isDeleting}
        onConfirm={c.confirmDelete}
        onCancel={c.cancelDelete}
      />
    </div>
  );
}