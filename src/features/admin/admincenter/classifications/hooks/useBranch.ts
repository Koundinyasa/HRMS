import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setBranchField, setBranchActive, loadBranchForEdit, clearBranchForm } from "../classificationSlice";
import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "../api/classificationApi";
import { validateBranch } from "../validation/classificationValidation";
import { getBackendMessage } from "./getBackendMessage";
import type { Branch } from "../types/classificationTypes";

export const useBranch = () => {
  const dispatch = useAppDispatch();
  // was: state.classification.branchForm — now nested under admin.adminCenter.classifications
  const form = useAppSelector((state) => state.admin.adminCenter.classifications.branchForm);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const { data: backendBranches = [], isLoading } = useGetBranchesQuery();
  const branches = backendBranches;

  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  const openAdd = () => {
    dispatch(clearBranchForm());
    setIsFormOpen(true);
  };

  const openEdit = (branch: Branch) => {
    dispatch(
      loadBranchForEdit({
        editingId: branch.Id,
        branchName: branch.BranchName,
        address: branch.Address,
        state: branch.State,
        isActive: branch.IsActive,
      })
    );
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    dispatch(clearBranchForm());
  };

  const setField = (field: "branchName" | "address" | "state", value: string) =>
    dispatch(setBranchField({ field, value }));

  const submit = async () => {
    const validation = validateBranch(form);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      if (form.editingId) {
        await updateBranch({
          id: form.editingId,
          branchName: form.branchName,
          address: form.address,
          state: form.state,
          isActive: form.isActive,
        }).unwrap();
        toast.success("Branch updated successfully.");
      } else {
        await createBranch({ branchName: form.branchName, address: form.address, state: form.state }).unwrap();
        toast.success("Branch added successfully.");
      }
      closeForm();
    } catch (err) {
      console.error("Branch save failed:", err);
      toast.error(getBackendMessage(err) || "Unable to save the branch. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteBranch({ id: deleteTarget.Id }).unwrap();
      toast.success("Branch deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to delete the branch.");
    }
  };

  return {
    branches, isLoading,
    isFormOpen, openAdd, openEdit, closeForm,
    form, setField, setActive: (v: 0 | 1) => dispatch(setBranchActive(v)), submit,
    isSaving: isCreating || isUpdating,
    deleteTarget, setDeleteTarget, confirmDelete, isDeleting,
  };
};
