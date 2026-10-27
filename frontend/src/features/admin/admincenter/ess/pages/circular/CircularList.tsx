import { useState } from "react";
import { Pencil, Trash2, FileDown } from "lucide-react";
import {
  downloadEssFile,
  buildDownloadFileName,
  resolveRowFilter,
  ESS_STATUS,
  getRowId,
  type EssModuleRow,
  type EssDropdowns,
} from "../../api/essApi";

interface Props {
  rows: EssModuleRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (row: EssModuleRow) => void;
  onDelete: (row: EssModuleRow) => void;
  statusId?: typeof ESS_STATUS.CURRENT | typeof ESS_STATUS.PREVIOUS;
  dropdowns: EssDropdowns | undefined;
}

const iconChip =
  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors";

export default function CircularList({
  rows,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
  statusId = ESS_STATUS.CURRENT,
  dropdowns,
}: Props) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownload = async (row: EssModuleRow) => {
    const id = getRowId(row);
    if (id == null || !row.FilePath) return;
    try {
      setDownloadingId(id);
      await downloadEssFile({
        filePath: String(row.FilePath),
        fallbackFileName: buildDownloadFileName(row.Name, row.FilePath, "circular"),
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download file.";
      alert(message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-gray-500 font-[Urbanist]">
        Loading circulars…
      </p>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center font-[Urbanist]">
        <p className="mb-2 text-sm text-red-500">Failed to load.</p>
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
        {statusId === ESS_STATUS.PREVIOUS ? "No Previous Circulars" : "No Current Circulars"}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto px-2 py-2 font-[Urbanist]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
            <th className="px-4 py-3 font-medium">Circular Name</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Acknowledgement</th>
            <th className="px-4 py-3 font-medium">Applicable Type</th>
            <th className="px-4 py-3 font-medium">Applicable For</th>
            <th className="px-4 py-3 font-medium">Effective Date</th>
            <th className="px-4 py-3 font-medium">To Date</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            const hasFile = Boolean(row.FilePath);
            const isDownloading = id != null && downloadingId === id;
            const { type: applicableType, value: applicableFor } = resolveRowFilter(row, dropdowns);
            return (
              <tr
                key={id}
                className="border-b border-[#F1F5F9] hover:bg-[#F6F3FF]/50"
              >
                <td className="px-4 py-3 font-medium text-[#131313]">
                  {row.Name ?? "—"}
                </td>
                <td className="max-w-[220px] truncate px-4 py-3 text-[#475569]">
                  {row.Description ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full border border-[#E2DAFE] bg-[#ECE7FF] px-2 py-1 text-[11px] font-normal text-[#7A5BED]">
                    {row.AckTypeName ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#475569]">{applicableType}</td>
                <td className="px-4 py-3 text-[#475569]">{applicableFor ?? "—"}</td>
                <td className="px-4 py-3 text-[#475569]">
                  {row.FromDate
                    ? new Date(row.FromDate).toLocaleDateString("en-GB")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-[#475569]">
                  {row.ToDate
                    ? new Date(row.ToDate).toLocaleDateString("en-GB")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {hasFile ? (
                      <button
                        type="button"
                        title="Download attachment"
                        disabled={isDownloading}
                        onClick={() => handleDownload(row)}
                        className={`${iconChip} bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] disabled:opacity-50`}
                      >
                        <FileDown size={15} strokeWidth={2} />
                      </button>
                    ) : (
                      <span
                        title="No attachment"
                        className={`${iconChip} cursor-not-allowed bg-gray-50 text-gray-300`}
                      >
                        <FileDown size={15} strokeWidth={2} />
                      </span>
                    )}
                    <button
                      type="button"
                      title="Edit circular"
                      onClick={() => onEdit(row)}
                      className={`${iconChip} bg-[#F6F3FF] text-[#7A5BED] hover:bg-[#ECE7FF]`}
                    >
                      <Pencil size={15} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      title="Delete circular"
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