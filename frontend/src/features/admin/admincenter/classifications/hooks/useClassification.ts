import { useMemo, useState } from "react";
import {
  useGetClassificationsQuery,
  useAddClassificationMutation,
  useUpdateClassificationMutation,
  useDeleteClassificationMutation,
  useToggleClassificationStatusMutation,
} from "../api/classificationApi";
import {
  validateClassificationSchema,
  isClassificationFormValid,
} from "../validation/classificationSchema";
import { DEFAULT_FILTERS, DEFAULT_FORM_VALUES } from "../constants/classification.constants";
import type {
  Classification,
  ClassificationFilters,
  ClassificationFormValues,
  ClassificationFormErrors,
  ClassificationModalMode,
} from "../types/classification.types";

export function useClassification() {
  const [filters, setFilters] = useState<ClassificationFilters>(DEFAULT_FILTERS);
  const [modalMode, setModalMode] = useState<ClassificationModalMode>(null);
  const [activeRecord, setActiveRecord] = useState<Classification | null>(null);
  const [formValues, setFormValues] = useState<ClassificationFormValues>(DEFAULT_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<ClassificationFormErrors>({});
  const [deleteTarget, setDeleteTarget] = useState<Classification | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetClassificationsQuery(filters);

  const [addClassification, { isLoading: isAdding }] = useAddClassificationMutation();
  const [updateClassification, { isLoading: isUpdating }] = useUpdateClassificationMutation();
  const [deleteClassification, { isLoading: isDeleting }] = useDeleteClassificationMutation();
  const [toggleStatus] = useToggleClassificationStatusMutation();

  const classifications = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;

  // ---- filters ----
  const updateFilter = <K extends keyof ClassificationFilters>(
    key: K,
    value: ClassificationFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? (value as number) : 1 }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // ---- add / edit modal ----
  const openAddModal = () => {
    setActiveRecord(null);
    setFormValues(DEFAULT_FORM_VALUES);
    setFormErrors({});
    setModalMode("add");
  };

  const openEditModal = (record: Classification) => {
    setActiveRecord(record);
    setFormValues({
      name: record.name,
      shortName: record.shortName,
      type: record.type,
      description: record.description ?? "",
      active: record.active,
    });
    setFormErrors({});
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveRecord(null);
    setFormErrors({});
  };

  const updateFormField = <K extends keyof ClassificationFormValues>(
    key: K,
    value: ClassificationFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const submitForm = async (): Promise<{ success: boolean }> => {
    const errors = validateClassificationSchema(formValues);
    setFormErrors(errors);
    if (!isClassificationFormValid(errors)) return { success: false };

    if (modalMode === "edit" && activeRecord) {
      await updateClassification({ id: activeRecord.id, ...formValues }).unwrap();
    } else {
      await addClassification(formValues).unwrap();
    }

    closeModal();
    return { success: true };
  };

  // ---- delete confirmation ----
  const openDeleteModal = (record: Classification) => setDeleteTarget(record);
  const closeDeleteModal = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteClassification(deleteTarget.id).unwrap();
    closeDeleteModal();
  };

  // ---- status toggle ----
  const handleToggleStatus = async (record: Classification) => {
    await toggleStatus({ id: record.id, active: !record.active }).unwrap();
  };

  return {
    // data
    classifications,
    total,
    isLoading,
    isFetching,
    isError,
    refetch,

    // filters
    filters,
    updateFilter,
    resetFilters,

    // add/edit modal
    modalMode,
    activeRecord,
    openAddModal,
    openEditModal,
    closeModal,
    formValues,
    formErrors,
    updateFormField,
    submitForm,
    isSaving: isAdding || isUpdating,

    // delete
    deleteTarget,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    isDeleting,

    // status
    handleToggleStatus,
  };
}
