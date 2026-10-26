import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ChatListPreviewRow } from "../types/chatbot.types";

const GRADIENT_STYLE = { backgroundImage: 'var(--primary-gradient)' };

type Tone = "pending" | "success" | "danger" | "neutral";

const TONE_BADGE: Record<Tone, string> = {
  pending: "bg-amber-50 text-amber-700",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
  neutral: "bg-gray-100 text-gray-600",
};

const TONE_DOT: Record<Tone, string> = {
  pending: "bg-amber-400",
  success: "bg-emerald-400",
  danger: "bg-red-400",
  neutral: "bg-gray-300",
};

// Rows built before this change only ever sent `status` as plain text
// (e.g. "Pending", "Approved") without a `tone`. Rather than requiring
// every call site (holidays, employee directory, etc.) to be updated at
// once, we infer a sensible tone from the status text itself so those
// rows get the new badge styling for free the moment they start sending
// `status`, with zero risk to rows that don't send it at all.
function inferTone(status?: string): Tone {
  if (!status) return "neutral";
  const s = status.toLowerCase();
  if (s.includes("pending")) return "pending";
  if (s.includes("approv")) return "success";
  if (s.includes("reject") || s.includes("cancel")) return "danger";
  return "neutral";
}

interface ListPreviewModalProps {
  title: string;
  rows: ChatListPreviewRow[];
  onClose: () => void;
  onRowAction?: (action: string) => void;
}

export default function ListPreviewModal({
  title,
  rows,
  onClose,
  onRowAction,
}: ListPreviewModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-2xl bg-white shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div style={GRADIENT_STYLE} className="px-[18px] py-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-white m-0">
              {title}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="text-white/85 hover:text-white text-lg leading-none bg-transparent border-none cursor-pointer"
            >
              &times;
            </button>
          </div>
          <p className="text-[11px] text-white/80 mt-1 mb-0">
            {rows.length} item{rows.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Body */}
        <div className="px-[14px] py-3 max-h-[380px] overflow-y-auto flex flex-col gap-2">
          {rows.length === 0 ? (
            <p className="text-[13px] text-[#8b86a3] py-6 text-center m-0">
              Nothing to show here right now.
            </p>
          ) : (
            rows.map((row, i) => {
              const tone = row.tone ?? inferTone(row.status);
              const content = (
                <>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${TONE_DOT[tone]}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1f2430] m-0 truncate">
                      {row.primary}
                    </p>
                    {(row.meta ?? row.secondary) && !row.status && (
                      <p className="text-[11.5px] text-[#8a90a5] m-0 mt-0.5 truncate">
                        {row.meta ?? row.secondary}
                      </p>
                    )}
                    {row.meta && row.status && (
                      <p className="text-[11.5px] text-[#8a90a5] m-0 mt-0.5 truncate">
                        {row.meta}
                      </p>
                    )}
                  </div>
                  {row.status ? (
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${TONE_BADGE[tone]}`}
                    >
                      {row.status}
                    </span>
                  ) : row.secondary ? (
                    <span className="text-[11.5px] text-[#4a4f5c] whitespace-nowrap shrink-0">
                      {row.secondary}
                    </span>
                  ) : null}
                </>
              );

              if (row.action && onRowAction) {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onRowAction(row.action!)}
                    className="flex items-center gap-2.5 rounded-xl border border-[#eceef5] bg-white px-3 py-2.5 text-left cursor-pointer transition-colors hover:border-[#c9c2ff] hover:bg-[#f6f4ff]"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border border-[#eceef5] bg-white px-3 py-2.5"
                >
                  {content}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-[18px] py-3.5 flex justify-end border-t border-[#eceef5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[11px] text-[12.5px] font-medium text-[#4a4f5c] border border-[#eceef5] bg-white cursor-pointer hover:bg-[#f6f4ff]"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}