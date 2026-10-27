import { useState, type ChangeEvent } from "react";
import {
  ESS_INSIGHT,
  useGetEssModuleQuery,
  useCreateEssModuleMutation,
  useUpdateEssModuleMutation,
  useDeleteEssModuleMutation,
  useGetEssDropdownsQuery,
  useGetPolicyReadStatusQuery,
  toApiDate,
  toUiDate,
  getRowId,
  type EssModuleRow,
} from "../api/essApi";
import { useMonthCalendar, formatDate, parseDate } from "./useMonthCalendar";
import { useEssFilterOptions } from "./useEssFilterOptions";

export type PolicyFormData = {
  policyName: string;
  description: string;
  filter: string;
  subFilter: string;
  date: string;
  toDate: string;
  ackTypeId: string;
  isDownloadRestricted: boolean;
  file: File | null;
};

const EMPTY_FORM: PolicyFormData = {
  policyName: "",
  description: "",
  filter: "",
  subFilter: "",
  date: "",
  toDate: "",
  ackTypeId: "",
  isDownloadRestricted: false,
  file: null,
};

export function usePolicy() {
  const [search, setSearch] = useState("");
  // Policy SP ignores statusId — load all policies in one list.
  const {
    data: moduleResponse,
    isLoading: isListLoading,
    isError: isListError,
    refetch,
  } = useGetEssModuleQuery({
    essInsightId: ESS_INSIGHT.POLICY,
  });

  const allRows: EssModuleRow[] = moduleResponse?.data ?? [];

  const value = search.trim().toLowerCase();

  const filteredRows = allRows.filter((row) => {
    return (
      (row.PolicyName ?? "").toLowerCase().includes(value) ||
      (row.Description ?? "").toLowerCase().includes(value)
    );
  });

  // Dynamic dropdown options from the backend.
  const {
    data: dropdowns,
    isLoading: isDropdownsLoading,
  } = useGetEssDropdownsQuery();

  const ackTypeOptions = (dropdowns?.ackTypes ?? []).map((item) => ({
    id: String(item.ID),
    label: item.TypeName ?? item.Name ?? "",
  }));

  // Form state.
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] =
    useState<string | number | null>(null);
  const [formData, setFormData] =
    useState<PolicyFormData>(EMPTY_FORM);

  const [openDropdown, setOpenDropdown] =
    useState<"filter" | "subFilter" | "ackTypeId" | null>(null);

  const [datePickerOpen, setDatePickerOpen] =
    useState<"from" | "to" | null>(null);

  const [saveError, setSaveError] = useState<string | null>(null);

  const calendar = useMonthCalendar(formData.date);
  const toCalendar = useMonthCalendar(formData.toDate);

  const { filterOptions, subFilterOptions, needsDepartment, needsDesignation } =
    useEssFilterOptions(dropdowns, formData.filter);

  const [createEssModule, { isLoading: isCreating }] =
    useCreateEssModuleMutation();

  const [updateEssModule, { isLoading: isUpdating }] =
    useUpdateEssModuleMutation();

  const [deleteEssModule] = useDeleteEssModuleMutation();

  const isSaving = isCreating || isUpdating;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFilterSelect = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      filter: value,
      subFilter: "",
    }));
    setOpenDropdown(null);
  };

  const handleSubFilterSelect = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      subFilter: value,
    }));
    setOpenDropdown(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({
      ...previous,
      file: e.target.files?.[0] ?? null,
    }));
  };

  const setIsDownloadRestricted = (checked: boolean) => {
    setFormData((previous) => ({
      ...previous,
      isDownloadRestricted: checked,
    }));
  };

  const handleDateTextChange = (value: string) => {
    setFormData((previous) => ({ ...previous, date: value }));

    const parsed = parseDate(value);
    if (parsed) calendar.goToMonthOf(parsed);
  };

  const handleToDateTextChange = (value: string) => {
    setFormData((previous) => ({ ...previous, toDate: value }));

    const parsed = parseDate(value);
    if (parsed) toCalendar.goToMonthOf(parsed);
  };

  const handleDateSelect = (iso: string) => {
    const selected = new Date(`${iso}T00:00:00`);

    setFormData((previous) => ({
      ...previous,
      date: formatDate(selected),
    }));

    calendar.goToMonthOf(selected);
    setDatePickerOpen(null);
  };

  const handleToDateSelect = (iso: string) => {
    const selected = new Date(`${iso}T00:00:00`);

    setFormData((previous) => ({
      ...previous,
      toDate: formatDate(selected),
    }));

    toCalendar.goToMonthOf(selected);
    setDatePickerOpen(null);
  };

  const handleClearDate = () => {
    setFormData((previous) => ({ ...previous, date: "" }));
    setDatePickerOpen(null);
  };

  const handleClearToDate = () => {
    setFormData((previous) => ({ ...previous, toDate: "" }));
    setDatePickerOpen(null);
  };

  const handleTodayDate = () => {
    const todayDate = new Date();

    setFormData((previous) => ({
      ...previous,
      date: formatDate(todayDate),
    }));

    calendar.goToMonthOf(todayDate);
    setDatePickerOpen(null);
  };

  const handleTodayToDate = () => {
    const todayDate = new Date();

    setFormData((previous) => ({
      ...previous,
      toDate: formatDate(todayDate),
    }));

    toCalendar.goToMonthOf(todayDate);
    setDatePickerOpen(null);
  };

  const handleOpenForm = (row?: EssModuleRow) => {
    if (row) {
      setEditingId(getRowId(row) ?? null);

      setFormData({
        policyName: row.PolicyName ?? "",
        description: row.Description ?? "",
        filter:
          (row.Filter ?? row.FilterID) != null
            ? String(row.Filter ?? row.FilterID)
            : "",
        subFilter:
          (row.SubFilter ?? row.SubFilterID) != null
            ? String(row.SubFilter ?? row.SubFilterID)
            : "",
        date: toUiDate(
          (row.FromDate as string | undefined) ??
            (row as Record<string, unknown>).PolicyDate as string | undefined
        ),
        toDate: toUiDate(
          (row.ToDate as string | undefined) ??
            (row as Record<string, unknown>).PolicyToDate as string | undefined
        ),
        ackTypeId:
          row.AckTypeID != null ? String(row.AckTypeID) : "",
        isDownloadRestricted: !!row.IsDownloadRestricted,
        file: null,
      });
    } else {
      setEditingId(null);

      setFormData({
        ...EMPTY_FORM,
        filter: "", // All Employees
        ackTypeId: ackTypeOptions[0]?.id ?? "",
      });
    }

    setOpenDropdown(null);
    setDatePickerOpen(null);
    setSaveError(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setOpenDropdown(null);
    setDatePickerOpen(null);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!formData.policyName.trim()) {
      setSaveError("Policy name is required.");
      return;
    }

    if (!formData.date.trim()) {
      setSaveError("From date is required.");
      return;
    }

    setSaveError(null);

    const basePayload = {
      essInsightId: ESS_INSIGHT.POLICY,
      fromDate: toApiDate(formData.date),
      toDate: formData.toDate
        ? toApiDate(formData.toDate)
        : undefined,
      title: formData.policyName.trim(),
      content: formData.description || undefined,
      ackTypeId: formData.ackTypeId || undefined,
      isDownloadRestricted: formData.isDownloadRestricted,
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
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as {
          data?: { message?: string };
          message?: string;
        })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to save policy.";

      setSaveError(message);
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
      label: String(row.PolicyName ?? "this policy"),
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
        essInsightId: ESS_INSIGHT.POLICY,
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


  // View Result: existing Seen / Unseen functionality.
  const [viewResultId, setViewResultId] =
    useState<string | number | null>(null);

  const [activeTab, setActiveTab] =
    useState<"seen" | "unseen">("unseen");

  const {
    data: readStatus,
    isLoading: isReadStatusLoading,
    isError: isReadStatusError,
  } = useGetPolicyReadStatusQuery(viewResultId ?? "", {
    skip: viewResultId === null,
  });

  const openViewResult = (row: EssModuleRow) => {
    setViewResultId(getRowId(row) ?? null);
    setActiveTab("unseen");
  };

  const closeViewResult = () => setViewResultId(null);

  const seen = readStatus?.seen ?? [];
  const unseen = readStatus?.unseen ?? [];
  const activeList = activeTab === "seen" ? seen : unseen;

  return {
    // Single policy list (no Current / Previous tabs).
    rows: filteredRows,
    isListLoading,
    isListError,
    refetch,
    search,
    setSearch,
    handleDelete,
    pendingDelete,
    cancelDelete,
    confirmDelete,
    isDeleting,

    // Form.
    showForm,
    editingId,
    formData,
    openDropdown,
    setOpenDropdown,
    datePickerOpen,
    setDatePickerOpen,
    calendar,
    toCalendar,
    saveError,
    isSaving,
    ackTypeOptions,
    dropdowns,
    filterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
    handleFilterSelect,
    handleSubFilterSelect,
    isDropdownsLoading,
    handleInputChange,
    handleFileChange,
    setIsDownloadRestricted,
    handleDateTextChange,
    handleToDateTextChange,
    handleDateSelect,
    handleToDateSelect,
    handleClearDate,
    handleClearToDate,
    handleTodayDate,
    handleTodayToDate,
    handleOpenForm,
    handleCloseForm,
    handleSave,

    // View Result modal.
    viewResultId,
    openViewResult,
    closeViewResult,
    activeTab,
    setActiveTab,
    activeList,
    seen,
    unseen,
    isReadStatusLoading,
    isReadStatusError,
  };
}

export default usePolicy;