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
import { SEED_BRANCHES } from "../constants/branch.constants";
import type { Branch } from "../types/classificationTypes";

const SEED_ID_FLOOR = 9000; // ids at/above this are local seed rows, not real backend rows

export const useBranch = () => {
  const dispatch = useAppDispatch();
  // was: state.classification.branchForm — now nested under admin.adminCenter.classifications
  const form = useAppSelector((state) => state.admin.adminCenter.classifications.branchForm);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [seedBranches, setSeedBranches] = useState<Branch[]>(SEED_BRANCHES);

  const { data: backendBranches = [], isLoading } = useGetBranchesQuery();

  // Once the backend actually has rows, prefer those over the local seed.
  const usingSeed = !isLoading && backendBranches.length === 0;
  const branches = usingSeed ? seedBranches : backendBranches;

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

    // Editing/adding while showing seed rows: keep it local instead of
    // hitting the real API with ids the backend has never seen.
    const isSeedEdit = form.editingId !== null && form.editingId >= SEED_ID_FLOOR;
    if (usingSeed || isSeedEdit) {
      if (form.editingId) {
        setSeedBranches((prev) =>
          prev.map((b) =>
            b.Id === form.editingId
              ? { ...b, BranchName: form.branchName, Address: form.address, State: form.state, IsActive: form.isActive }
              : b,
          ),
        );
        toast.success("Branch updated successfully.");
      } else {
        const nextId = Math.max(SEED_ID_FLOOR, ...seedBranches.map((b) => b.Id)) + 1;
        setSeedBranches((prev) => [
          ...prev,
          { Id: nextId, BranchName: form.branchName, Address: form.address, State: form.state, IsActive: 1 },
        ]);
        toast.success("Branch added successfully.");
      }
      closeForm();
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

    if (deleteTarget.Id >= SEED_ID_FLOOR) {
      setSeedBranches((prev) => prev.filter((b) => b.Id !== deleteTarget.Id));
      toast.success("Branch deleted.");
      setDeleteTarget(null);
      return;
    }

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
