import { useState } from "react";
import {
  ESS_INSIGHT,
  ESS_STATUS,
  useGetEssModuleQuery,
  useCreateEssModuleMutation,
  useUpdateEssModuleMutation,
  useDeleteEssModuleMutation,
  useGetEssDropdownsQuery,
  toApiDate,
  toUiDate,
  getRowId,
  type EssModuleRow,
} from "../api/essApi";
import { useMonthCalendar, formatDate, parseDate } from "./useMonthCalendar";
import { useEssFilterOptions } from "./useEssFilterOptions";

const EMPTY = {
  startDate: "",
  endDate: "",
  targetFilter: "",
  subFilter: "",
  questionTypeId: "",
  question: "",
};

export type PollTab = "current" | "previous";

export function usePoll() {
  const [activeTab, setActiveTab] = useState<PollTab>("current");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] =
    useState<"targetFilter" | "subFilter" | "questionType" | null>(null);

  const startCalendar = useMonthCalendar(form.startDate);
  const endCalendar = useMonthCalendar(form.endDate);

  // Fetch both Current and Previous polls from the backend.
  const {
    data: currentResponse,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    refetch: refetchCurrent,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.POLL,
    statusId: ESS_STATUS.CURRENT,
  });

  const {
    data: previousResponse,
    isLoading: isPreviousLoading,
    isError: isPreviousError,
    refetch: refetchPrevious,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.POLL,
    statusId: ESS_STATUS.PREVIOUS,
  });

  const isListLoading =
    activeTab === "current" ? isCurrentLoading : isPreviousLoading;

  const isListError =
    activeTab === "current" ? isCurrentError : isPreviousError;

  const rows: EssModuleRow[] =
    activeTab === "current"
      ? currentResponse?.data ?? []
      : previousResponse?.data ?? [];

  const refetch = () => {
    if (activeTab === "current") {
      return refetchCurrent();
    }
    return refetchPrevious();
  };

  const refreshBoth = async () => {
    await Promise.all([refetchCurrent(), refetchPrevious()]);
  };

  const { data: dropdowns, isLoading: isDropdownsLoading } =
    useGetEssDropdownsQuery();

  const questionTypeOptions = (dropdowns?.pollTypes ?? []).map((t) => ({
    id: String(t.ID),
    label: t.TypeName ?? t.Name ?? "",
  }));

  const {
    filterOptions: targetFilterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
  } = useEssFilterOptions(dropdowns, form.targetFilter);

  const [createEssModule, { isLoading: isCreating }] =
    useCreateEssModuleMutation();

  const [updateEssModule, { isLoading: isUpdating }] =
    useUpdateEssModuleMutation();

  const [deleteEssModule] = useDeleteEssModuleMutation();

  const isSaving = isCreating || isUpdating;

  const closeAllPopovers = () => {
    setStartDatePickerOpen(false);
    setEndDatePickerOpen(false);
    setOpenDropdown(null);
  };

  const handleOpenForm = (row?: EssModuleRow) => {
    if (row) {
      setEditingId(getRowId(row) ?? null);
      setForm({
        startDate: toUiDate(row.StartDate ?? row.FromDate),
        endDate: toUiDate(row.EndDate ?? row.ToDate),
        targetFilter:
          row.FilterID != null ? String(row.FilterID) : "",
        subFilter:
          row.SubFilterID != null ? String(row.SubFilterID) : "",
        questionTypeId:
          row.QuestionTypeID != null ? String(row.QuestionTypeID) : "",
        question: row.Question ?? "",
      });
    } else {
      setEditingId(null);
      setForm({
        ...EMPTY,
        targetFilter: targetFilterOptions[0]?.id ?? "",
        questionTypeId: questionTypeOptions[0]?.id ?? "",
      });
    }

    setSaveError(null);
    closeAllPopovers();
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY);
    setSaveError(null);
    closeAllPopovers();
  };

  const setQuestion = (value: string) => {
    setForm((prev) => ({ ...prev, question: value }));
  };

  const handleTargetFilterSelect = (value: string) => {
    setForm((prev) => ({
      ...prev,
      targetFilter: value,
      subFilter: "",
    }));
    setOpenDropdown(null);
  };

  const handleSubFilterSelect = (value: string) => {
    setForm((prev) => ({ ...prev, subFilter: value }));
    setOpenDropdown(null);
  };

  const handleQuestionTypeSelect = (value: string) => {
    setForm((prev) => ({ ...prev, questionTypeId: value }));
    setOpenDropdown(null);
  };

  const handleStartDateText = (value: string) => {
    setForm((prev) => ({ ...prev, startDate: value }));
    const parsed = parseDate(value);
    if (parsed) startCalendar.goToMonthOf(parsed);
  };

  const handleEndDateText = (value: string) => {
    setForm((prev) => ({ ...prev, endDate: value }));
    const parsed = parseDate(value);
    if (parsed) endCalendar.goToMonthOf(parsed);
  };

  const handleStartDateSelect = (iso: string) => {
    const date = new Date(`${iso}T00:00:00`);
    setForm((prev) => ({ ...prev, startDate: formatDate(date) }));
    startCalendar.goToMonthOf(date);
    setStartDatePickerOpen(false);
  };

  const handleEndDateSelect = (iso: string) => {
    const date = new Date(`${iso}T00:00:00`);
    setForm((prev) => ({ ...prev, endDate: formatDate(date) }));
    endCalendar.goToMonthOf(date);
    setEndDatePickerOpen(false);
  };

  const handleClearStartDate = () => {
    setForm((prev) => ({ ...prev, startDate: "" }));
    setStartDatePickerOpen(false);
  };

  const handleClearEndDate = () => {
    setForm((prev) => ({ ...prev, endDate: "" }));
    setEndDatePickerOpen(false);
  };

  const handleTodayStartDate = () => {
    const today = new Date();
    setForm((prev) => ({ ...prev, startDate: formatDate(today) }));
    startCalendar.goToMonthOf(today);
    setStartDatePickerOpen(false);
  };

  const handleTodayEndDate = () => {
    const today = new Date();
    setForm((prev) => ({ ...prev, endDate: formatDate(today) }));
    endCalendar.goToMonthOf(today);
    setEndDatePickerOpen(false);
  };

  const handleSave = async () => {
    if (!form.startDate) {
      setSaveError("Please select start date");
      return;
    }

    if (!form.question.trim()) {
      setSaveError("Please enter poll question");
      return;
    }

    setSaveError(null);

    const payload = {
      essInsightId: ESS_INSIGHT.POLL,
      fromDate: toApiDate(form.startDate),
      toDate: form.endDate ? toApiDate(form.endDate) : undefined,
      content: form.question.trim(),
      questionTypeId: form.questionTypeId || undefined,
      filter: form.targetFilter || undefined,
      subFilter: form.subFilter || undefined,
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

      handleClose();
      await refreshBoth();
    } catch (err: unknown) {
      const error = err as {
        data?: { message?: string };
        message?: string;
      };

      setSaveError(
        error?.data?.message ?? error?.message ?? "Failed to save poll."
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
      label: String(row.Name ?? row.Question ?? "this poll"),
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
        essInsightId: ESS_INSIGHT.POLL,
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
    currentCount: currentResponse?.data?.length ?? 0,
    previousCount: previousResponse?.data?.length ?? 0,
    rows,
    isListLoading,
    isListError,
    refetch,
    handleDelete,
    pendingDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
    showModal,
    editingId,
    handleOpenForm,
    handleClose,
    form,
    setQuestion,
    saveError,
    isSaving,
    handleSave,
    startDatePickerOpen,
    setStartDatePickerOpen,
    endDatePickerOpen,
    setEndDatePickerOpen,
    openDropdown,
    setOpenDropdown,
    handleTargetFilterSelect,
    handleSubFilterSelect,
    handleQuestionTypeSelect,
    targetFilterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
    questionTypeOptions,
    isDropdownsLoading,
    startCalendar,
    endCalendar,
    handleStartDateText,
    handleEndDateText,
    handleStartDateSelect,
    handleEndDateSelect,
    handleClearStartDate,
    handleClearEndDate,
    handleTodayStartDate,
    handleTodayEndDate,
    closeAllPopovers,
  };
}

export default usePoll;