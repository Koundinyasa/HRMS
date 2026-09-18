import { useMemo, useState } from "react";
import { Search, X, FileSpreadsheet, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";

import type { AuditLogEntry } from "../types/craftReport.types";

interface AuditLogModalProps {
  onClose: () => void;
  entries?: AuditLogEntry[];
  onExport?: (rows: AuditLogEntry[]) => void;
  fileName?: string;
}

const COLUMNS = [
  "Record Details",
  "Record Changes",
  "Action Time",
  "User",
  "Employee Name",
];

export default function AuditLogModal({
  onClose,
  entries = [],
  onExport,
  fileName = "Audit_Log",
}: AuditLogModalProps) {
  const [search, setSearch] = useState("");
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter((entry) =>
      Object.values(entry).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [entries, search]);

  const handleExportClick = () => {
    if (onExport) {
      onExport(filtered);
      return;
    }

    // Default client-side export via SheetJS.
    // Exports the current (filtered) rows — or just the header row if the
    // table is empty, so the button always produces a real file.
    const rows =
      filtered.length > 0
        ? filtered.map((entry) => ({
            "Record Details": entry.recordDetails,
            "Record Changes": entry.recordChanges,
            "Action Time": entry.actionTime,
            "User": entry.user,
            "Employee Name": entry.employeeName,
          }))
        : [];

    const worksheet =
      rows.length > 0
        ? XLSX.utils.json_to_sheet(rows)
        : XLSX.utils.aoa_to_sheet([COLUMNS]);

    worksheet["!cols"] = COLUMNS.map((col) => {
      const maxLen = Math.max(
        col.length,
        ...rows.map((r) => String((r as Record<string, unknown>)[col] ?? "").length)
      );
      return { wch: Math.min(Math.max(maxLen + 2, 12), 40) };
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Log");

    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${fileName}_${stamp}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-[#814A3C]">
            Audit Log
          </h2>
          <button
            type="button"
            onClick={handleExportClick}
            title="Export to Excel"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-emerald-600 hover:bg-emerald-50"
          >
            <FileSpreadsheet size={16} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
          <div className="relative w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Start Typing..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-[#D97B3F]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEmployeeOpen((v) => !v)}
              className="flex h-9 w-32 items-center justify-between rounded-md border border-slate-300 px-3 text-xs text-slate-600"
            >
              Employee
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => setActionOpen((v) => !v)}
              className="flex h-9 w-28 items-center justify-between rounded-md border border-slate-300 px-3 text-xs text-slate-600"
            >
              Action
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 bg-[#EAF2FB] text-[#334155]">
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-4 py-3 font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="bg-[#FFFBEB] px-4 py-8">
                    <p className="text-center text-[13px] font-medium text-[#B45309]">
                      No Record Found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-slate-700">
                      {entry.recordDetails}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {entry.recordChanges}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {entry.actionTime}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{entry.user}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {entry.employeeName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}