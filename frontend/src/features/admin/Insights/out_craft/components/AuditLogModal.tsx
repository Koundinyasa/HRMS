import { useMemo, useState } from "react";
import { Search, X, FileSpreadsheet, ChevronDown } from "lucide-react";
import ExcelJS from "exceljs";

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

    const q = search.trim().toLowerCase();

    return entries.filter((entry) =>
      Object.values(entry).some((value) =>
        String(value ?? "").toLowerCase().includes(q)
      )
    );
  }, [entries, search]);

  const [isExporting, setIsExporting] = useState(false);

  const handleExportClick = async () => {
    if (onExport) {
      onExport(filtered);
      return;
    }

    if (isExporting) return;

    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Audit Log");

      const exportRows = filtered.map((entry) => ({
        "Record Details": entry.recordDetails ?? "",
        "Record Changes": entry.recordChanges ?? "",
        "Action Time": entry.actionTime ?? "",
        User: entry.user ?? "",
        "Employee Name": entry.employeeName ?? "",
      }));

      worksheet.columns = COLUMNS.map((header) => {
        const maxLength = Math.max(
          header.length,
          ...exportRows.map((row) =>
            String(row[header as keyof typeof row] ?? "").length
          )
        );

        return {
          header,
          key: header,
          width: Math.min(Math.max(maxLength + 2, 12), 40),
        };
      });

      exportRows.forEach((row) => {
        worksheet.addRow(row);
      });

      // Style the header row.
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: "middle" };
      headerRow.height = 22;

      // Keep the header visible while scrolling.
      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const stamp = new Date().toISOString().slice(0, 10);

      link.href = url;
      link.download = `${fileName}_${stamp}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the temporary download URL.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Failed to export audit log:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="font-[Urbanist] fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 flex-wrap min-w-0">
      <div className="font-[Urbanist] flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl min-w-0 max-w-full">
        {/* Header */}
        <div className="font-[Urbanist] flex items-center justify-between border-b border-black px-5 py-4 flex-wrap min-w-0">
          <h2 className="font-[Urbanist] text-base font-semibold text-[#814A3C]">
            Audit Log
          </h2>

          <button
            type="button"
            onClick={handleExportClick}
            disabled={isExporting}
            title={isExporting ? "Exporting..." : "Export to Excel"}
            aria-label="Export audit log to Excel"
            className="font-[Urbanist] flex h-8 w-8 items-center justify-center rounded-md border border-black text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={16} />
          </button>
        </div>

        {/* Filters */}
        <div className="font-[Urbanist] flex flex-wrap items-center gap-3 border-b border-black px-5 py-3 min-w-0">
          <div className="font-[Urbanist] relative w-full sm:w-64">
            <Search
              size={14}
              className="font-[Urbanist] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Start Typing..."
              aria-label="Search audit logs"
              className="font-[Urbanist] h-9 w-full rounded-md border border-black bg-slate-50 pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-[#D97B3F]"
            />
          </div>

          <div className="font-[Urbanist] ml-auto flex items-center gap-2 flex-wrap min-w-0">
            <button
              type="button"
              onClick={() => setEmployeeOpen((value) => !value)}
              aria-expanded={employeeOpen}
              className="font-[Urbanist] flex h-9 w-full sm:w-32 items-center justify-between rounded-md border border-black px-3 text-xs text-slate-600 flex-wrap min-w-0 max-w-full"
            >
              Employee
              <ChevronDown
                size={14}
                className={`font-[Urbanist] text-slate-400 transition-transform ${
                  employeeOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setActionOpen((value) => !value)}
              aria-expanded={actionOpen}
              className="font-[Urbanist] flex h-9 w-full sm:w-28 items-center justify-between rounded-md border border-black px-3 text-xs text-slate-600 flex-wrap min-w-0 max-w-full"
            >
              Action
              <ChevronDown
                size={14}
                className={`font-[Urbanist] text-slate-400 transition-transform ${
                  actionOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="font-[Urbanist] flex-1 overflow-auto min-w-0">
          <table className="font-[Urbanist] w-full border-collapse text-left text-xs">
            <thead className="font-[Urbanist] sticky top-0 bg-[#EAF2FB] text-[#334155]">
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="font-[Urbanist] whitespace-nowrap px-4 py-3 font-semibold"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="font-[Urbanist] bg-[#FFFBEB] px-4 py-8"
                  >
                    <p className="font-[Urbanist] text-center text-[13px] font-medium text-[#B45309]">
                      No Record Found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="font-[Urbanist] border-b border-black"
                  >
                    <td className="font-[Urbanist] px-4 py-3 text-slate-700">
                      {entry.recordDetails}
                    </td>

                    <td className="font-[Urbanist] px-4 py-3 text-slate-700">
                      {entry.recordChanges}
                    </td>

                    <td className="font-[Urbanist] px-4 py-3 text-slate-500">
                      {entry.actionTime}
                    </td>

                    <td className="font-[Urbanist] px-4 py-3 text-slate-500">
                      {entry.user}
                    </td>

                    <td className="font-[Urbanist] px-4 py-3 text-slate-500">
                      {entry.employeeName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="font-[Urbanist] flex items-center justify-end border-t border-black px-5 py-3 flex-wrap min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="font-[Urbanist] inline-flex h-9 items-center gap-1.5 rounded-md border border-black bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50 flex-wrap min-w-0"
          >
            <X size={14} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}