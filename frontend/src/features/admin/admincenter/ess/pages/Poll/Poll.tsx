import { Plus, Clock } from "lucide-react";
import { usePoll } from "../../hooks/usePoll";
import PollList from "./PollList";
import PollForm from "./Pollform";
import EssConfirmDialog from "../../components/EssConfirmDialog";

export default function Poll() {
  const p = usePoll();

  return (
    <div className="w-full min-w-0 min-h-[calc(100vh-100px)] font-[Urbanist]">
      <div className="mb-5 flex min-h-[54px] w-full min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F3FF] px-4 py-2">
        <div className="flex h-9 min-w-0 items-center rounded-lg bg-[#7A5BED] px-6 text-sm font-semibold leading-[17px] tracking-[0.3px] text-white">
          Polls
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => p.handleOpenForm()}
            className="flex items-center gap-2 h-[34px] bg-[#7A5BED] hover:bg-[#5932E9] text-white px-3 rounded-md text-sm font-medium"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Polls
          </button>

          <button
            type="button"
            title="History"
            onClick={() => p.setActiveTab("previous")}
            className="text-[#131313] hover:text-[#7A5BED]"
          >
            <Clock size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl min-h-[650px] w-full min-w-0">
        <div className="mb-4 flex items-center gap-6 border-b border-[#E2E8F0] px-2">
          <button
            type="button"
            onClick={() => p.setActiveTab("current")}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              p.activeTab === "current"
                ? "text-[#7A5BED]"
                : "text-[#64748B] hover:text-[#7A5BED]"
            }`}
          >
            Current
            <span className="ml-2 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-xs text-[#7A5BED]">
              {p.currentCount}
            </span>
            {p.activeTab === "current" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#7A5BED]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => p.setActiveTab("previous")}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              p.activeTab === "previous"
                ? "text-[#7A5BED]"
                : "text-[#64748B] hover:text-[#7A5BED]"
            }`}
          >
            Previous
            <span className="ml-2 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-xs text-[#7A5BED]">
              {p.previousCount}
            </span>
            {p.activeTab === "previous" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#7A5BED]" />
            )}
          </button>
        </div>

        <PollList
          rows={p.rows}
          isLoading={p.isListLoading}
          isError={p.isListError}
          onRetry={() => p.refetch()}
          onEdit={p.handleOpenForm}
          onDelete={p.handleDelete}
        />
      </div>

      {p.showModal && (
        <PollForm
          isEditing={p.editingId !== null}
          form={p.form}
          saveError={p.saveError}
          isSaving={p.isSaving}
          startDatePickerOpen={p.startDatePickerOpen}
          setStartDatePickerOpen={p.setStartDatePickerOpen}
          endDatePickerOpen={p.endDatePickerOpen}
          setEndDatePickerOpen={p.setEndDatePickerOpen}
          openDropdown={p.openDropdown}
          setOpenDropdown={p.setOpenDropdown}
          handleTargetFilterSelect={p.handleTargetFilterSelect}
          handleSubFilterSelect={p.handleSubFilterSelect}
          handleQuestionTypeSelect={p.handleQuestionTypeSelect}
          setQuestion={p.setQuestion}
          targetFilterOptions={p.targetFilterOptions}
          subFilterOptions={p.subFilterOptions}
          needsDepartment={p.needsDepartment}
          needsDesignation={p.needsDesignation}
          questionTypeOptions={p.questionTypeOptions}
          isDropdownsLoading={p.isDropdownsLoading}
          startCalendar={p.startCalendar}
          endCalendar={p.endCalendar}
          handleStartDateText={p.handleStartDateText}
          handleEndDateText={p.handleEndDateText}
          handleStartDateSelect={p.handleStartDateSelect}
          handleEndDateSelect={p.handleEndDateSelect}
          handleClearStartDate={p.handleClearStartDate}
          handleClearEndDate={p.handleClearEndDate}
          handleTodayStartDate={p.handleTodayStartDate}
          handleTodayEndDate={p.handleTodayEndDate}
          closeAllPopovers={p.closeAllPopovers}
          onSave={p.handleSave}
          onClose={p.handleClose}
        />
      )}


      <EssConfirmDialog
        open={Boolean(p.pendingDelete)}
        title="Confirm delete"
        message={
          p.pendingDelete
            ? `Are you sure you want to delete "${p.pendingDelete.label}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={p.isDeleting}
        onConfirm={p.confirmDelete}
        onCancel={p.cancelDelete}
      />
    </div>
  );
}