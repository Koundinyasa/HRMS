











// AuditLogModal.tsx
import { useEffect, useMemo, useRef } from "react";
import { X, Search, FileText, FileSpreadsheet, History, ChevronDown } from "lucide-react";
import EmptyState from "./common/EmptyState";
import Pagination from "./common/Pagination";
import { useAuditLog } from "../hooks/useAuditLog";
import type { AuditLogEntry } from "../types/auditLog";

interface AuditLogModalProps {
  /** Same reportType used to load the report's data, e.g. "top-leave-taken". */
  reportType: string;
  /** Report title shown for context, e.g. "Top Leave Taken". */
  title?: string;
  onClose: () => void;
}

function formatActionTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
}

export default function AuditLogModal({ reportType, title, onClose }: AuditLogModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const d = useAuditLog({ reportType, enabled: true });

  // Close on Escape.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const employeeOptions = useMemo(() => {
    const names = new Set(d.rows.map((r) => r.employeeName).filter(Boolean) as string[]);
    return Array.from(names);
  }, [d.rows]);

  const actionOptions = useMemo(() => {
    const actions = new Set(d.rows.map((r) => r.recordDetails).filter(Boolean));
    return Array.from(actions);
  }, [d.rows]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-4"
    >
      <div className="w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            Audit Log{title ? <span className="text-gray-400 font-normal"> — {title}</span> : null}
          </h2>
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => d.handleExport("pdf")}
              aria-label="Export audit log to PDF"
              className="text-red-600 hover:opacity-75 transition-opacity"
            >
              <FileText size={20} />
            </button>
            <button
              type="button"
              onClick={() => d.handleExport("excel")}
              aria-label="Export audit log to Excel"
              className="text-green-600 hover:opacity-75 transition-opacity"
            >
              <FileSpreadsheet size={20} />
            </button>
            <button
              type="button"
              disabled
              aria-label="Audit log history"
              className="text-gray-400 opacity-40 cursor-default"
            >
              <History size={18} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close audit log"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[160px]">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={d.filters.search}
              onChange={(e) => d.setFilters({ ...d.filters, search: e.target.value })}
              placeholder="Start Typing..."
              className="w-full outline-none text-sm placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={d.filters.employee[0] ?? ""}
              onChange={(e) =>
                d.setFilters({
                  ...d.filters,
                  employee: e.target.value ? [e.target.value] : [],
                })
              }
              className="appearance-none text-sm text-gray-700 border border-gray-200 rounded-md pl-3 pr-7 py-1.5 outline-none cursor-pointer bg-white"
            >
              <option value="">Employee</option>
              {employeeOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={d.filters.action[0] ?? ""}
              onChange={(e) =>
                d.setFilters({
                  ...d.filters,
                  action: e.target.value ? [e.target.value] : [],
                })
              }
              className="appearance-none text-sm text-gray-700 border border-gray-200 rounded-md pl-3 pr-7 py-1.5 outline-none cursor-pointer bg-white"
            >
              <option value="">Action</option>
              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-orange-50 sticky top-0">
                <th className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">
                  Record Details
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">
                  Record Changes
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">
                  Action Time
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">
                  User
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 whitespace-nowrap">
                  Employee Name
                </th>
              </tr>
            </thead>
            <tbody>
              {d.loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : d.rows.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState variant="simple" message="No audit log entries found" />
                  </td>
                </tr>
              ) : (
                d.rows.map((row: AuditLogEntry) => (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.recordDetails}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.recordChanges ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatActionTime(row.actionTime)}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.user}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.employeeName ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <Pagination
          page={d.page}
          pageSize={d.pageSize}
          totalCount={d.totalCount}
          onPageChange={d.setPage}
          onPageSizeChange={d.setPageSize}
        />
      </div>
    </div>
  );
}