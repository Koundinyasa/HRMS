




// ReportTable.tsx (updated)
import EmptyState from "./common/EmptyState";
import { GripVertical } from "lucide-react";
import type { LeaveReportRow } from "../types/leaveReport";

interface ReportTableColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: LeaveReportRow) => React.ReactNode;
}

interface ReportTableProps {
  columns: ReportTableColumn[];
  rows: LeaveReportRow[];
  loading?: boolean;
  emptyMessage?: string;
  /**
   * When true, an empty result set shows ONLY the empty-state illustration
   * (no table header row at all). Defaults to false, which keeps the
   * original behavior: header row stays visible, illustration shows inside
   * the table body.
   */
  hideHeaderOnEmpty?: boolean;
}

export default function ReportTable({
  columns,
  rows,
  loading,
  emptyMessage = "No records found",
  hideHeaderOnEmpty = false,
}: ReportTableProps) {
  // Only for pages that explicitly opt in via hideHeaderOnEmpty: when there's
  // no data (and we're not loading), show only the empty-state illustration
  // — no table header row, no Sl.No/Employee ID/Employee Name columns at all.
  if (hideHeaderOnEmpty && !loading && rows.length === 0) {
    return (
      <div className="font-[Urbanist] bg-white rounded-lg shadow-sm border border-[#8B5A2B]">
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="font-[Urbanist] bg-white rounded-lg shadow-sm border border-[#8B5A2B] overflow-x-auto min-w-0 max-w-full">
      <table className="font-[Urbanist] w-full text-sm">
        <thead>
          <tr className="font-[Urbanist] bg-orange-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`font-[Urbanist] px-4 py-3 font-semibold text-gray-800 whitespace-nowrap ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="font-[Urbanist] px-4 py-10 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.slNo} className="font-[Urbanist] border-t border-[#8B5A2B] hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`font-[Urbanist] px-4 py-3 text-gray-700 whitespace-nowrap ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    } ${col.key === "employeeId" ? "text-blue-600" : ""}`}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as unknown as Record<string, unknown>)[col.key] as React.ReactNode) ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export const dragActionColumn = {
  key: "__action",
  label: "Action",
  align: "center" as const,
  render: () => <GripVertical size={16} className="font-[Urbanist] mx-auto text-gray-400 cursor-grab" />,
};