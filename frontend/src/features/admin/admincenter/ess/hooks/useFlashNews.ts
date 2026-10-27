import { useState } from "react";
import {
  ESS_INSIGHT,
  ESS_STATUS,
  useGetEssModuleQuery,
  useCreateEssModuleMutation,
  useUpdateEssModuleMutation,
  useDeleteEssModuleMutation,
  toApiDate,
  toUiDate,
  getRowId,
  type EssModuleRow,
} from "../api/essApi";
import { useMonthCalendar, formatDate, parseDate } from "./useMonthCalendar";

export type FlashNewsFormData = {
  content: string;
  fromDate: string;
  toDate: string;
};

export type FlashNewsTab = "current" | "previous";

const EMPTY_FORM: FlashNewsFormData = {
  content: "",
  fromDate: "",
  toDate: "",
};

export function useFlashNews() {
  const [activeTab, setActiveTab] = useState<FlashNewsTab>("current");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] =
    useState<FlashNewsFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<{
    content?: string;
    fromDate?: string;
  }>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const [fromDatePickerOpen, setFromDatePickerOpen] = useState(false);
  const [toDatePickerOpen, setToDatePickerOpen] = useState(false);

  const fromCalendar = useMonthCalendar(formData.fromDate);
  const toCalendar = useMonthCalendar(formData.toDate);

  // Fetch current Flash News from the backend.
  const {
    data: currentResponse,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    refetch: refetchCurrent,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.FLASH_NEWS,
    statusId: ESS_STATUS.CURRENT,
  });

  // Fetch previous Flash News from the backend.
  const {
    data: previousResponse,
    isLoading: isPreviousLoading,
    isError: isPreviousError,
    refetch: refetchPrevious,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.FLASH_NEWS,
    statusId: ESS_STATUS.PREVIOUS,
  });

  const currentRows: EssModuleRow[] = currentResponse?.data ?? [];
  const previousRows: EssModuleRow[] = previousResponse?.data ?? [];

  const rows =
    activeTab === "current" ? currentRows : previousRows;

  const isListLoading =
    activeTab === "current" ? isCurrentLoading : isPreviousLoading;

  const isListError =
    activeTab === "current" ? isCurrentError : isPreviousError;

  const refetch = () =>
    activeTab === "current" ? refetchCurrent() : refetchPrevious();

  const refetchBoth = async () => {
    await Promise.all([refetchCurrent(), refetchPrevious()]);
  };

  const [createEssModule, { isLoading: isCreating }] =
    useCreateEssModuleMutation();

  const [updateEssModule, { isLoading: isUpdating }] =
    useUpdateEssModuleMutation();

  const [deleteEssModule] = useDeleteEssModuleMutation();

  const isSaving = isCreating || isUpdating;

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));

    if (value.trim()) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const handleFromDateText = (value: string) => {
    setFormData((prev) => ({ ...prev, fromDate: value }));

    if (value) {
      setErrors((prev) => ({ ...prev, fromDate: undefined }));
    }

    const parsed = parseDate(value);
    if (parsed) fromCalendar.goToMonthOf(parsed);
  };

  const handleToDateText = (value: string) => {
    setFormData((prev) => ({ ...prev, toDate: value }));

    const parsed = parseDate(value);
    if (parsed) toCalendar.goToMonthOf(parsed);
  };

  const handleFromDateSelect = (iso: string) => {
    const date = new Date(`${iso}T00:00:00`);

    setFormData((prev) => ({
      ...prev,
      fromDate: formatDate(date),
    }));

    fromCalendar.goToMonthOf(date);
    setErrors((prev) => ({ ...prev, fromDate: undefined }));
    setFromDatePickerOpen(false);
  };

  const handleToDateSelect = (iso: string) => {
    const date = new Date(`${iso}T00:00:00`);

    setFormData((prev) => ({
      ...prev,
      toDate: formatDate(date),
    }));

    toCalendar.goToMonthOf(date);
    setToDatePickerOpen(false);
  };

  const handleClearFromDate = () => {
    setFormData((prev) => ({ ...prev, fromDate: "" }));
    setFromDatePickerOpen(false);
  };

  const handleClearToDate = () => {
    setFormData((prev) => ({ ...prev, toDate: "" }));
    setToDatePickerOpen(false);
  };

  const handleTodayFromDate = () => {
    const today = new Date();

    setFormData((prev) => ({
      ...prev,
      fromDate: formatDate(today),
    }));

    fromCalendar.goToMonthOf(today);
    setErrors((prev) => ({ ...prev, fromDate: undefined }));
    setFromDatePickerOpen(false);
  };

  const handleTodayToDate = () => {
    const today = new Date();

    setFormData((prev) => ({
      ...prev,
      toDate: formatDate(today),
    }));

    toCalendar.goToMonthOf(today);
    setToDatePickerOpen(false);
  };

  const handleOpenForm = (row?: EssModuleRow) => {
    if (row) {
      setEditingId(getRowId(row) ?? null);

      setFormData({
        content: row.FlashNews ?? "",
        fromDate: toUiDate(row.FromDate),
        toDate: toUiDate(row.ToDate),
      });
    } else {
      setEditingId(null);
      setFormData(EMPTY_FORM);
    }

    setErrors({});
    setSaveError(null);
    setFromDatePickerOpen(false);
    setToDatePickerOpen(false);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setSaveError(null);
    setFromDatePickerOpen(false);
    setToDatePickerOpen(false);
  };

  const handleSave = async () => {
    const newErrors: {
      content?: string;
      fromDate?: string;
    } = {};

    if (!formData.content.trim()) {
      newErrors.content = "Field Required";
    }

    if (!formData.fromDate) {
      newErrors.fromDate = "Field Required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSaveError(null);

    const payload = {
      essInsightId: ESS_INSIGHT.FLASH_NEWS,
      fromDate: toApiDate(formData.fromDate),
      toDate: formData.toDate
        ? toApiDate(formData.toDate)
        : undefined,
      content: formData.content.trim(),
    };

    try {
      if (editingId !== null) {
        await updateEssModule({
          ...payload,
          id: editingId,
        }).unwrap();
      } else {
        await createEssModule(payload).unwrap();
      }

      handleCloseForm();
      await refetchBoth();
    } catch (err: unknown) {
      const error = err as {
        data?: { message?: string };
        message?: string;
      };

      setSaveError(
        error?.data?.message ??
          error?.message ??
          "Failed to save flash news."
      );
    }
  };

  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (row: EssModuleRow) => {
    const id = getRowId(row);
    if (id === undefined) return;
    setPendingDelete({
      id,
      label: String(row.Name ?? "this flash news"),
    });
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteEssModule({
        essInsightId: ESS_INSIGHT.FLASH_NEWS,
        id: pendingDelete.id,
      }).unwrap();
      setPendingDelete(null);
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string }; message?: string })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to delete.";
      window.alert(message);
    } finally {
      setIsDeleting(false);
    }
  };


  return {
    activeTab,
    setActiveTab,

    rows,
    currentCount: currentRows.length,
    previousCount: previousRows.length,

    isListLoading,
    isListError,
    refetch,
    refetchBoth,
    handleDelete,
    pendingDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,

    showForm,
    editingId,
    handleOpenForm,
    handleCloseForm,

    formData,
    errors,
    saveError,
    isSaving,

    handleContentChange,
    handleSave,

    fromDatePickerOpen,
    setFromDatePickerOpen,
    toDatePickerOpen,
    setToDatePickerOpen,

    fromCalendar,
    toCalendar,

    handleFromDateText,
    handleToDateText,
    handleFromDateSelect,
    handleToDateSelect,
    handleClearFromDate,
    handleClearToDate,
    handleTodayFromDate,
    handleTodayToDate,
  };
}

export default useFlashNews;