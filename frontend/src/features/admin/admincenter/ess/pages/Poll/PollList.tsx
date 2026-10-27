import { Pencil, Trash2 } from "lucide-react";
import { getRowId, type EssModuleRow } from "../../api/essApi";

interface Props {
  rows: EssModuleRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (row?: EssModuleRow) => void;
  onDelete: (row: EssModuleRow) => void;
}

const iconChip =
  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors";

/** Format API date for list UI — supports FromDate/StartDate and ToDate/EndDate. */
function formatRowDate(row: EssModuleRow, which: "from" | "to"): string {
  const raw =
    which === "from"
      ? (row.FromDate ??
          (row as Record<string, unknown>).StartDate ??
          (row as Record<string, unknown>).fromDate)
      : (row.ToDate ??
          (row as Record<string, unknown>).EndDate ??
          (row as Record<string, unknown>).toDate);

  if (raw == null || raw === "") return "—";
  const value = String(raw);
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB");
}

export default function PollList({
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
        Loading polls…
      </p>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center font-[Urbanist]">
        <p className="mb-2 text-sm text-red-500">Failed to load polls.</p>
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
        No Polls Yet
      </p>
    );
  }

  return (
    <div className="overflow-x-auto px-2 py-2 font-[Urbanist]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
            <th className="px-4 py-3 font-medium">Question</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">From Date</th>
            <th className="px-4 py-3 font-medium">To Date</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            return (
              <tr
                key={id}
                className="border-b border-[#F1F5F9] hover:bg-[#F6F3FF]/50"
              >
                <td className="max-w-[320px] truncate px-4 py-3 font-medium text-[#131313]">
                  {row.Question ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full border border-[#E2DAFE] bg-[#ECE7FF] px-2 py-1 text-[11px] font-normal text-[#7A5BED]">
                    {row.QuestionTypeName ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#475569]">
                  {formatRowDate(row, "from")}
                </td>
                <td className="px-4 py-3 text-[#475569]">
                  {formatRowDate(row, "to")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Edit poll"
                      onClick={() => onEdit(row)}
                      className={`${iconChip} bg-[#F6F3FF] text-[#7A5BED] hover:bg-[#ECE7FF]`}
                    >
                      <Pencil size={15} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      title="Delete poll"
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