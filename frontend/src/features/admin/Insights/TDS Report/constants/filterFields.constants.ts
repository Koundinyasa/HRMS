import { Search } from "lucide-react";

export const FILTER_FIELD_KEYS = [
  "query",
  "branch",
  "salaryStructure",
  "leave",
  "attendance",
  "designation",
  "empStatus",
] as const;

export type FilterFieldKey =
  (typeof FILTER_FIELD_KEYS)[number];

export const FILTER_FIELD_DEFS: {
  key: FilterFieldKey;
  label: string;
  type: "checkbox" | "text";
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}[] = [
  {
    key: "query",
    label: "Query",
    type: "text",
    icon: Search,
  },
  {
    key: "branch",
    label: "Branch",
    type: "checkbox",
  },
  {
    key: "salaryStructure",
    label: "Salary Structure",
    type: "checkbox",
  },
  {
    key: "leave",
    label: "Leave",
    type: "checkbox",
  },
  {
    key: "attendance",
    label: "Attendance",
    type: "checkbox",
  },
  {
    key: "designation",
    label: "Designation",
    type: "checkbox",
  },
  {
    key: "empStatus",
    label: "Emp Status",
    type: "checkbox",
  },
];