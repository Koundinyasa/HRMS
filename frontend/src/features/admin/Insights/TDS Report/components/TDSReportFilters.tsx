import { useMemo, useState } from "react";

import FilterBar, { type FilterValues } from "./FilterBar";
import type { FilterOption } from "./FilterDropdown";

import {
  FILTER_FIELD_DEFS,
  type FilterFieldKey,
} from "../constants/filterFields.constants";

interface TDSReportFiltersProps {
  rows?: Record<string, unknown>[];
}

const ROW_FIELD_ALIASES: Record<FilterFieldKey, string[]> = {
  query: ["query", "Query", "Employee ID", "Employee Name"],
  branch: ["branch", "Branch"],
  salaryStructure: ["salaryStructure", "Salary Structure"],
  leave: ["leave", "Leave"],
  attendance: ["attendance", "Attendance"],
  designation: ["designation", "Designation"],
  empStatus: [
    "empStatus",
    "employeeStatus",
    "Emp Status",
    "Employee Status",
  ],
};

export default function TDSReportFilters({
  rows = [],
}: TDSReportFiltersProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [values, setValues] = useState<FilterValues>({});
  const [searchValue, setSearchValue] = useState("");

  const fieldOptions = useMemo<
    Partial<Record<FilterFieldKey, FilterOption[]>>
  >(() => {
    const options: Partial<
      Record<FilterFieldKey, FilterOption[]>
    > = {};

    FILTER_FIELD_DEFS
      .filter((field) => field.type === "checkbox")
      .forEach((field) => {
        const valuesForField = rows
          .flatMap((row) =>
            ROW_FIELD_ALIASES[field.key].map(
              (name) => row[name]
            )
          )
          .filter(
            (value): value is string | number =>
              typeof value === "string" ||
              typeof value === "number"
          )
          .map(String)
          .filter(
            (value) => value.trim() !== ""
          );

        options[field.key] = [
          ...new Set(valuesForField),
        ].map((value) => ({
          value,
          label: value,
        }));
      });

    return options;
  }, [rows]);

  // Completely remove the filter section
  // when X is clicked.
  if (!showFilters) {
    return null;
  }

  return (
    <section className="w-full rounded-xl border border-[#d7d7d7] bg-white px-3 py-3 shadow-sm">
      <FilterBar
        fieldOptions={fieldOptions}
        values={values}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onChange={(key, value) =>
          setValues((previous) => ({
            ...previous,
            [key]: value,
          }))
        }
        onClearAll={() => {
          setValues({});
          setSearchValue("");
          setShowFilters(false);
        }}
        variant="chip"
        showMenu
      />
    </section>
  );
}