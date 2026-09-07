import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setBankField, loadBankForEdit, clearBankForm } from "../classificationSlice";
import {
  useGetBanksQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
} from "../api/classificationApi";
import { validateBank } from "../validation/classificationValidation";
import { getBackendMessage } from "./getBackendMessage";
import type { Bank } from "../types/classificationTypes";

export const useBanks = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.adminCenter.classifications.bankForm);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Bank | null>(null);

  const { data: apiBanks, isLoading, isError } = useGetBanksQuery();
  const banks: Bank[] = isError
    ? [{ Id: 1, BankName: "IDBI Bank", AcType: "Salary Account", IfscCode: "IBKL0000002" }]
    : apiBanks ?? [];
  const usingFallback = isError;
  const [createBank, { isLoading: isCreating }] = useCreateBankMutation();
  const [updateBank, { isLoading: isUpdating }] = useUpdateBankMutation();
  const [deleteBank, { isLoading: isDeleting }] = useDeleteBankMutation();

  const openAdd = () => {
    dispatch(clearBankForm());
    setIsFormOpen(true);
  };

  const openEdit = (bank: Bank) => {
    dispatch(
      loadBankForEdit({
        editingId: bank.Id,
        bankName: bank.BankName,
        acType: bank.AcType,
        ifscCode: bank.IfscCode,
      })
    );
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    dispatch(clearBankForm());
  };

  const setField = (field: "bankName" | "acType" | "ifscCode", value: string) =>
    dispatch(setBankField({ field, value }));

  const submit = async () => {
    const validation = validateBank(form);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (usingFallback) {
      toast.info("This is preview data — the banks API isn't live yet, so changes can't be saved.");
      return;
    }

    try {
      if (form.editingId) {
        await updateBank({
          id: form.editingId,
          bankName: form.bankName,
          acType: form.acType,
          ifscCode: form.ifscCode,
        }).unwrap();
        toast.success("Bank updated successfully.");
      } else {
        await createBank({ bankName: form.bankName, acType: form.acType, ifscCode: form.ifscCode }).unwrap();
        toast.success("Bank added successfully.");
      }
      closeForm();
    } catch (err) {
      console.error("Bank save failed:", err);
      toast.error(getBackendMessage(err) || "Unable to save the bank. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (usingFallback) {
      toast.info("This is preview data — the banks API isn't live yet, so changes can't be saved.");
      setDeleteTarget(null);
      return;
    }
    try {
      await deleteBank({ id: deleteTarget.Id }).unwrap();
      toast.success("Bank deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to delete the bank.");
    }
  };

  return {
    banks, isLoading, usingFallback,
    isFormOpen, openAdd, openEdit, closeForm,
    form, setField, submit,
    isSaving: isCreating || isUpdating,
    deleteTarget, setDeleteTarget, confirmDelete, isDeleting,
  };
};
