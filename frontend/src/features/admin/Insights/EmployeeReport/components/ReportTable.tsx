




import EmptyState from "./common/EmptyState";
import type { EmployeeReportRow } from "../types/employeeReport";
import type { ColumnVisibilityState } from "../types/filters";

interface ReportTableColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: EmployeeReportRow) => React.ReactNode;
}

interface ReportTableProps {
  columns: ReportTableColumn[];
  rows: EmployeeReportRow[];
  loading?: boolean;
  emptyMessage?: string;
  visibleColumns?: ColumnVisibilityState;
  showRowNumber?: boolean;
  /** Override the header row background class (e.g. "bg-blue-100"). */
  headerClassName?: string;
  /** Guaranteed inline color, in case the Tailwind class above doesn't resolve in your build. */
  headerBgColor?: string;
}

const LINK_COLUMNS = new Set(["employeeId"]);

export default function ReportTable({
  columns,
  rows,
  loading,
  emptyMessage = "No records found",
  visibleColumns,
  showRowNumber = false,
  headerClassName = "bg-orange-50",
  headerBgColor = "#FDEEE3",
}: ReportTableProps) {
  const displayedColumns = visibleColumns
    ? columns.filter((col) => visibleColumns[col.key] !== false)
    : columns;

  const colSpan = displayedColumns.length + (showRowNumber ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={headerClassName} style={{ backgroundColor: headerBgColor }}>
            {showRowNumber && (
              <th className="px-4 py-3 font-semibold text-gray-800 text-left whitespace-nowrap">
                Sl. No.
              </th>
            )}
            {displayedColumns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold text-gray-800 whitespace-nowrap ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
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
              <td colSpan={colSpan} className="px-4 py-10 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan}>
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={row.slNo ?? row.employeeId}
                className="border-t border-gray-100 hover:bg-orange-50/40 transition-colors"
              >
                {showRowNumber && (
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{i + 1}</td>
                )}
                {displayedColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 whitespace-nowrap ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    } ${
                      LINK_COLUMNS.has(col.key)
                        ? "text-brand-700 font-medium"
                        : "text-gray-700"
                    }`}
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