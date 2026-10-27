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

export const TABS = [
  "Current Notification",
  "Previous Notification",
  "Notification Login Banner",
  "Daily Thoughts",
  "Daily Thought Import",
] as const;

type DatePickerType = "from" | "to" | null;

export function useNotification() {
  const [activeTab, setActiveTab] = useState<string>(
    "Current Notification"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [notificationText, setNotificationText] = useState("");
  const [eventName, setEventName] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [savedAttachmentPath, setSavedAttachmentPath] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filter, setFilterId] = useState("");
  const [subFilter, setSubFilter] = useState("");

  const [openDropdown, setOpenDropdown] = useState<
    "filter" | "subFilter" | null
  >(null);

  const [openDatePicker, setOpenDatePicker] =
    useState<DatePickerType>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    notification: "",
    eventName: "",
    fromDate: "",
  });

  const fromCalendar = useMonthCalendar(fromDate);
  const toCalendar = useMonthCalendar(toDate);

  const {
    data: currentResponse,
    isLoading: isCurrentLoading,
    isError: isCurrentError,
    refetch: refetchCurrent,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.NOTIFICATION,
    statusId: ESS_STATUS.CURRENT,
  });

  const {
    data: previousResponse,
    isLoading: isPreviousLoading,
    isError: isPreviousError,
    refetch: refetchPrevious,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.NOTIFICATION,
    statusId: ESS_STATUS.PREVIOUS,
  });

  const {
    data: dropdowns,
    isLoading: isDropdownsLoading,
  } = useGetEssDropdownsQuery();

  const {
    filterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
  } = useEssFilterOptions(dropdowns, filter);

  const [createEssModule, { isLoading: isCreating }] =
    useCreateEssModuleMutation();

  const [updateEssModule, { isLoading: isUpdating }] =
    useUpdateEssModuleMutation();

  const [deleteEssModule] = useDeleteEssModuleMutation();

  const isSaving = isCreating || isUpdating;

  const currentRows: EssModuleRow[] = currentResponse?.data ?? [];
  const previousRows: EssModuleRow[] = previousResponse?.data ?? [];
  const isPreviousTab = activeTab === "Previous Notification";
  const rows = isPreviousTab ? previousRows : currentRows;
  const isListLoading = isPreviousTab ? isPreviousLoading : isCurrentLoading;
  const isListError = isPreviousTab ? isPreviousError : isCurrentError;
  const refetch = async () => {
    await Promise.all([refetchCurrent(), refetchPrevious()]);
  };

  const isBanner = activeTab === "Notification Login Banner";

  const handleFilterSelect = (value: string) => {
    setFilterId(value);
    setSubFilter("");
    setOpenDropdown(null);
  };

  const handleSubFilterSelect = (value: string) => {
    setSubFilter(value);
    setOpenDropdown(null);
  };

  const handleNotificationChange = (html: string) => {
    setNotificationText(html);

    const isEmpty = html.replace(/<[^>]*>/g, "").trim().length === 0;

    if (!isEmpty) {
      setErrors((prev) => ({
        ...prev,
        notification: "",
      }));
    }
  };

  const handleEventNameChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setEventName(value);

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        eventName: "",
      }));
    }
  };

  const handleAttachmentChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setAttachment(e.target.files?.[0] ?? null);
  };

  const makeDateHandlers = (
    setValue: (value: string) => void,
    calendar: typeof fromCalendar,
    clearFieldError = false
  ) => ({
    onText: (value: string) => {
      setValue(value);

      if (clearFieldError && value) {
        setErrors((prev) => ({
          ...prev,
          fromDate: "",
        }));
      }

      const parsed = parseDate(value);

      if (parsed) {
        calendar.goToMonthOf(parsed);
      }
    },

    onSelect: (iso: string) => {
      setValue(formatDate(new Date(`${iso}T00:00:00`)));

      if (clearFieldError) {
        setErrors((prev) => ({
          ...prev,
          fromDate: "",
        }));
      }

      setOpenDatePicker(null);
    },

    onClear: () => {
      setValue("");
      setOpenDatePicker(null);
    },

    onToday: () => {
      const today = new Date();

      setValue(formatDate(today));
      calendar.goToMonthOf(today);

      if (clearFieldError) {
        setErrors((prev) => ({
          ...prev,
          fromDate: "",
        }));
      }

      setOpenDatePicker(null);
    },
  });

  const fromHandlers = makeDateHandlers(
    setFromDate,
    fromCalendar,
    true
  );

  const toHandlers = makeDateHandlers(
    setToDate,
    toCalendar
  );

  const handleOpenDatePicker = (type: "from" | "to") => {
    const existing = parseDate(
      type === "from" ? fromDate : toDate
    );

    if (existing) {
      (type === "from" ? fromCalendar : toCalendar)
        .goToMonthOf(existing);
    }

    setOpenDatePicker(type);
  };

  const handleOpenModal = (row?: EssModuleRow) => {
    if (row) {
      setEditingId(getRowId(row) ?? null);

      const isBannerRow =
        activeTab === "Notification Login Banner";

      setEventName(
        isBannerRow ? row.EventName ?? "" : ""
      );
      setSavedAttachmentPath(row.FilePath ?? null);

      setNotificationText(
        isBannerRow
          ? ""
          : row.Description ?? row.EventName ?? ""
      );

      setFromDate(toUiDate(row.FromDate));
      setToDate(toUiDate(row.ToDate));

      const rowFilter = row.Filter ?? row.FilterID;
      const rowSubFilter = row.SubFilter ?? row.SubFilterID;
      setFilterId(rowFilter != null ? String(rowFilter) : "");
      setSubFilter(rowSubFilter != null ? String(rowSubFilter) : "");
      setAttachment(null);
    } else {
      setEditingId(null);
      setEventName("");
      setNotificationText("");
      setSavedAttachmentPath(null);
      setFromDate("");
      setToDate("");
      setFilterId(filterOptions[0]?.id ?? "");
      setSubFilter("");
      setAttachment(null);
    }

    setErrors({
      notification: "",
      eventName: "",
      fromDate: "",
    });

    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setOpenDatePicker(null);
    setNotificationText("");
    setEventName("");
    setAttachment(null);
    setSavedAttachmentPath(null);
    setFromDate("");
    setToDate("");
    setFilterId("");
    setSubFilter("");
    setOpenDropdown(null);
    setSaveError(null);

    setErrors({
      notification: "",
      eventName: "",
      fromDate: "",
    });
  };

  const handleSave = async () => {
    const newErrors = {
      notification: "",
      eventName: "",
      fromDate: "",
    };

    let hasError = false;

    const plainNotificationText = notificationText
      .replace(/<[^>]*>/g, "")
      .trim();

    if (!isBanner && !plainNotificationText) {
      newErrors.notification = "Field Required";
      hasError = true;
    }

    if (isBanner && !eventName.trim()) {
      newErrors.eventName = "Field Required";
      hasError = true;
    }

    if (!fromDate) {
      newErrors.fromDate = "Field Required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setSaveError(null);

    const basePayload = {
      essInsightId: ESS_INSIGHT.NOTIFICATION,
      fromDate: toApiDate(fromDate),
      toDate: toDate ? toApiDate(toDate) : undefined,
      title: isBanner
        ? eventName.trim()
        : plainNotificationText.slice(0, 80) ||
          "Notification",
      content: isBanner ? undefined : notificationText,
      filter: filter || undefined,
      subFilter: subFilter || undefined,
      file: attachment,
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

      handleCloseModal();
    } catch (err: unknown) {
      const error = err as {
        data?: { message?: string };
        message?: string;
      };

      setSaveError(
        error?.data?.message ||
          error?.message ||
          "Failed to save notification."
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
      label: "this notification",
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
        essInsightId: ESS_INSIGHT.NOTIFICATION,
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
    isBanner,
    rows,
    currentCount: currentRows.length,
    previousCount: previousRows.length,
    isListLoading,
    isListError,
    refetch,
    handleDelete,
    pendingDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,
    isModalOpen,
    editingId,
    handleOpenModal,
    handleCloseModal,
    notificationText,
    handleNotificationChange,
    eventName,
    handleEventNameChange,
    attachment,
    attachmentName:
      attachment?.name ??
      savedAttachmentPath?.split(/[\\/]/).pop()?.split("?")[0] ??
      null,
    handleAttachmentChange,
    fromDate,
    toDate,
    filter,
    subFilter,
    filterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
    dropdowns,
    handleFilterSelect,
    handleSubFilterSelect,
    openDropdown,
    setOpenDropdown,
    isDropdownsLoading,
    errors,
    saveError,
    isSaving,
    openDatePicker,
    handleOpenDatePicker,
    setOpenDatePicker,
    fromCalendar,
    toCalendar,
    handleFromDateTextChange: fromHandlers.onText,
    handleToDateTextChange: toHandlers.onText,
    handleFromDateSelect: fromHandlers.onSelect,
    handleToDateSelect: toHandlers.onSelect,
    handleClearFromDate: fromHandlers.onClear,
    handleClearToDate: toHandlers.onClear,
    handleTodayFrom: fromHandlers.onToday,
    handleTodayTo: toHandlers.onToday,
    handleSave,
  };
}

export default useNotification;