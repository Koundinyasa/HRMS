import type { ClassificationFilters, ClassificationFormValues } from "../types/classification.types";

export const CLASSIFICATION_TYPES = [
  "Branch",
  "Department",
  "Team",
  "Cost Center",
  "Designation",
] as const;

export const STATUS_FILTER_OPTIONS: { label: string; value: ClassificationFilters["status"] }[] = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const TABLE_COLUMNS = [
  { key: "name", label: "Classification Name" },
  { key: "shortName", label: "Short Name" },
  { key: "type", label: "Type" },
  { key: "active", label: "Active" },
  { key: "action", label: "Action" },
] as const;

export const DEFAULT_FILTERS: ClassificationFilters = {
  search: "",
  status: "all",
  type: "all",
  page: 1,
  pageSize: 10,
};

export const DEFAULT_FORM_VALUES: ClassificationFormValues = {
  name: "",
  shortName: "",
  type: CLASSIFICATION_TYPES[0],
  description: "",
  active: true,
};
