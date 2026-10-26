import { useMemo, useState } from "react";

import {
  useGetAdditionalClassificationsQuery,
  useCreateAdditionalClassificationMutation,
  useUpdateAdditionalClassificationMutation,
  useDeleteAdditionalClassificationMutation,
} from "../api/classificationApi";

import {
  validateClassificationSchema,
  isClassificationFormValid,
} from "../validation/classificationSchema";

import {
  DEFAULT_FILTERS,
  DEFAULT_FORM_VALUES,
} from "../constants/classification.constants";

import type {
  Classification,
  ClassificationFilters,
  ClassificationFormValues,
  ClassificationFormErrors,
  ClassificationModalMode,
} from "../types/classification.types";

import type { AdditionalClassification } from "../types/classificationTypes";

function mapClassification(
  item: AdditionalClassification
): Classification {
  return {
    id: String(item.Id),
    name: item.Name,
    shortName: item.Tag,
    type: "Additional",
    description: "",
    active: true,
    createdAt: "",
    updatedAt: "",
  };
}

export function useClassification() {
  const [filters, setFilters] =
    useState<ClassificationFilters>(DEFAULT_FILTERS);

  const [modalMode, setModalMode] =
    useState<ClassificationModalMode>(null);

  const [activeRecord, setActiveRecord] =
    useState<Classification | null>(null);

  const [formValues, setFormValues] =
    useState<ClassificationFormValues>(DEFAULT_FORM_VALUES);

  const [formErrors, setFormErrors] =
    useState<ClassificationFormErrors>({});

  const [deleteTarget, setDeleteTarget] =
    useState<Classification | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdditionalClassificationsQuery();

  const [addClassification, { isLoading: isAdding }] =
    useCreateAdditionalClassificationMutation();

  const [updateClassification, { isLoading: isUpdating }] =
    useUpdateAdditionalClassificationMutation();

  const [deleteClassification, { isLoading: isDeleting }] =
    useDeleteAdditionalClassificationMutation();

  const classifications = useMemo(
    () => (data ?? []).map(mapClassification),
    [data]
  );

  const total = classifications.length;

  const updateFilter = <K extends keyof ClassificationFilters>(
    key: K,
    value: ClassificationFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? (value as number) : 1,
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

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
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitForm = async (): Promise<{ success: boolean }> => {
    const errors = validateClassificationSchema(formValues);
    setFormErrors(errors);

    if (!isClassificationFormValid(errors)) {
      return { success: false };
    }

    if (modalMode === "edit" && activeRecord) {
      await updateClassification({
        id: Number(activeRecord.id),
        name: formValues.name,
        tag: formValues.shortName,
      }).unwrap();
    } else if (modalMode === "add") {
      await addClassification({
        name: formValues.name,
        tag: formValues.shortName,
      }).unwrap();
    } else {
      return { success: false };
    }

    closeModal();
    return { success: true };
  };

  const openDeleteModal = (record: Classification) => {
    setDeleteTarget(record);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await deleteClassification({
      id: Number(deleteTarget.id),
    }).unwrap();

    closeDeleteModal();
  };

  return {
    classifications,
    total,
    isLoading,
    isFetching,
    isError,
    refetch,

    filters,
    updateFilter,
    resetFilters,

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

    deleteTarget,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    isDeleting,
  };
}
