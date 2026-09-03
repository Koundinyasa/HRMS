import ClassificationHeader from "../components/ClassificationHeader";
import ClassificationFilters from "../components/ClassificationFilters";
import ClassificationTable from "../components/ClassificationTable";
import ClassificationModal from "../components/ClassificationModal";
import DeleteClassificationModal from "../components/DeleteClassificationModal";
import { useClassification } from "../hooks/useClassification";

export default function ClassificationPage() {
  const {
    classifications,
    isLoading,
    filters,
    updateFilter,
    resetFilters,
    modalMode,
    openAddModal,
    openEditModal,
    closeModal,
    formValues,
    formErrors,
    updateFormField,
    submitForm,
    isSaving,
    deleteTarget,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    isDeleting,
    handleToggleStatus,
  } = useClassification();

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full p-3 sm:p-5">
        <ClassificationHeader
          search={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          onAddNew={openAddModal}
        />

        <ClassificationFilters filters={filters} onChange={updateFilter} onReset={resetFilters} />

        <ClassificationTable
          classifications={classifications}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      <ClassificationModal
        mode={modalMode}
        values={formValues}
        errors={formErrors}
        isSaving={isSaving}
        onChange={updateFormField}
        onClose={closeModal}
        onSubmit={submitForm}
      />

      <DeleteClassificationModal
        target={deleteTarget}
        isDeleting={isDeleting}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
