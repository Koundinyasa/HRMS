

// ColumnsSelector.tsx
// Vertical "Columns List" sidebar — lets the viewer expand category groups
// (General, Basic Details, Contact Details, Classification, Statutory,
// Separation Info) and choose which columns are visible, for reports that
// expose it (Employee Report, Employee Custom Report). Purely a display
// preference; it never affects which rows are fetched, only which columns
// of the already-fetched real data are shown.
import { useState } from "react";
import ToggleSwitch from "./common/ToggleSwitch";
import type { ColumnVisibilityState } from "../types/filters";

export interface ColumnOption {
  key: string;
  label: string;
  locked?: boolean;
}

export interface ColumnSection {
  key: string;
  label: string;
}

const DEFAULT_SECTIONS: ColumnSection[] = [
  { key: "general", label: "General" },
  { key: "basicDetails", label: "Basic Details" },
  { key: "contactDetails", label: "Contact Details" },
  { key: "classification", label: "Classification" },
  { key: "statutory", label: "Statutory" },
  { key: "separationInfo", label: "Separation Info" },
];

interface ColumnsSelectorProps {
  open: boolean;
  columns: ColumnOption[];
  visibleColumns: ColumnVisibilityState;
  onToggle: (key: string) => void;
  onClose: () => void;
  sections?: ColumnSection[];
  activeSections?: Record<string, boolean>;
  onToggleSection?: (key: string) => void;
}

export default function ColumnsSelector({
  open,
  columns,
  visibleColumns,
  onToggle,
  onClose,
  sections = DEFAULT_SECTIONS,
  activeSections,
  onToggleSection,
}: ColumnsSelectorProps) {
  const [localSections, setLocalSections] = useState<Record<string, boolean>>({});
  const sectionState = activeSections ?? localSections;
  const handleSectionToggle =
    onToggleSection ?? ((key: string) => setLocalSections((p) => ({ ...p, [key]: !p[key] })));

  if (!open) return null;

  return (
    <div className="w-full lg:w-56 shrink-0 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-1 divide-y divide-gray-100">
        {sections.map((section) => (
          <ToggleSwitch
            key={section.key}
            label={section.label}
            checked={!!sectionState[section.key]}
            onChange={() => handleSectionToggle(section.key)}
          />
        ))}
      </div>

      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-800">Column List</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-2.5">
          {columns.map((col) => (
            <label
              key={col.key}
              className={`flex items-center gap-2.5 text-sm ${
                col.locked ? "text-gray-400 cursor-not-allowed" : "text-gray-700 cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={visibleColumns[col.key] !== false}
                disabled={col.locked}
                onChange={() => onToggle(col.key)}
                className={`h-4 w-4 rounded border-gray-300 focus:ring-brand-500 ${
                  col.locked ? "text-gray-300" : "text-brand-700"
                }`}
              />
              {col.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}