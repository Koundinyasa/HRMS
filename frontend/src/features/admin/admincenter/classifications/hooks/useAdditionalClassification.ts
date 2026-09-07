import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setAdditionalField, loadAdditionalForEdit, clearAdditionalForm } from "../classificationSlice";
import {
  useGetAdditionalClassificationsQuery,
  useCreateAdditionalClassificationMutation,
  useUpdateAdditionalClassificationMutation,
  useDeleteAdditionalClassificationMutation,
} from "../api/classificationApi";
import { validateAdditionalClassification } from "../validation/classificationValidation";
import { getBackendMessage } from "./getBackendMessage";
import type { AdditionalClassification } from "../types/classificationTypes";

export const useAdditionalClassification = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.adminCenter.classifications.additionalForm);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: apiItems, isLoading, isError } = useGetAdditionalClassificationsQuery();
  const items: AdditionalClassification[] = isError
    ? [
        { Id: 1, Name: "Department", Tag: "Department" },
        { Id: 2, Name: "Team", Tag: "Team" },
      ]
    : apiItems ?? [];
  const usingFallback = isError;
  const [createItem, { isLoading: isCreating }] = useCreateAdditionalClassificationMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateAdditionalClassificationMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteAdditionalClassificationMutation();

  const selected = items.find((i) => i.Id === selectedId) ?? null;

  const openAdd = () => {
    dispatch(clearAdditionalForm());
    setIsFormOpen(true);
  };

  const openEdit = (item: AdditionalClassification) => {
    dispatch(loadAdditionalForEdit({ id: item.Id, name: item.Name, tag: item.Tag }));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    dispatch(clearAdditionalForm());
  };

  const setField = (field: "name" | "tag", value: string) => dispatch(setAdditionalField({ field, value }));

  const submit = async () => {
    const validation = validateAdditionalClassification(form);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (usingFallback) {
      toast.info("This is preview data — the additional classifications API isn't live yet, so changes can't be saved.");
      return;
    }

    try {
      if (form.editingId) {
        await updateItem({ id: form.editingId, name: form.name, tag: form.tag }).unwrap();
        toast.success("Classification updated successfully.");
      } else {
        await createItem({ name: form.name, tag: form.tag }).unwrap();
        toast.success("Classification added successfully.");
      }
      closeForm();
    } catch (err) {
      console.error("Additional classification save failed:", err);
      toast.error(getBackendMessage(err) || "Unable to save the classification. Please try again.");
    }
  };

  const remove = async (id: number) => {
    if (usingFallback) {
      toast.info("This is preview data — the additional classifications API isn't live yet, so changes can't be saved.");
      return;
    }
    try {
      await deleteItem({ id }).unwrap();
      toast.success("Classification deleted.");
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to delete the classification.");
    }
  };

  return {
    items, isLoading, usingFallback,
    selectedId, setSelectedId, selected,
    isFormOpen, openAdd, openEdit, closeForm,
    form, setField, submit,
    isSaving: isCreating || isUpdating, isDeleting,
    remove,
  };
};
