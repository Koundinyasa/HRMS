import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  setDesignationName,
  setDesignationPage,
  loadDesignationForEdit,
  clearDesignationForm,
} from "../classificationSlice";
import {
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} from "../api/classificationApi";
import { validateDesignation } from "../validation/classificationValidation";
import { getBackendMessage } from "./getBackendMessage";
import type { Designation } from "../types/classificationTypes";

const DEFAULT_PAGE_SIZE = 10;
export const useDesignation = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.adminCenter.classifications.designationForm);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Designation | null>(null);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const { data, isLoading } = useGetDesignationsQuery({ page: form.page, pageSize });
  const backendDesignations = data?.Designations ?? [];
  const backendTotal = data?.TotalCount ?? 0;

  const designations = useMemo(() => backendDesignations, [backendDesignations]);
  const total = backendTotal;

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    dispatch(setDesignationPage(1));
  };

  const [createDesignation, { isLoading: isCreating }] = useCreateDesignationMutation();
  const [updateDesignation, { isLoading: isUpdating }] = useUpdateDesignationMutation();
  const [deleteDesignation, { isLoading: isDeleting }] = useDeleteDesignationMutation();

  const openAdd = () => {
    dispatch(clearDesignationForm());
    setIsFormOpen(true);
  };

  const openEdit = (item: Designation) => {
    dispatch(loadDesignationForEdit({ id: item.Id, designationName: item.DesignationName }));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    dispatch(clearDesignationForm());
  };

  const submit = async () => {
    const validation = validateDesignation(form);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      if (form.editingId) {
        await updateDesignation({ id: form.editingId, designationName: form.designationName }).unwrap();
        toast.success("Designation updated successfully.");
      } else {
        await createDesignation({ designationName: form.designationName }).unwrap();
        toast.success("Designation added successfully.");
      }
      closeForm();
    } catch (err) {
      console.error("Designation save failed:", err);
      toast.error(getBackendMessage(err) || "Unable to save the designation. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDesignation({ id: deleteTarget.Id }).unwrap();
      toast.success("Designation deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to delete the designation.");
    }
  };

  return {
    designations, total, page: form.page, pageSize, setPageSize, isLoading,
    setPage: (p: number) => dispatch(setDesignationPage(p)),
    isFormOpen, openAdd, openEdit, closeForm,
    form, setDesignationName: (v: string) => dispatch(setDesignationName(v)), submit,
    isSaving: isCreating || isUpdating,
    deleteTarget, setDeleteTarget, confirmDelete, isDeleting,
  };
};
