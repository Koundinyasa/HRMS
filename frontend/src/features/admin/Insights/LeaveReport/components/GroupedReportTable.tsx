








// components/GroupedReportTable.tsx
// For two-level headers, e.g. Leave Summary Report (LOP / CL groups)
import EmptyState from "./common/EmptyState";

interface SubColumn {
  key: string;
  label: string;
}

interface ColumnGroup {
  groupLabel: string;
  columns: SubColumn[];
}

interface Row {
  slNo: number;
  empId: string;
  employeeName: string;
  [key: string]: unknown;
}

interface GroupedReportTableProps {
  groups: ColumnGroup[];
  rows: Row[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function GroupedReportTable({
  groups,
  rows,
  loading,
  emptyMessage = "No data available",
}: GroupedReportTableProps) {
  const flatColumns = groups.flatMap((g) => g.columns);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-orange-50">
            <th rowSpan={2} className="px-4 py-3 text-left font-semibold text-gray-800 align-middle">
              Sl. No.
            </th>
            <th rowSpan={2} className="px-4 py-3 text-left font-semibold text-gray-800 align-middle">
              Emp. ID
            </th>
            <th rowSpan={2} className="px-4 py-3 text-left font-semibold text-gray-800 align-middle whitespace-nowrap">
              Employee Name
            </th>
            {groups.map((g) => (
              <th
                key={g.groupLabel}
                colSpan={g.columns.length}
                className="px-4 py-2 text-center font-semibold text-gray-800 border-l border-orange-100"
              >
                {g.groupLabel}
              </th>
            ))}
          </tr>
          <tr className="bg-orange-50">
            {groups.map((g) =>
              g.columns.map((col, i) => (
                <th
                  key={`${g.groupLabel}-${col.key}`}
                  className={`px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap ${
                    i === 0 ? "border-l border-orange-100" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3 + flatColumns.length} className="px-4 py-10 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={3 + flatColumns.length}>
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.slNo} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700">{row.slNo}</td>
                <td className="px-4 py-3 text-blue-600">{row.empId}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.employeeName}</td>
                {flatColumns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-right text-gray-700">
                    {(row[col.key] as React.ReactNode) ?? 0}
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