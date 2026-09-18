import { useState } from "react";
import { Plus, X, MoreVertical } from "lucide-react";
import FilterDropdown, { type FilterOption } from "./FilterDropdown";
import { FILTER_FIELD_DEFS, type FilterFieldKey } from "./filterFields.constants";

export type FilterValues = Partial<Record<FilterFieldKey, string[] | string>>;

interface FilterBarProps {
  /** Per-field option lists, keyed the same as FILTER_FIELD_DEFS. Omit a key
   *  (or pass an empty array) for fields that don't apply on a given page —
   *  they'll still render as an empty "No options available" dropdown, or
   *  you can filter FILTER_FIELD_DEFS down to just the fields you need via
   *  `fields` below. */
  fieldOptions: Partial<Record<FilterFieldKey, FilterOption[]>>;
  values: FilterValues;
  onChange: (key: FilterFieldKey, value: string[] | string) => void;
  onClearAll: () => void;
  /** Restrict to a subset of the canonical fields, in this order. Defaults
   *  to all of them. */
  fields?: FilterFieldKey[];
  /** "chip" = bordered pill buttons (Attendance Integration style).
   *  "plain" = flat text links (Reconcile Leave toolbar style). */
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
  showMenu = false,
}: FilterBarProps) {
  const [activeFields, setActiveFields] = useState<FilterFieldKey[]>(fields);

  const toggleField = (key: FilterFieldKey) => {
    setActiveFields((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const addFilterButtonClass =
    variant === "chip"
      ? "flex items-center gap-1.5 h-9 px-3 rounded-lg border border-emerald-500 text-emerald-600 text-sm font-medium hover:bg-emerald-50 transition-colors"
      : "flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800 transition-colors";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button type="button" className={addFilterButtonClass}>
        <Plus size={14} />
        Add Filter
      </button>

      {fields
        .filter((key) => activeFields.includes(key))
        .map((key) => {
          const def = FILTER_FIELD_DEFS.find((f) => f.key === key);
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
                onChange={(v) => onChange(key, v)}
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
              onChange={(v) => onChange(key, v)}
            />
          );
        })}

      {showMenu && (
        <button
          type="button"
          className="flex items-center justify-center h-9 w-9 text-slate-400 hover:text-slate-600"
        >
          <MoreVertical size={16} />
        </button>
      )}

      <button
        type="button"
        onClick={onClearAll}
        title="Clear all filters"
        className="flex items-center justify-center h-9 w-9 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}