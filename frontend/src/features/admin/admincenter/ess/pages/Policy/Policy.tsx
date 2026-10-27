import { Plus } from "lucide-react";
import { usePolicy } from "../../hooks/Usepolicy";
import PolicyList from "./PolicyList";
import PolicyForm from "./Policyform";
import PolicyAcknowledgementModal from "./Policyacknowledgementmodal";
import EssConfirmDialog from "../../components/EssConfirmDialog";

export default function Policy() {
  const p = usePolicy();

  return (
    <div className="min-h-[calc(100vh-100px)] w-full font-[Urbanist]">
      <div className="mb-5 flex min-h-[54px] flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F3FF] px-4 py-2">
        <button
          type="button"
          className="h-9 rounded-lg bg-[#7A5BED] px-6 text-sm font-semibold leading-[17px] tracking-[0.3px] text-white"
        >
          Policy
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => p.handleOpenForm()}
            className="flex h-[30px] items-center gap-2 rounded-md bg-[#7A5BED] px-3 text-sm font-medium text-white hover:bg-[#5932E9]"
          >
            <Plus size={15} strokeWidth={2.5} />
            Policy
          </button>
        </div>
      </div>

      <div className="relative min-h-[650px]">
        <PolicyList
          rows={p.rows}
          isLoading={p.isListLoading}
          isError={p.isListError}
          search={p.search}
          setSearch={p.setSearch}
          onRetry={() => p.refetch()}
          onEdit={p.handleOpenForm}
          onDelete={p.handleDelete}
          onViewResult={p.openViewResult}
          ackTypeOptions={p.ackTypeOptions}
          dropdowns={p.dropdowns}
        />

        {p.showForm && (
          <PolicyForm
            formData={p.formData}
            ackTypeOptions={p.ackTypeOptions}
            filterOptions={p.filterOptions}
            subFilterOptions={p.subFilterOptions}
            needsDepartment={p.needsDepartment}
            needsDesignation={p.needsDesignation}
            onFilterSelect={p.handleFilterSelect}
            onSubFilterSelect={p.handleSubFilterSelect}
            isDropdownsLoading={p.isDropdownsLoading}
            openDropdown={p.openDropdown}
            setOpenDropdown={p.setOpenDropdown}
            datePickerOpen={p.datePickerOpen}
            setDatePickerOpen={p.setDatePickerOpen}
            calendar={p.calendar}
            toCalendar={p.toCalendar}
            saveError={p.saveError}
            isSaving={p.isSaving}
            onChange={p.handleInputChange}
            onFileChange={p.handleFileChange}
            onDateTextChange={p.handleDateTextChange}
            onToDateTextChange={p.handleToDateTextChange}
            onDateSelect={p.handleDateSelect}
            onToDateSelect={p.handleToDateSelect}
            onClearDate={p.handleClearDate}
            onClearToDate={p.handleClearToDate}
            onTodayDate={p.handleTodayDate}
            onTodayToDate={p.handleTodayToDate}
            onIsDownloadRestricted={p.setIsDownloadRestricted}
            onSave={p.handleSave}
            onClose={p.handleCloseForm}
          />
        )}

        {p.viewResultId !== null && (
          <PolicyAcknowledgementModal
            activeTab={p.activeTab}
            setActiveTab={p.setActiveTab}
            seen={p.seen}
            unseen={p.unseen}
            activeList={p.activeList}
            isLoading={p.isReadStatusLoading}
            isError={p.isReadStatusError}
            onClose={p.closeViewResult}
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
    </div>
  );
}