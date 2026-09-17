import { Search } from "lucide-react";

// The canonical "Query / Branch / Salary Structure / Leave / Attendance /
// Designation / Emp Status" filter set — reused as-is across BGV Initiate,
// BulkUpdate, Attendance Integration, Reconcile Leave, and any future
// module that needs the same filter bar. Field METADATA lives here;
// each page still supplies its own OPTION LISTS via <FilterBar fieldOptions=.../>
// since option sources vary (some come from shared master data like
// SEED_BRANCHES, some from module-specific queries).
export const FILTER_FIELD_KEYS = [
  "query",
  "branch",
  "salaryStructure",
  "leave",
  "attendance",
  "designation",
  "empStatus",
] as const;

export type FilterFieldKey = (typeof FILTER_FIELD_KEYS)[number];

export const FILTER_FIELD_DEFS: {
  key: FilterFieldKey;
  label: string;
  type: "checkbox" | "text";
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { key: "query", label: "Query", type: "text", icon: Search },
  { key: "branch", label: "Branch", type: "checkbox" },
  { key: "salaryStructure", label: "Salary Structure", type: "checkbox" },
  { key: "leave", label: "Leave", type: "checkbox" },
  { key: "attendance", label: "Attendance", type: "checkbox" },
  { key: "designation", label: "Designation", type: "checkbox" },
  { key: "empStatus", label: "Emp Status", type: "checkbox" },
];