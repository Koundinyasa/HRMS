import type { EssDropdowns } from "../api/essApi";

export type EssOption = { id: string; label: string };

export const ALL_EMPLOYEES_OPTION: EssOption = {
  id: "",
  label: "All Employees",
};

export function useEssFilterOptions(
  dropdowns: EssDropdowns | undefined,
  filterValue: string
) {
  const toOptions = (
    list?: { ID: number; TypeName?: string; Name?: string }[]
  ): EssOption[] =>
    (list ?? [])
      .map((t) => ({
        id: String(t.ID),
        label: (t.TypeName ?? t.Name ?? "").trim(),
      }))
      .filter((o) => o.label.length > 0);

  const backendFilters = toOptions(dropdowns?.filterTypes).filter(
    (o) => !/^all\s*employees$/i.test(o.label)
  );

  const filterOptions: EssOption[] = [ALL_EMPLOYEES_OPTION, ...backendFilters];
  const departmentOptions = toOptions(dropdowns?.departments);
  const designationOptions = toOptions(dropdowns?.designations);

  const selected =
    filterOptions.find((o) => o.id === filterValue) ??
    filterOptions.find((o) => o.label === filterValue);

  const selectedFilterLabel = selected?.label ?? "";
  const needsDepartment = /department/i.test(selectedFilterLabel);
  const needsDesignation = /designation/i.test(selectedFilterLabel);
  const subFilterOptions = needsDepartment
    ? departmentOptions
    : needsDesignation
      ? designationOptions
      : [];

  return {
    filterOptions,
    subFilterOptions,
    needsDepartment,
    needsDesignation,
  };
}

export default useEssFilterOptions;