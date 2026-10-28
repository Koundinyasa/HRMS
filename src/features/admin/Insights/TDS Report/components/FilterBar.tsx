import { Plus, X, MoreVertical, Search } from "lucide-react";

import FilterDropdown, {
  type FilterOption,
} from "@/features/admin/Insights/TDS Report/components/FilterDropdown";

import {
  FILTER_FIELD_DEFS,
  type FilterFieldKey,
} from "@/features/admin/Insights/TDS Report/constants/filterFields.constants";

export type FilterValues = Partial<
  Record<FilterFieldKey, string[] | string>
>;

interface FilterBarProps {
  fieldOptions: Partial<Record<FilterFieldKey, FilterOption[]>>;
  values: FilterValues;
  onChange: (
    key: FilterFieldKey,
    value: string[] | string
  ) => void;
  onClearAll: () => void;
  fields?: FilterFieldKey[];
  variant?: "chip" | "plain";
  showMenu?: boolean;
}

export default function FilterBar({
  fieldOptions,
  values,
  onChange,
  onClearAll,
  fields = FILTER_FIELD_DEFS.map((f) => f.key),
  variant = "chip",
  showMenu = true,
}: FilterBarProps) {
  const addFilterButtonClass =
    variant === "chip"
      ? "flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-500 bg-white px-3 font-[Urbanist] text-[13px] font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
      : "flex h-9 shrink-0 items-center gap-1 whitespace-nowrap font-[Urbanist] text-[13px] font-medium text-slate-600 transition-colors hover:text-slate-800";

  return (
    <div className="flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible whitespace-nowrap">
      {/* Search */}
      <div className="relative w-[180px] shrink-0">
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={(values.query as string) ?? ""}
          onChange={(event) =>
            onChange("query", event.target.value)
          }
          placeholder="Search ..."
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 font-[Urbanist] text-[13px] font-normal text-slate-700 outline-none placeholder:font-[Urbanist] placeholder:text-[13px] placeholder:font-normal placeholder:text-slate-400 focus:border-[#8b4f40]"
        />
      </div>

      {/* Add Filter */}
      <button
        type="button"
        className={addFilterButtonClass}
      >
        <Plus size={14} />
        Add Filter
      </button>

      {/* Filter Dropdowns */}
      {fields.map((key) => {
        const def = FILTER_FIELD_DEFS.find(
          (f) => f.key === key
        );

        if (!def) return null;

        if (def.type === "text") {
          return (
            <FilterDropdown
              key={key}
              type="text"
              variant={variant}
              label={def.label}
              icon={def.icon}
              value={(values[key] as string) ?? ""}
              onChange={(value) =>
                onChange(key, value)
              }
            />
          );
        }

        return (
          <FilterDropdown
            key={key}
            variant={variant}
            label={def.label}
            icon={def.icon}
            options={fieldOptions[key] ?? []}
            selected={(values[key] as string[]) ?? []}
            onChange={(value) =>
              onChange(key, value)
            }
          />
        );
      })}

      {/* Right-side actions */}
      <div className="ml-auto flex shrink-0 items-center gap-1">
        {/* Three dots */}
        {showMenu && (
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            aria-label="More filter options"
            title="More filter options"
          >
            <MoreVertical size={17} />
          </button>
        )}

        {/* X */}
        <button
          type="button"
          onClick={onClearAll}
          title="Clear all filters"
          aria-label="Clear all filters"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  );
}