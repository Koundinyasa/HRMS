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
import { SEED_DESIGNATIONS } from "../constants/designation.constants";
import type { Designation } from "../types/classificationTypes";

const DEFAULT_PAGE_SIZE = 10;
const SEED_ID_FLOOR = 9000; // ids at/above this are local seed rows, not real backend rows

export const useDesignation = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.adminCenter.classifications.designationForm);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Designation | null>(null);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [seedDesignations, setSeedDesignations] = useState<Designation[]>(SEED_DESIGNATIONS);

  const { data, isLoading } = useGetDesignationsQuery({ page: form.page, pageSize });
  const backendDesignations = data?.Designations ?? [];
  const backendTotal = data?.TotalCount ?? 0;

  // Once the backend actually has rows, prefer those over the local seed.
  const usingSeed = !isLoading && backendTotal === 0;

  const designations = useMemo(() => {
    if (!usingSeed) return backendDesignations;
    const start = (form.page - 1) * pageSize;
    return seedDesignations.slice(start, start + pageSize);
  }, [usingSeed, backendDesignations, seedDesignations, form.page, pageSize]);

  const total = usingSeed ? seedDesignations.length : backendTotal;

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

    // Editing/adding while showing seed rows: keep it local instead of
    // hitting the real API with ids the backend has never seen.
    const isSeedEdit = form.editingId !== null && form.editingId >= SEED_ID_FLOOR;
    if (usingSeed || isSeedEdit) {
      if (form.editingId) {
        setSeedDesignations((prev) =>
          prev.map((d) => (d.Id === form.editingId ? { ...d, DesignationName: form.designationName } : d)),
        );
        toast.success("Designation updated successfully.");
      } else {
        const nextId = Math.max(SEED_ID_FLOOR, ...seedDesignations.map((d) => d.Id)) + 1;
        setSeedDesignations((prev) => [...prev, { Id: nextId, DesignationName: form.designationName }]);
        toast.success("Designation added successfully.");
      }
      closeForm();
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

    if (deleteTarget.Id >= SEED_ID_FLOOR) {
      setSeedDesignations((prev) => prev.filter((d) => d.Id !== deleteTarget.Id));
      toast.success("Designation deleted.");
      setDeleteTarget(null);
      return;
    }

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
