import { Pencil, Trash2 } from "lucide-react";
import {
  formatEssDate,
  getRowFromDate,
  getRowToDate,
  getRowId,
  type EssModuleRow,
} from "../../api/essApi";

interface Props {
  rows: EssModuleRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (row: EssModuleRow) => void;
  onDelete: (row: EssModuleRow) => void;
}

const iconChip =
  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors";

export default function FlashNewsList({
  rows,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-gray-500 font-[Urbanist]">
        Loading flash news…
      </p>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center font-[Urbanist]">
        <p className="mb-2 text-sm text-red-500">
          Failed to load flash news.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="text-sm text-[#7A5BED] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="flex min-h-[400px] items-center justify-center text-sm text-gray-400 font-[Urbanist]">
        No Flash News Yet
      </p>
    );
  }

  return (
    <div className="overflow-x-auto px-2 py-2 font-[Urbanist]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
            <th className="px-4 py-3 font-medium">
              Flash News
            </th>

            <th className="px-4 py-3 font-medium">
              From
            </th>

            <th className="px-4 py-3 font-medium">
              To
            </th>

            <th className="px-4 py-3 font-medium">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => {
            const id = getRowId(row);

            return (
              <tr
                key={id ?? index}
                className="border-b border-[#F1F5F9] hover:bg-[#F6F3FF]/50"
              >
                <td className="max-w-[420px] truncate px-4 py-3 font-medium text-[#131313]">
                  {row.FlashNews ?? "—"}
                </td>

                <td className="px-4 py-3 text-[#475569]">
                  {formatEssDate(getRowFromDate(row))}
                </td>

                <td className="px-4 py-3 text-[#475569]">
                  {formatEssDate(getRowToDate(row))}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title="Edit flash news"
                      onClick={() => onEdit(row)}
                      className={`${iconChip} bg-[#F6F3FF] text-[#7A5BED] hover:bg-[#ECE7FF]`}
                    >
                      <Pencil size={15} strokeWidth={2} />
                    </button>

                    <button
                      type="button"
                      title="Delete flash news"
                      onClick={() => onDelete(row)}
                      className={`${iconChip} bg-[#FEF2F2] text-[#DD3232] hover:bg-[#FEE2E2]`}
                    >
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}