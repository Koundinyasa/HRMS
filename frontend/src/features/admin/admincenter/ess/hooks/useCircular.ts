import { useState, type ChangeEvent } from "react";
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

export type CircularFormData = {
  circularName: string;
  description: string;
  filter: string;
  subFilter: string;
  date: string;
  toDate: string;
  ackTypeId: string;
  file: File | null;
};

type CircularTab = "current" | "previous";

const EMPTY_FORM: CircularFormData = {
  circularName: "",
  description: "",
  filter: "",
  subFilter: "",
  date: "",
  toDate: "",
  ackTypeId: "",
  file: null,
};

export function useCircular() {
  const [activeListTab, setActiveListTab] =
    useState<CircularTab>("current");

  const [showForm, setShowForm] = useState(false);
  const [datePickerOpen, setDatePickerOpen] =
    useState<"from" | "to" | null>(null);

  const [openDropdown, setOpenDropdown] =
    useState<"filter" | "subFilter" | "acknowledgement" | null>(null);

  const [formData, setFormData] =
    useState<CircularFormData>(EMPTY_FORM);

  const [errors, setErrors] = useState<{
    circularName?: string;
    date?: string;
  }>({});

  const [editingId, setEditingId] =
    useState<string | number | null>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  const calendar = useMonthCalendar(formData.date);
  const toCalendar = useMonthCalendar(formData.toDate);

  // Fetch current circulars from the backend.
  const {
    data: currentResponse,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    refetch: refetchCurrent,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.CIRCULAR,
    statusId: ESS_STATUS.CURRENT,
  });

  // Fetch previous circulars from the backend.
  const {
    data: previousResponse,
    isLoading: isPreviousLoading,
    isError: isPreviousError,
    refetch: refetchPrevious,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.CIRCULAR,
    statusId: ESS_STATUS.PREVIOUS,
  });

  const currentRows: EssModuleRow[] = currentResponse?.data ?? [];
  const previousRows: EssModuleRow[] = previousResponse?.data ?? [];

  const rows =
    activeListTab === "current" ? currentRows : previousRows;

  const isListLoading =
    activeListTab === "current"
      ? isCurrentLoading
      : isPreviousLoading;

  const isListError =
    activeListTab === "current"
      ? isCurrentError
      : isPreviousError;

  const refetchCirculars = async () => {
    await Promise.all([refetchCurrent(), refetchPrevious()]);
  };

  // Load dropdown values from the backend.
  const {
    data: dropdowns,
    isLoading: isDropdownsLoading,
  } = useGetEssDropdownsQuery();

  const ackTypeOptions = (dropdowns?.ackTypes ?? []).map((t) => ({
    id: String(t.ID),
    label: t.TypeName ?? "",
  }));

  const {
    filterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
  } = useEssFilterOptions(dropdowns, formData.filter);

  const [createEssModule, { isLoading: isCreating }] =
    useCreateEssModuleMutation();

  const [updateEssModule, { isLoading: isUpdating }] =
    useUpdateEssModuleMutation();

  const [deleteEssModule] = useDeleteEssModuleMutation();

  const isSaving = isCreating || isUpdating;

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
      label: String(row.Name ?? "this circular"),
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
        essInsightId: ESS_INSIGHT.CIRCULAR,
        id: pendingDelete.id,
      }).unwrap();
      setPendingDelete(null);
      await refetchCirculars();
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


  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "circularName") {
      setErrors((prev) => ({ ...prev, circularName: undefined }));
    }
  };

  const handleFilterSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      filter: value,
      subFilter: "",
    }));

    setOpenDropdown(null);
  };

  const handleSubFilterSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, subFilter: value }));
    setOpenDropdown(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files?.[0] || null,
    }));
  };

  const handleDateTextChange = (value: string) => {
    setFormData((prev) => ({ ...prev, date: value }));

    const parsed = parseDate(value);
    if (parsed) calendar.goToMonthOf(parsed);
  };

  const handleToDateTextChange = (value: string) => {
    setFormData((prev) => ({ ...prev, toDate: value }));

    const parsed = parseDate(value);
    if (parsed) toCalendar.goToMonthOf(parsed);
  };

  const handleDateSelect = (iso: string) => {
    const selected = new Date(`${iso}T00:00:00`);

    setFormData((prev) => ({
      ...prev,
      date: formatDate(selected),
    }));

    calendar.goToMonthOf(selected);
    setDatePickerOpen(null);
  };

  const handleToDateSelect = (iso: string) => {
    const selected = new Date(`${iso}T00:00:00`);

    setFormData((prev) => ({
      ...prev,
      toDate: formatDate(selected),
    }));

    toCalendar.goToMonthOf(selected);
    setDatePickerOpen(null);
  };

  const handleClearDate = () => {
    setFormData((prev) => ({ ...prev, date: "" }));
    setDatePickerOpen(null);
  };

  const handleClearToDate = () => {
    setFormData((prev) => ({ ...prev, toDate: "" }));
    setDatePickerOpen(null);
  };

  const handleTodayDate = () => {
    const today = new Date();

    setFormData((prev) => ({
      ...prev,
      date: formatDate(today),
    }));

    calendar.goToMonthOf(today);
    setDatePickerOpen(null);
  };

  const handleTodayToDate = () => {
    const today = new Date();

    setFormData((prev) => ({
      ...prev,
      toDate: formatDate(today),
    }));

    toCalendar.goToMonthOf(today);
    setDatePickerOpen(null);
  };

  const handleOpenForm = (row?: EssModuleRow) => {
    if (row) {
      setEditingId(getRowId(row) ?? null);

      setFormData({
        circularName: row.Name ?? "",
        description: row.Description ?? "",
        filter: row.FilterID != null ? String(row.FilterID) : "",
        subFilter:
          row.SubFilterID != null ? String(row.SubFilterID) : "",
        date: toUiDate(row.FromDate),
        toDate: toUiDate(row.ToDate),
        ackTypeId:
          row.AckTypeID != null ? String(row.AckTypeID) : "",
        file: null,
      });
    } else {
      setEditingId(null);

      setFormData({
        ...EMPTY_FORM,
        filter: filterOptions[0]?.id ?? "",
        ackTypeId: ackTypeOptions[0]?.id ?? "",
      });
    }

    setErrors({});
    setSaveError(null);
    calendar.resetToToday();
    toCalendar.resetToToday();
    setDatePickerOpen(null);
    setOpenDropdown(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setDatePickerOpen(null);
    setOpenDropdown(null);
    setEditingId(null);
    setSaveError(null);
  };

  const handleSave = async () => {
    const newErrors: {
      circularName?: string;
      date?: string;
    } = {};

    if (!formData.circularName.trim()) {
      newErrors.circularName = "Field Required";
    }

    if (!formData.date) {
      newErrors.date = "Field Required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSaveError(null);

    const basePayload = {
      essInsightId: ESS_INSIGHT.CIRCULAR,
      fromDate: toApiDate(formData.date),
      toDate: formData.toDate
        ? toApiDate(formData.toDate)
        : undefined,
      title: formData.circularName,
      content: formData.description || undefined,
      ackTypeId: formData.ackTypeId || undefined,
      filter: formData.filter || undefined,
      subFilter: formData.subFilter || undefined,
      file: formData.file,
    };

    try {
      if (editingId !== null) {
        await updateEssModule({
          ...basePayload,
          id: editingId,
        }).unwrap();
      } else {
        await createEssModule(basePayload).unwrap();
      }

      handleCloseForm();
      await refetchCirculars();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string }; message?: string })
          ?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to save circular.";

      setSaveError(message);
    }
  };

  return {
    // Current / Previous tabs
    activeListTab,
    setActiveListTab,
    currentCount: currentRows.length,
    previousCount: previousRows.length,

    // Backend list
    rows,
    dropdowns,
    isListLoading,
    isListError,
    refetchCirculars,

    // Add / Edit / Delete
    showForm,
    editingId,
    handleOpenForm,
    handleCloseForm,
    handleSave,
    handleDelete,
    pendingDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,

    // Form state
    formData,
    errors,
    saveError,
    isSaving,
    handleChange,
    handleFileChange,

    // Dropdowns
    openDropdown,
    setOpenDropdown,
    ackTypeOptions,
    filterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
    handleFilterSelect,
    handleSubFilterSelect,
    isDropdownsLoading,

    // Date pickers
    datePickerOpen,
    setDatePickerOpen,
    calendar,
    toCalendar,
    handleDateTextChange,
    handleToDateTextChange,
    handleDateSelect,
    handleToDateSelect,
    handleClearDate,
    handleClearToDate,
    handleTodayDate,
    handleTodayToDate,
  };
}

export default useCircular;