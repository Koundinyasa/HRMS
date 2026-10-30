import {
  Search,
  ChevronsUpDown,
  Eye,
  Download,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";

import { useEffect, useState } from "react";
import { fetchFileObjectUrl } from "@/app/fileAccess";
import {
  buildDocumentUrl,
  downloadEssFile,
  buildDownloadFileName,
  getRowId,
  resolveRowFilter,
  type EssModuleRow,
  type EssDropdowns,
} from "../../api/essApi";

const iconChip =
  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors";

interface Props {
  rows: EssModuleRow[];
  isLoading: boolean;
  isError: boolean;
  search: string;
  setSearch: (value: string) => void;
  onRetry: () => void;
  onEdit: (row: EssModuleRow) => void;
  onDelete: (row: EssModuleRow) => void;
  onViewResult: (row: EssModuleRow) => void;
  /** Map AckTypeID → label (API list returns ID only, not name). */
  ackTypeOptions?: { id: string; label: string }[];
  dropdowns?: EssDropdowns;
}

function formatDate(value?: string | null): string {
  if (value == null || value === "") return "—";
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-GB");
}

/** Backend Policy list sends PolicyDate only. */
function policyListDate(row: EssModuleRow): string {
  const r = row as Record<string, unknown>;
  const raw =
    r.PolicyDate ??
    row.FromDate ??
    r.StartDate ??
    r.EffectiveDate ??
    r.fromDate;
  return formatDate(raw != null ? String(raw) : null);
}

function ackLabel(
  row: EssModuleRow,
  options?: { id: string; label: string }[]
): string {
  if (row.AckTypeName) return String(row.AckTypeName);
  const id =
    row.AckTypeID != null
      ? String(row.AckTypeID)
      : row.ackTypeId != null
        ? String(row.ackTypeId)
        : "";
  if (!id) return "—";
  const found = options?.find((o) => o.id === id);
  return found?.label || "—";
}

export default function PolicyList({
  rows,
  isLoading,
  isError,
  search,
  setSearch,
  onRetry,
  onEdit,
  onDelete,
  onViewResult,
  ackTypeOptions = [],
  dropdowns,
}: Props) {
  // In-app preview (Eye) — no new browser tab
  const [preview, setPreview] = useState<{
    url: string;
    title: string;
    isImage: boolean;
  } | null>(null);

  // The attachment is fetched with the login session (refreshing it if the
  // access token has expired) and shown from a blob address.
  const openPolicy = async (row: EssModuleRow) => {
    const fileUrl = buildDocumentUrl(row.FilePath);
    if (!fileUrl) {
      window.alert("No attachment available for this policy.");
      return;
    }
    const path = String(row.FilePath || "").toLowerCase();
    const isImage = /\.(png|jpe?g|gif|webp|bmp)$/i.test(path);
    try {
      const blobUrl = await fetchFileObjectUrl(fileUrl);
      setPreview({
        url: blobUrl,
        title: row.PolicyName || "Policy attachment",
        isImage,
      });
    } catch (err: unknown) {
      window.alert(
        err instanceof Error ? err.message : "Failed to open the attachment."
      );
    }
  };

  // Release the blob address when the viewer closes or is replaced.
  useEffect(() => {
    const url = preview?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [preview?.url]);


  /** Download icon — save file to disk via /documents FilePath. */
  const handleDownload = async (row: EssModuleRow) => {
    if (!row.FilePath) {
      window.alert("No attachment available for this policy.");
      return;
    }
    try {
      await downloadEssFile({
        filePath: String(row.FilePath),
        fallbackFileName: buildDownloadFileName(
          row.PolicyName,
          row.FilePath,
          "policy"
        ),
      });
    } catch (err: unknown) {
      window.alert(
        err instanceof Error ? err.message : "Failed to download file."
      );
    }
  };

  return (
    <>
      {/* In-app attachment viewer — Eye icon */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a]/90 font-[Urbanist]">
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-[#0f172a] px-4">
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="flex h-9 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-medium text-white hover:bg-white/20"
            >
              ← Back
            </button>
            <span className="truncate text-sm font-medium text-white">
              {preview.title}
            </span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4">
            {preview.isImage ? (
              <img
                src={preview.url}
                alt={preview.title}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              />
            ) : (
              <iframe
                title={preview.title}
                src={preview.url}
                className="h-full min-h-[70vh] w-full max-w-5xl rounded-lg bg-white shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      <div className="mb-5 font-[Urbanist]">
        <div className="relative w-[320px] max-w-full">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#626262]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search policies by name, description..."
            className="h-9 w-full rounded-md border border-[#E2E8F0] pl-9 pr-3 text-sm outline-none placeholder:text-gray-500 focus:border-[#7A5BED]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white font-[Urbanist]">
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="py-16 text-center text-sm text-gray-500">
              Loading policies...
            </p>
          ) : isError ? (
            <div className="py-16 text-center">
              <p className="mb-2 text-sm text-red-500">
                Failed to load policies.
              </p>

              <button
                type="button"
                onClick={onRetry}
                className="text-sm text-[#7A5BED] underline"
              >
                Retry
              </button>
            </div>
          ) : rows.length === 0 ? (
            <p className="flex min-h-[200px] items-center justify-center text-sm text-gray-400">
              No Policies Yet
            </p>
          ) : (
            <table className="w-full text-sm font-normal">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <tr>
                  <th className="whitespace-nowrap px-3.5 py-3 text-left text-xs font-medium text-[#131313]">
                    Policy Name
                    <ChevronsUpDown
                      size={10}
                      className="ml-1 inline"
                    />
                  </th>

                  <th className="whitespace-nowrap px-3.5 py-3 text-left text-xs font-medium text-[#131313]">
                    Description
                    <ChevronsUpDown
                      size={10}
                      className="ml-1 inline"
                    />
                  </th>

                  <th className="whitespace-nowrap px-3.5 py-3 text-left text-xs font-medium text-[#131313]">
                    Date
                    <ChevronsUpDown
                      size={10}
                      className="ml-1 inline"
                    />
                  </th>

                  <th className="whitespace-nowrap px-3.5 py-3 text-left text-xs font-medium text-[#131313]">
                    Applicable Type
                  </th>

                  <th className="whitespace-nowrap px-3.5 py-3 text-left text-xs font-medium text-[#131313]">
                    Applicable For
                  </th>

                  <th className="whitespace-nowrap px-3.5 py-3 text-left text-xs font-medium text-[#131313]">
                    Acknowledgement
                  </th>

                  <th className="whitespace-nowrap px-3.5 py-3 text-center text-xs font-medium text-[#131313]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((policy, index) => {
                  const id = getRowId(policy);
                  const fileUrl = buildDocumentUrl(
                    policy.FilePath
                  );
                  const { type: applicableType, value: applicableFor } =
                    resolveRowFilter(policy, dropdowns);

                  return (
                    <tr
                      key={id ?? index}
                      className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-3.5 py-4 font-medium text-[#131313]">
                        {policy.PolicyName ?? "—"}
                      </td>

                      <td className="max-w-[190px] truncate px-3.5 py-4 text-[#626262]">
                        {policy.Description ?? "—"}
                      </td>

                      <td className="whitespace-nowrap px-3.5 py-4 text-[#626262]">
                        {policyListDate(policy)}
                      </td>

                      <td className="whitespace-nowrap px-3.5 py-4 text-[#626262]">
                        {applicableType}
                      </td>

                      <td className="whitespace-nowrap px-3.5 py-4 text-[#626262]">
                        {applicableFor ?? "—"}
                      </td>

                      <td className="whitespace-nowrap px-3.5 py-4">
                        <span className="ml-3 inline-block rounded-full border border-[#E2DAFE] bg-[#ECE7FF] px-2 py-1 text-[10px] text-[#7A5BED]">
                          {ackLabel(policy, ackTypeOptions)}
                        </span>
                      </td>

                      <td className="px-3.5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onViewResult(policy)}
                            className="mr-1 h-[21px] whitespace-nowrap rounded bg-[#10B981] px-3 text-xs font-medium text-white hover:bg-[#0EA472]"
                          >
                            View Result
                          </button>

                          {/* View / Eye */}
                          <button
                            type="button"
                            title={
                              fileUrl
                                ? "View policy attachment"
                                : "No attachment available"
                            }
                            disabled={!fileUrl}
                            onClick={() => void openPolicy(policy)}
                            className={`${iconChip} ${
                              fileUrl
                                ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE]"
                                : "cursor-not-allowed bg-gray-50 text-gray-300"
                            }`}
                          >
                            <Eye
                              size={15}
                              strokeWidth={2}
                            />
                          </button>

                          {/* Download */}
                          <button
                            type="button"
                            title={
                              fileUrl
                                ? "Download policy attachment"
                                : "No attachment available"
                            }
                            disabled={!fileUrl}
                            onClick={() => handleDownload(policy)}
                            className={`${iconChip} ${
                              fileUrl
                                ? "bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7]"
                                : "cursor-not-allowed bg-gray-50 text-gray-300"
                            }`}
                          >
                            <Download
                              size={15}
                              strokeWidth={2}
                            />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            title="Edit policy"
                            onClick={() => onEdit(policy)}
                            className={`${iconChip} bg-[#F6F3FF] text-[#7A5BED] hover:bg-[#ECE7FF]`}
                          >
                            <Pencil
                              size={15}
                              strokeWidth={2}
                            />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            title="Delete policy"
                            onClick={() => onDelete(policy)}
                            className={`${iconChip} bg-[#FEF2F2] text-[#DD3232] hover:bg-[#FEE2E2]`}
                          >
                            <Trash2
                              size={15}
                              strokeWidth={2}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-xs text-[#626262]">
          <span>
            Showing 1 - {rows.length} of {rows.length} records
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="flex h-[22px] w-[22px] items-center justify-center rounded border border-[#E2E8F0]"
            >
              <ChevronDown
                size={12}
                className="rotate-90"
              />
            </button>

            <button
              type="button"
              className="mx-1.5 h-[22px] w-[22px] rounded bg-[#1D4ED8] text-xs text-white"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="flex h-[22px] w-[22px] items-center justify-center rounded border border-[#E2E8F0]"
            >
              <ChevronDown
                size={12}
                className="-rotate-90"
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}