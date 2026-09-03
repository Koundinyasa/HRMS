import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  setSalaryComponentField,
  setSalaryComponentCalculative,
  setSalaryComponentOpen,
  setSalaryComponentType,
  loadSalaryComponentForEdit,
  clearSalaryComponentForm,
} from "../classificationSlice";
import {
  useGetSalaryComponentsQuery,
  useCreateSalaryComponentMutation,
  useUpdateSalaryComponentMutation,
  useDeleteSalaryComponentMutation,
  useReorderSalaryComponentsMutation,
  useCreateDefaultSalaryComponentsMutation,
} from "../api/classificationApi";
import { validateSalaryComponent } from "../validation/classificationValidation";
import { getBackendMessage } from "./getBackendMessage";
import { DEFAULT_SALARY_COMPONENTS } from "../constants/salaryComponent.constants";
import type { SalaryComponent, SalaryComponentType } from "../types/classificationTypes";

export const useSalaryComponent = () => {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.admin.adminCenter.classifications.salaryComponentForm);

  const [activeTab, setActiveTab] = useState<SalaryComponentType>("Earnings");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SalaryComponent | null>(null);

  const { data: apiComponents, isLoading, isError } = useGetSalaryComponentsQuery();
  const allComponents = isError ? DEFAULT_SALARY_COMPONENTS : apiComponents ?? [];
  const usingFallback = isError;
  const [createComponent, { isLoading: isCreating }] = useCreateSalaryComponentMutation();
  const [updateComponent, { isLoading: isUpdating }] = useUpdateSalaryComponentMutation();
  const [deleteComponent, { isLoading: isDeleting }] = useDeleteSalaryComponentMutation();
  const [reorderComponents] = useReorderSalaryComponentsMutation();
  const [createDefaults, { isLoading: isCreatingDefaults }] = useCreateDefaultSalaryComponentsMutation();

  const components = useMemo(() => {
    const bySearch = search.trim()
      ? allComponents.filter((c) => c.ComponentName.toLowerCase().includes(search.trim().toLowerCase()))
      : allComponents;
    return bySearch
      .filter((c) => c.Type === activeTab)
      .slice()
      .sort((a, b) => a.SortOrder - b.SortOrder);
  }, [allComponents, activeTab, search]);

  const openAdd = () => {
    dispatch(clearSalaryComponentForm(activeTab));
    setIsFormOpen(true);
  };

  const openEdit = (component: SalaryComponent) => {
    dispatch(
      loadSalaryComponentForEdit({
        editingId: component.Id,
        componentName: component.ComponentName,
        printName: component.PrintName,
        isCalculative: component.IsCalculative,
        isOpenComponent: component.IsOpenComponent,
        type: component.Type,
      })
    );
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    dispatch(clearSalaryComponentForm(activeTab));
  };

  const setField = (field: "componentName" | "printName", value: string) =>
    dispatch(setSalaryComponentField({ field, value }));

  const submit = async () => {
    const validation = validateSalaryComponent(form);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (usingFallback) {
      toast.info("This is preview data — the salary components API isn't live yet, so changes can't be saved.");
      return;
    }

    const duplicate = allComponents.some(
      (c) =>
        c.Type === form.type &&
        c.Id !== form.editingId &&
        c.ComponentName.trim().toLowerCase() === form.componentName.trim().toLowerCase()
    );
    if (duplicate) {
      toast.error("A component with this name already exists.");
      return;
    }

    try {
      if (form.editingId) {
        await updateComponent({
          id: form.editingId,
          componentName: form.componentName,
          printName: form.printName,
          isCalculative: form.isCalculative,
          isOpenComponent: form.isOpenComponent,
          type: form.type,
        }).unwrap();
        toast.success("Component updated successfully.");
      } else {
        await createComponent({
          componentName: form.componentName,
          printName: form.printName,
          isCalculative: form.isCalculative,
          isOpenComponent: form.isOpenComponent,
          type: form.type,
        }).unwrap();
        toast.success("Component added successfully.");
      }
      closeForm();
    } catch (err) {
      console.error("Salary component save failed:", err);
      toast.error(getBackendMessage(err) || "Unable to save the component. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (usingFallback) {
      toast.info("This is preview data — the salary components API isn't live yet, so changes can't be saved.");
      setDeleteTarget(null);
      return;
    }
    try {
      await deleteComponent({ id: deleteTarget.Id }).unwrap();
      toast.success("Component deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to delete the component.");
    }
  };

  const reorder = async (orderedIds: number[]) => {
    try {
      await reorderComponents({ orderedIds }).unwrap();
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to update sort order.");
    }
  };

  const createFromDefaults = async () => {
    try {
      await createDefaults().unwrap();
      toast.success("Default components added.");
    } catch (err) {
      toast.error(getBackendMessage(err) || "Unable to create default components.");
    }
  };

  return {
    components,
    allComponents,
    isLoading,
    usingFallback,
    activeTab,
    setActiveTab: (tab: SalaryComponentType) => {
      setActiveTab(tab);
      dispatch(setSalaryComponentType(tab));
    },
    search,
    setSearch,
    isFormOpen,
    openAdd,
    openEdit,
    closeForm,
    form,
    setField,
    setCalculative: (v: 0 | 1) => dispatch(setSalaryComponentCalculative(v)),
    setOpenComponent: (v: 0 | 1) => dispatch(setSalaryComponentOpen(v)),
    submit,
    isSaving: isCreating || isUpdating,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
    reorder,
    createFromDefaults,
    isCreatingDefaults,
  };
};
