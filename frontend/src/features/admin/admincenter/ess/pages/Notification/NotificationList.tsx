
import { Plus, Clock, Pencil, Trash2, FileDown } from "lucide-react";
import { useState } from "react";
import feedsEmptyState from "../../../../../../../src/assets/images/feeds-empty-state(1).png";
import {
  downloadEssFile,
  buildDownloadFileName,
  getRowId,
  resolveRowFilter,
  type EssModuleRow,
  type EssDropdowns,
} from "../../api/essApi";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rows: EssModuleRow[];
  currentCount: number;
  previousCount: number;
  dropdowns: EssDropdowns | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (row: EssModuleRow) => void;
  onDelete: (row: EssModuleRow) => void;
}

const actionBtn =
  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors";

function formatDate(value: unknown): string {
  if (!value) return "—";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function NotificationList({
  activeTab,
  setActiveTab,
  rows,
  currentCount,
  previousCount,
  dropdowns,
  isLoading,
  isError,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const showRealList =
    activeTab === "Current Notification" ||
    activeTab === "Previous Notification";

  const emptyMessage =
    activeTab === "Previous Notification"
      ? "No Previous Notification available"
      : "No Current Notification available";

  const handleDownload = async (row: EssModuleRow) => {
    const id = getRowId(row);
    if (id == null || !row.FilePath) return;
    try {
      setDownloadingId(id);
      await downloadEssFile({
        filePath: String(row.FilePath),
        fallbackFileName: buildDownloadFileName(
          row.EventName ?? row.Description,
          row.FilePath,
          "notification"
        ),
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download file.";
      window.alert(message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full min-h-full bg-white font-[Urbanist]">
      <div className="mb-5 flex min-h-[54px] flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F3FF] px-4 py-2">
        <button
          type="button"
          className="h-9 rounded-lg bg-[#7A5BED] px-6 text-sm font-semibold leading-[17px] tracking-[0.3px] text-white"
        >
          Notification
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onAdd}
            className="flex h-[30px] items-center gap-2 rounded-md bg-[#7A5BED] px-3 text-sm font-medium text-white hover:bg-[#5932E9]"
          >
            <Plus size={15} strokeWidth={2.5} />
            Notification
          </button>

          <button
            type="button"
            title="History"
            onClick={() => setActiveTab("Previous Notification")}
            className={`rounded-md p-1 ${
              activeTab === "Previous Notification"
                ? "text-[#7A5BED]"
                : "text-[#131313] hover:text-[#7A5BED]"
            }`}
          >
            <Clock size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-6 border-b border-[#E2E8F0] px-2">
        {(["Current Notification", "Previous Notification"] as const).map(
          (tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[#7A5BED]"
                    : "text-[#64748B] hover:text-[#7A5BED]"
                }`}
              >
                {tab === "Current Notification" ? "Current" : "Previous"}
                <span className="ml-2 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-xs text-[#7A5BED]">
                  {tab === "Current Notification" ? currentCount : previousCount}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#7A5BED]" />
                )}
              </button>
            );
          }
        )}
      </div>

      <div className="min-h-[650px] rounded-xl bg-white">
        {!showRealList ? (
          <div className="flex justify-center items-center min-h-[450px]">
            <p className="text-sm font-normal text-gray-400">
              No {activeTab} available
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center min-h-[450px]">
            <p className="text-sm text-gray-500">
              Loading notifications…
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col justify-center items-center min-h-[450px] gap-2">
            <p className="text-sm text-red-500">
              Failed to load notifications.
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
          <div className="flex justify-center items-center min-h-[450px]">
            <div className="text-center">
              <img
                src={feedsEmptyState}
                alt="No Notifications"
                className="w-[220px] h-[165px] object-contain mx-auto mb-6"
              />

              <p className="text-sm font-normal text-[#131313]">
                {emptyMessage}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto px-5 py-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]">
                  <th className="px-4 py-3 font-medium">
                    Title
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Applicable Type
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Applicable For
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
                  const hasFile = Boolean(row.FilePath);
                  const isDownloading = id != null && downloadingId === id;
                  const { type: applicableType, value: applicableFor } =
                    resolveRowFilter(row, dropdowns);

                  return (
                    <tr
                      key={id ?? index}
                      className="border-b border-[#F1F5F9] hover:bg-[#F6F3FF]/50"
                    >
                      <td className="max-w-[320px] truncate px-4 py-3 font-medium text-[#131313]">
                        {row.EventName ??
                          row.Description ??
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-[#475569]">
                        {applicableType}
                      </td>

                      <td className="px-4 py-3 text-[#475569]">
                        {applicableFor ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-[#475569]">
                        {formatDate(row.FromDate)}
                      </td>

                      <td className="px-4 py-3 text-[#475569]">
                        {formatDate(row.ToDate)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {hasFile ? (
                            <button
                              type="button"
                              title="Download attachment"
                              disabled={isDownloading}
                              onClick={() => handleDownload(row)}
                              className={`${actionBtn} bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] disabled:opacity-50`}
                            >
                              <FileDown size={15} strokeWidth={2} />
                            </button>
                          ) : (
                            <span
                              title="No attachment"
                              className={`${actionBtn} cursor-not-allowed bg-gray-50 text-gray-300`}
                            >
                              <FileDown size={15} strokeWidth={2} />
                            </span>
                          )}
                          <button
                            type="button"
                            title="Edit notification"
                            onClick={() => onEdit(row)}
                            className={`${actionBtn} bg-[#F6F3FF] text-[#7A5BED] hover:bg-[#ECE7FF]`}
                          >
                            <Pencil
                              size={15}
                              strokeWidth={2}
                            />
                          </button>

                          <button
                            type="button"
                            title="Delete notification"
                            onClick={() => onDelete(row)}
                            className={`${actionBtn} bg-[#FEF2F2] text-[#DD3232] hover:bg-[#FEE2E2]`}
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
          </div>
        )}
      </div>
    </div>
  );
}
