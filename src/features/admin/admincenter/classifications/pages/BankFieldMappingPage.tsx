import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search, Plus, MoreVertical, Check,
  Hash, CreditCard, DollarSign, User, Info, MessageSquare, Calendar,
  Code2, Landmark, Mail, RefreshCw, HelpCircle, FileText, Shuffle,
  Fingerprint, Folder, FolderPlus, ListChecks,
} from "lucide-react";
import ClassificationNavbar from "../components/ClassificationNavbar";
import { useBankFieldMapping } from "../hooks/useBankFieldMapping";
import type { AvailableField } from "../types/classificationTypes";

const ICONS: Record<string, typeof Hash> = {
  hash: Hash,
  "credit-card": CreditCard,
  dollar: DollarSign,
  user: User,
  info: Info,
  message: MessageSquare,
  calendar: Calendar,
  code: Code2,
  bank: Landmark,
  mail: Mail,
  swap: RefreshCw,
  help: HelpCircle,
  file: FileText,
  shuffle: Shuffle,
  fingerprint: Fingerprint,
  folder: Folder,
  "folder-plus": FolderPlus,
};

function FieldIcon({ iconKey }: { iconKey?: string }) {
  const Icon = (iconKey && ICONS[iconKey]) || Hash;
  return <Icon size={14} className="text-violet-400 shrink-0" />;
}

export default function BankFieldMappingPage() {
  const { bankId = "" } = useParams();
  const {
    quickTokens, availableFields, enabledCount, mappingRows,
    isLoading, isSaving, usingFallback,
    search, setSearch,
    toggleField, updateRow, save,
  } = useBankFieldMapping(Number(bankId));

  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <ClassificationNavbar
        rightSlot={
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Mapping"}
          </button>
        }
      />

      <p className="px-4 sm:px-6 mt-4 text-xs text-gray-400">Classifications / Bank</p>

      {usingFallback && (
        <div className="mx-4 sm:mx-6 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          Showing preview data — the field mapping API isn't live on the backend yet, so this isn't connected to
          real data and edits won't be saved.
        </div>
      )}

      {isLoading ? (
        <p className="px-4 sm:px-6 mt-6 text-sm text-muted-foreground text-center py-8">Loading field configuration...</p>
      ) : (
        <div className="px-4 sm:px-6 mt-4 pb-8">
          {/* Quick tokens */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickTokens.map((t) => (
              <span
                key={t.Token}
                className="px-3 py-1.5 rounded-full bg-[#F5F3FF] text-xs text-violet-600 font-medium border border-violet-100"
              >
                {t.Label} <span className="text-violet-400">({t.Token})</span>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
            {/* Left: available fields */}
            <div className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks size={16} className="text-violet-500" />
                <h4 className="text-sm font-semibold text-gray-800">Available Fields</h4>
                <span className="text-sm text-gray-400">{enabledCount}</span>
              </div>

              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search target fields..."
                  className="w-full h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                />
              </div>

              <div className="space-y-0.5 max-h-[480px] overflow-y-auto">
                {availableFields.map((field: AvailableField) => (
                  <div
                    key={field.FieldId}
                    className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg hover:bg-violet-50/60 text-sm"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1">
                      {field.IsAppendType ? (
                        <span className="w-4 h-4 rounded border border-gray-300 shrink-0" />
                      ) : (
                        <span
                          onClick={(e) => { e.preventDefault(); toggleField(field.FieldId); }}
                          className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                            field.IsEnabled ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
                          }`}
                        >
                          {field.IsEnabled && <Check size={11} className="text-white" />}
                        </span>
                      )}
                      <FieldIcon iconKey={field.IconKey} />
                      <span className="truncate text-gray-700">{field.Label}</span>
                    </label>

                    {field.IsAppendType ? (
                      <button
                        type="button"
                        onClick={() => toggleField(field.FieldId)}
                        aria-label={`Add ${field.Label}`}
                        className="text-violet-500 hover:text-violet-700 shrink-0"
                      >
                        <Plus size={14} />
                      </button>
                    ) : (
                      <MoreVertical size={14} className="text-gray-300 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: mapping table */}
            <div className="rounded-2xl border bg-white overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="text-violet-600 text-xs bg-[#F5F3FF]">
                    <th className="p-3 text-left font-medium">Header/Field Name</th>
                    <th className="p-3 text-left font-medium">Character Length</th>
                    <th className="p-3 text-left font-medium">Prefix</th>
                    <th className="p-3 text-left font-medium">Suffix</th>
                    <th className="p-3 text-left font-medium">Pattern</th>
                    <th className="p-3 text-left font-medium">Add Expression</th>
                    <th className="p-3 text-center font-medium">Concat</th>
                  </tr>
                </thead>
                <tbody>
                  {mappingRows.map((row) => {
                    const isFocused = focusedRowId === row.RowId;
                    const cellClass = `w-full px-2 py-1.5 rounded-md border outline-none text-xs ${
                      isFocused ? "border-violet-400 ring-2 ring-violet-100" : "border-gray-200"
                    } focus:border-violet-400 focus:ring-2 focus:ring-violet-100`;
                    return (
                      <tr
                        key={row.RowId}
                        className="border-t"
                        onClick={() => setFocusedRowId(row.RowId)}
                      >
                        <td className="p-2">
                          <div
                            className={`px-2 py-1.5 rounded-md border text-xs font-medium text-gray-800 truncate ${
                              isFocused ? "border-violet-400 ring-2 ring-violet-100" : "border-gray-200"
                            }`}
                          >
                            {row.HeaderFieldName}
                          </div>
                        </td>
                        <td className="p-2">
                          <input
                            value={row.CharacterLength}
                            onChange={(e) => updateRow(row.RowId, "CharacterLength", e.target.value)}
                            className={cellClass}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            value={row.Prefix}
                            onChange={(e) => updateRow(row.RowId, "Prefix", e.target.value)}
                            className={cellClass}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            value={row.Suffix}
                            onChange={(e) => updateRow(row.RowId, "Suffix", e.target.value)}
                            className={cellClass}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            value={row.Pattern}
                            onChange={(e) => updateRow(row.RowId, "Pattern", e.target.value)}
                            className={cellClass}
                          />
                        </td>
                        <td className="p-2">
                          {row.ExpressionNotApplicable ? (
                            <span className="text-gray-300 text-xs pl-2">-</span>
                          ) : row.Expression ? (
                            <input
                              value={row.Expression}
                              onChange={(e) => updateRow(row.RowId, "Expression", e.target.value)}
                              className={cellClass}
                              placeholder="Expression"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateRow(row.RowId, "Expression", " ")}
                              className="text-xs font-medium text-violet-600 border border-violet-200 rounded-md px-3 py-1 hover:bg-violet-50"
                            >
                              Add
                            </button>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={row.Concat}
                            onChange={(e) => updateRow(row.RowId, "Concat", e.target.checked)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
