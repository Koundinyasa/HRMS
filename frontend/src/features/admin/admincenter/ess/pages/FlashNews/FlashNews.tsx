import { Plus, Clock } from "lucide-react";
import { useFlashNews } from "../../hooks/useFlashNews";
import FlashNewsList from "./Flashnewslist";
import FlashNewsForm from "./Flashnewsform";
import EssConfirmDialog from "../../components/EssConfirmDialog";

export default function FlashNews() {
  const f = useFlashNews();

  const tabClass = (selected: boolean) =>
    `px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
      selected
        ? "border-[#7A5BED] text-[#7A5BED]"
        : "border-transparent text-[#64748B] hover:text-[#7A5BED]"
    }`;

  return (
    <div className="w-full min-w-0 font-[Urbanist]">
      {/* PAGE HEADER */}
      <div className="mb-5 flex h-[54px] items-center justify-between rounded-xl bg-[#F6F3FF] px-4 py-2 font-[Urbanist]">
        <button
          type="button"
          className="h-9 rounded-lg bg-[#7A5BED] px-6 text-sm font-semibold leading-[17px] tracking-[0.3px] text-white"
        >
          Flash News
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => f.handleOpenForm()}
            className="flex h-[34px] items-center gap-2 rounded-md bg-[#7A5BED] px-3 text-sm font-medium text-white hover:bg-[#5932E9]"
          >
            <Plus size={15} strokeWidth={2.5} />
            Flash News
          </button>

          <button
            type="button"
            title="View previous Flash News"
            onClick={() => f.setActiveTab("previous")}
            className="text-[#131313] hover:text-[#7A5BED]"
          >
            <Clock size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* FLASH NEWS TABLE AND TABS */}
      <div className="relative min-h-[650px] rounded-xl bg-white font-[Urbanist]">
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-4">
          <button
            type="button"
            onClick={() => f.setActiveTab("current")}
            className={tabClass(f.activeTab === "current")}
          >
            Current
            <span className="ml-2 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-xs">
              {f.currentCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => f.setActiveTab("previous")}
            className={tabClass(f.activeTab === "previous")}
          >
            Previous
            <span className="ml-2 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-xs">
              {f.previousCount}
            </span>
          </button>
        </div>

        <FlashNewsList
          rows={f.rows}
          isLoading={f.isListLoading}
          isError={f.isListError}
          onRetry={() => {
            void f.refetch();
          }}
          onEdit={f.handleOpenForm}
          onDelete={f.handleDelete}
        />

        {/* EXISTING ADD / EDIT FORM */}
        {f.showForm && (
          <FlashNewsForm
            isEditing={f.editingId !== null}
            formData={f.formData}
            errors={f.errors}
            saveError={f.saveError}
            isSaving={f.isSaving}
            fromDatePickerOpen={f.fromDatePickerOpen}
            setFromDatePickerOpen={f.setFromDatePickerOpen}
            toDatePickerOpen={f.toDatePickerOpen}
            setToDatePickerOpen={f.setToDatePickerOpen}
            fromCalendar={f.fromCalendar}
            toCalendar={f.toCalendar}
            onContentChange={f.handleContentChange}
            onFromDateText={f.handleFromDateText}
            onToDateText={f.handleToDateText}
            onFromDateSelect={f.handleFromDateSelect}
            onToDateSelect={f.handleToDateSelect}
            onClearFromDate={f.handleClearFromDate}
            onClearToDate={f.handleClearToDate}
            onTodayFromDate={f.handleTodayFromDate}
            onTodayToDate={f.handleTodayToDate}
            onSave={f.handleSave}
            onClose={f.handleCloseForm}
          />
        )}
      </div>


      <EssConfirmDialog
        open={Boolean(f.pendingDelete)}
        title="Confirm delete"
        message={
          f.pendingDelete
            ? `Are you sure you want to delete "${f.pendingDelete.label}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={f.isDeleting}
        onConfirm={f.confirmDelete}
        onCancel={f.cancelDelete}
      />
    </div>
  );
}