import type { FilterOption } from "@/features/admin/components/FilterDropdown";

export const getSingleSelectedId = (
  selected: string[] | string | undefined,
  options: FilterOption[] | undefined,
): number | undefined => {
  if (!Array.isArray(selected) || selected.length !== 1) return undefined;
  const value = options?.find((option) => option.value === selected[0])?.value;
  if (!value) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
};

export const getSelectedIds = (selected: string[] | string | undefined, options: FilterOption[] | undefined) =>
  (Array.isArray(selected) ? selected : [])
    .map((value) => Number(options?.find((option) => option.value === value)?.value))
    .filter((id) => Number.isSafeInteger(id) && id > 0);
