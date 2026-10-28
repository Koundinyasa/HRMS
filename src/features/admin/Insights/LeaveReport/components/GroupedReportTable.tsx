








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
    <div className="font-[Urbanist] bg-white rounded-lg shadow-sm border border-[#8B5A2B] overflow-x-auto min-w-0 max-w-full">
      <table className="font-[Urbanist] w-full text-sm">
        <thead>
          <tr className="font-[Urbanist] bg-orange-50">
            <th rowSpan={2} className="font-[Urbanist] px-4 py-3 text-left font-semibold text-gray-800 align-middle">
              Sl. No.
            </th>
            <th rowSpan={2} className="font-[Urbanist] px-4 py-3 text-left font-semibold text-gray-800 align-middle">
              Emp. ID
            </th>
            <th rowSpan={2} className="font-[Urbanist] px-4 py-3 text-left font-semibold text-gray-800 align-middle whitespace-nowrap">
              Employee Name
            </th>
            {groups.map((g) => (
              <th
                key={g.groupLabel}
                colSpan={g.columns.length}
                className="font-[Urbanist] px-4 py-2 text-center font-semibold text-gray-800 border-l border-[#8B5A2B]"
              >
                {g.groupLabel}
              </th>
            ))}
          </tr>
          <tr className="font-[Urbanist] bg-orange-50">
            {groups.map((g) =>
              g.columns.map((col, i) => (
                <th
                  key={`${g.groupLabel}-${col.key}`}
                  className={`font-[Urbanist] px-4 py-2 text-right font-medium text-gray-700 whitespace-nowrap ${
                    i === 0 ? "border-l border-[#8B5A2B]" : ""
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
              <td colSpan={3 + flatColumns.length} className="font-[Urbanist] px-4 py-10 text-center text-gray-400">
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
              <tr key={row.slNo} className="font-[Urbanist] border-t border-[#8B5A2B] hover:bg-gray-50 transition-colors">
                <td className="font-[Urbanist] px-4 py-3 text-gray-700">{row.slNo}</td>
                <td className="font-[Urbanist] px-4 py-3 text-blue-600">{row.empId}</td>
                <td className="font-[Urbanist] px-4 py-3 text-gray-700 whitespace-nowrap">{row.employeeName}</td>
                {flatColumns.map((col) => (
                  <td key={col.key} className="font-[Urbanist] px-4 py-3 text-right text-gray-700">
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