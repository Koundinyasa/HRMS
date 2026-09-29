import type { AdjustmentRecord } from "../types/adjustment.types";

interface AdjustmentTableProps {
  rows: AdjustmentRecord[];
  loading?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
}

const AdjustmentTable = ({
  rows,
  loading = false,
  selectedIds = [],
  onSelectionChange,
}: AdjustmentTableProps) => {
  const allSelected =
    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
      return;
    }

    onSelectionChange?.(rows.map((row) => row.id));
  };

  const handleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white py-12 font-[Urbanist]">
        <p className="text-[13px] text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center rounded-lg border border-slate-200 bg-white">
        <img
          src="/no-data.png"
          alt="No data available"
          className="h-40 w-40 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white [scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a] xl:overflow-x-visible xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
      <table className="w-full min-w-[900px] border-collapse font-[Urbanist]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="w-12 px-4 py-3 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-slate-300"
                aria-label="Select all records"
              />
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-600">
              Leave
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-600">
              Adjustment Type
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-600">
              Number Of Days
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-600">
              Status
            </th>

            <th className="px-4 py-3 text-left text-[12px] font-semibold text-slate-600">
              Remarks
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
            >
              <td className="px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.id)}
                  onChange={() => handleSelectRow(row.id)}
                  className="h-4 w-4 rounded border-slate-300"
                  aria-label={`Select ${row.leave}`}
                />
              </td>

              <td className="px-4 py-3 text-[13px] text-slate-700">
                {row.leave || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] text-slate-600">
                {row.adjustmentType || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] text-slate-600">
                {row.numberOfDays ?? "-"}
              </td>

              <td className="px-4 py-3 text-[13px] text-slate-600">
                {row.status || "-"}
              </td>

              <td className="px-4 py-3 text-[13px] text-slate-600">
                {row.remarks || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdjustmentTable;
